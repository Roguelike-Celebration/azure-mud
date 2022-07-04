import React, { useState } from 'react'
import { RainwayChannelMode, RainwayPeer, RainwayPeerState, RainwayError, RainwayRuntime, RainwayStreamAnnouncement } from '@rainway/web'
import { Widget } from './Widget'
import Config from '../../config'

interface DemoPeer {
  peerId: bigint;
  peer: RainwayPeer | undefined;
  announcements: RainwayStreamAnnouncement[];
  streamStopCount: number;
}

export default function RainwayStreamView (props: {}) {
  // TODO: The sample sets this via localStorage.
  // We probably want to wire it up to our infra
  const [connectingRuntime, setConnectingRuntime] = useState(false)
  const [runtime, setRuntime] = useState<RainwayRuntime | undefined>()
  const [peers, setPeers] = useState<DemoPeer[]>([])

  // This "peerId" string is the value for the connect prompt.
  const [peerId, setPeerId] = useState<string>('peerId-widget1')
  const [connecting, setConnecting] = useState(false)
  const [connectError, setConnectError] = useState('')

  function makePeer (peer: RainwayPeer): DemoPeer {
    return {
      peer,
      peerId: peer.peerId,
      streamStopCount: 0,
      announcements: []
    }
  }

  function addAnnouncement (
    peer: RainwayPeer,
    announcement: RainwayStreamAnnouncement
  ) {
    setPeers((ps) =>
      ps.map((p) =>
        p.peerId === peer.peerId
          ? { ...p, announcements: [...p.announcements, announcement] }
          : p
      )
    )
  }

  const connectToRainway = async (): Promise<void> => {
    // Make and attach the Rainway client.
    let rt: RainwayRuntime
    if (!runtime) {
      setConnectingRuntime(true)
      try {
        rt = await RainwayRuntime.initialize({
          apiKey: Config.RAINWAY_API_KEY,
          externalId: 'web-demo-react',
          onRuntimeConnectionLost: (rt, error) => {
            // When the connection is fatally lost, drop all peers.
            console.log('Connection lost:', error)
            setRuntime(undefined)
            setPeers([])
          },
          onConnectionRequest: (rt, request) => {
            // Auto-accept every request.
            request.accept()
          },
          onPeerMessage: (rt, peer, ch, data) => {
            // Chat was here in the demo
          },
          onPeerDataChannel: () => {
            // We don't particularly care about a data channel opening.
          },
          onPeerError: (rt, peer, error: RainwayError) => {
            // When a peer encounters an error, log it to the console.
            console.warn('onPeerError', peer, error)
          },
          onPeerStateChange: (rt, peer, state) => {
            // on connect
            if (state === RainwayPeerState.New) {
              // When a peer connection is established, add a DemoPeer/widget.
              const found = peers.find((p) => p.peerId === peer.peerId)
              if (!found) {
                setPeers((ps) => [...ps, makePeer(peer)])
              }
            } else if (state === RainwayPeerState.Failed) {
              // When a peer connection is lost, remove a DemoPeer/widget.
              console.warn('onPeerDisconnect', peer)
              setPeers((ps) =>
                ps.map((p) =>
                  p.peerId === peer.peerId ? { ...p, peer: undefined } : p
                )
              )
            }
          },
          onStreamAnnouncement: (rt, peer, announcement) => {
            addAnnouncement(peer, announcement)
          },
          onStreamStop: (rt, stream) => {
            // When a stream is stopped, increment that DemoPeer's
            // "streamStopCount". A `useEffect` in the Widget listens for such
            // increments and kills the stream state.
            setPeers((ps) =>
              ps.map((p) =>
                [...(p.peer?.streams.values() ?? [])].some((s) => s === stream)
                  ? { ...p, streamStopCount: p.streamStopCount + 1 }
                  : p
              )
            )
          },
          logSink: (level, message) => {
            // Where should log messages from Rainway go?
            console.log(level, message)
          }
        })
        setRuntime(rt)
      } finally {
        setConnectingRuntime(false)
      }
    } else {
      rt = runtime
    }
  }

  // TODO: Way to add peerId

  return (
    <div>
      <div className="m-b-8 flex">
        <br/>
        {runtime ? (
          <div className="m-l-8 badge ok">Connected to Rainway</div>
        ) : connectingRuntime ? (
          <div className="m-l-8 badge">Connecting…</div>
        ) : (
          <div>
            <button
              className="m-l-16"
              disabled={runtime !== undefined || connectingRuntime}
              onClick={connectToRainway}
            >
                    Connect to Rainway
            </button>
          </div>
        )}
      </div>
      {peers.map((p) => (
        <Widget
          key={p.peerId.toString()}
          peer={p.peer}
          peerId={p.peerId}
          announcements={p.announcements}
          disconnect={() => {
            p.peer?.disconnect()
            setPeers((ps) => ps.filter((x) => x.peerId !== p.peerId))
          }}
          streamStopCount={p.streamStopCount}
        />
      ))}
      <div className="card flex">
        <h2>
          <label htmlFor="peerId">Peer ID</label>
        </h2>
        <input
          className="m-l-8"
          id="peerId"
          type="text"
          spellCheck={false}
          value={peerId}
          placeholder="511111111111111111"
          disabled={!runtime || connecting}
          onChange={(e) => setPeerId(e.target.value)}
        />
        <button
          className="m-l-8 m-r-16"
          disabled={!runtime || connecting}
          onClick={async () => {
            console.log(peerId)
            try {
              setConnecting(true)
              const peer = await runtime?.connect(BigInt(peerId))
              if (peer) {
                await peer.createDataChannel(
                  'Message',
                  RainwayChannelMode.Reliable
                )

                await peer.listStreams()
                setConnectError('')
              }
            } catch (e) {
              setConnectError(
                (e as Error).toString().replace(/.*Rainway SDK Error: /, '')
              )
            } finally {
              setConnecting(false)
            }
          }}
        >
          {connecting ? 'Connecting…' : 'Connect to peer'}
        </button>
        {connectError}
      </div>
    </div>
  )
}
