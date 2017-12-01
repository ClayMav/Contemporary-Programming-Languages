'use strict';

/**
 * Delay for a specified amount of time
 * @param  {number} t Number of milliseconds to wait before proceeding.
 * @return {Promise} A promise that resolves after the specified time.
 */
function delay(t) {
  return new Promise(function(resolve) {
    setTimeout(resolve, t);
  });
}

module.exports = {
  delay: delay,
};
