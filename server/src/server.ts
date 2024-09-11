import express from 'express'
import ws from 'ws'
const session = require('express-session');

// Not sure we need http AND express, but this is how their sample code handles attaching the WSS
const http = require('http');

import routeFns from './routeFns'
import routeMetadata from './routeMetadata'
import { userConnected, userDisconnected } from './websocketManager';

const port = process.env.PORT || 3000

const sessionParser = session({
  saveUninitialized: false,
  secret: '$eCuRiTy',
  resave: false
});


const app = express()
app.use(express.json())
app.use(sessionParser);

// Programmatically load all of our routes
Object.keys(routeFns).forEach((name) => {
  // TODO: eventually, we should hardcode accepted methods, instead of implicitly assuming all method types in some situations.
  // That requires going through and looking at the client implementation,
  // which doesn't seem like the correct use of time right now.
  // My TS typing is sloppy because that refactor will clean all this up.
  const route = routeFns[name]
  if ((route as any).post || (route as any).get) { // has method-specific calls
    const methods = Object.keys(route)
    methods.forEach((method) => {
      const args = routeMetadata[name][method]
      // Replace this raw call with one that injects the metadata
      app[method](route, (req, res) => {
        routeFns[name][method]();
      })
    })
  } else {
    const args = routeMetadata[name]
    // Replace this raw call with one that injects the metadata
    app.all(name, (req, res) => {
      (routeFns[name] as Function)()
    })  }
})

const server = http.createServer(app);

//
// Create a WebSocket server completely detached from the HTTP server.
//
const wss = new ws.Server({ clientTracking: false, noServer: true });

server.on('upgrade', function (request, socket, head) {
  socket.on('error', onSocketError);

  console.log('Parsing session from request...');

  sessionParser(request, {}, () => {
    if (!request.session.userId) {
      socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
      socket.destroy();
      return;
    }

    console.log('Session is parsed!');

    socket.removeListener('error', onSocketError);

    wss.handleUpgrade(request, socket, head, function (ws) {
      wss.emit('connection', ws, request);
    });
  });
});

wss.on('connection', function (ws, request) {
  const userId = request.session.userId;

  userConnected(userId, ws);

  ws.on('error', console.error);

  ws.on('message', function (message) {
    console.log(`Received message ${message} from user ${userId}`);
    // TODO: Pipe through to actual message handler
  });

  ws.on('close', function () {
    userDisconnected(userId)
  });
});

//
// Start the server.
//

server.listen(port, function () {
  console.log('Listening on http://localhost:' + port);
});
