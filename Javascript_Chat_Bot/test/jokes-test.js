'use strict';

const chai = require('chai');
const delay = require('./delay.js').delay;
const Helper = require('hubot-test-helper');

// Setup "should"
chai.should();

// Time to wait for the Hubot to reply
const RESPONSE_DELAY = 500;

describe('jokes script', function() {
  // Configure mocha to use longer timout periods. We have to wait for
  // Hubot to respond to messages.
  this.slow(5000+ 2*RESPONSE_DELAY);
  this.timeout(7000+ 2*RESPONSE_DELAY);

  // Executed before each test. Used for setup.
  beforeEach(function() {
    // Disable timeout for setup
    this.timeout(0);

    const helper = new Helper('../scripts/jokes.js');
    this.room = helper.createRoom();
  });

  // Executed after each test. Used for cleanup.
  afterEach(function() {
    this.room.destroy();
  });

  it('gets a joke', function() {
    // Use a URL that returns valid JSON. It only has one joke posted.
    process.env.JOKE_URL = 'http://cpl.mwisely.xyz/hw/5/test-joke.json';

    const room = this.room;

    // Ask the robot for a joke...
    return room.user.say('norm', 'hubot tell me a joke')
      .then(function() {
        // ... then wait for the robot to reply...
        return delay(RESPONSE_DELAY);
      }).then(function() {
        // ... then check that it responded correctly. We
        // expect the robot to ask the question, but *not*
        // show an answer yet.
        room.messages.should.deep.eql([
          ['norm', 'hubot tell me a joke'],
          ['hubot', '@norm What\'s a monster\'s favorite bean?'],
        ]);

        // The robot should reply after 3 seconds, so we'll
        // wait for 3.5 seconds to account for other delays.
        return delay(3500);
      }).then(function() {
        // ... then we'll check the conversation to ensure
        // we've seen the answer.
        room.messages.should.deep.eql([
          ['norm', 'hubot tell me a joke'],
          ['hubot', '@norm What\'s a monster\'s favorite bean?'],
          ['hubot', '@norm A human bean.'],
        ]);
      });
  });

  it('handles empty joke list', function() {
    // Use a URL that returns an empty JSON array. (It has zero
    // jokes posted.)
    process.env.JOKE_URL = 'http://cpl.mwisely.xyz/hw/5/empty-jokes.json';

    const room = this.room;

    // Ask the robot for a joke...
    return room.user.say('norm', 'hubot tell me a joke')
      .then(function() {
        // ... then wait for the robot to reply...
        return delay(RESPONSE_DELAY);
      }).then(function() {
        // ... then check that the robot is aware that the
        // list is empty.
        room.messages.should.deep.eql([
          ['norm', 'hubot tell me a joke'],
          ['hubot', '@norm The joke list was empty!'],
        ]);
      });
  });

  it('handles missing jokes page', function() {
    // Use a URL that doesn't actually exist. Responds with an
    // HTTP 404.
    process.env.JOKE_URL = 'http://cpl.mwisely.xyz/hw/5/nope.json';

    const room = this.room;

    // Ask the robot for a joke...
    return room.user.say('norm', 'hubot tell me a joke')
      .then(function() {
        // ...then wait for the robot to reply...
        return delay(RESPONSE_DELAY);
      }).then(function() {
        // ...then check that the robot handles the error
        // correctly.
        room.messages.should.deep.eql([
          ['norm', 'hubot tell me a joke'],
          ['hubot', '@norm I couldn\'t retrieve any jokes...'],
        ]);
      });
  });

  it('handles non-JSON jokes page', function() {
    // Use a URL for a page that exists, but doesn't actually
    // contain JSON-encoded data.
    process.env.JOKE_URL = 'http://cpl.mwisely.xyz/index.html';

    const room = this.room;

    // Ask the robot for a joke
    return room.user.say('norm', 'hubot tell me a joke')
      .then(function() {
        // ...wait for the robot to reply...
        return delay(RESPONSE_DELAY);
      }).then(function() {
        // ...then check that the robot handles the error
        // correctly.
        room.messages.should.deep.eql([
          ['norm', 'hubot tell me a joke'],
          ['hubot', '@norm I couldn\'t parse any jokes...'],
        ]);
      });
  });
});
