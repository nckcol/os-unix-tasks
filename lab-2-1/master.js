const { fork } = require("child_process");
const path = require("path");
const readline = require("readline");
const messages = require("./messages");

const childScript = path.resolve("./child.js");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const DEFAULT_SUBPROCESSES_NUMBER = 4;
const MAX_SUBPROCESSES_NUMBER = 5;
const MIN_SUBPROCESSES_NUMBER = 1;

const PROGRAMS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

let childProcesses = [];

const handleReadline = rl => subprocesses => {
  const childNumber = filterSubprocessesNumber(subprocesses);

  childProcesses = range(childNumber).map(forkChildAndSave);

  rl.close();
};

rl.question(
  `Enter number of subprocesses from ${MIN_SUBPROCESSES_NUMBER} to ${MAX_SUBPROCESSES_NUMBER} (${DEFAULT_SUBPROCESSES_NUMBER}): `,
  handleReadline(rl)
);

const handleMessage = child => message => {
  console.log("message from child:", message);

  //child.send("Hi");
};

const filterSubprocessesNumber = subprocesses => {
  subprocesses = parseInt(subprocesses, 10);

  if (isNaN(subprocesses)) {
    return DEFAULT_SUBPROCESSES_NUMBER;
  }

  return Math.min(
    Math.max(MIN_SUBPROCESSES_NUMBER, subprocesses),
    MAX_SUBPROCESSES_NUMBER
  );
};

const forkChildAndSave = i => {
  const child = forkChild(i);
  childProcesses.push(child);
  child.on("message", handleMessage(child));
  child.send({
    type: messages.INIT,
    payload: {
      programs: PROGRAMS
    }
  });
  return child;
};

const forkChild = i =>
  fork(childScript, [i], {
    stdio: ["pipe", "pipe", "pipe", "ipc"]
  });

const range = (arg1, arg2 = false, step = 1) => {
  const list = [];

  let from = 0;
  let to = 0;

  if (!arg2) {
    to = arg1;
  } else {
    from = arg1;
    to = arg2;
  }

  for (let i = from; i < to; i += step) {
    list.push(i);
  }

  return list;
};
