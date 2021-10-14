import React from 'react'

export default function RiddleModalView (props: {riddles: string[]}) {
  const riddleViews = props.riddles.map(function (val, index) { return <p className='riddle' key={'riddle-' + index}>{val}</p> })
  const riddleTitle = (props.riddles.length > 1 ? 'The engraved riddles read...' : 'The engraved riddle reads...')

  return (
    <div id='riddle-modal' className='riddle-div'>
      <h1>{riddleTitle}</h1>
      {riddleViews}
    </div>
  )
}
