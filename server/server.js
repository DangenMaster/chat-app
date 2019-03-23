const http = require('http');
const path = require('path');
const express = require('express');
const socket = require('socket.io');

const { generateMessage } = require('./utils/message');
const port = process.env.PORT || 3000;
const publicPath = path.join(__dirname, '../public');

const app = express();
const server = http.createServer(app);
const io = socket(server);

app.use(express.static(publicPath));

io.on('connection', (socket) => {
  console.log('Connected to client');
 
  socket.emit('new message', generateMessage('Admin', 'Welcome to chat app'));
  socket.broadcast.emit('new message', generateMessage('Admin', 'New user joined'));

  socket.on('create message', (message) => {
    io.emit('new message', generateMessage(message.from, message.text));
  });

  socket.on('disconnect', () => {
    console.log('Disconnected from client');
  });
});

server.listen(port, () => {
  console.log(`Server is up at port ${port}`);
});