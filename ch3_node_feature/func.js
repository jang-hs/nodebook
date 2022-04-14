const { odd, even } = require('./var');

function checkOddOrEven(num) {
  if (num % 2) {
    //홀수
    return odd;
  }
  return even;
}

module.exports = checkOddOrEven;