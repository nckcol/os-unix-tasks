const fs = require("fs");
const glob = require("glob");
const path = require("path");
const readline = require("readline");
const chalk = require("chalk");
const mv = require("mv");

const main = async () => {
  const [source, destination] = process.argv.slice(2);

  await checkDirectory(source);

  const userSize = await questionPromise(rl, "Enter files size (200): ");
  const size = parseInt(userSize) || 200;

  const files = await globPromise(`${path.normalize(source)}/*`);

  const filesWithStats = await Promise.all(
    files.map(async file => {
      const stat = await statPromise(file);
      return {
        name: file,
        stat
      };
    })
  );

  const filteredFiles = filesWithStats.filter(file => file.stat.size < size);

  console.log("Count: " + filteredFiles.length);
  console.log(
    "Size: " +
      filteredFiles.reduce((acc, file) => acc + file.stat.size, 0) +
      "b"
  );

  await Promise.all(
    filteredFiles.map(async file => {
      const parsedName = path.parse(file.name);

      const newFilename = path.join(destination, parsedName.base);

      await movePromise(file.name, newFilename);
    })
  );
};

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const writeFilePromise = (file, data) =>
  new Promise((resolve, reject) => {
    fs.writeFile(file, data, err => {
      if (err) reject(err);
      resolve();
    });
  });

const questionPromise = (rl, text) =>
  new Promise((resolve, reject) =>
    rl.question(text, answer => {
      resolve(answer);
      rl.close();
    })
  );

const statPromise = filename =>
  new Promise((resolve, reject) => {
    fs.stat(filename, (error, stat) => {
      if (error) {
        reject(error);
      }
      resolve(stat);
    });
  });

const renamePromise = (oldName, newName) =>
  new Promise((resolve, reject) => {
    fs.rename(oldName, newName, err => {
      if (err) reject(err);
      resolve();
    });
  });

const globPromise = (pattern, options) =>
  new Promise((resolve, reject) =>
    glob(pattern, options, (error, files) => {
      if (error) {
        reject(error);
      }

      resolve(files);
    })
  );

const movePromise = (source, destination) => {
  new Promise((resolve, reject) => {
    mv(source, destination, { mkdirp: true }, err => {
      if (err) reject(err);
      resolve();
    });
  });
};

const error = message => {
  console.error(chalk.red.bold(`Error: ${message}`));
  process.exit(1);
};

const checkDirectory = async directory => {
  let directoryStat;

  try {
    directoryStat = await statPromise(directory);
  } catch (e) {
    error(`Directory '${directory}' does not exists`);
  }

  if (!directoryStat.isDirectory()) {
    error(`'${directory}' is not a directory`);
  }
};

main();
