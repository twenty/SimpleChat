var router = require('express').Router();
var mongoose = require("mongoose");
var Database = require("../helpers/Database");
var MessageSchema = require("./message");

// router.delete("/:message_id", hasPermissionToDeleteMessage, (req:any, res:any, next:Function) => {
//     if(Database.connect().result) {

//     } else {
//         res.status(500).end();
//     }
// });

/*
    @TODO
        - Check if the thread exists
        - Security checks
        - get user id
*/
router.post("/create", (req:any, res:any, next:Function) => {
    if(Database.connect().result) {
        let message = new MessageSchema({
            "messageText": req.body.message,
            "threadId": req.body.threadId,
            "author": "5c63d8a4a502153290b065a6" // hardcoded, alice2 user_id, changeme
        });
        message.save();
        res.json({
            "success": true
        });
        
    } else {
        res.status(500).end();
    }
});

module.exports = router