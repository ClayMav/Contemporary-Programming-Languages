// Description:
//   Checks the spelling of a word and offers spelling suggestions
//   if it's wrong.
//
// Commands:
//   hubot how do you spell <word> - Checks the spelling of a word
//
// Notes:
//   This command spawns `aspell` in a child process. It communicates
//   with the child process by sending the word to check over `stdin`
//   and retrieves the result over `stdout`. This command will only
//   work if `aspell` is installed.
//
'use strict';

const s = require('underscore.string');
const spawn = require('child_process').spawn;
// const _ = require('underscore');


module.exports = (robot) => {
  // Handler for 'hubot how do you spell <word>'
  robot.respond(/how do you spell (.+)$/i, (msg) => {
    const word = msg.match[1];

    if (/\s/.test(word)) {
      msg.reply('I can only offer suggestions for single words.');
      return;
    }
    let check = spawn('aspell', ['-a']);
    let output = '';
    let outarr = undefined;
    let done = 0;

    check.stdin.write(word);
    check.stdout.on('data', (data) => {
      output += data.toString();
    });
    check.stdin.end();


    check.stdout.on('close', (code) => {
      if (code != 0) {
        msg.reply('aspell didn\'t work!');
        return;
      }
      outarr = s.lines(output);
      outarr = s.words(outarr[1]);
      if (outarr[0] == '*') {
        msg.reply(word + ' is spelled correctly');
        done = 1;
        return;
      } else if (outarr[0] == '&') {
        outarr = outarr.slice(4);
        outarr = outarr.join(' ');
      } else {
        msg.reply('aspell returned something weird!');
        done = 1;
        return;
      }

      if (!done) {
        msg.reply('What about: ' + outarr);
      }
    });
  });
};
