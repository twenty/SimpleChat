import mongoose = require("mongoose");
let uniqueValidator = require('mongoose-unique-validator');
let crypto = require("crypto");
let jwt = require("jsonwebtoken");
let config = require('../../env.json')[process.env.NODE_ENV || 'development'];
let secret = config.secret;

let UserSchema = new mongoose.Schema({
    username: {
        type: String, 
        lowercase: true, 
        required: [true, "can't be blank"],
        match: [/^[a-zA-Z0-9]+$/, 'is invalid'], 
        index: true,
        unique: true
    },
    email: {
        type: String, 
        lowercase: true, 
        required: [true, "can't be blank"],
        match: [/\S+@\S+\.\S+/, 'is invalid'], 
        index: true,
        unique: true
    },
    hash: String,
    salt: String
}, { timestamps: true });

UserSchema.plugin(uniqueValidator, {message: 'is already taken.'});
UserSchema.methods.setPassword = function(password){
    this.salt = crypto.randomBytes(16).toString('hex');
    this.hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
};    

UserSchema.methods.generateJWT = function() {
    let today = new Date();
    let exp = new Date(today);
    exp.setDate(today.getDate() + 60);
    return jwt.sign({
        id: this._id,
        username: this.username,
        exp: (exp.getTime() / 1000),
    }, secret);
};
UserSchema.methods.toAuthJSON = function(){
    return {
        username: this.username,
        email: this.email,
        token: this.generateJWT()
    };
};

module.exports = mongoose.model("User", UserSchema);