// @ts-nocheck

const express = require('express');
const { createServer } = require('node:http');
const { join } = require('node:path');
const { Server } = require('socket.io');

const app = express();
const server = createServer(app);
const io = new Server(server);

let messages = [];
let users = [];
let room = "room1";

app.get('/', (req, res) => {
    res.sendFile(join(__dirname, 'index.html'));
});

io.on('connection', (socket) => {
    users.push(socket.id);
    socket.join(room);

    socket.on("new user", (name) => {
        socket.username = name;
    });

    // Get messages log
    socket.on("get messages", (callback) => {
        callback(messages);
    });

    // Send a message
    socket.on('send message', (msg) => {
        messages.push({
            username: socket.username,
            message: msg
        });

        socket.broadcast.to(room).emit('new message', socket.username, msg);
    });

    // typing
    socket.on('typing', () => {
        socket.broadcast.to(room).emit('show typing', socket.username);
    });

    // Seen 
    socket.on('seen', () => {
        socket.to(room).emit('show seen', socket.username);
    });
});


server.listen(3000, () => {
    console.log('server running at http://localhost:3000');
});