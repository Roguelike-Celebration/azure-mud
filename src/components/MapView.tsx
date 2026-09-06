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

const mapText = `                                                                                                              
      ┌────────┬───────────────┌─────────────┬──────────────┐    │                │ # │            │ │           
     ┌┘        │    Chez      ┌┘     Press   │     VIP      └┐   │                │ # │            │ │           
    ┌┘         │   Nathan's  ┌┘       Box    │    Seats      └┐  │                │ # │            │ │           
   ┌┘          │    (12)    ┌┘       (18)    │     (19)       └┐ ├────────────────┘ # └────────────┘ └─────      
   │ Orville's │            ├──────────┬─────┴──────┬──────────┤ │ ################ #  Scalpers                  
   │   (13)    ├────────────┤  The    ┌┘            └┐ Waterboy│ │                  #   Alley                    
   │          ┌┘            │ Dugout ┌┘              └┐ Lounge │ │ ##Irrepressible# #    (08)                    
   │         ┌┘             │  (17) ┌┘                └┐ (20)  │ │   Feelings Zone  # ┌────────┐ ┌─────────      
   ├────────┬┘              ├───────┘      Stadium     └───────┤ │        (07)      # │        │ │               
   │        │               │              Theater             │ │ ################ # │        │ │               
   │        │   Concessions │               (05)               │ ├───────────────── # └────────┘ └─────────      
   │        └┐    Stadium   │                                  │ │                  #                            
   │   Soda  └┐    (11)     │                                  │ │ ################ #                            
   └┐Fountain └┐            └┐                                ┌┘ │                  #                            
    └┐ (14)    │             └┐                              ┌┘..│   Unconferencing #        Practice            
     └┐        │              └┐                            ┌┘...│      Parking     #         Field              
      └────────┴───####────────└─────────────###────────────┘....│        Lot       #          (09)              
      ┼      .......##.......................###.................│ #######(06)##### #                            
┌─────┴─────┐.......##.....┌────────────┐.##########..┌────────┐.│                  #                            
│ Church of │.......##.....│   Jersey   │.#........#..│  Gift  │.│ ################ #                            
│ Gamer LEDs│.......##.....│ Assignment │.#.. ▲ ...#..│  Shop  │.│                  #┌────────────┐   ┌────      
│    (15)   │.......##.....│    (03)    │.#..│ │...#..│  (04)  │.│ ################ #│            │   │          
└─────##────┘.......##.....└─────##─────┘.#..│ │...#..└───##───┘.│                  #│ Tailgaters │   │          
###########################################..└─┘...###################################   Union    │   │          
 ┌──────────┐#      ▲       ▲       #........The........#                ▲       ▲  ##    (10)    │   │          
 │   The    │#  ▲   ▲       |       #......Obelisk......#     ▲▲   ▲▲    |  ▲    |  #│            │   │          
 │  Penalty ##  ▲   |           ▲   #.......(02)........#  ▲▲ ▲▲   ▲▲▲▲▲▲   ▲▲▲    ▲#└────────────┘   │          
 │    Box   ##  |     ~~~       ▲▲  #...................# ▲▲|▲▲| ▲ |▲▲▲▲|   ||▲▲   ▲#                 │          
 │   (16)   │#       ~~~~~~~    ||  ##################### ▲| ▲▲  |  ||||      |▲   |#┌────────────┐   │          
 └──────────┘#   ▲  ~~~~~~~~        #...................# |  ||      ▲▲▲▲      |    #│            │   │          
             #   ▲ ~~~~~~~~~~       #....The Streets....#         ▲▲▲▲▲▲▲▲          #│            │   │          
 ┌──────────┐#   ▲ ~~~~~~~~~~       #........(01).......#   ▲    ▲▲|▲▲▲▲▲▲▲  ▲▲▲▲▲  #│            │   │          
 │          │#   | ~~~~~~~~~~  ▲    #...................#   |   ▲▲▲ ▲▲▲▲▲▲▲▲ ||▲▲▲  #│            │   │          
 │          │#     ~~~~~~~~~~  |    #...................#       ||| ▲▲▲▲▲▲▲▲  ▲▲▲|  #└────────────┘   └─────     
                                                                                                                `

const presenceMapping = [  
    'entryWay',
    'streets',
    'obelisk',
    'jerseys',
    'giftShop',
    'theater',
    'unconferencingHub',
    'unconfFeelings',
    'unconfScalpers',
    'unconfPractice',
    'unconfTailgate',
    'concessions',
    'chezNathan',
    'orville',
    'sodaFountain',
    'churchOfGamers',
    'penaltyBox',
    'dugout',
    'pressbox',
    'vipSeats',
    'waterboy'
]

const clickableAreas: ClickableArea[] = [
  {
    roomId: "streets",
    x: 37,
    y: 30,
    width: 19,
    height: 5
  },
  {
    roomId: "obelisk",
    x: 37,
    y: 24,
    width: 19,
    height: 5
  },
  {
    roomId: "theater",
    x: 54,
    y: 19,
    width: 10,
    height: 5
  },
  {
    roomId: "jerseys",
    x: 27,
    y: 19,
    width: 14,
    height: 5
  },
  {
    roomId: "theater",
    x: 38,
    y: 6,
    width: 16,
    height: 11
  },
  {
    roomId: "unconferencingHub",
    x: 66,
    y: 12,
    width: 18,
    height: 12
  },
  {
    roomId: "unconfFeelings",
    x: 66,
    y: 5,
    width: 18,
    height: 6
  },
  {
    roomId: "unconfScalpers",
    x: 86,
    y: 4,
    width: 22,
    height: 5
  },
  {
    roomId: "unconfPractice",
    x: 85,
    y: 11,
    width: 22,
    height: 10
  },
  {
    roomId: "unconfTailgate",
    x: 85,
    y: 21,
    width: 14,
    height: 7
  },
  {
    roomId: "concessions",
    x: 14,
    y: 7,
    width: 14,
    height: 10
  },
  {
    roomId: "chezNathan",
    x: 16,
    y: 1,
    width: 12,
    height: 5
  },
  {
    roomId: "orville",
    x: 2,
    y: 1,
    width: 12,
    height: 8
  },
  {
    roomId: "sodaFountain",
    x: 2,
    y: 9,
    width: 12,
    height: 9
  },
  {
    roomId: "churchOfGamers",
    x: 0,
    y: 18,
    width: 13,
    height: 6
  },
  {
    roomId: "penaltyBox",
    x: 0,
    y: 25,
    width: 13,
    height: 6
  },
  {
    roomId: "dugout",
    x: 28,
    y: 6,
    width: 10,
    height: 4
  },
  {
    roomId: "pressbox",
    x: 28,
    y: 1,
    width: 17,
    height: 5
  },
  {
    roomId: "vipSeats",
    x: 45,
    y: 1,
    width: 19,
    height: 5
  },
  {
    roomId: "waterboy",
    x: 54,
    y: 6,
    width: 10,
    height: 4
  }
]
