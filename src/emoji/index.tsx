import React from 'react'

import customEmojiMap from './customEmojiMap.json'

export function renderCustomEmojiString (string: string) {
  const stringParts = string.split(/(:.*?:)/)
  const emojiComponent = stringParts.reduce<JSX.Element>((newComponent, stringPart) => {
    if (stringPart.startsWith(':') && stringPart.endsWith(':')) {
      const emojiIdRegex = /:(.*):/
      const [_, emojiId] = emojiIdRegex.exec(stringPart)

      if (customEmojiMap[emojiId]) {
        return <>{newComponent} {<img className="inline-custom-emoji" alt={':' + emojiId + ':'} src={customEmojiMap[emojiId]}/>}</>
      }

      return <>{newComponent} {':' + emojiId + ':'}</>
    }

    return <>{newComponent} {stringPart}</>
  }, <></>)

  return emojiComponent
}

export const emojiMentionsData = Object.keys(customEmojiMap).map(key => {
  return {
    id: key
  }
})
