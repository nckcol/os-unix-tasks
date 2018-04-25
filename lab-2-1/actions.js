const messages = require("./messages");

const init = programs => {
  return {
    type: messages.INIT,
    payload: {
      programs
    }
  };
};

const launchRequest = propgram => {
  return {
    type: messages.LAUNCH_REQUEST,
    payload: {
      programs
    }
  };
};

const launchApprove = program => {
  return {
    type: messages.LAUNCH_APPROVE,
    payload: {
      programs
    }
  };
};

const launchEnd = program => {
  return {
    type: messages.LAUNCH_FINISH,
    payload: {
      programs
    }
  };
};

const logChild = message => {
  return {
    type: message.LOG,
    payload: {
      message
    }
  };
};

module.exports = {
  init,
  launchApprove,
  launchRequest,
  launchEnd,
  logChild
};
