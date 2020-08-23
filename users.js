const users = []; //variable for user

// Used to alert when the user enters a groupchat
function userJoinsChat(id, username, room) 
{
  const user = { id, username, room };
  users.push(user);
  return user;
}

// Gets the current user
function getCurrentUser(id) 
{
  return users.find(user => user.id === id);
}

// Alerts when the user exits the groupchat
function userLeaving(id) 
{
  const index = users.findIndex(user => user.id === id);
  if (index !== -1) 
  {
    return users.splice(index, 1)[0];
  }
}

// Gets groupchat users
function getUsers(room) 
{
  return users.filter(user => user.room === room);
}

// Used for user info
module.exports = 
{
  userJoinsChat,
  getCurrentUser,
  userLeaving,
  getUsers
};
