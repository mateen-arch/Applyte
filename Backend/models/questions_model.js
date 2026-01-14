const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    session: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Session"
    },
    question: {
        type: String
    },
    note: {
        title: {
            type: String 
        },
        desc: {
            type: String
        }
    },
    answer: {
        type: String
    }
},{timestamps: true});


const Questions = mongoose.model("Questions",questionSchema);
module.exports = {
    Questions
}