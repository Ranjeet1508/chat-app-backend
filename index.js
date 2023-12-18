const http = require('http');
const express = require('express');
const socketIo = require("socket.io");
const cors = require('cors');


const app = express();
const users = [{}];

app.use(cors({
    origin: "*"
}))

app.get('/',(req,res) => {
    res.send("socket is working fine");
})

const server = http.createServer(app);

const io = socketIo(server);

io.on("connection", (socket) => {
    console.log("New Connection");

    socket.on('joined', ({user}) => {
        users[socket.id] = user
        console.log(`${user} has joined`);
        socket.broadcast.emit('userJoined', {user: "Admin", message:`${users[socket.id]} has joined`})
        socket.emit('welcome', {user:"Admin", message:`Welcome to the chat ${users[socket.id]}`})
    })

    socket.on('message', ({message, id}) => {
        io.emit('sendMessage', {user:users[id], message, id})
    })

    socket.on('disconnect', () => {
        socket.broadcast.emit('leave', {user:"Admin", message:`${users[socket.id]} has left`})
    })
})





server.listen(8080, () => {
    console.log("Server started successfully")
})