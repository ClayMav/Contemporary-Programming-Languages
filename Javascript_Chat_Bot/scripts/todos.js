// Description:
//   Keeps track of todo items
//
// Commands:
//   hubot show my todo list - Lists todo items in no particular order
//   hubot add <item> to my todo list - Adds <item> to the list of todo items
//   hubot <itemID> is done - Removes the item with <itemID> from the todo list
//
// Notes:
//  This script stores todo items as individual text files within a
//  directory named "todos". Each file will be named uniquely with a
//  random UUID (uuid.v4) and no file extension. Because each is a
//  separate file with a random name, the order of the listed todo
//  items may vary.
//
'use strict';

const fs = require('fs');
const path = require('path');
const uuid = require('uuid');
// const _ = require('underscore');

const DATA_DIR = 'todos';

module.exports = function(robot) {
  // Check to see if our chosen DATA_DIR exists. If it doesn't, we'll
  // make it.
  try {
    fs.statSync(DATA_DIR);
  } catch (error) {
    fs.mkdirSync(DATA_DIR);
  }

  // Handler for 'hubot show my todo list'
  robot.respond(/show my todo list$/i, function(msg) {
    fs.readdir(DATA_DIR, function(err, data) {
      if (err != null) {
        msg.reply('Oh no... I couldn\'t look for todos...');
        return;
      } else if (data.length == 0) {
        msg.reply('The list is empty!');
        return;
      } else {
        for (let i of data) {
          fs.readFile(path.join(DATA_DIR, i), function(err, data) {
            if (err != null) {
              msg.reply('Uh oh! Had trouble opening a todo...');
              return;
            } else {
              msg.reply(i + ': ' + data);
            }
          });
        }
      }
    });
  });

  // Handler for 'hubot add <item> to my todo list'
  robot.respond(/add (.+) to my todo list$/i, function(msg) {
    const todo = msg.match[1];

    fs.writeFile(path.join(DATA_DIR, uuid.v4()), todo, function(err) {
      if (err != null) {
        msg.reply('Oh no... I couldn\'t write the todo file...');
        return;
      }
    });
    msg.reply('OK! I added ' + todo + ' to the todo list');
  });

  // Handler for 'hubot <itemID> is done'
  robot.respond(/([0-9a-f-]{36}) is done$/i, function(msg) {
    const id = msg.match[1];

    fs.unlink(path.join(DATA_DIR, id), function(err) {
      if (err != null) {
        msg.reply('Couldn\'t find ' + id);
        return;
      }
      msg.reply('OK! Removed ' + id);
    });
  });
};
