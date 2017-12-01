'use strict';

const chai = require('chai');
const delay = require('./delay.js').delay;
const fs = require('fs');
const Helper = require('hubot-test-helper');
const path = require('path');
const rm = require('rimraf').sync;
const tmp = require('tmp');
const _ = require('underscore');

// Setup "should"
const should = chai.should();

// Time to wait for the Hubot to reply
const RESPONSE_DELAY = 500;

describe('todo script', function() {
  // Configure mocha to use longer timout periods. We have to wait for
  // Hubot to respond to messages.
  this.slow(2000 + 2*RESPONSE_DELAY);
  this.timeout(4000+ 2*RESPONSE_DELAY);

  // Executed before each test. Used for setup.
  beforeEach(function() {
    // Disable timeout for setup
    this.timeout(0);

    // Remember our original working directory
    this.cwd = process.cwd();

    // Create a temporary directory...
    this.dataDir = tmp.dirSync().name;

    // Change to that directory
    process.chdir(this.dataDir);

    this.helper = new Helper('../scripts/todos.js');
    this.room = this.helper.createRoom();
  });

  // Executed after each test. Used for cleanup.
  afterEach(function() {
    this.room.destroy();


    // Change back to the original working directory
    process.chdir(this.cwd);

    // Remove the temporary directory when the test is over.
    rm(this.dataDir, {disableGlob: true});
  });

  it('creates a "todos" directory for todo items', function(done) {
    // We don't need to ask the robot for help to run this
    // test. We just want to know if we've setup the "todos"
    // directory like we were supposed to.

    // Make sure it's making the "todos" directory for us.
    fs.stat('todos', function(err, stat) {
      should.not.exist(err);
      stat.isDirectory().should.be.true;

      // Async test is complete
      done();
    });
  });

  it('shows a message when the data file is empty', function() {
    const room = this.room;

    // Ask the robot to show our todo list.
    return room.user.say('norm', 'hubot show my todo list')
      .then(function() {
        // ... then wait to hear back from the robot
        return delay(RESPONSE_DELAY);
      }).then(function() {
        // ... since we haven't told the robot to track
        // anything, then its list should be empty.
        room.messages.should.eql([
          ['norm', 'hubot show my todo list'],
          ['hubot', '@norm The list is empty!'],
        ]);
      });
  });

  it('shows a message when the data file isn\'t there', function() {
    const room = this.room;

    // Remove the todos directory
    fs.rmdirSync(path.join(this.dataDir, 'todos'));

    // Then ask the robot to show the list
    return room.user.say('norm', 'hubot show my todo list')
      .then(function() {
        // ... then wait to hear back from the robot
        return delay(RESPONSE_DELAY);
      }).then(function() {
        // ... then look for the error message
        room.messages.should.eql([
          ['norm', 'hubot show my todo list'],
          ['hubot', '@norm Oh no... I couldn\'t look for todos...'],
        ]);
      });
  });

  it('lets us add an item', function() {
    const room = this.room;

    // Ask the robot to add "potato" to the list
    return room.user.say('norm', 'hubot add potato to my todo list')
      .then(function() {
        // ... then wait to hear back from the robot
        return delay(RESPONSE_DELAY);
      }).then(function() {
        // ... then check that the robot acknowledged "potato"
        room.messages.should.eql([
          ['norm', 'hubot add potato to my todo list'],
          ['hubot', '@norm OK! I added potato to the todo list'],
        ]);
      });
  });

  it('lets us add a couple of items', function() {
    const room = this.room;
    const dataDir = this.dataDir;

    // Ask the robot to add "frog" to the list
    return room.user.say('norm', 'hubot add frog to my todo list')
      .then(function() {
        // ... then wait to hear back from the robot
        return delay(RESPONSE_DELAY);
      }).then(function() {
        // ... then add "submarine" to the list
        return room.user.say('norm', 'hubot add submarine to my todo list');
      }).then(function() {
        // ... then wait to hear back from the robot again
        return delay(RESPONSE_DELAY);
      }).then(function() {
        // ... then check that we see both acknowledgements
        room.messages.should.eql([
          ['norm', 'hubot add frog to my todo list'],
          ['hubot', '@norm OK! I added frog to the todo list'],
          ['norm', 'hubot add submarine to my todo list'],
          ['hubot', '@norm OK! I added submarine to the todo list'],
        ]);

        // Synchronously look up the contents of our "todos" directory
        const todoDir = path.join(dataDir, 'todos');
        const filenames = _(fs.readdirSync(todoDir));

        // Synchronously read the contents from all of the
        // data files
        const data = filenames.map(function(fname) {
          return fs.readFileSync(path.join(todoDir, fname), 'ascii');
        });

        // Assert that the files contain what we expect
        data.should.have.lengthOf(2);
        data.should.have.members(['frog', 'submarine']);

        // Then ask the robot to show us our todo list.
        return room.user.say('norm', 'hubot show my todo list');
      }).then(function() {
        // ... then wait a bit to hear back from the robot
        return delay(RESPONSE_DELAY);
      }).then(function() {
        // ... then verify that we see our message.
        room.messages[4].should.eql(
          ['norm', 'hubot show my todo list']
        );

        // Now let's look at the robot's replies...
        const messages = room.messages.slice(5);

        // Each message should be formatted as...
        // <uuid>: <task>
        _(messages).each(function(m) {
          const [name, msg] = m;
          name.should.equal('hubot');
          msg.should.match(/@norm [0-9a-f-]{36}: .*/i);
        });

        // Get a list of all of the tasks (lose the UUIDs)
        const todos = messages.map(function([_, msg]) {
          const match = /@norm [0-9a-f-]{36}: (.*)/i.exec(msg);
          return match[1];
        });

        // Make sure there are only two, and that they
        // match our requested tasks
        todos.should.have.lengthOf(2);
        todos.should.have.members(['frog', 'submarine']);
      });
  });

  it('lets us remove items', function() {
    const room = this.room;
    const dataDir = this.dataDir;
    const todoDir = path.join(dataDir, 'todos');

    let f1;
    let f2;

    // Ask the robot to add "frog" to the list
    return room.user.say('norm', 'hubot add frog to my todo list')
      .then(function() {
        // ... then wait to hear back from the robot
        return delay(RESPONSE_DELAY);
      }).then(function() {
        // ... then ask the robot to add submarine to the list
        return room.user.say('norm', 'hubot add submarine to my todo list');
      }).then(function() {
        // Wait to hear back from the robot
        return delay(RESPONSE_DELAY);
      }).then(function() {
        // Synchronously check our list of files
        const files = fs.readdirSync(todoDir);

        // There better be exactly two files!
        files.length.should.equal(2);

        // Here they are. All two of them.
        [f1, f2] = files;

        // Tell the robot to remove the item associated with f1
        return room.user.say('norm', `hubot ${f1} is done`);
      }).then(function() {
        // ... then wait to hear back from the robot
        return delay(RESPONSE_DELAY);
      }).then(function() {
        // Remove the first four messages and check that we
        // see our removal message and an acknowledgment
        room.messages.slice(4).should.eql([
          ['norm', `hubot ${f1} is done`],
          ['hubot', `@norm OK! Removed ${f1}`],
        ]);

        // Check the directory again. There should only be
        // one file left.
        const files = fs.readdirSync(todoDir);
        files.should.have.lengthOf(1);

        // Get the file and make sure it's the same as f2
        // (we deleted f1).
        const [f3] = files;
        f2.should.equal(f3);
      });
  });
});
