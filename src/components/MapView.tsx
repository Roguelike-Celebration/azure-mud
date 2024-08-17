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

  // Pixel size of one ASCII character
  let w; let h = 0
  if (props.isMiniMap) {
    w = 8
    h = 13
  } else if (preWidth !== 0 && preHeight !== 0) {
    w = preWidth / 121
    h = preHeight / 37
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
 ┌────────────────────────┐┌─────────────┐ ┌─────────────┐ ┌─────────────┐┌─────────┐ ~~~~~~~~~~~~~~~~~~~~              
 │........................││..Bawdy......│ │.............│ │.Joust.Arena.││.........│ ~~~~~~~~~~~~~~~~~~~~~             
 │┌────────┐....┌────────┐││..Singers....###.............###....(12).....││.........│  ~~~~~~~~~~~~~~~~~~~~~~~          
 ││.Vegan..│....│.Taco...│││....(09).....│ │.............│ │.............││.........│     ~~~~~~~~~~~~~~~~~~~~          
 ││.Truck..│....│.Truck..│││.............│ │.............│ │.............││.........│         ~~~~~~~~~~~~~~~~~~        
 ││.(00)...│....│.(01)...│││=============│ │...Theater...│ │=============││.........│           ~~~~~~~~~~~~~~~~~~      
 │└────────┘....└────────┘││..Whip.Show..│ │....(11).....│ │..Fountain...││.........│               ~~~~~~~~~~~~~~~~    
 │........................││....(10).....###.............###....(13).....││.........│               ~~~~~~~~~~~~~~~~~   
 │........................││.............│ │.............│ │.............││.Archery.│                ~~~~~~~~~~~~~~~~~  
 │┌────────┐....┌────────┐││.............│ │.............│ │.............││...(14)..│┌─────────────┐    ~~~~~~~~~~~~~~~ 
 ││.Boba...│....│.Kebab..││└─────────────┘ └──────##─────┘ └─────────────┘│.........││.............│     ~~~~~~~~~~~~~~~
 ││.Truck..│....│.Truck..││                       ##                      │.........││.............│       ~~~~~~~~~~~~~
 ││.(02)...│....│.(03)...││                       ##                      │.........││..Wood.Shop..│┌───────┐~~~~~~~~~~~
 │└────────┘....└────────┘│      /────────────────##───────────────\\      │.........││....(15).....││.......│~~~~~~~~~~~
 │................┌──────┐│     /┌──────────────┐.##................\\     │.........││.............││.......│~~~~~~~~~~~
 │┌───────┐.......│.Swag.││    /.│.Tattoo.Truck.│.##..┌────────────┐.\\    │.........││.............││.......└~~~~~~~~~~~
 ││.......│.......│.Store││   /..│.....(17).....│.##..│..Note.Wall.│..\\   └────#────┘└──────#──────┘│...........│~~~~~~~
 ││.Steam.│.......│.(05).││  /...│..............│.##..│....(18)....│...\\  ┌────#────────────#──────┐│...........│~~~~~~~
 ││.Sale..│.......│......││ /....└────────#─────┘.##..└──────#─────┘....\\ │........................││.......┌~~~~~~~~~~~
 ││.(04)..│.......└──────┘│ │.............###############....#..........│ │........................││.......│~~~~~~~~~~~
 ││.......│...............│ │.............##┌─────────┐##....#..........│ │.....Unconferencing.....││.Docks.└~~~~~~~~~~~
 ││.......│..Night.Market.│ │.............##│.........│##....#..........│ │...........(21).........││.(16)......│~~~~~~~
 ││.......│.....(06)......##################│.Obelisk.│####################........................##...........│~~~~~~~
 ││.......│...............##################│..(19)...│####################........................││.......┌~~~~~~~~~~~
 ││.......│.┌────────────┐│ │.............##└─────────┘......#..........│ │........................││.......│~~~~~~~~~~~
 ││.......│.│..Standing..││ │.............#########┌─────────#────┐.....│ │........................││.......└~~~~~~~~~~~
 │└───────┘.│..Tables....││ │.............#########│..............│.....│ │........................││...........│~~~~~~~
 │┌─────\\...│..(07)......││ │....................##│..............│.....│ └────────────#───────────┘│...........│~~~~~~~
 ││......\\..│............││ \\....................###.Goofy.Items..│...../ ┌────────────#───────────┐│.......┌~~~~~~~~~~~
 ││.......\\.└────────────┘│  \\...................##│....(20)......│..../  │........................││.......│~~~~~~~~~~~
 ││........\\─────────────┐│   \\..................##│..............│.../   │....Weapons.Training....│└───────┘~~~~~~~~~~~
 ││...Picnic Grounds.....││    \\.................##│..............│../    │...........(22).........│        ~~~~~~~~~~~~
 ││........(08)..........││     \\................##└──────────────┘./     │........................│      ~~~~~~~~~~~~~~
 ││......................││      \\─────────────────────────────────/      └────────────────────────┘      ~~~~~~~~~~~~~~
 │└──────────────────────┘│                  ░░░░░░░░░░                                                   ~~~~~~~~~~~~~~
 └────────────────────────┘                                                                               ~~~~~~~~~~~~~~
`

const presenceMapping = [
  'veganTruck',
  'tacoTruck',
  'bobaTruck',
  'kebabTruck',
  'steamSale',
  'swag',
  'nightMarket',
  'standingTables',
  'picnicGrounds',
  'bawdySingers',
  'whipShow',
  'theater',
  'joust',
  'fountain',
  'unconfArchery',
  'unconfWoodShop',
  'unconfDocks',
  'tattooTruck',
  'kiosk',
  'obelisk',
  'goofyItems',
  'unconferencingHub',
  'unconfWeaponsTraining'
]

const clickableAreas: ClickableArea[] = [
  {
    roomId: 'veganTruck',
    x: 2,
    y: 3,
    width: 10,
    height: 5
  },
  {
    roomId: 'tacoTruck',
    x: 16,
    y: 3,
    width: 10,
    height: 5
  },
  {
    roomId: 'bobaTruck',
    x: 2,
    y: 10,
    width: 10,
    height: 5
  },
  {
    roomId: 'theater',
    x: 44,
    y: 1,
    width: 15,
    height: 11
  },
  {
    roomId: 'bawdySingers',
    x: 28,
    y: 1,
    width: 15,
    height: 5
  },
  {
    roomId: 'joust',
    x: 60,
    y: 1,
    width: 15,
    height: 5
  },
  {
    roomId: 'unconfArchery',
    x: 75,
    y: 1,
    width: 18,
    height: 17
  },
  {
    roomId: 'kebabTruck',
    x: 16,
    y: 10,
    width: 10,
    height: 5
  },
  {
    roomId: 'whipShow',
    x: 28,
    y: 7,
    width: 15,
    height: 5
  },
  {
    roomId: 'fountain',
    x: 60,
    y: 7,
    width: 15,
    height: 5
  },
  {
    roomId: 'unconfWoodShop',
    x: 86,
    y: 10,
    width: 15,
    height: 8
  },
  {
    roomId: 'unconfDocks',
    x: 101,
    y: 13,
    width: 10,
    height: 19
  },
  {
    roomId: 'steamSale',
    x: 3,
    y: 16,
    width: 8,
    height: 12
  },
  {
    roomId: 'obelisk',
    x: 44,
    y: 21,
    width: 15,
    height: 5
  },
  {
    roomId: 'swag',
    x: 18,
    y: 15,
    width: 8,
    height: 6
  },
  {
    roomId: 'tattooTruck',
    x: 34,
    width: 16,
    y: 15,
    height: 5
  },
  {
    roomId: 'kiosk',
    x: 55,
    y: 16,
    width: 14,
    height: 4
  },
  {
    roomId: 'unconferencingHub',
    x: 76,
    y: 18,
    width: 26,
    height: 11
  },
  {
    roomId: 'nightMarket',
    x: 11,
    y: 21,
    width: 14,
    height: 4
  },
  {
    roomId: 'standingTables',
    x: 13,
    y: 25,
    width: 14,
    height: 6
  },
  {
    roomId: 'picnicGrounds',
    x: 3,
    y: 31,
    width: 24,
    height: 5
  },
  {
    roomId: 'goofyItems',
    x: 52,
    y: 26,
    width: 16,
    height: 8
  },
  {
    roomId: 'unconfWeaponsTraining',
    x: 77,
    width: 24,
    y: 29,
    height: 6
  }
]
