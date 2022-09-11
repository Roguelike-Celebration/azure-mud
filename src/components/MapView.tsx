/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useContext, useRef, useState } from 'react'
import { Room } from '../room'
import { moveToRoom } from '../networking'
import { HideModalAction } from '../Actions'
import { DispatchContext } from '../App'
import { isUndefined } from 'lodash'

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
    w = preWidth / 110
    h = preHeight / 41
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
      style={{ letterSpacing: '2px', fontFamily: 'IBM Plex Mono', margin: '0px', width: 'fit-content' }}
    >
      <code>{map}</code>
    </pre>
  </div>
}

const mapText = `                        ┌───────────────────────────────────────────────────────────┐                         
┌────────────────┐      │............................................│..............│                         
│................│      │.................Theater....................#....Warrior...│                         
│..Docking Bay...│      │...................(05).....................│.....(06).....│                         
│.....(00).......###    │............................................│──────────────│                         
│................│ #    │............................................│..............│                         
│................│ #    │............................................#.....Mage.....│                         
└──────────#─────┘ #    │............................................│.....(07).....│                         
┌──────────#─────┐ #    │............................................│──────────────│                         
│............... │ #    │............................................│..............│                         
│................│ #    │............................................#....Rogue.....│                         
│................│ #    │............................................│.....(08).....│                         
│.....Oxygen.....│ #    │............................................│──────────────│                         
│.....Farm.......│ #    │............................................│..............│        ┌─────────────┐  
│.....(01).......│ #    │............................................#....Cleric....│        │..Dig Site...│  
│................###    │............................................│.....(09).....│     ####.....(14)....│  
│................│ #    └─────────────────#─────────────────────────────────────────┘     #  └─────────────┘  
│................│ #                      #                                               #  ┌─────────────┐  
└────────────────┘ #         ┌────────────#──────────┐                                    #  │..Starship...│  
┌─────────────┐   ┌#───────────┐...................┌────────────┐ ┌─────────────────────┐ ####.....(15)....│  
│.............│   │............│...................│............│ │....Unconferencing...│ #  └─────────────┘  
│..Office Of..#####Destinations│...................│.Swag Table.###......Lobby ..(13)...###  ┌─────────────┐  
│....Steam....│   │....(11)....│...................│....(12)....│ │.....................│ #  │..Rave Cave..│  
│....(02).....│   └#───────────┘...................└────────────┘ └─────────────────────┘ ####....(16).....│  
└───────#─────┘    #         │.......................│  ┌────────────────────────┐        #  └─────────────┘  
┌───────#────────┐ #         │.......................│  │......Experimental......│        #  ┌─────────────┐  
│................│ #         │.......................####.........Biology........│        #  │...Elysium...│  
│...Adventurers..│ #         │.......................│  │..........(18)..........│        ####....(17).....│  
│.....Guild......###         │.....Central Hall......│  └────────────────────────┘           └─────────────┘  
│.....(03).......│ #         │.........(10)..........│  ┌──────────────────────────────────────────────────┐  
│................│ #         │.......................│  │........................................┌───────┐.│  
│................│ #         │.......................####...................Bar ..(19)...........│Balcony│.│  
│................│ #         │.......................│  │..┌──────┐..............................│..(22).│.│  
└───────#────────┘ #         │.......................│  │..│Stools│..............................└───────┘.│  
┌───────#────────┐ #         │.......................│  │..│.(20).│........................................│  
│................│ #         │.......................│  │..│......│........................................│  
│................│ #         │.......................│  │..└──────┘..............................┌───────┐.│  
│....VideoDome...#############.......................####..............┌────────────────┐........│.Back..│.│  
│......(04)......│           │.......................│  │..............│...Stage...(21).│........│..(23).│.│  
│................│           │.......................│  │..............└────────────────┘........└───────┘.│  
└────────────────┘           └────────────#──────────┘  └──────────────────────────────────────────────────┘  `

const presenceMapping = [
  'dockingBay',
  'oxygenFarm',
  'officeOfSteam',
  'adventurersGuildHall',
  'videoDome',
  'theater',
  'theaterWarrior',
  'theaterMage',
  'theaterRogue',
  'theaterCleric',
  'centralHall',
  'destinations',
  'swag',
  'unconference',
  'unconferenceDigSite',
  'unconferenceStarShip',
  'unconferenceRaveCave',
  'unconferenceElysium',
  'experimentalBiology',
  'bar',
  'barStools',
  'barBalcony',
  'barStage',
  'barBack'
]

const clickableAreas: ClickableArea[] = [
  {
    roomId: 'dockingBay',
    x: 0,
    y: 1,
    width: 18,
    height: 7
  },
  {
    roomId: 'oxygenFarm',
    x: 0,
    y: 8,
    width: 18,
    height: 11
  },
  {
    roomId: 'officeOfSteam',
    x: 0,
    y: 19,
    width: 15,
    height: 6
  },
  {
    roomId: 'adventurersGuildHall',
    x: 0,
    y: 25,
    width: 18,
    height: 9
  },
  {
    roomId: 'videoDome',
    x: 0,
    y: 34,
    width: 18,
    height: 7
  },
  {
    roomId: 'theater',
    x: 24,
    y: 0,
    width: 45,
    height: 17
  },
  {
    roomId: 'centralHall',
    x: 29,
    y: 18,
    width: 25,
    height: 23
  },
  {
    roomId: 'destinations',
    x: 18,
    y: 19,
    width: 14,
    height: 5
  },
  {
    roomId: 'swag',
    x: 51,
    y: 19,
    width: 14,
    height: 5
  },
  {
    roomId: 'theaterWarrior',
    x: 69,
    y: 0,
    width: 16,
    height: 5
  },
  {
    roomId: 'theaterMage',
    x: 69,
    y: 5,
    width: 16,
    height: 4
  },
  {
    roomId: 'theaterRogue',
    x: 69,
    y: 9,
    width: 16,
    height: 4
  },
  {
    roomId: 'theaterCleric',
    x: 69,
    y: 13,
    width: 16,
    height: 4
  },
  {
    roomId: 'unconference',
    x: 66,
    y: 19,
    width: 23,
    height: 5
  },
  {
    roomId: 'unconferenceDigSite',
    x: 93,
    y: 13,
    width: 15,
    height: 4
  },
  {
    roomId: 'unconferenceStarship',
    x: 93,
    y: 17,
    width: 15,
    height: 4
  },
  {
    roomId: 'unconferenceRaveCave',
    x: 93,
    y: 21,
    width: 15,
    height: 4
  },
  {
    roomId: 'unconferenceElysium',
    x: 93,
    y: 25,
    width: 15,
    height: 4
  },
  {
    roomId: 'experimentalBiology',
    x: 56,
    y: 24,
    width: 26,
    height: 5
  },
  {
    roomId: 'bar',
    x: 56,
    y: 29,
    width: 52,
    height: 12
  },
  {
    roomId: 'barStools',
    x: 59,
    y: 32,
    width: 8,
    height: 5
  },
  {
    roomId: 'barBalcony',
    x: 97,
    y: 30,
    width: 9,
    height: 4
  },
  {
    roomId: 'barStage',
    x: 71,
    y: 37,
    width: 18,
    height: 3
  },
  {
    roomId: 'barBack',
    x: 97,
    y: 36,
    width: 9,
    height: 4
  }
]
