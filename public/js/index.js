const socket = io();
socket.on('connect', function () {
  console.log('Connected to server');
});

socket.on('welcome client', function (message) {
  console.log('welcome client', message);
});

socket.emit('welcome server', {
  message: 'Welcome to chat app server!'
});

socket.on('disconnect', function () {
  console.log('Disconnected from server');
});