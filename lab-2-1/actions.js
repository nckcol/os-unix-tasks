const messages = require("./messages");

module.exports.init = programs => {
  return {
    type: messages.INIT,
    payload: {
      programs
    }
  };
};
