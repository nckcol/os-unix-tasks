const net = require("net");
const { PassThrough } = require("stream");

/* Addresses registry */

let addressRegistry = [];
let currentId = 0;

const getAddressList = () => addressRegistry.map(record => record.address);

const registerAddress = address => {
  addressRegistry.push({
    id: currentId,
    address
  });
  return currentId++;
};

const removeAddress = id => {
  addressRegistry = addressRegistry.filter(record => record.id !== id);
};

/* Server */

const addressStream = new PassThrough();

const server = net.createServer(function(socket) {
  const { address } = socket.address();

  addressStream.pipe(socket);

  addressStream.push(
    JSON.stringify({
      event: "NEW",
      payload: address
    })
  );

  setTimeout(() => {
    socket.write(
      JSON.stringify({
        event: "REGISTRY",
        payload: getAddressList()
      })
    );

    const id = registerAddress(address);
  }, 40);

  console.log(`Client ${address} connected`);

  socket.on("close", () => {
    addressStream.unpipe(socket);
    removeAddress(id);
    console.log(`Client ${address} disconnected`);
  });
});

server.listen(15250, "127.0.0.1", () => {
  console.log("Server started!");
});
