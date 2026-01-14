const { User } = require("../../models/user");
const { Session } = require("../../models/session_model");
const { Questions } = require("../../models/questions_model");
const { generateExplanation } = require("./ai_controller");

const createSession = async (req, res) => {
    try {
        const { role, experience, topics, desc, questions } = req.body;
        const userID = req._id; // Changed from req._id to req.user._id (more common)

        const user = await User.findById(userID);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found!",
            });
        }

        const experiance = Number(experience);
        // Create session first
        const session = await Session.create({
            user: userID,
            role,
            experiance,
            topics,
            desc,
            questions: [],
        });

        // Create questions and collect their IDs
        const createdQuestions = await Promise.all(
            questions.map(async (q) => {
                if (!q.question || !q.answer) {
                    throw new Error(
                        "Each question must have 'question' and 'answer' fields"
                    );
                }

                const exp = await generateExplanation(q.question);

                const question = await Questions.create({
                    session: session._id,
                    question: q.question,
                    answer: q.answer,
                    note: {
                        title: exp.title,
                        desc: exp.explanation,
                    },
                });
                return question._id;
            })
        );

        // Update session with question references

        if (!createdQuestions) {
            return res.status(400).json({
                success: false,
                message: "Failed to create questions!",
            });
        }

        session.questions = createdQuestions;
        await session.save();

        return res.status(201).json({
            success: true,
            message: "Session created successfully!",
            session: session,
        });
    } catch (e) {
        console.error("Error creating session:", e);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

const getAllSessions = async (req, res) => {
    try {
        const userID = req._id;

        const user = await User.findById(userID);
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User not found!",
            });
        }

        const sessions = await Session.find({ user: userID });

        return res.status(200).json({
            success: true,
            sessions,
        });
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            success: false,
            message: "Something went wrong!",
        });
    }
};

const getSessionByID = async (req, res) => {
    try {
        const sessionID = req.params.id;
        const userID = req._id;

        const user = await User.findById(userID);
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User not found!",
            });
        }

        const session = await Session.findById(sessionID);
        if (!session) {
            return res.status(400).json({
                success: false,
                message: "Session is not available!",
            });
        }

        const questions = await Promise.all(
            session.questions.map(async (q) => {
                return await Questions.findById(q);
            })
        );

        return res.status(200).json({
            success: true,
            session,
            questions,
        });
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            success: false,
            message: "Something went wrong!",
        });
    }
};

const deleteSession = async (req, res) => {
    try {
        const sessionID = req.params.id;
        const userID = req._id;

        const user = await User.findById(userID);
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User not found!",
            });
        }

        const session = await Session.findById(sessionID);
        if (!session) {
            return res.status(400).json({
                success: false,
                message: "Session is not available!",
            });
        }

        session.questions.forEach(async (question) => {
            await Questions.findByIdAndDelete(question._id);
        });

        await Session.findByIdAndDelete(sessionID);
        return res.status(200).json({
            success: true,
            message: "Session deleted successfully!",
        });
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            success: false,
            message: "Something went wrong!",
        });
    }
};

module.exports = {
    createSession,
    getAllSessions,
    getSessionByID,
    deleteSession,
};