const messages = require("./messages");
const actions = require("./actions");

const id = process.argv[2];
let programs = [];
let digest = [];

const log = message => {
  process.send(actions.logChild(message));
};

const error = message => {
  process.send(actions.errorChild(message));
};

makeGenerator = (from, to) => () => {
  return Math.round(from + Math.random() * to);
};

const generateProgramDigest = (programs, number) => {
  const randomProgramNumber = makeGenerator(0, programs.length - 1);
  const randomDelay = makeGenerator(1, 10);
  let forLaunch = [];

  for (let i = 0; i < number; i++) {
    const programNumber = randomProgramNumber();
    const delay = randomDelay();
    forLaunch.push([programNumber, delay]);
  }

  return forLaunch;
};

process.on("message", ({ type, payload }) => {
  switch (type) {
    case messages.INIT:
      digest = generateProgramDigest(payload.programs, 5);
      digest.forEach(([program, delay]) =>
        process.send(actions.launchRequest(program, delay))
      );
      break;
    case messages.TERMINATE:
      for (let i = 0; i < digest.length; i++) {
        if (digest[i][0] !== payload.program) {
          continue;
        }

        digest.splice(i, 1);
        break;
      }

      if (!digest.length) {
        process.exit(0);
      }
  }
});

process.on("exit", message => {
  log("exited");
});
