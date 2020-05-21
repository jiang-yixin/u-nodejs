const http = require('http');

const routes = require('./routes');

const server = http.createServer(routes.handler);

console.log('Hello from nodejs');

server.listen(3000);