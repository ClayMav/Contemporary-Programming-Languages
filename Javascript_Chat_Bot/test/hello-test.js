'use strict';

const chai = require('chai');
const Helper = require('hubot-test-helper');

// Setup "should"
chai.should();

describe('hello script', function() {
  // Executed before each test. Used for setup.
  beforeEach(function() {
    // Disable timeout for setup
    this.timeout(0);

    const helper = new Helper('../scripts/hello.js');
    this.room = helper.createRoom();
  });

  // Executed after each test. Used for cleanup.
  afterEach(function() {
    this.room.destroy();
  });

  it('says hi in response to "hubot hi"', function() {
    const room = this.room;

    // Say hi to the robot...
    return room.user.say('norm', 'hubot hi')
      .then(function() {
        // ... then check its response
        room.messages.should.deep.eql([
          ['norm', 'hubot hi'],
          ['hubot', '@norm hey there'],
        ]);
      });
  });

  it('says hi in response to "Hubot hi"', function() {
    const room = this.room;

    // Say hi to the robot...
    return room.user.say('norm', 'Hubot hi')
      .then(function() {
        // ... then check its response.
        room.messages.should.deep.eql([
          ['norm', 'Hubot hi'],
          ['hubot', '@norm hey there'],
        ]);
      });
  });
});
