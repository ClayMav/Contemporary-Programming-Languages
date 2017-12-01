// Description:
//   Reminds you to do something after a specified waiting time
//
// Commands:
//   hubot remind me to <task> in <sec> seconds - Send a reminder in <sec> secs
//
// Notes:
//   If the hubot is shut down, all reminders are cleared.
//
'use strict';

module.exports = function(robot) {
  // Handler for "hubot remind me to <task> in <sec> seconds"
  robot.respond(/remind me to (.+) in (\d+) seconds?$/i, function(msg) {
    const task = msg.match[1];
    const numSeconds = msg.match[2];
    const milliseconds = numSeconds * 1000;

    // TODO
    if (numSeconds == 1) {
      msg.reply('OK. I\'ll remind you to ' + task + ' in ' + numSeconds +
        ' second.');
    } else {
      msg.reply('OK. I\'ll remind you to ' + task + ' in ' + numSeconds +
        ' seconds.');
    }
    setTimeout(function() {
      msg.reply('Don\'t forget to ' + task + '!');
    }, milliseconds);
  });
};
