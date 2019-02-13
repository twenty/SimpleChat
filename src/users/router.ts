var router = require('express').Router();
var mongoose = require("mongoose");
var ThreadSchema = require("../threads/thread");
var UserSchema = require("../users/user");
var Database = require("../helpers/Database");

/*
    @TODO:
        - Shouldn't be able to see other users channels
        - Shouldn't see channels that are "private" and this user isn't apart of
*/
router.post("/create", (req:any, res:any, next:Function) => {
    if(Database.connect().result) {
        let user = new UserSchema({
            "username": req.body.username,
            "email": req.body.email
        });
        user.setPassword(req.body.password);
        user.save(function(err) {
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
        res.status(500).end();
    }
});

router.get("/show_channels/:user_id", (req:any, res:any, next:Function) => {
    let user = UserSchema.find({ "username": req.params.user_id });
    if(Database.connect().result) {
        user.exec(function(error, documents) {
            if(error === null) {
                documents.forEach((doc) => {
                    let thread = ThreadSchema.find({
                        "users": doc._id
                    });
                    thread.exec((err, threads) => {
                        if(err === null) {
                            res.send(threads);
                        } else {
                            res.send([]);
                        }
                    });
                });
            } else {
                res.status(403).end();
            }
        });
    } else {
        res.status(500).end();
    }
});
module.exports = router