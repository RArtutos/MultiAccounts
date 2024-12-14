import { createBareServer } from '@tomphttp/bare-server-node';
import http from 'http';

const port = process.env.BARE_SERVER_PORT || 8080;
const server = http.createServer();
const bareServer = createBareServer('/bare/');

server.on('request', (req, res) => {
  if (bareServer.shouldRoute(req)) {
    bareServer.routeRequest(req, res);
  } else {
    res.writeHead(400);
    res.end('Not a bare request');
  }
});

server.on('upgrade', (req, socket, head) => {
  if (bareServer.shouldRoute(req)) {
    bareServer.routeUpgrade(req, socket, head);
  } else {
    socket.end();
  }
});

server.listen(port, () => {
  console.log(`Bare server listening on port ${port}`);
});