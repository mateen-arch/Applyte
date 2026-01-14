const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
    user : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    role: {
        type: String
    },
    experiance: {
        type: Number
    }, 
    topics: {
        type: String
    },
    desc: {
        type: String
    },
    questions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Questions"
    }],
},{timestamps: true});

const Session = mongoose.model("Session",sessionSchema);

module.exports = {
    Session
}