const http = require('http');
const path = require('path');
const express = require('express');
const socket = require('socket.io');

const { generateMessage, generateLocationMessage } = require('./utils/message');
const { isRealString } = require('./utils/validation');
const { Users } = require('./utils/users');
const port = process.env.PORT || 3000;
const publicPath = path.join(__dirname, '../public');

const app = express();
const server = http.createServer(app);
const io = socket(server);
const users = new Users();

app.use(express.static(publicPath));

io.on('connection', (socket) => {
  console.log('Connected to client');

  socket.on('join', (params, callback) => {
    if (!isRealString(params.name) || !isRealString(params.room)) {
      return callback('Name and Room name are required.');
    }
    socket.join(params.room);
    users.removeUser(socket.id);
    users.addUser(socket.id, params.name, params.room);
    io.to(params.room).emit('get user list', users.getUserList(params.room));
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
    const user = users.removeUser(socket.id);
    if (user) {
      io.to(user.room).emit('get user list', users.getUserList(user.room));
      io.to(user.room).emit('new message', generateMessage('Admin', `${user.name} has left.`));
    }
  });
});

server.listen(port, () => {
  console.log(`Server is up at port ${port}`);
});