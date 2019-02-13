import mongoose = require("mongoose");

let ThreadSchema = new mongoose.Schema({
    threadName: {
        type: String,
        required: [true, "This is required"]
    },
    stillActive: Boolean,
    author: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User' 
    },
    users: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User' 
    }]
}, { timestamps: true });

module.exports = mongoose.model("Thread", ThreadSchema);