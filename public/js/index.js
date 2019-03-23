const socket = io();
socket.on('connect', function () {
  console.log('Connected to server');
});

socket.on('new message', function (message) {
  console.log('new message', message);
});

socket.on('disconnect', function () {
  console.log('Disconnected from server');
});