import ConfettiGenerator from 'confetti-js'
import React, { useEffect } from 'react'

export const ConfettiRoomView = () => {
  useEffect(() => {
    const confettiSettings = { target: 'confetti-canvas' }
    const confetti = new ConfettiGenerator(confettiSettings)
    confetti.render()

    return () => confetti.clear()
  }, [])
  return (
    <canvas style={ { position: 'absolute', top: 0, zIndex: 0 } } id='confetti-canvas'></canvas>
  )
}
