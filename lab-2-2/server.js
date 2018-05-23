const net = require("net");
const { Duplex } = require("stream");

const ipStream = new Duplex();
const ips = [];

const server = net.createServer(function(socket) {
  const { address, port } = socket.address();

  socket.write(JSON.stringify(ips));

  ips.push(address);
  ipStream.push(address);

  socket.pipe(ipStream);
});

server.listen(15250, "127.0.0.1");
