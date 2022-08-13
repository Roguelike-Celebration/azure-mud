import React, { useContext, useState, useEffect } from 'react'
import { MentionsInput, Mention } from 'react-mentions'
import { DispatchContext } from '../App'
import { SendMessageAction } from '../Actions'

import '../../style/input.css'
const emojifier = require('node-emoji')

export default function InputView (props: {
  sendMessage: (message: string) => void,
  prepopulated?: string
}) {
  const dispatch = useContext(DispatchContext)
  const [input, setInput] = useState('')

  const handleInputChange = (e) => {
    // const result = emojifier.emojify(e.currentTarget.value)
    const result = e.target.value
    setInput(result)
  }

  const checkEnter = (e) => {
    if (e.key === 'Enter') {
      onClick()
    }
  }

  const onClick = () => {
    props.sendMessage(input)
    setInput('')
  }

  useEffect(() => {
    document.getElementById('chat-input').focus()
    if (props.prepopulated) {
      setInput(props.prepopulated)
    }
  }, [props.prepopulated])

  return (
    <div id="input">
      <MentionsInput
        // type="text"
        id="chat-input"
        className="ci"
        onChange={handleInputChange}
        // onKeyPress={checkEnter}
        value={input}
        aria-label="Chat text input box"
        autoComplete="off"
      >
        <Mention
          trigger="@"
          data={[{id: 'b', display: "Bob"}, {id: 'a', display: "Alice"}]}
          renderSuggestion={(suggestion, search, highlightedDisplay) => (
            <div>{highlightedDisplay}</div>
          )}
        />
      </MentionsInput>
      <button id="send" onClick={onClick}>
        Send
      </button>
    </div>
  )
}
