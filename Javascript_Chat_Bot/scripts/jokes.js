// Description:
//   Fetches a joke from a remote site
//
// Configuration:
//   JOKE_URL: The URL to use for fetching JSON-encoded joke data.
//       Defaults to http://cpl.mwisely.xyz/hw/5/jokes.json
//
// Commands:
//   hubot tell me a joke - Go fetch a random joke
//
// Notes:
//   This script pulls jokes from JOKE_URL. That means that this
//   script will need access to the Internet.
//
'use strict';

const request = require('request');
// const _ = require('underscore');

// The delay (in milliseconds) between asking the question and
// responding with the answer.
const THINKING_TIME = 3000;

module.exports = (robot) => {
  // Handler for 'hubot tell me a joke'
  robot.respond(/tell me a joke$/i, (msg) => {
    let jokeUrl = process.env.JOKE_URL;
    if (jokeUrl == null) {
      jokeUrl = 'http://cpl.mwisely.xyz/hw/5/jokes.json';
    }

    request(jokeUrl, function(err, response, jokes) {
      if (err != null || response.statusCode != 200) {
        msg.reply('I couldn\'t retrieve any jokes...');
        return;
      }
      let qas = undefined;

      try {
        qas = JSON.parse(jokes);
      } catch (SyntaxError) {
        msg.reply('I couldn\'t parse any jokes...');
        return;
      }
      if (qas.length == 0) {
        msg.reply('The joke list was empty!');
        return;
      }

      let joke = qas[Math.floor(Math.random() * qas.length)];
      msg.reply(joke.question);
      setTimeout(function() {
        msg.reply(joke.answer);
      }, THINKING_TIME);
    });
  });
};
