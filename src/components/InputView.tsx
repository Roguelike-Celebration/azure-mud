import React, { useContext, useState, useEffect } from 'react'
import { MentionsInput, Mention } from 'react-mentions'
import { DispatchContext, UserMapContext } from '../App'

import '../../style/input.css'
import { PublicUser } from '../../server/src/user'
import { emojiMentionsData } from '../emoji'
const emojifier = require('node-emoji')

export default function InputView (props: {
  sendMessage: (message: string) => void,
  prepopulated?: string,
  usersInRoom?: string[]
}) {
  const { userMap } = useContext(UserMapContext)
  const [input, setInput] = useState('')

  const SUGGESTIONS_LIMIT = 10

  const handleInputChange = (e) => {
    if (e.target.value === '\n') {
      return
    }
    const result = emojifier.emojify(e.target.value)
    setInput(result)
  }

  const checkEnter = (e) => {
    if (e.key === 'Enter') {
      onClick()
    }
  }

  const onClick = () => {
    if (input.trim() !== '') {
      props.sendMessage(input)
    }
    setInput('')
  }

  useEffect(() => {
    document.getElementById('chat-input').focus()
    if (props.prepopulated) {
      setInput(props.prepopulated)
    }
  }, [props.prepopulated])

  const usersInRoom = (search: string) => {
    if (!props.usersInRoom) { return [] }

    const upperCaseSearch = search.toUpperCase()
    const suggestionIds = []
    for (const userId of props.usersInRoom) {
      const user: PublicUser = userMap[userId]
      if (user && (!search || user.username.toUpperCase().startsWith(upperCaseSearch))) {
        suggestionIds.push({ id: user.id, display: user.username })
      }
      if (suggestionIds.length === SUGGESTIONS_LIMIT) {
        break
      }
    }

    return suggestionIds
  }

  return (
    <div id="input">
      <MentionsInput
        id="chat-input"
        className="mentions main-input"
        onChange={handleInputChange}
        onKeyPress={checkEnter}
        value={input}
        aria-label="Chat text input box"
        autoComplete="off"
        forceSuggestionsAboveCursor={true}
        singleLine={true}
      >
        <Mention
          trigger="@"
          className="mentions__mentions"
          markup="@@[[__display__]]``__id__``@@"
          data={usersInRoom}
          renderSuggestion={(suggestion, search, highlightedDisplay) => {
            return (
              <div>{highlightedDisplay}</div>
            )
          }}
        />
        <Mention
          trigger=":"
          className="mentions__custom_emoji"
          markup=":__id__:"
          data={emojiMentionsData}
          displayTransform={(id, display) => `:${id}:`}
          renderSuggestion={(suggestion, search, highlightedDisplay) => {
            return (
              <div>{highlightedDisplay}</div>
            )
          }}
        />
      </MentionsInput>
      <button id="send" onClick={onClick}>
        Send
      </button>
    </div>
  )
}
