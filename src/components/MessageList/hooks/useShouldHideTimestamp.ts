import { useCallback } from 'react'
import { Message } from '../../../message'

const THREE_MINUTES = 1_000 * 60 * 3

type ShouldHideTimestamp = (
  message: Message,
  previousMessage: Message | undefined
) => boolean;

export const useShouldHideTimestamp = () =>
  useCallback<ShouldHideTimestamp>(
    (message, previousMessage) =>
      previousMessage &&
      'userId' in previousMessage &&
      'userId' in message &&
      previousMessage.userId === message.userId &&
      new Date(message.timestamp).getTime() -
        new Date(previousMessage.timestamp).getTime() <
        THREE_MINUTES,
    []
  )
