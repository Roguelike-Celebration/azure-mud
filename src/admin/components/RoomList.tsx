/* eslint-disable react/display-name */
import _ from 'lodash'
import React from 'react'

export default function (props: {roomIds: string[]}) {
  const roomIds = _.sortBy(props.roomIds || [])
  return (
    <ul>
      {roomIds.map(id => {
        return (
          <li key={`room-button-${id}`}>
            {id}
          </li>)
      })}
    </ul>
  )
}
