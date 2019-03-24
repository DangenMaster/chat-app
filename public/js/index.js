const socket = io();

socket.on('connect', function () {
  console.log('Connected to server');
});

socket.on('new message', function (message) {
  let li = jQuery('<li></li>');
  li.text(`${message.from}: ${message.text}`);
  jQuery('#message').append(li);
});

socket.on('new location message', function (message) {
  let li = jQuery('<li></li>');
  let a = jQuery('<a target="_blank">My current location</a>');
  li.text(`${message.from}: `);
  a.attr('href', message.url);
  li.append(a);
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
    jQuery('[name=message]').val('');
  });
});

const locationButton = jQuery('#send-location');
locationButton.on('click', function () {
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(function (position) {
      socket.emit('create location message', {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      }, function () {
        
      });
    }, function () {
      alert('Unable to fetch location.');
    });
  } else {
    alert('Geolocation is not available or not supported by your browser.');
  }
});
