import {
  InputLevel,
  RainwayPeer,
  RainwayStream,
  RainwayStreamAnnouncement
} from '@rainway/web'
import React, { useEffect, useState } from 'react'
import { Rainway } from '@rainway/react'
import { StreamSelector } from './StreamSelector'

export interface WidgetProps {
  peerId: bigint;
  peer: RainwayPeer | undefined;
  announcements: RainwayStreamAnnouncement[];
  disconnect: () => void;
  streamStopCount: number;
}

/// A single widget in the demo app, exposing an interactive interface to a
/// Rainway peer-to-peer connection. The user can chat and request streams.
export const Widget = (props: WidgetProps) => {
  const offline = props.peer === undefined

  const [chatBuffer, setChatBuffer] = useState('')

  const [requestingStream, setRequestingStream] = useState(false)
  const [stream, setStream] = useState<RainwayStream | undefined>()
  const toggleStream = async () => {
    if (stream) {
      stream.leave()
      setStream(undefined)
      return
    }
    try {
      setRequestingStream(true)
      const result = await props.peer?.requestStream(
        InputLevel.Gamepad | InputLevel.Mouse | InputLevel.Keyboard,
      )
      setStream(result)
    } catch (e) {
      console.log(e)
    } finally {
      setRequestingStream(false)
    }
  }

  useEffect(() => {
    stream?.leave()
    setStream(undefined)
  }, [props.streamStopCount])

  return (
    <div className="card widget">
      <div style={{ width: 110, marginBottom: '8px' }}>
        {offline ? (
          <div className="badge">Disconnected</div>
        ) : (
          <div className="badge ok">Connected</div>
        )}
      </div>
      <div className="card-top">
        <h2>
          <label htmlFor="peerId">Peer ID</label>
        </h2>
        <input
          id="peerId"
          type="text"
          spellCheck={false}
          value={props.peerId.toString()}
          disabled={true}
        />
        <button onClick={() => props.disconnect()}>
          {offline ? 'Close' : 'Disconnect'}
        </button>
        <button
          disabled={!props.peer || !stream}
          onClick={() => stream?.requestFullscreen()}
        >
          Fullscreen
        </button>
        <button
          disabled={!props.peer || requestingStream}
          onClick={() => toggleStream()}
        >
          {stream ? 'Leave Stream' : 'Request New Stream'}
        </button>
        <StreamSelector
          announcements={props.announcements}
          onChosen={async (announcement) => {
            const stream = await announcement.join()

            setStream(stream)
          }}
        />
      </div>
      <div className="widget-body">
        <div className="stream-column m-r-16">
          <div className="stream-wrapper">
            <Rainway stream={stream}>No stream.</Rainway>
          </div>
        </div>
      </div>
    </div>
  )
}
