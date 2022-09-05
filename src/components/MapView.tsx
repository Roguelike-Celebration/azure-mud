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
    h = 13
  } else {
    w = 10
    h = 21
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
  }, (props.isMiniMap ? null : []))

  if (!roomData) { return <div/> }

  let map = mapText

  presenceMapping.forEach((roomId, idx) => {
    let replaceString = '[0]'

    if (roomData[roomId] && roomData[roomId].users && roomData[roomId].users.length > 0) {
      replaceString = `[${roomData[roomId].users.length}]`
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
    <pre style={{ letterSpacing: '2px', fontFamily: 'IBM Plex Mono' }}><code>
      {map}
    </code></pre>
  </div>
}

const mapText = `
                        ┌───────────────────────────────────────────────────────────┐                         
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
│....Steam....│   │....(10)....│...................│....(12)....│ │.....................│ #  │..Rave Cave..│  
│....(02).....│   └#───────────┘...................└────────────┘ └─────────────────────┘ ####....(16).....│  
└───────#─────┘    #         │.......................│  ┌────────────────────────┐        #  └─────────────┘  
┌───────#────────┐ #         │.......................│  │......Experimental......│        #  ┌─────────────┐  
│................│ #         │.......................####.........Biology........│        #  │...Elysium...│  
│...Adventurers..│ #         │.......................│  │..........(18)..........│        ####....(17).....│  
│.....Guild......###         │.....Central Hall......│  └────────────────────────┘           └─────────────┘  
│.....(03).......│ #         │.........(11)..........│  ┌──────────────────────────────────────────────────┐  
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
└────────────────┘           └────────────#──────────┘  └──────────────────────────────────────────────────┘  
`

const presenceMapping = [
  'dockingBay',
  'oxygenFarm',
  'officeOfSteam',
  'adventurersGuild',
  'videoDome',
  'theater',
  'theaterWarrior',
  'theaterMage',
  'theaterRogue',
  'theaterCleric',
  'destinations',
  'centralHall',
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
    height: 10
  },
  {
    roomId: 'officeOfSteam',
    x: 0,
    y: 19,
    width: 15,
    height: 6
  },
  {
    roomId: 'adventurersGuild',
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
    roomId: 'destinations',
    x: 18,
    y: 19,
    width: 14,
    height: 5
  },
  {
    roomId: 'centralHall',
    x: 29,
    y: 18,
    width: 25,
    height: 23
  },
  {
    roomId: 'swag',
    x: 51,
    y: 19,
    width: 14,
    height: 4
  },
  {
    roomId: 'warrior',
    x: 70,
    y: 1,
    width: 16,
    height: 4
  },
  {
    roomId: 'mage',
    x: 70,
    y: 5,
    width: 16,
    height: 4
  },
  {
    roomId: 'rogue',
    x: 70,
    y: 9,
    width: 16,
    height: 4
  },
  {
    roomId: 'cleric',
    x: 70,
    y: 13,
    width: 16,
    height: 4
  },
  {
    roomId: 'unconference',
    x: 67,
    y: 19,
    width: 23,
    height: 4
  },
  {
    roomId: 'digSite',
    x: 94,
    y: 14,
    width: 15,
    height: 4
  },
  {
    roomId: 'starship',
    x: 94,
    y: 18,
    width: 15,
    height: 4
  },
  {
    roomId: 'raveCave',
    x: 94,
    y: 23,
    width: 15,
    height: 4
  },
  {
    roomId: 'elysium',
    x: 94,
    y: 27,
    width: 15,
    height: 4
  },
  {
    roomId: 'experimentalBiology',
    x: 57,
    y: 25,
    width: 26,
    height: 5
  },
  {
    roomId: 'bar',
    x: 57,
    y: 30,
    width: 52,
    height: 12
  },
  {
    roomId: 'stools',
    x: 60,
    y: 33,
    width: 8,
    height: 5
  },
  {
    roomId: 'balcony',
    x: 98,
    y: 31,
    width: 9,
    height: 4
  },
  {
    roomId: 'barStage',
    x: 72,
    y: 38,
    width: 18,
    height: 3
  },
  {
    roomId: 'back',
    x: 98,
    y: 37,
    width: 9,
    height: 4
  }
]
