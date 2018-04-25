const messages = require("./messages");
const actions = require("./actions");

const id = process.argv[2];

if (process.send) {
  process.send(`Hello from ${id}`);
}

let programs = [];

process.on("message", message => {
  switch (message.type) {
    case messages.INIT:
      programs = message.payload.programs;
      process.send(Math.round(Math.random() * programs.length));
      break;
    case messages.LAUNCH_APPROVE:
      launch();
      setTimeout(terminate());
      break;
  }
});

makeGenerator = (from, to) => () => {};

const launch = program => {};
const terminate = program => () => {
  process.send(actions.launchEnd(program));
};

const log = message => {
  process.send(actions.logChild(message));
};
