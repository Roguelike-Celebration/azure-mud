import express from 'express'
import ws from 'ws'
import cors from 'cors'

import routeFns from './routeFns'
import routeMetadata, { EndpointOptions } from './routeMetadata'
import { processResultWebsockets, userConnected, userDisconnected } from './websocketManager'
import authenticate, { getUserIdFromHeaders } from './authenticate'
import { AuthenticatedEndpointFunction, EndpointFunction } from './endpoint'
import updateProfile from './endpoints/updateProfile'

const session = require('express-session')

const port = process.env.PORT || 3000

// We use sessions because we need to pass a userId in when we create a WS connection,
// and this is how we associate a HTTP user with a WS user.
// I imagine in an ideal world *everything* might use session/cookie data instead of our custom headers,
// but that doesn't work with Azure Functions and thus this would require different client codepaths.
//
// For now we're using a junk secret, which is fine since this is only local dev.
// Server deployment would want to harden this.
const sessionParser = session({
  saveUninitialized: false,
  secret: 'thisisabadsecret',
  resave: false
})

const app = express()
app.use(express.json())
app.use(sessionParser)

// This is fine as long as this is only for local dev
var corsOptions = {
  origin: 'http://localhost:1234',
  credentials: true,
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}
app.use(cors(corsOptions))

const server = app.listen(port, function () {
  console.log('Listening on http://localhost:' + port)
})

console.log('restarted')

// Will also need to be updated when not local
app.get('/api/negotiatePubSub', (req, res) => {
  res.json({
    url: 'ws://localhost:3000'
  })
})

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
      const metadata = routeMetadata[name][method]
      // Replace this raw call with one that injects the metadata
      app[method](`/api/${name}`, (req, res) => {
        console.log('Calling', name, method, metadata)
        wrappedFunction(routeFns[name][method], metadata)(req, res)
      })
    })
  } else {
    const metadata = routeMetadata[name] as EndpointOptions
    // Replace this raw call with one that injects the metadata
    app.all(`/api/${name}`, (req, res) => {
      console.log('Calling', name)
      wrappedFunction((routeFns[name] as EndpointFunction), metadata)(req, res)
    })
  }
})

function onSocketError (e) {
  console.log('WebSocket error: ', e)
};

//
// Create a WebSocket server completely detached from the HTTP server.
//
const wss = new ws.Server({ clientTracking: false, noServer: true })

server.on('upgrade', function (request, socket, head) {
  socket.on('error', onSocketError)

  console.log('Parsing session from request...')

  sessionParser(request, {}, () => {
    if (!request.session.userId) {
      socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n')
      socket.destroy()
      return
    }

    console.log('Session is parsed!')

    socket.removeListener('error', onSocketError)

    wss.handleUpgrade(request, socket, head, function (ws) {
      wss.emit('connection', ws, request)
    })
  })
})

wss.on('connection', function (ws, request) {
  const userId = request.session.userId

  userConnected(userId, ws)

  ws.on('error', console.error)

  ws.on('message', function (message) {
    console.log(`Received message ${message} from user ${userId}`)
    // TODO: Pipe through to actual message handler
  })

  ws.on('close', function () {
    userDisconnected(userId)
  })
})

function wrappedFunction (fn: EndpointFunction|AuthenticatedEndpointFunction, metadata: EndpointOptions): (req, res) => void {
  // This is intended to be passed directly to express, so it can't be async itself
  return (req, res) => {
    (async () => {
      // todo: handle metadata.audit
      let result

      if (metadata.authenticated) {
        try {
          const authResult = await authenticate(req.headers, console.log, metadata)
          if (authResult.user) {
            result = await fn(authResult.user, req.body || {}, console.log)
            req.session.authenticated = true
            req.session.userId = authResult.user.id
          }
        } catch (e) {
          res
            .status(401)
            .send(e)
        }
      } else {
        console.log('not authenticated', req.body)

        // updateProfile is weird in that we need to grab the validated userId from the headers, but don't require you have a complete user yet
        // should we be relying on function-as-object equality? probably not.
        if (fn === updateProfile) {
          req.body.userId = await getUserIdFromHeaders(req.headers, console.log)
        }

        result = await (fn as EndpointFunction)(req.body, console.log)
      }

      if (!result) { return }

      // console.log(result)

      processResultWebsockets(result)
      if (result.httpResponse) {
        res.status(result.httpResponse.status).send(result.httpResponse.body)
      }
    })()
  }
}
