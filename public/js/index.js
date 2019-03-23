const socket = io();
socket.on('connect', function () {
  console.log('Connected to server');
});

socket.on('new message', function (message) {
  let li = jQuery('<li></li>');
  li.text(`${message.from}: ${message.text}`);
  jQuery('#message').append(li);
});

socket.on('disconnect', function () {
  console.log('Disconnected from server');
});

jQuery('#message-form').on('submit', function (e) {
  e.preventDefault();
  socket.emit('create message', {
    from: 'User',
    text: jQuery('[name=message]').val()
  }, function () {
    
  });
})