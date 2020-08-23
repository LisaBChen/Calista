const path = require('path');
const http = require('http');
const express = require('express');
const app = express(); //sets up express
const socketio = require('socket.io');
const io = socketio(server); //variable for socketio
const formatMessage = require('./utils/messages');
const server = http.createServer(app); //sets up server
const botName = 'Calista Bot';
const {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers
} = require('./utils/users');

// Sets up the needed static folders
app.use(express.static(path.join(__dirname, 'public')));

// Runs when client connects
io.on('connection', socket => 
{
  socket.on('joinRoom', ({ username, room }) => 
  {
    const user = userJoin(socket.id, username, room);
    socket.join(user.room);

    // Welcomes user to the groupchat
    socket.emit('message', formatMessage(botName, 'Welcome Calister!'));

    // Alerts that the user has entered the groupchat
    socket.broadcast
      .to(user.room)
      .emit
      (
        'message',
        formatMessage(botName, `${user.username} has entered the groupchat`)
      );

    // Send users and room info
    io.to(user.room).emit('roomUsers', 
    {
      room: user.room,
      users: getRoomUsers(user.room)
    });
  });

  // Checks if there's a message and shows it
  socket.on('chatMessage', msg => 
  {
    const user = getCurrentUser(socket.id); 
    io.to(user.room).emit('message', formatMessage(user.username, msg));
  });

  // Executes when client disconnects and user leaves
  socket.on('disconnect', () => 
  {
    const user = userLeave(socket.id); //user variable

    //test for user and sends needed alerts and info
    if (user) 
    {
      //user exited chat room alert
      io.to(user.room).emit(
        'message',
        formatMessage(botName, `${user.username} has exited the chat`)
      );

      // Send users and room info
      io.to(user.room).emit('roomUsers', 
      {
        room: user.room,
        users: getRoomUsers(user.room)
      });
    }
  });
});

//used to assign port and display it
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running using port ${PORT}`));
