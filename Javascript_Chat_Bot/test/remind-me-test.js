'use strict';

const chai = require('chai');
const delay = require('./delay.js').delay;
const Helper = require('hubot-test-helper');

// Setup "should"
chai.should();

// Time to wait for the Hubot to reply
const RESPONSE_DELAY = 500;

describe('remind-me script', function() {
  // Configure mocha to use longer timout periods. We have to wait for
  // Hubot to respond to messages.
  this.slow(4000 + 2*RESPONSE_DELAY);
  this.timeout(6000 + 2*RESPONSE_DELAY);

  // Executed before each test. Used for setup.
  beforeEach(function() {
    // Disable timeout for setup
    this.timeout(0);

    const helper = new Helper('../scripts/remind-me.js');
    this.room = helper.createRoom();
  });

  // Executed after each test. Used for cleanup.
  afterEach(function() {
    this.room.destroy();
  });

  it('reminds us to do stuff in a reasonable amount of time', function() {
    const room = this.room;

    // Ask the robot to remind us to dance.
    return room.user.say('norm', 'hubot remind me to dance in 2 seconds')
      .then(function() {
        // ... wait for it to think and reply
        return delay(RESPONSE_DELAY);
      }).then(function() {
        // ... then we make sure that we see our message and the
        // acknowledgement
        room.messages.should.deep.eql([
          ['norm', 'hubot remind me to dance in 2 seconds'],
          ['hubot', '@norm OK. I\'ll remind you to dance in 2 seconds.'],
        ]);

        // ... then we wait another two seconds...
        return delay(2000);
      }).then(function() {
        // ... and assert that we see our messages from before,
        // PLUS the actual reminder.
        room.messages.should.deep.eql([
          ['norm', 'hubot remind me to dance in 2 seconds'],
          ['hubot', '@norm OK. I\'ll remind you to dance in 2 seconds.'],
          ['hubot', '@norm Don\'t forget to dance!'],
        ]);
      });
  });

  it('says the right thing', function() {
    const room = this.room;

    // As the robot to remind us to eat a bug.
    return room.user.say('norm', 'hubot remind me to eat a bug in 1 second')
      .then(function() {
        // ... then we wait 1100 milliseconds...
        return delay(1100);
      }).then(function() {
        // ... then we make sure that we've seen all of the expected phrases.
        room.messages.should.deep.eql([
          ['norm', 'hubot remind me to eat a bug in 1 second'],
          ['hubot', '@norm OK. I\'ll remind you to eat a bug in 1 second.'],
          ['hubot', '@norm Don\'t forget to eat a bug!'],
        ]);
      });
  });
});
