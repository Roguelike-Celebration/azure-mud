# Minimum Viable WebRTC Setup

This is a simple Hello World-level web app for streaming p2p WebRTC video.

Anyone who visits a copy of this webapp will start streaming their webcam video to all other actively connected users, and will be able to see everyone else accordingly. This is known as a full-mesh topology; its performance isn't ideal for situations where there are a large number of peers connected, but is the simplest way to demonstrate basic WebRTC functionality.

There are two main pieces:

1. An [Azure SignalR service](https://azure.microsoft.com/en-us/services/signalr-service/?WT.mc_id=webrtc-github-emwalker) instance and a few [Azure functions](https://azure.microsoft.com/en-us/services/functions/?WT.mc_id=webrtc-github-emwalker) to provide real-time text communication across clients.
   - When a new client joins: it can broadcast its peer ID to all connected clients
   - When two clients are trying to negotiate a p2p WebRTC connection: they can send WebRTC signaling data directly to each other
   - This is also theoretically usable as a text/data comms channel to send messages to _all_ clients, not just ones you have a WebRTC data channel open with
2. A small (TypeScript) browser app that loads the webcam, sets up communications with our SignalR service, and then uses that to set up p2p WebRTC connections with all connected clients

This uses the [simple-peer](http://github.com/feross/simple-peer) library to simplify the WebRTC handshaking and connection process.

More exhaustive documentation coming soon.
