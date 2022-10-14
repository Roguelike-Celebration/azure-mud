import { HubConnection, HubConnectionState } from '@microsoft/signalr'
import React, { useEffect } from 'react'
import { HideModalAction } from '../Actions'
import { DispatchContext } from '../App'
import { connectSignalR } from '../networking'

export default function DisconnectModalView (props: { userId: string, connection: HubConnection }) {
  const [secondsToReconnect, setsecondsToReconnect] = React.useState(1)
  const [nextSecondsToReconnect, setNextSecondsToReconnect] = React.useState(2)

  const dispatch = React.useContext(DispatchContext)

  useEffect(() => {
    console.log("in useEffect " + secondsToReconnect)
    // This actually sets & clears the timer every second anew.
    // TODO: better text
    // TODO: what if you actually...time out?
    let timerId = setInterval(
      () => {
        if (secondsToReconnect === 0) {
          console.log("HARD RECONNECTING!")
          if (props.connection.state === HubConnectionState.Disconnected) {
            console.log('PROPS CONN STATE BEFORE ' + props.connection.state)
            connectSignalR(props.userId, dispatch).then((newConnection) => {
              if (newConnection.state === HubConnectionState.Connected) {
                dispatch(HideModalAction())
                console.log('PROPS CONN STATE AFTER ' + props.connection.state)
              } else {
                console.log("RECONNECT FAILED")
                setNextSecondsToReconnect(nextSecondsToReconnect * 2)
                setsecondsToReconnect(nextSecondsToReconnect)
              }
              
            }).catch(() => {
              console.log("FAILURE TO CONNECT SHOULD RESET SECONDS")
              setNextSecondsToReconnect(nextSecondsToReconnect * 2)
              setsecondsToReconnect(nextSecondsToReconnect)
            })
          }
        } else if (props.connection.state === HubConnectionState.Connecting ||
                   props.connection.state === HubConnectionState.Reconnecting) {
          setsecondsToReconnect(secondsToReconnect - 1)
          console.log('CONNECTING OR RECONNECTING')
        } else {
          setsecondsToReconnect(secondsToReconnect - 1)
        }
      },
      1000
    );
    console.log('RESOLVING INTERVAL')
    return () => clearInterval(timerId);
  }, [secondsToReconnect])

  return (
    <div>
      <h1>Please Hold!</h1>
      <p>
        TODO: Possibly Add Error Copy!
        Reconnect in: {secondsToReconnect}
      </p>
    </div>
  )
}
