var router = require('express').Router();
var mongoose = require("mongoose");
var ThreadSchema = require("./thread");
var MessageSchema = require("../messages/message");
var UserSchema = require("../users/user");
var Database = require("../helpers/Database");

/*
    @TODO:
        - Check if this user can actually access this thread
        - Order by creation date
*/
// get all messages for a thread
router.post("/create", (req:any, res:any, next:Function) => {
    if(Database.connect().result) {
        let thread = new ThreadSchema({
            "threadName": req.body.message,
            "stillActive": true,
            "author": "5c63d8a4a502153290b065a6", // hardcoded, alice2 user_id, changeme
            "users": ["5c63d8a4a502153290b065a6"]
        });
        thread.save();
        res.json({
            "success": true
        });
        
    } else {
        res.status(500).end();
    }
});

router.patch("/invite/:user_id/:thread_id", (req:any, res:any, next:Function) => {
    if(Database.connect().result) {
        // 1. does the user exist?
        let user = UserSchema.find({ "username": req.params.user_id });
        user.exec((err, users) => {
            console.log("CALLBACK", users);
            if(err === null) {
                if(users && users[0]) {
                    let id = users[0]._id;
                    // 2. does the thread exist?
                    ThreadSchema.findById(req.params.thread_id, (err, thread) => {
                        if(err === null && thread) {
                            let existingUsers = thread.users;
                            if(existingUsers.indexOf(id) === -1) {
                                existingUsers.push(id);
                                thread.users = existingUsers;
                                thread.save(function(err) {
                                    if(err === null) {
                                        res.json({
                                            "success": true
                                        });
                                    } else {
                                        res.json({
                                            "success": false,
                                            "message": err.message
                                        });
                                    }
                                });
                            } else {
                                res.json({
                                    "success": false,
                                    "message": "User has already been invited to this thread"
                                });
                            }
                        }
                    });
                }
            }
        });
    } else {
        res.status(500).end();
    }
});

router.get("/:thread_id", (req:any, res:any, next:Function) => {
    if(Database.connect().result) {
        ThreadSchema.findById(req.params.thread_id, (err, message) => {
            if(err === null) {
                // get messages
                let messages = MessageSchema.find({ "threadId" : message._id });
                messages.exec((e, history) => {
                    if(e === null) {
                        res.send(history);
                    }
                });
                // res.send(message);
                return;
                // let m = new MessageSchema({
                //     "messageText": "This is my message!",
                //     "threadId": message._id,
                //     "author": "5c63d8a4a502153290b065a6" // hardcoded, alice2 user_id, changeme
                // });
                // m.save();
            }
            res.send({
                "success": false,
                "message": "Unable to find thread"
            });
        });
    } else {
        res.status(500).end();
    }
});

module.exports = router