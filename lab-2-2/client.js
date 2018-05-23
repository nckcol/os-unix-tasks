const net = require("net");

const client = new net.Socket();
let initialized = false;

client.on("close", function() {
  console.log("Connection closed");
});

client.on("data", function(data) {
  data = JSON.parse(data);

  switch (data.event) {
    case "NEW":
      if (!initialized) break;
      console.log("NEW CLIENT: " + data.payload);
      break;

    case "REGISTRY":
      initialized = true;
      console.log("CONNECTED CLIENTS: \n" + data.payload.join("\n"));
      break;
  }
});

client.connect(15250, "127.0.0.1");
