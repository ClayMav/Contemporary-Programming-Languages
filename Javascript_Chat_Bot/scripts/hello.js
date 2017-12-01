// Description:
//   Say hello, Hubot!
//
// Commands:
//   hubot hi - say hi
//
'use strict';

module.exports = function(robot) {
  // This script is actually done. It's mostly here as a reference if
  // you're wondering how a simple Hubot script looks.

  // Handler for "hubot hi"
  robot.respond(/hi$/i, function(msg) {
    // Just reply to the user by saying "hey there"
    msg.reply('hey there');
  });
};
