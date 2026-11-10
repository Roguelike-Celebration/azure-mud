/* eslint-disable react/display-name */
import _ from 'lodash'
import React, { useContext } from 'react'

import diskRoomData from '../../../server/src/rooms/data/roomData.json'
import { tooltipAttrs } from '../../display.js'
import { getAllRooms, getRoom, resetRoomData } from '../../networking.js'
import { RoomDataMap } from '../../reducer.js'
import { UpdateAndShowRoomAction } from '../actions.js'
import { formatRoomDataJson, roomDataFileName } from '../roomDataJson.js'

import { DispatchContext } from './App.js'
import '../../../style/nav.css'

// The copy of roomData.json built into this app, standing in for the backend's copy that
// Reset loads. Will match as long as frontend and backend are deployed from the same version.
// (Which we do for prod and staging. Not necessarily dev; that depends on the operator.)
const roomDataOnDisk: RoomDataMap = diskRoomData

const DIFFERS_FROM_DISK_MARK = '\u{1F7E1}' // large yellow circle
const DIFFERS_FROM_DISK_TEXT = 'Differs from the disk copy. Reset Room Data would overwrite it.'

export default function (props: {
  roomIds: string[] | undefined,
  roomData: RoomDataMap,
  okToLeaveRoom: () => boolean,
  showPreview: boolean,
  setShowPreview: (show: boolean) => void
}) {
  const dispatch = useContext(DispatchContext)

  const roomIds = _.sortBy(props.roomIds || [])

  const differsFromDisk = (roomId: string): boolean => {
    const room = props.roomData[roomId]
    return room !== undefined && !_.isEqual(room, roomDataOnDisk[roomId])
  }

  const roomTooltip = (roomId: string): string => {
    const room = props.roomData[roomId]
    const lines = [
      room?.displayName ?? '?',
      room?.shortName ?? '?',
      roomId
    ]
    if (differsFromDisk(roomId)) {
      lines.push('', DIFFERS_FROM_DISK_TEXT)
    }
    return lines.join('\n')
  }

  const clickedResetData = async () => {
    if (!confirm("Are you sure you'd like to reset room data? This may cause irrevocable data loss. (Will also force a page refresh, sorry.)")) return
    const result = await resetRoomData(true)
    if (!result.ok) {
      alert(`Failed resetting room data: ${result.error}`)
      return
    }
    const roomCount = Object.keys(result.value.roomData ?? {}).length
    alert(`Reset room data to the disk copy (${roomCount} rooms).`)
    window.location.reload()
  }

  const clickedDownloadData = async () => {
    const rooms = await getAllRooms()
    if (!rooms) {
      alert('Failed fetching room data to download. (AzFn getAllRooms failed.)')
      return
    }
    const roomJSON = formatRoomDataJson(rooms)

    // via https://stackoverflow.com/questions/34156282/how-do-i-save-json-to-local-text-file
    var a = document.createElement('a')
    var file = new Blob([roomJSON], { type: 'application/json' })
    a.href = URL.createObjectURL(file)
    // Use download time as timestamp. TODO: Use time of last edit instead. That time is
    // not available through the backend API yet.
    a.download = roomDataFileName(new Date())
    a.click()
  }

  const clickedRoom = async (e: React.MouseEvent<HTMLButtonElement>) => {
    const roomId = e.currentTarget.getAttribute('data-room')
    if (roomId && props.okToLeaveRoom()) {
      // TODO: This is bad compared to handling this async better
      // The cobbler's children have no shoes.
      const roomData = await getRoom(roomId)
      if (!roomData) {
        alert(`Failed fetching room data for room ${roomId}. (AzFn getRoom failed.)`)
        return
      }
      console.log('got room data', roomId, roomData)
      dispatch(UpdateAndShowRoomAction(roomId, roomData))
    }
  }

  return (
    <ul id='room-list'>
      {roomIds.map(id => {
        return (
          <li key={`room-button-${id}`}>
            <button
              data-room={id}
              className='nav-item'
              onClick={clickedRoom}
              {...tooltipAttrs(roomTooltip(id))}
            >
              {id}
              {differsFromDisk(id) &&
                <span className='room-status-mark' role='img' aria-label={DIFFERS_FROM_DISK_TEXT}>
                  {DIFFERS_FROM_DISK_MARK}
                </span>}
            </button>
          </li>)
      })}
      <li style={{ marginTop: '1em' }}>
        <label>
          <input
            type='checkbox'
            checked={props.showPreview}
            onChange={(e) => props.setShowPreview(e.target.checked)}
          />
          Show preview
        </label>
      </li>
      <button
        onClick={clickedResetData}
        style={{ marginTop: '1em' }}>
        Reset Room Data to Disk Copy
      </button>
      <button
        onClick={clickedDownloadData}
        style={{ marginTop: '1em', display: 'block' }}>
        Download Local JSON
      </button>
    </ul>
  )
}
