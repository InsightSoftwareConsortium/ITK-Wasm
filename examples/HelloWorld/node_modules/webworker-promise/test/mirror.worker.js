const register = require('../src/register');

register(
  (message, emit) => {
    return message;
  }
);