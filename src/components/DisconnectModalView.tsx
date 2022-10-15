import React, { useEffect } from 'react'
import { HideModalAction } from '../Actions'
import { DispatchContext } from '../App'
import { connect } from '../networking'

export default function DisconnectModalView (props: { userId: string }) {
  const [reconnecting, setReconnecting] = React.useState(false)
  const [secondsToReconnect, setsecondsToReconnect] = React.useState(1)
  const [nextSecondsToReconnect, setNextSecondsToReconnect] = React.useState(2)

  const dispatch = React.useContext(DispatchContext)

  useEffect(() => {
    // This actually sets & clears the timer every second anew.
    const timerId = setInterval(
      () => {
        if (reconnecting) {
          // If you're already reconnecting, you don't want to double up
        } else if (!reconnecting && secondsToReconnect <= 0) {
          setReconnecting(true)
          connect(props.userId, dispatch).then(() => {
            setReconnecting(false)
            dispatch(HideModalAction())
          }).catch((e) => {
            console.error('Could not successfully reconnect!', e)
            setReconnecting(false)
            setNextSecondsToReconnect(nextSecondsToReconnect * 2)
            setsecondsToReconnect(nextSecondsToReconnect)
          })
        } else if (secondsToReconnect > 0) {
          setsecondsToReconnect(secondsToReconnect - 1)
        }
      },
      1000
    )
    return () => clearInterval(timerId)
  }, [secondsToReconnect, reconnecting])

  return (
    <div>
      <h1>There&apos;s a network issue!</h1>
      <p>Sorry, the client&apos;s lost its connection to chat!</p>
      <p>We&apos;ll attempt to periodically reconnect, or you can refresh your page to force it.</p>
      {secondsToReconnect !== 0 ? (
        <p>Next attempt in {secondsToReconnect} seconds.</p>
      ) : (
        <p>Attempting to reconnect...</p>
      )}
    </div>
  )
}
