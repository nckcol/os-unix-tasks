const messages = require("./messages");

const init = programs => {
  return {
    type: messages.INIT,
    payload: {
      programs
    }
  };
};

const launchRequest = (program, delay) => {
  return {
    type: messages.LAUNCH_REQUEST,
    payload: {
      program,
      delay
    }
  };
};

const launchApprove = program => {
  return {
    type: messages.LAUNCH_APPROVE,
    payload: {
      program
    }
  };
};

const launch = program => {
  return {
    type: messages.LAUNCH,
    payload: {
      program
    }
  };
};

const terminate = program => {
  return {
    type: messages.TERMINATE,
    payload: {
      program
    }
  };
};

const logChild = text => {
  return {
    type: messages.LOG,
    payload: {
      text
    }
  };
};

const errorChild = text => {
  return {
    type: messages.ERROR,
    payload: {
      text
    }
  };
};

module.exports = {
  init,
  launchApprove,
  launchRequest,
  launch,
  terminate,
  logChild,
  errorChild
};
