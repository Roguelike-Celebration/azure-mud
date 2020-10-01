/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useContext } from 'react'
import { Room } from '../room'
import { moveToRoom } from '../networking'
import { HideModalAction } from '../Actions'
import { DispatchContext } from '../App'

/**
 * This renders a clickable ASCII map!
 *
 * The map itself is just plaintext ASCII pasted in here, generated using the
 * Mac app MonoDraw app (see the map.monopic file in the root of this repo)
 *
 * There are two additional data sources in here:
 *
 * 1. To make rooms clickable, there is an array of ClickableArea objects
 * that define clickable squares that move to a given roomId.
 * Coordinates are given using ASCII character coordinates, not pixels.
 *
 * 2. To add real-time presence numbers to rooms, there's an array of roomIds
 * that correspond to the number in parenthesis that lives in the ASCII map itself
 * This number is monotonically increasing. To add a new room, add its name to the
 * end of the array and then make the number you use in the ASCII map the array index + 1
 * (because the ASCII map numbers are 1-indexed)
 */

 interface Props {
  roomData: { [roomId: string]: Room };
  currentRoomId: string
  isMiniMap?: boolean
 }

  interface ClickableArea {
    x: number,
    y: number,
    height: number,
    width: number,
    roomId: string
  }

export default function MapView (props: Props) {
  const dispatch = useContext(DispatchContext)
  const { roomData, currentRoomId } = props

  // Pixel size of one ASCII character
  let w, h
  if (props.isMiniMap) {
    w = 8
    h = 12
  } else {
    w = 10
    h = 15
  }

  // Scroll to make sure that the user's location is visible
  // The empty array at the end means we only run this on first render, not every time it re-renders
  // This ensures it only scrolls on load, not every time new presence data comes in
  React.useEffect(() => {
    console.log('Attempting to scroll', `${props.isMiniMap ? 'minimap-' : ''}clickable-room-${currentRoomId}`)
    const location = document.getElementById(`${props.isMiniMap ? 'minimap-' : ''}clickable-room-${currentRoomId}`)
    if (location) {
      console.log(location)
      location.scrollIntoView({ block: 'center', inline: 'center' })
    } else {
      console.log('NO LCATION')
    }
  }, (props.isMiniMap ? null : []))

  if (!roomData) { return <div/> }

  // mapText = mapText.replace('$0', `(${props.roomData.danceFloor.users.length})`)

  presenceMapping.forEach((roomId, idx) => {
    let replaceString = '(0)'

    if (roomData[roomId] && roomData[roomId].users && roomData[roomId].users.length > 0) {
      replaceString = `(${roomData[roomId].users.length})`
    }

    replaceString = replaceString.padEnd(4, '.')

    mapText = mapText.replace(`(${idx.toString().padStart(2, '0')})`, replaceString)
  })

  const handleClick = (e) => {
    const roomId =
      e.target && e.target.getAttribute && e.target.getAttribute('data-room')
    if (roomId) {
      moveToRoom(roomId)
      dispatch(HideModalAction())
    }
  }

  const clickableDivs = clickableAreas.map(a => {
    return <div
      style={{
        position: 'absolute',
        left: `${a.x * w}px`,
        top: `${a.y * h}px`,
        width: `${a.width * w}px`,
        height: `${a.height * h}px`,
        cursor: 'pointer'
      }}
      key={a.roomId}
      onClick={handleClick}
      data-room={a.roomId}
      id={`${props.isMiniMap ? 'minimap-' : ''}clickable-room-${a.roomId}`} />
  })

  return <div className='map' style={{ position: 'relative', margin: '15px' }}>
    {clickableDivs}
    <pre style={{ letterSpacing: '2px' }}><code>
      {mapText}
    </code></pre>
  </div>
}

let mapText = `                ┌────────────────────────┐
┌──────────┐    │........................│                    ┌─────────────────────────┐
│..........│    │......Kitchen (01)......│                    │.........................│
│..Quiet ..│    │........................│                    │.........................│
│..Lounge..+####+........................│   ┌──────────┐     │.........................│
│...(06)...│    │....Table B (02)........│   │.Shipping.│     │.........................│
│..........│    │.......┌───┐............│   │.Container│     │.........................│
│..........│    │.......└───┘............│   │...(07)...│     │.........................│
└─────+────┘    │..........Table C (04)..│   └────#─────┘     │.........................│
      #         │..............┌───┐.....│        #           │.........Theater.........│
 ┌────+────┐    │.Table A (03).└───┘.....#################    │...........(08)..........│
 │.........│    │...┌───┐................│  #     #       #   │.........................│
 │.........│    │...└───┘................│  # ┌───#────┐   #  │.........................│
 │..Dance..+####+........................│  # │........│    ##│.........................│
 │..Floor..│    └──────────###───────────┘  # │.@-sign.│      │.........................│
 │..(00)...│    ┌──────────###───────────┐ #  │.Statue.│      │.........................│
 │.........│    │........................│####│..(10)..│      │.........................│
 │.........+####+........................│    │........│      │.........................│
 │.........│    │........Bar (05)........│    └────#───┘      │.........................│
 └─────────┘    │........................│         #          │.........................│
                │........................│        ##          │.........................│
                └──────────────────+─────┘        #           │.........................│
                             ┌─────+──────────────+─────────┐ │.........................│
┌────────────┐ ┌──────────┐  │..............................│ │.........................│
│............│ │..........│  │..............................│#│.........................│
│............│ │..........+##+........North Showcase .......│ │.........................│
│.Engineer's.###.Artist's │  │...........Hall (11)..........│ └─────+++───────+++───────┘
│.Workbench .│ │.Atelier .│  │..............................│       ###       ###
│....(18)....│ │...(09)...│  │..............................│  ┌────###───────###─────────────┐
│............│ │..........│  │...East ...............West ..│  │....................┌─┐.......│
└──────#─────┘ └────#─────┘  │.Showcase............Showcase.│  │....................│!│.Swag .│
  ┌────#────────────#────┐   │...Hall ...............Hall ..+##+...Haunted Foyer ...│!│.Table.│
  │......................│   │...(12)................(13)...│  │........(17)........│%│.(16)..│
  │......Procedural .....+###+..............................│  │....................│)│.......│
  │......Generation .....│   │..............................│  │....................└─┘.......│
  │......Study (15)......│   │..............................│  └──────────────────────────────┘
  │......................│   │..............................│
  └──────────────────────┘   │........South Showcase .......│
                             │...........Hall (14)..........│
                             │..............................│
                             └──────────────────────────────┘
   `

const presenceMapping = [
  'danceFloor',
  'kitchen',
  'kitchenTableB',
  'kitchenTableA',
  'kitchenTableC',
  'bar',
  'lounge',
  'shippingContainer',
  'theater',
  'atelier',
  'statue',
  'northShowcaseHall',
  'eastShowcaseHall',
  'westShowcaseHall',
  'southShowcaseHall',
  'study',
  'swag',
  'foyer',
  'workbench'
]

const clickableAreas: ClickableArea[] = [
  {
    roomId: 'lounge',
    x: 0,
    y: 1,
    width: 12,
    height: 8
  },
  {
    roomId: 'danceFloor',
    x: 1,
    y: 10,
    width: 11,
    height: 10
  },
  {
    roomId: 'kitchen',
    x: 16,
    y: 0,
    width: 26,
    height: 15
  },
  {
    roomId: 'kitchenTableA',
    x: 17,
    y: 10,
    height: 3,
    width: 11
  },
  {
    roomId: 'kitchenTableB',
    x: 20,
    y: 5,
    height: 3,
    width: 11
  },
  {
    roomId: 'kitchenTableC',
    x: 26,
    y: 8,
    width: 11,
    height: 3
  },
  {
    roomId: 'bar',
    x: 16,
    y: 15,
    width: 25,
    height: 7
  },
  {
    roomId: 'shippingContainer',
    x: 44,
    y: 4,
    width: 12,
    height: 5
  },
  {
    roomId: 'statue',
    x: 45,
    y: 12,
    width: 10,
    height: 7
  },
  {
    roomId: 'theater',
    x: 60,
    y: 1,
    width: 27,
    height: 26
  },
  {
    roomId: 'foyer',
    x: 61,
    y: 28,
    width: 21,
    height: 8
  },
  {
    roomId: 'swag',
    x: 82,
    y: 28,
    width: 11,
    height: 8
  },
  {
    roomId: 'workbench',
    x: 0,
    y: 23,
    width: 14,
    height: 8
  },
  {
    roomId: 'atelier',
    x: 15,
    y: 23,
    width: 12,
    height: 8
  },
  {
    roomId: 'study',
    x: 2,
    y: 31,
    width: 24,
    height: 7
  },
  {
    roomId: 'northShowcaseHall',
    x: 35,
    y: 22,
    width: 17,
    height: 6
  },
  {
    roomId: 'southShowcaseHall',
    x: 35,
    y: 36,
    width: 17,
    height: 4
  },
  {
    roomId: 'westShowcaseHall',
    x: 45,
    y: 28,
    width: 15,
    height: 8
  },
  {
    roomId: 'eastShowcaseHall',
    x: 28,
    y: 28,
    width: 15,
    height: 8
  }
]
