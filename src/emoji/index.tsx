import React from 'react'

import customEmojiMapJson from './customEmojiMap.json'
import reservedEmojiMapJson from './reservedEmojiMap.json'

/** Maps emoji id (the "id" in ":id:") to its image file relative path */
type EmojiMap = { [emojiId: string]: string | undefined }

export const customEmojiMap: EmojiMap = customEmojiMapJson
export const reservedEmojiMap: EmojiMap = reservedEmojiMapJson

export function renderCustomEmojiString (string: string): JSX.Element {
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
