const { fork } = require("child_process");
const path = require("path");
const readline = require("readline");
const messages = require("./messages");
const actions = require("./actions");
const { range, middleware } = require("./utils");

const childScript = path.resolve("./child.js");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const MAX_SUBPROCESSES_NUMBER = 5;
const MIN_SUBPROCESSES_NUMBER = 1;
const DEFAULT_SUBPROCESSES_NUMBER = 4;

const PROGRAMS = [
  "word",
  "excel",
  "paint",
  "chrome",
  "notepad",
  "explorer",
  "opera",
  "player",
  "vlc",
  "vscode"
];
const launchQueue = {};

PROGRAMS.forEach((item, index) => (launchQueue[index] = []));

let childProcesses = {};

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

const forkChild = middleware(name => [
  fork(childScript, [name], {
    stdio: [process.stdin, process.stdout, process.stderr, "ipc"]
  }),
  name
]);

const saveChild = middleware(([child, name]) => {
  childProcesses[name] = child;
  return [child, name];
});

const initChild = middleware(([child, name]) => {
  child.send(actions.init(PROGRAMS));
  return [child, name];
});

const initChildHandlers = middleware(([child, name]) => {
  child.on("message", handleMessage([child, name]));
  return [child, name];
});

const handleReadline = rl => subprocesses => {
  const childNumber = filterSubprocessesNumber(subprocesses);

  range(childNumber).map(forkChild(saveChild(initChildHandlers(initChild()))));

  console.log("[time]: #[child] runs [program] for [delay]s");

  rl.close();
};

const handleMessage = ([child, name]) => ({ type, payload }) => {
  const launchForChild = launch(name);
  const terminateForChild = terminate(name);

  switch (type) {
    case messages.LAUNCH_REQUEST:
      return launchForChild(payload.program, payload.delay);

    case messages.TERMINATE:
      return terminateForChild(payload.program);

    case messages.LOG:
      return log(name, payload.text);

    case messages.ERROR:
      return error(name, payload.text);
  }
};

const launch = child => (program, delay) => {
  if (!launchQueue[program].length) {
    run(child, program, delay);
  }

  launchQueue[program].push([child, delay]);
};

const run = (child, program, delay) => {
  const now = new Date();
  const programName = PROGRAMS[program];
  console.log(
    `[${now
      .toISOString()
      .substr(11, 8)}]: #${child} runs ${programName} for ${delay}s`
  );
  setTimeout(() => terminate(child)(program), delay * 1000);
};

const terminate = child => program => {
  if (launchQueue[program][0][0] !== child) {
    console.log("error order", launchQueue[program][0], child);
  }

  childProcesses[child].send(actions.terminate(program));

  launchQueue[program].shift();

  if (launchQueue[program].length) {
    run(launchQueue[program][0][0], program, launchQueue[program][0][1]);
  }
};

const log = (child, text) => {
  console.log(`LOG #${child}:`, text);
};

const error = (child, text) => {
  console.error(`ERROR #${child}:`, text);
};

// MAIN PROGRAM

rl.question(
  `Enter number of subprocesses from ${MIN_SUBPROCESSES_NUMBER} to ${MAX_SUBPROCESSES_NUMBER} (${DEFAULT_SUBPROCESSES_NUMBER}): `,
  handleReadline(rl)
);
