const socket = io();

function scrollToBottom() {
  // Selectors
  const messages = jQuery('#messages');
  const newMessage = messages.children('li:last-child');
  // Heights
  const clientHeight = messages.prop('clientHeight');
  const scrollTop = messages.prop('scrollTop');
  const scrollHeight = messages.prop('scrollHeight');
  const newMessageHeight = newMessage.innerHeight();
  const lastMessageHeight = newMessage.prev().innerHeight();
  if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
    messages.scrollTop(scrollHeight);
  }
}

socket.on('connect', function () {
  let params = jQuery.deparam(window.location.search);
  socket.emit('join', params, function (error) {
    if (error) {
      alert(error);
      window.location.href = '/';
    } else {
      //continue
    }
  })
});

socket.on('disconnect', function () {
  console.log('Disconnected from server');
});

socket.on('new message', function (message) {
  let formattedTime = moment(message.createdAt).format('h:mm a');
  let template = jQuery('#message-template').html();
  let html = Mustache.render(template, {
    from: message.from,
    text: message.text,
    createdAt: formattedTime
  });
  jQuery('#messages').append(html);
  scrollToBottom();
});

socket.on('new location message', function (message) {
  let formattedTime = moment(message.createdAt).format('h:mm a');
  let template = jQuery('#location-message-template').html();
  let html = Mustache.render(template, {
    from: message.from,
    url: message.url,
    createdAt: formattedTime
  });
  jQuery('#messages').append(html);
  scrollToBottom();
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
    locationButton.attr('disabled', 'disabled').text('Sending location...');
    navigator.geolocation.getCurrentPosition(function (position) {
      socket.emit('create location message', {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      }, function () {
        locationButton.removeAttr('disabled').text('Send location');
      });
    }, function () {
      locationButton.removeAttr('disabled').text('Send location');
      alert('Unable to fetch location.');
    });
  } else {
    locationButton.attr('disabled', 'disabled').text('Send location');
    alert('Geolocation is not available or not supported by your browser.');
  }
});
