const http = require('http');
const path = require('path');
const express = require('express');
const socket = require('socket.io');

const { generateMessage, generateLocationMessage } = require('./utils/message');
const { isRealString } = require('./utils/validation');
const port = process.env.PORT || 3000;
const publicPath = path.join(__dirname, '../public');

const app = express();
const server = http.createServer(app);
const io = socket(server);

app.use(express.static(publicPath));

io.on('connection', (socket) => {
  console.log('Connected to client');

  socket.on('join', (params, callback) => {
    if (!isRealString(params.name) || !isRealString(params.room)) {
      callback('Name and Room name are required.');
    }
    socket.join(params.room);
    socket.emit('new message', generateMessage('Admin', 'Welcome to chat app'));
    socket.broadcast.to(params.room).emit('new message', generateMessage('Admin', `${params.name} has joined.`));
    callback();
  });

  socket.on('create message', (message, callback) => {
    io.emit('new message', generateMessage(message.from, message.text));
    callback();
  });

  socket.on('create location message', (coords, callback) => {
    io.emit('new location message', generateLocationMessage('Admin', coords.latitude, coords.longitude));
    callback();
  });

  socket.on('disconnect', () => {
    console.log('Disconnected from client');
  });
});

server.listen(port, () => {
  console.log(`Server is up at port ${port}`);
});