import { HubConnection, HubConnectionState } from '@microsoft/signalr'
import React, { useEffect } from 'react'
import { HideModalAction, SignalRHubCreatedAction } from '../Actions'
import { DispatchContext } from '../App'
import { connectSignalR } from '../networking'

export default function DisconnectModalView (props: { userId: string, connection: HubConnection }) {
  const [reconnecting, setReconnecting] = React.useState(false)
  const [secondsToReconnect, setsecondsToReconnect] = React.useState(1)
  const [nextSecondsToReconnect, setNextSecondsToReconnect] = React.useState(2)

  const dispatch = React.useContext(DispatchContext)

  const forceReconnect = () => {
    console.log("HARD RECONNECTING!")
    setReconnecting(true)
    connectSignalR(props.userId, dispatch).then((newConnection) => {
      if (
        newConnection.state === HubConnectionState.Connected ||
        newConnection.state === HubConnectionState.Connecting ||
        newConnection.state === HubConnectionState.Reconnecting
      ) {
        console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
        dispatch(HideModalAction())
        setReconnecting(false)
        dispatch(SignalRHubCreatedAction(newConnection))
      } else {
        setReconnecting(false)
        console.log("RECONNECT FAILED")
        setNextSecondsToReconnect(nextSecondsToReconnect * 2)
        setsecondsToReconnect(nextSecondsToReconnect)
      }
    }).catch(() => {
      console.log("FAILURE TO CONNECT SHOULD RESET SECONDS")
      setNextSecondsToReconnect(nextSecondsToReconnect * 2)
      setsecondsToReconnect(nextSecondsToReconnect)
      setReconnecting(false)
    })
  }

  useEffect(() => {
    console.log("in useEffect " + secondsToReconnect)
    // This actually sets & clears the timer every second anew.
    // TODO: better text
    // TODO: what if you actually...time out?

    let timerId = setInterval(
      () => {
        if (reconnecting) {
          // If you're already reconnecting, you don't want to double up
          console.log('skipping because reconnecting already')
        } else if (secondsToReconnect <= 0) {
          setReconnecting(true)
          console.log('NOW RECONNECTING!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!')
          connectSignalR(props.userId, dispatch).then((newConnection) => {
            if (newConnection.state === HubConnectionState.Connected) {
              setReconnecting(false)
              dispatch(SignalRHubCreatedAction(newConnection))
              dispatch(HideModalAction())
            } else {
              console.log("RECONNECT FAILED")
              setReconnecting(false)
              setNextSecondsToReconnect(nextSecondsToReconnect * 2)
              setsecondsToReconnect(nextSecondsToReconnect)
            }
          }).catch(() => {
            console.log("FAILURE TO CONNECT SHOULD RESET SECONDS")
            setNextSecondsToReconnect(nextSecondsToReconnect * 2)
            setsecondsToReconnect(nextSecondsToReconnect)
            setReconnecting(false)
          })
        } else if (secondsToReconnect > 0) {
          setsecondsToReconnect(secondsToReconnect - 1)
        }
      },
      1000
    );
    console.log('RESOLVING INTERVAL')
    return () => clearInterval(timerId);
  }, [secondsToReconnect, reconnecting])

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
