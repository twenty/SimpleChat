/*
    @TODO:
        - This feels entirely wrong. tidy up
*/
module.exports.connect = function() {
    let mongoose = require("mongoose");
    let config = require('../../env.json')[process.env.NODE_ENV || 'development'];
    try {
        mongoose.connect(config.MONGO_URI);
        return {
            "conn": mongoose.connection,
            "result": true
        };
    } catch(e) {
        console.error(e);
    }
    return {
        "result": false
    }
}