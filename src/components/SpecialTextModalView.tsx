import React from 'react'

export default function SpecialTextModalView (props: {text: string}) {
  return (
    <div id='bonus-modal'>
      <p className="with-line-breaks">{props.text}</p>
    </div>
  )
}
