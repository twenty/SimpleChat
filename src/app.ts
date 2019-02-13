import express = require('express');
let app = express();
let config = require('./env.json')[process.env.NODE_ENV || 'development'];
let bodyParser = require("body-parser");

app.set("view engine", "ejs");
app.use(bodyParser.json());
// app.use(express.static("public"));
app.use("/message", require("./messages/router"));
app.use("/thread", require("./threads/router"));
app.use("/user", require("./users/router"));

const server = app.listen(config.SERVER.PORT, () => {
    console.log(`Node has started on ${config.SERVER.PORT}`);
});

const io = require("socket.io")(server);

io.on("connection", (socket) => {
    console.log("SOCK");
    // socket.username = config.DEFAULT_USER;
    // let user = new Users();
    // socket.on("change_username", (data) => {
    //     let oldName = socket.username;
    //     user.changeUsername(oldName, data.username, socket, io);
    // });

    // socket.on("new_message", (data) => {
    //     io.sockets.emit("new_message", {
    //         "message": data.message,
    //         "author": socket.username,
    //         "timestamp": new Date().getTime()
    //     });
    // });
});