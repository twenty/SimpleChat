import mongoose = require("mongoose");

let MessageSchema = new mongoose.Schema({
    messageText: {
        type: String,
        required: [true, "This is required"]
    },
    threadId: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Thread'
    },
    author: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User' 
    }
}, { timestamps: true });

module.exports = mongoose.model("Message", MessageSchema);