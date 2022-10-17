import React from 'react'

export default function SpecialTextModalView (props: {text: string}) {
  return (
    <div id='riddle-modal' className='riddle-div'>
      <p>{props.text}</p>
    </div>
  )
}
