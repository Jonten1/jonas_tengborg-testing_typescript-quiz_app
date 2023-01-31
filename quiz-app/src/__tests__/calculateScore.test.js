const assert = require('assert');
function calculateScore(numCorrect) {
  if (numCorrect < 0) {
    return 0;
  }
  return numCorrect * 10;
}

describe('calculateScore()', function () {
  it('should return the correct score for a given number of correct answers', function () {
    const score = calculateScore(5);
    assert.equal(score, 50);
  });

  it('should return 0 for a negative number of correct answers', function () {
    const score = calculateScore(-5);
    assert.equal(score, 0);
  });
});
