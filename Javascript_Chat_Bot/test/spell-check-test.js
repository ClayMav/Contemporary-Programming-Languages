'use strict';

const chai = require('chai');
const delay = require('./delay.js').delay;
const Helper = require('hubot-test-helper');

// Setup "should"
chai.should();

// Time to wait for the Hubot to reply
const RESPONSE_DELAY = 500;

describe('spell-check script', function() {
  // Configure mocha to use longer timout periods. We have to wait for
  // Hubot to respond to messages.
  this.slow(4000 + 2*RESPONSE_DELAY);
  this.timeout(6000 + 2*RESPONSE_DELAY);

  // Executed before each test. Used for setup.
  beforeEach(function() {
    // Disable timeout for setup
    this.timeout(0);

    const helper = new Helper('../scripts/spell-check.js');
    this.room = helper.createRoom();
  });

  // Executed after each test. Used for cleanup.
  afterEach(function() {
    this.room.destroy();
  });

  it('recognizes correctly spelled words', function() {
    const room = this.room;

    // Ask the robot to remind us to dance.
    return room.user.say('norm', 'hubot how do you spell banana')
      .then(function() {
        // ... wait for it to think and reply
        return delay(RESPONSE_DELAY);
      }).then(function() {
        // ... then we make sure that we see our message the robot's
        // reply
        room.messages.should.deep.eql([
          ['norm', 'hubot how do you spell banana'],
          ['hubot', '@norm banana is spelled correctly'],
        ]);
      });
  });

  it('makes sane suggestions for bad spelling', function() {
    const room = this.room;

    // Ask the robot to remind us to dance.
    return room.user.say('norm', 'hubot how do you spell bannana')
      .then(function() {
        // ... wait for it to think and reply
        return delay(RESPONSE_DELAY);
      }).then(function() {
        // ... then we make sure that we see our message the robot's
        // reply
        const reply = room.messages[room.messages.length-1][1];
        reply.should.contain('banana');
      });
  });

  it('doesn\'t offer suggestions for more than one word', function() {
    const room = this.room;

    // Ask the robot to remind us to dance.
    return room.user.say('norm', 'hubot how do you spell banana flombay')
      .then(function() {
        // ... wait for it to think and reply
        return delay(RESPONSE_DELAY);
      }).then(function() {
        // ... then we make sure that we see our message the robot's
        // reply
        room.messages.should.deep.eql([
          ['norm', 'hubot how do you spell banana flombay'],
          ['hubot', '@norm I can only offer suggestions for single words.'],
        ]);
      });
  });

  it('handles non-words', function() {
    const room = this.room;

    // Ask the robot to remind us to dance.
    return room.user.say('norm', 'hubot how do you spell -1')
      .then(function() {
        // ... wait for it to think and reply
        return delay(RESPONSE_DELAY);
      }).then(function() {
        // ... then we make sure that we see our message the robot's
        // reply. aspell doesn't spell-check certain things (numbers,
        // symbols, etc.)... so we should tell Norm when we can't
        // check something
        room.messages.should.deep.eql([
          ['norm', 'hubot how do you spell -1'],
          ['hubot', '@norm aspell returned something weird!'],
        ]);
      });
  });
});
