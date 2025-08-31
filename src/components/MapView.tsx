/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useContext, useRef, useState } from 'react'
import { Room } from '../room'
import { moveToRoom } from '../networking'
import { HideModalAction } from '../Actions'
import { DispatchContext } from '../App'
import _, { head, isUndefined } from 'lodash'

/**
 * This renders a clickable ASCII map!
 *
 * The map itself is just plaintext ASCII pasted in here, generated using the
 * Mac app MonoDraw app (see the map.monopic file in the root of this repo)
 *
 * (In 2021, this was switched to the Windows/Mac/Linux app Playscii - that's
 * map2021.psci.)
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
 * end of the array and then make the number you use in the ASCII map the array index.
 * The ASCII map is 0-indexed.
 */

interface Props {
  presenceData: { [roomId: string]: number };
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
  const [preWidth, setPreWidth] = useState(0)
  const [preHeight, setPreHeight] = useState(0)
  const { presenceData, currentRoomId } = props

  // Pixel size of one ASCII character in the rendered map
  let w; let h = 0
  if (props.isMiniMap) {
    w = 8
    h = 13
  } else if (preWidth !== 0 && preHeight !== 0) {
    const mapLines = mapText.split('\n')
    const maxLineLen = Math.max(...(mapLines.map(el => el.length)))
    w = preWidth / maxLineLen
    h = preHeight / mapLines.length
  }

  // Scroll to make sure that the user's location is visible
  // The empty array at the end means we only run this on first render, not every time it re-renders
  // This ensures it only scrolls on load, not every time new presence data comes in
  React.useEffect(() => {
    // console.log('Attempting to scroll', `${props.isMiniMap ? 'minimap-' : ''}clickable-room-${currentRoomId}`)
    const location = document.getElementById(`${props.isMiniMap ? 'minimap-' : ''}clickable-room-${currentRoomId}`)
    if (location) {
      // console.log(location)
      location.scrollIntoView({ block: 'center', inline: 'center' })
    } else {
      // console.log('NO LOCATION')
    }

    const pre = document.getElementById('map-pre')
    if (pre) {
      if (preWidth !== pre.clientWidth) {
        setPreWidth(pre.clientWidth)
      }
      if (preHeight !== pre.clientHeight) {
        setPreHeight(pre.clientHeight)
      }
    }
  }, (props.isMiniMap ? null : []))

  if (!presenceData) { return <div/> }

  let map = mapText

  presenceMapping.forEach((roomId, idx) => {
    let replaceString = '[0]'

    // Because 0 is falsy, we need to explicitly use isUndefined
    if (presenceData[roomId] && !isUndefined(presenceData[roomId])) {
      replaceString = `[${presenceData[roomId]}]`
    }
    replaceString = replaceString.padEnd(4, '.')
    map = map.replace(`(${idx.toString().padStart(2, '0')})`, replaceString)
  })

  map = map.replace(/\[([0-9]*)\]/g, '($1)')

  const handleClick = (e) => {
    const roomId =
      e.target && e.target.getAttribute && e.target.getAttribute('data-room')
    if (roomId) {
      moveToRoom(roomId)
      dispatch(HideModalAction())
    }
  }

  let clickableDivs = []
  if (w !== 0 && h !== 0) {
    clickableDivs = clickableAreas.map(a => {
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
  }

  return <div className='map' style={{ position: 'relative', margin: '15px' }}>
    {clickableDivs}
    <pre
      id={`${props.isMiniMap ? 'minimap-' : ''}map-pre`}
      style={{ letterSpacing: '2px', margin: '0px', width: 'fit-content' }}
    >
      <code>{map}</code>
    </pre>
  </div>
}

const mapText = `                                ┌───────────────────┬──────┬──────────────┐
                                │...................│......│..............│
                                │.....Dressing......│Props.│..Break Room .│
                                │.......Rooms.......│Closet│.....(18).....│┌──────────┐
                                │.......(16)........│.(17).│..............││..........│
                                └────────────##─────┴──##──┴──────##──────┘│Under.The.│
                                        /────##────────##─────────##────\\  │..Stage...│
                                       /.................................\\ │...(19)...│
                                      /...................................\\│..........│
                                      │...................................│└──────────┘
                                      │...................................│
                                      │.............Big.Top...............│
                 ┌────────────────┐   │...............(05)................│
                 │................│   │...................................│
┌──────────────┐ │................│   │...................................│     ┌───────────┐
│..............│ │..Magic Castle..│   \\.................................../     │...........│ ┌─────────────────┐
│..............│ │......(12)......│    \\................................./      │.Weird Lil.│ │.................│
│.Shell Games..│ │................│     \\──────────────##───────────────/       │.Guys Zoo .│ │...Strong Man....│
│.....(13).....│ │................│  /─────────────────##──────────────────\\    │...(07)....│ │.....Tower.......│
│............### └───────##───────┘ /..............┌───##───┐...............\\   │...........│ │......(08).......│
└─────────────##.........##....... /...............│........│................\\  └##─────────┘ │.................│
┌────────────┐.#################../................│Obelisk.│.................\\  ##...........└─────#───────────┘
│............│.#.........##....#./.................│..(02)..│..................\\ ##.Unconferencing..# ┌─────────┐
│............│.#...............#.│....┌──────┐.....│........│...┌───────────┐..│ ##...Menagerie.....# │.........│
│MerryGoRound│.#.Carnival Games#.│....│Future│.....└───##───┘...│..Sami's...│..│ ##......(06).......# │Clown Pit│
│....(14)....│.#......(11).....#######│.Hut..│.........##.......│.Souvenirs.│..│ ##.................# │...(09)..│
│............###.................│...#│.(03).│.........##########...(04)....######################### │.........│
│............│.#####.............│...#└──#───┘....#######.......│...........│..│     ┌─────#──────┐   │.........│
└────────────┘....##.............\\...######.......#.............└───────────┘../     │............│   └─────────┘
   ┌──────────────##─────────────┐\\.......#.......#.Pavilion................../      │............│
   │...........Hall.Of...........│ \\......#########...(01).................../       │.Red Velvet.│
   │...........Mirrors...........│  \\.............####....................../        │....(10)....│
   │.............(15)............│   \\────────────────####─────────────────/         │............│
   │.............................│                    ####                           │............│
   └─────────────────────────────┘                    ####                           └────────────┘              `

const presenceMapping = [
  'ticketBooth',
  'pavilion',
  'obelisk',
  'futureHut',
  'souvenirs',
  'bigTop',
  'unconferencingHub',
  'unconfLilGuys',
  'unconfStrongMan',
  'unconfClownPit',
  'unconfRedVelvet',
  'carnivalGames',
  'magicCastle',
  'shellGames',
  'merryGoRound',
  'hallOfMirrors',
  'dressingRooms',
  'propsCloset',
  'breakRoom',
  'underTheStage'
]

const clickableAreas: ClickableArea[] = [
  {
    roomId: 'pavilion',
    x: 47,
    y: 26,
    width: 18,
    height: 7
  },
  {
    roomId: 'obelisk',
    x: 52,
    y: 20,
    width: 10,
    height: 6
  },
  {
    roomId: 'futureHut',
    x: 39,
    y: 24,
    width: 8,
    height: 5
  },
  {
    roomId: 'souvenirs',
    x: 65,
    y: 24,
    width: 13,
    height: 6
  },
  {
    roomId: 'bigTop',
    x: 39,
    y: 7,
    width: 35,
    height: 11
  },
  {
    roomId: 'unconferencingHub',
    x: 84,
    y: 23,
    width: 17,
    height: 5
  },
  {
    roomId: 'unconfLilGuys',
    x: 81,
    y: 15,
    width: 13,
    height: 7
  },
  {
    roomId: 'unconfStrongMan',
    x: 95,
    y: 17,
    width: 18,
    height: 7
  },
  {
    roomId: 'unconfClownPit',
    x: 103,
    y: 23,
    width: 11,
    height: 7
  },
  {
    roomId: 'unconfRedVelvet',
    x: 86,
    y: 28,
    width: 14,
    height: 8
  },
  {
    roomId: 'carnivalGames',
    x: 17,
    y: 23,
    width: 15,
    height: 7
  },
  {
    roomId: 'magicCastle',
    x: 18,
    y: 13,
    width: 18,
    height: 8
  },
  {
    roomId: 'shellGames',
    x: 1,
    y: 15,
    width: 15,
    height: 7
  },
  {
    roomId: 'merryGoRound',
    x: 1,
    y: 22,
    width: 13,
    height: 8
  },
  {
    roomId: 'hallOfMirrors',
    x: 4,
    y: 31,
    width: 20,
    height: 6
  },
  {
    roomId: 'dressingRooms',
    x: 33,
    y: 1,
    width: 19,
    height: 6
  },
  {
    roomId: 'propsCloset',
    x: 53,
    y: 1,
    width: 6,
    height: 6
  },
  {
    roomId: 'breakRoom',
    x: 61,
    y: 1,
    width: 14,
    height: 6
  },
  {
    roomId: 'underTheStage',
    x: 76,
    y: 4,
    width: 11,
    height: 7
  }
]
