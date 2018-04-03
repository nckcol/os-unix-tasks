const id = process.argv[2];

if (process.send) {
  process.send(`Hello from ${id}`);
}

process.on("message", message => {
  //process.send("Hello!!");
});
