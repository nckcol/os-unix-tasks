const fs = require("fs");
const glob = require("glob");
const path = require("path");
const readline = require("readline");
const chalk = require("chalk");

const main = async () => {
  const [directory, suffix] = process.argv.slice(2);

  let directoryStat;

  try {
    directoryStat = await statPromise(directory);
  } catch (e) {
    error(`Directory '${directory}' does not exists`);
  }

  if (!directoryStat.isDirectory()) {
    error(`'${directory}' is not a directory`);
  }

  const filename =
    (await questionPromise(rl, "Enter filename (result.txt): ")) ||
    "result.txt";

  const files = await globPromise(
    `${path.normalize(directory)}/**/*${suffix}.*([^.])`
  );

  const filesWithAtime = await Promise.all(
    files.map(async file => {
      const stat = await statPromise(file);
      return {
        name: file,
        atime: stat.atimeMs
      };
    })
  );

  const sortedFiles = filesWithAtime.sort((a, b) => b.atime - a.atime);

  await writeFilePromise(
    filename,
    sortedFiles.map(file => file.name).join("\n")
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

const globPromise = (pattern, options) =>
  new Promise((resolve, reject) =>
    glob(pattern, options, (error, files) => {
      if (error) {
        reject(error);
      }

      resolve(files);
    })
  );

const error = message => {
  console.error(chalk.red.bold(`Error: ${message}`));
  process.exit(1);
};

main();
