const chatForm = document.getElementById('chat-form');
const roomName = document.getElementById('room-name');
const chatMessages = document.querySelector('.chat-messages');
const userList = document.getElementById('users');
const socket = io();

// Get user's username and room using url
const 
{ username, room } = Qs.parse(location.search, 
{
  ignoreQueryPrefix: true
});

// alerts that user is entering groupchat
socket.emit('joinRoom', { username, room });

// Retrieves the user and the groupchat
socket.on('roomUsers', ({ room, users }) => 
{
  outputRoomName(room);
  outputUsers(users);
});

// Server sends out message
socket.on('message', message => 
{
  console.log(message);
  outputMessage(message);
  // Scroll down
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

// alerts that message is sending
chatForm.addEventListener('submit', e => 
{
  e.preventDefault();
  // Gets the message
  const msg = e.target.elements.msg.value;
  // gives the message to the server
  socket.emit('chatMessage', msg);
  // empties out the message
  e.target.elements.msg.value = '';
  e.target.elements.msg.focus();
});

// sends out a message to DOM
function outputMessage(message) 
{
  const div = document.createElement('div');
  div.classList.add('message');
  div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
  <p class="text">
    ${message.text}
  </p>`;
  document.querySelector('.chat-messages').appendChild(div);
}

// Add a room name to DOM
function outputRoomName(room) 
{
  roomName.innerText = room;
}

// Add the needed users to the DOM
function outputUsers(users) 
{
  userList.innerHTML = `
    ${users.map(user => `<li>${user.username}</li>`).join('')}
  `;
}
