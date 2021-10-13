import React from 'react'

export default function RiddleModalView (props: {riddles: string[]}) {
  const riddleViews = props.riddles.map(n => <p className='riddle'>{n}</p>)
  const riddleTitle = (props.riddles.length > 1 ? 'The engraved riddles read...' : 'The engraved riddle reads...')
  
  return (
    <div id='riddle-modal' className='riddle-div'>
      <h1>{riddleTitle}</h1>
      {riddleViews}
    </div>
  )
}
