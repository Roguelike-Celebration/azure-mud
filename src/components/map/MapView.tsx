import React from 'react'
import MapRoom from './MapRoom'
import MapPath from './MapPath'
import { Room } from '../../room'

/**
 * This renders a clickable ASCII map! This code is super janky in many ways.
 *
 * At a high level, while there's some procedurality in creating the rooms,
 * the overall map is completely declarative. There's a data blob in this file
 * that contains exactly where each room should go, as well as the paths between
 * rooms (which I would *love* to procgen, but seems like a bunch of work)
 *
 * The paths in particular are janky. They have a solid background to override
 * the wall tiles in the case of doors, but that means we ofteh need to chunk out
 * individual paths into multiple ones so that the div being created doesn't
 * unintentionally sit on top of other room tiles and wipe them out. Sigh.
 */
interface Props {
    roomData: { [roomId: string]: Room };
    currentRoomId: string
}

export default function MapView (props: Props) {
  const height = Math.max(...rooms.map(r => r.y + r.height + 2))

  console.log(props.roomData)
  const roomViews = rooms.map((r, idx) => {
    console.log(r.id, props.roomData[r.id])
    return <MapRoom key={`room-${idx}`} room={props.roomData[r.id]} width={r.width} height={r.height} x={r.x} y={r.y} playerCoords={r.playerCoords} hasPlayer={r.id === props.currentRoomId}/>
  })
  const pathViews = paths.map((p, idx) => <MapPath key={`path-${idx}`} x={p.x} y={p.y} str={p.str}/>)

  return (
    <div style={{ position: 'relative', height: `${height * 15}px`, letterSpacing: '2px', margin: '15px' }}>
      {roomViews}
      {pathViews}
    </div>
  )
}

const rooms = [
  {
    id: 'danceFloor',
    width: 7,
    height: 8,
    x: 0,
    y: 4,
    playerCoords: [5, 6]
  },
  {
    id: 'kitchen',
    width: 10,
    height: 8,
    x: 12,
    y: 0,
    playerCoords: [2, 6]
  },
  {
    id: 'bar',
    width: 10,
    height: 4,
    x: 12,
    y: 10,
    playerCoords: [1, 1]
  },
  {
    id: 'shippingContainer',
    width: 13,
    height: 3,
    x: 30,
    y: 3,
    playerCoords: [1, 2]
  },
  {
    id: 'theatre',
    width: 15,
    height: 20,
    x: 50,
    y: 0,
    playerCoords: [7, 13]
  },
  {
    id: 'statue',
    width: 8,
    height: 5,
    x: 33,
    y: 12,
    playerCoords: [5, 4]
  },
  {
    id: 'lounge',
    width: 30,
    height: 6,
    x: 13,
    y: 20,
    playerCoords: [8, 3]
  }
]

const paths = [
  // Dance floor -> kitchen
  {
    x: 8,
    y: 6,
    str: '+'
  },
  {
    x: 9,
    y: 3,
    str: ' ##\r\n #\r\n #\r\n##'
  },
  {
    x: 12,
    y: 3,
    str: '#'
  },
  // Dance floor -> Bar
  {
    x: 8,
    y: 12,
    str: '#####'
  },
  // Kitchen -> bar
  {
    x: 17,
    y: 9,
    str: '#\r\n#'
  },
  // Bar <-> lounge
  {
    x: 18,
    y: 16,
    str: '####\r\n   #\r\n   #\r\n   #'
  },
  {
    x: 18,
    y: 15,
    str: '+'
  },
  {
    x: 21,
    y: 20,
    str: '+'
  },
  // lounge <-> statue
  {
    x: 39,
    y: 18,
    str: '#\r\n#\r\n#'
  },
  // theater <-> lounge
  {
    x: 43,
    y: 26,
    str: '#'
  },
  {
    x: 44,
    y: 22,
    str: '        #########\r\n      ##\r\n    ##\r\n  ##\r\n##'
  },
  {
    x: 55,
    y: 21,
    str: '+'
  },
  {
    x: 60,
    y: 21,
    str: '+'
  },
  // statue <-> theatre,
  {
    x: 42,
    y: 15,
    str: '#'
  },
  {
    x: 43,
    y: 13,
    str: '    ###\r\n    #\r\n##  #\r\n ####'
  },
  {
    x: 50,
    y: 13,
    str: '+'
  },
  // statue <-> container,
  {
    x: 37,
    y: 7,
    str: '+'
  },
  {
    x: 37,
    y: 8,
    str: '#\r\n#\r\n#\r\n#\r\n'
  },
  {
    x: 37,
    y: 12,
    str: '#'
  },
  // container <-> theater,
  {
    x: 44,
    y: 4,
    str: '+'
  },
  {
    x: 45,
    y: 4,
    str: '#####'
  },
  {
    x: 50,
    y: 4,
    str: '+'
  },
  // container <-> kitchen,
  {
    x: 33,
    y: 3,
    str: '+'
  },
  {
    x: 24,
    y: 1,
    str: '##########\r\n         #'
  },
  {
    x: 23,
    y: 1,
    str: '#'
  },
  // big kitchen <-> theatre pipeline,
  {
    x: 23,
    y: 6,
    str: '#'
  },
  {
    x: 24,
    y: 7,
    str: '#\r\n #'
  },
  {
    x: 26,
    y: 9,
    str: '###########'
  },
  {
    x: 38,
    y: 10,
    str: '############'
  },
  {
    x: 50,
    y: 10,
    str: '+'
  },
  // bar <-> kitchen/theatre pipeline
  {
    x: 23,
    y: 14,
    str: '#'
  },
  {
    x: 24,
    y: 10,
    str: '    #\r\n    #\r\n    #\r\n   #\r\n###'
  }
]
