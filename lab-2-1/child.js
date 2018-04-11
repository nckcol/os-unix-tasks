const messages = require("./messages.js");
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
      console.log("dssd");
      break;
  }
});
