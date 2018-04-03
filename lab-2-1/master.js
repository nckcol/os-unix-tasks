const { fork } = require("child_process");
const path = require("path");
const readline = require("readline");

const childScript = path.resolve("./child.js");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const DEFAULT_SUBPROCESSES_NUMBER = 4;
const MAX_SUBPROCESSES_NUMBER = 5;
const MIN_SUBPROCESSES_NUMBER = 1;

rl.question(
  `Enter number of subprocesses from ${MIN_SUBPROCESSES_NUMBER} to ${MAX_SUBPROCESSES_NUMBER} (${DEFAULT_SUBPROCESSES_NUMBER}): `,
  subprocesses => {
    const childNumber = filterSubprocessesNumber(subprocesses);

    let childProcesses = [];

    for (let i = 0; i < childNumber; i++) {
      const child = forkChild(i);
      childProcesses.push(child);
      child.on("message", handleMessage(child));
    }

    rl.close();
  }
);

const handleMessage = child => message => {
  console.log("message from child:", message);
  child.send("Hi");
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

const forkChild = i =>
  fork(childScript, [i], {
    stdio: ["pipe", "pipe", "pipe", "ipc"]
  });
