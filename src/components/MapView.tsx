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
    let replaceString = '(0)'

    if (roomData[roomId] && roomData[roomId].users && roomData[roomId].users.length > 0) {
      replaceString = `(${roomData[roomId].users.length})`
    }

    replaceString = replaceString.padEnd(4, '.')
    map = map.replace(`(${idx.toString().padStart(2, '0')})`, replaceString)
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
    <pre style={{ letterSpacing: '2px', fontFamily: 'IBM Plex Mono' }}><code>
      {map}
    </code></pre>
  </div>
}

const mapText = `                        ┌────────────────────────────────────────────┐                                        
┌────────────────┐      │                                            │   ┌──────────┐     ┌──────────┐        
│                │      │                 Theater                    │   │ Warrior  │     │   Mage   │        
│ Robot Labs     │      │                 (00006)                    │   │ (00013)  │     │ (00014)  │        
│ (00001)        │      │                                            │   └─────#────┘     └─────#────┘        
│                │      │                                            │         #                #             
│                │      │                                            ############################             
└──────────#─────┘      │                                            │         #                #             
┌──────────#─────┐      │                                            │   ┌─────#────┐     ┌─────#────┐        
│                │      │                                            │   │  Rogue   │     │ Tourist  │        
│ Spacehanger    │      │                                            │   │ (00015)  │     │ (00016)  │        
│ Lounge         │      │                                            │   └──────────┘     └──────────┘        
│ (00002)        │      │                                            │                                        
│                │      │                                            │                                        
│┌────────────┐  │      │                                            │                                        
││ Vending    │  ###    │                                            │                                        
││ Machine    │  │ ##   └────────────────────#───────────────────────┘                                        
││ (00003)    │  │  ###                      #           ┌──────────────────────────────────────────────────┐ 
│└────────────┘  │     ###        ┌──────────#────────┐  │                  Unconferencing                  │ 
└────────────────┘       ###      │                   ####                  Lobby (00017)                   │ 
                       ┌────────────┐                 │  └──────────────#───────────────────#───────────────┘ 
┌────────────────┐     │Destinations│  Central Hall   │  ┌──────────┐   #    ┌──────────┐   #   ┌──────────┐  
│                │     │(00007)     │   (00011)       │  │Cockatrice│   #    │   Naga   │   #   │  Tengu   │  
│ Adventurers    │     └────────────┘                 │  │ (00018)  ########## (00019)  │######## (00020)  │  
│ Guild          │     ###        │                   │  └──────────┘   #    └──────────┘   #   └──────────┘  
│ (00004)        │   ###          │                   │  ┌──────────┐   #    ┌──────────┐   #   ┌──────────┐  
│                │###             │                   │  │  Dragon  │   #    │ Skeleton │   #   │   Yak    │  
│                ##               │  ┌────────────┐   │  │ (00021)  ########## (00022)  ######### (00023)  │  
│                │                │  │ Swag Table │   │  └──────────┘        └──────────┘       └──────────┘  
│                │   ┌──────────┐ │  │ (00012)    │   │ ┌──────────────────────────────────────────────┐      
│                │   │Lights    │ │  └────────────┘   │ │                                    ┌───────┐ │      
│                │  ##(00008)   │ │                   │ │                 Bar (00024)        │Railing│ │      
└───────#────────┘ ##└──────────┘ │                   │ │                                    │(00026)│ │      
        #         #  ┌──────────┐ │                   │ │  ┌───────┐                         └───────┘ │      
┌───────#────────┐#  │Libations │ │                   │ │  │Stools │                                   │      
│               ##  ##(00009)   │ │                   ###  │(00025)│                                   │      
│ Temple of      │###└──────────┘ │                   │ │  └───────┘                                   │      
│ Transmutation  ##  ┌──────────┐ │                   │ │                     ┌────────────┐           │      
│ (00005)        │   │Quest     │ └───────────────────┘ │                     │Back (00027)│           │      
│                #####(00010)   │                       │                     └────────────┘           │      
└────────────────┘   └──────────┘                       └──────────────────────────────────────────────┘      `

const presenceMapping = [
  'robots',
  'sfHub',
  'vendingMachine',
  'exploreHub',
  'temple',
  'theater',
  'destinations',
  'lights',
  'libations',
  'quest',
  'hall',
  'swag',
  'warrior',
  'mage',
  'rogue',
  'tourist',
  'unconference',
  'cockatrice',
  'naga',
  'tengu',
  'dragon',
  'skeleton',
  'yak',
  'bar',
  'stools',
  'railing',
  'back'
]

const clickableAreas: ClickableArea[] = [
  {
    roomId: 'robots',
    x: 0,
    y: 1,
    width: 18,
    height: 7
  },
  {
    roomId: 'sfHub',
    x: 0,
    y: 8,
    width: 18,
    height: 12
  },
  {
    roomId: 'vendingMachine',
    x: 1,
    y: 14,
    width: 14,
    height: 5
  },
  {
    roomId: 'exploreHub',
    x: 0,
    y: 21,
    width: 18,
    height: 12
  },
  {
    roomId: 'temple',
    x: 0,
    y: 5,
    width: 18,
    height: 7
  },
  {
    roomId: 'theater',
    x: 25,
    y: 0,
    width: 46,
    height: 17
  },
  {
    roomId: 'destinations',
    x: 23,
    y: 20,
    width: 14,
    height: 4
  },
  {
    roomId: 'lights',
    x: 21,
    y: 29,
    width: 12,
    height: 4
  },
  {
    roomId: 'libations',
    x: 21,
    y: 33,
    width: 12,
    height: 4
  },
  {
    roomId: 'quest',
    x: 21,
    y: 37,
    width: 12,
    height: 4
  },
  {
    roomId: 'hall',
    x: 34,
    y: 18,
    width: 21,
    height: 21
  },
  {
    roomId: 'swag',
    x: 37,
    y: 27,
    width: 14,
    height: 4
  },
  {
    roomId: 'warrior',
    x: 73,
    y: 1,
    width: 12,
    height: 4
  },
  {
    roomId: 'mage',
    x: 90,
    y: 1,
    width: 12,
    height: 4
  },
  {
    roomId: 'rogue',
    x: 73,
    y: 8,
    width: 12,
    height: 4
  },
  {
    roomId: 'tourist',
    x: 90,
    y: 8,
    width: 17,
    height: 6
  },
  {
    roomId: 'unconference',
    x: 57,
    y: 17,
    width: 52,
    height: 4
  },
  {
    roomId: 'cockatrice',
    x: 57,
    y: 21,
    width: 12,
    height: 4
  },
  {
    roomId: 'dragon',
    x: 57,
    y: 25,
    width: 12,
    height: 4
  },
  {
    roomId: 'naga',
    x: 77,
    y: 21,
    width: 12,
    height: 4
  },
  {
    roomId: 'skeleton',
    x: 77,
    y: 25,
    width: 12,
    height: 4
  },
  {
    roomId: 'tengu',
    x: 96,
    y: 21,
    width: 12,
    height: 4
  },
  {
    roomId: 'yak',
    x: 96,
    y: 25,
    width: 12,
    height: 4
  },
  {
    roomId: 'bar',
    x: 105,
    y: 18,
    width: 12,
    height: 7
  },
  {
    roomId: 'stools',
    x: 59,
    y: 33,
    width: 9,
    height: 4
  },
  {
    roomId: 'railing',
    x: 93,
    y: 30,
    width: 9,
    height: 4
  },
  {
    roomId: 'back',
    x: 78,
    y: 37,
    width: 14,
    height: 3
  }
]
