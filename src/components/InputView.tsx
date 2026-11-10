import { emojify } from 'node-emoji'
import React, { useContext, useEffect, useState } from 'react'
import { Mention, MentionsInput } from 'react-mentions'

import { MinimalUser } from '../../server/src/user.js'
import { UserMapContext } from '../App.js'
import { emojiMentionsData } from '../emoji/index.js'
import '../../style/input.css'

/** id of the main chat's text input. */
export const MAIN_CHAT_INPUT_ID = 'chat-input'

export default function InputView (props: {
  /** id for the text input. Must be unique on the page: there can be more than one
   * InputView at a time, like the main chat's and a profile's whisper chat's. */
  inputId: string,
  sendMessage: (message: string) => void,
  usersInRoom?: string[]
}) {
  const { userMap } = useContext(UserMapContext)
  const [input, setInput] = useState('')

  const SUGGESTIONS_LIMIT = 10

  const handleInputChange = (e: { target: { value: string } }) => {
    if (e.target.value === '\n') {
      return
    }
    const result = emojify(e.target.value)
    setInput(result)
  }

  const checkEnter = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      sendInput()
    }
  }

  const sendInput = () => {
    if (input.trim() !== '') {
      props.sendMessage(input)
    }
    setInput('')
  }

  useEffect(() => {
    // Focus the main chat, even when this is another InputView, like a profile's whisper
    // chat, so opening a profile leaves you typing in the main chat
    document.getElementById(MAIN_CHAT_INPUT_ID)?.focus()
  }, [])

  const usersInRoom = (search: string) => {
    if (!props.usersInRoom) { return [] }

    const upperCaseSearch = search.toUpperCase()
    const suggestionIds = []
    for (const userId of props.usersInRoom) {
      const user: MinimalUser = userMap[userId]
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
        id={props.inputId}
        className="mentions main-input"
        onChange={handleInputChange}
        onKeyPress={checkEnter}
        value={input}
        aria-label="Chat text input box"
        autoComplete="off"
        /* Keep 1Password autofill from popping up; it ignores autoComplete="off". */
        data-1p-ignore
        forceSuggestionsAboveCursor={true}
        singleLine={true}
      >
        <Mention
          appendSpaceOnAdd={true}
          trigger="@"
          className="mentions__mentions"
          markup="@@[[__display__]]``__id__``@@"
          data={usersInRoom}
          displayTransform={(id, display) => display || id}
          renderSuggestion={(suggestion, search, highlightedDisplay) => {
            return (
              <div>{highlightedDisplay}</div>
            )
          }}
        />
        <Mention
          appendSpaceOnAdd={true}
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
      <button id="send" onClick={sendInput}>
        Send
      </button>
    </div>
  )
}
