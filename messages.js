const moment = require('moment'); //moment variable

/*
used to output the username,text, & time of the user's message 
*/
function formatMsg(username, text) 
{
  return 
  {
    username,
    text,
    time: moment().format('h:mm a')
  };
}
module.exports = formatMsg; //used to format messages
