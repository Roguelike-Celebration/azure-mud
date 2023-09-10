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
      style={{ letterSpacing: '2px', margin: '0px', width: 'fit-content' }}
    >
      <code>{map}</code>
    </pre>
  </div>
}

const mapText = `
                     ┌----------┐  ┌--------------┐   ┌-------------------------------------------------┐    
  ┌-------------┐    |.Teen.....####..............|   |...50ft....|.....Body Works....|.................|    
  |.............|    |.Cube.(01)|  |...Theater....#####...Goblin..|...........(04)....|.................|    
  |...H & M.....|    |..........|  |......(02)....|   |.......(03)|......___#_________|.....Spencer's...|    
  |...and Fitch.|    |==========|  |..............|   |===========|...../,,,.,.,,,.,,,,\\...Gifts (05)...|   
  |...Postale...|    |Jabberwock|  |..............#####..Orc......|..../,,,.,,,.,,,,,.,,\\...............|   
  |...Republic..|    |.Park.....####..............|   |..Wedding..|...#.,,┌-----------┐,,.#.............|   
  |.......(00)..\\    |.....(19).|  └-----....-----┘   |.....(20)..|../,,.,|  ͳ  ͳ  ͳ  |,,,,\\............| 
  |..............\\   └----------┘     /........\\------└===========┘=/,,,,,| Fountain  |,,,,,\\___________|   
  |...............\\                  /.,..,,.,,,\\.........|........|,,,,,,|     (21)  |,.,,,,|..........|   
┌--------------┐...|                /,,,,,,,,,,,,\\.Book...|........|,,,.,,|           |,,,.,,|..........| 
|..............|...|         ###   /,,,,.,,,,,,,,.#.Store.|..Hot...\\,,,,,,|  ͳ  ͳ  ͳ  |,,,,,.#..........| 
|..............|,,,|           #  /,,,,,,,,,.,,,,,,\\.(26).|..Topic..#.,,,,└-----------┘,,,.,/...........\\ 
|..............|,,,└-----------+-,,,.,,,,,,,,,,.,,,,\\.....|...(27)...\\,,,,,.,,,,,,,,.,,,,,,/...Sears.....╔░
|..American....|,,,,,,,,,,,,,,,,,,,,,,,.,,,,,,,,,,,,,\\....|...........\\,,,,,,,,,.,,,,,,,,,/.....(06).....╠░
|..Eagle (18)..|,,,,..........,,.,,,░░░░░░░░░░░░░,,,,,,=========#=====┘,,,,,.Feedback,,,,/...............╙░
|..............#.,,,.Kid Zone.,,,,,░░░░░Ice░░░░░░░,,.,...........,,,,.,,,,,,,.Kiosk.,,,.□............../ 
|..............|,,,,.(25).....,,,,,░░░░░Rink░░░░░░,,,,.Photo......,,,,,,.,,,,..(22).,,,.□..............| 
└--------------|,,,,..........,,,.,░░░░░(24)░░░░░░,,,,.Booth (23).,,,,,,,,,,........,,,.□..............| 
                \\,,,.,,,,,,.,,,,,,,░░░░░░░░░░░░░░░,,,............,,,,,,,,,,,,,,,,,,,,,,.□..............| 
┌--------------------#--------\\,,,,░░░░░░░░░░░░░░░,,,,┌------------------------------------------------┘ 
|..............................\\,,,,░░░░░░░░░░░░░,,,,,|     ┌------------------------------------┐           
|..Fighterman...................\\,,,,,,,,,,,,,,.,,,,,,|     |♦....♦....♦....♦...|................|           
|..Machine (14)..........Dance...\\,,,.,,,,,.,,,,,,.,,,|     |.♦....♦....♦....♦..| Orange Julius..|         
|........................Machine..\\,,,,,,,,,,,,,,,,,.,|     |..♦....♦....♦....♦.#..........(07)..|       
|...........................(15)...\\..........┌-\\,.,,.\\_____|.♦....♦....♦....♦..|................|       
|..................................|..........|  ---\\,.......♦...♦....♦....♦....|================|       
|..................................#..........|      \\,,......♦....Food.♦....♦..|................|       
|.........Arcade  (13).............|..........|       \\,.......♦...Court.♦....♦.#...Pretzel......|       
|..................................|..........|        \\,___..♦....(10)...♦....♦|...Place (08)...|       
|..................................|..Map.....|         |   |♦....♦....♦....♦...|................|       
|..................................|..Obelisk.|  empty  |   |.♦....♦....♦....♦..|................|       
|........................Anime.....|.....(12).#  store  |   |..♦....♦....♦....♦.|================|       
|........................Racing....|..........|   (11)  |   |.♦....♦....♦....♦..|................|       
|..80s Section...........Game......|..........|---------┘   |♦....♦....♦....♦...|...Hot Dog......|       
|.........(16).............(17)....|..........|             |.♦....♦....♦....♦..#...Stand (09)...|       
|..................................|..........|             |..♦....♦....♦....♦.|................|       
└----------------------------------└---╔╦╗----┘             └------------------------------------┘       
                                     ░░░░░░░░                                                            
`

const presenceMapping = [
  'h&m',
  'screen1',
  'theater',
  'screen2',
  'bodyWorks',
  'spencers',
  'sears',
  'orangeJulius',
  'pretzelPlace',
  'hotDogStand',
  'foodCourt',
  'emptyStore',
  'obelisk',
  'arcade',
  'unconferenceFighterman',
  'unconferenceDance',
  'unconference80s',
  'unconferenceRacing',
  'americanEagle',
  'screen3',
  'screen4',
  'fountain',
  'kiosk',
  'photoBooth',
  'iceRink',
  'kidZone',
  'bookstore',
  'hotTopic'
]

const clickableAreas: ClickableArea[] = [
  {
    roomId: 'h&m',
    x: 3,
    y: 2,
    width: 15,
    height: 9
  },
  {
    roomId: 'screen1',
    x: 22,
    y: 1,
    width: 12,
    height: 4
  },
  {
    roomId: 'theater',
    x: 36,
    y: 1,
    width: 16,
    height: 8
  },
  {
    roomId: 'screen2',
    x: 56,
    y: 1,
    width: 12,
    height: 4
  },
  {
    roomId: 'bodyWorks',
    x: 69,
    y: 1,
    width: 19,
    height: 4
  },
  {
    roomId: 'spencers',
    x: 89,
    y: 1,
    width: 18,
    height: 6
  },
  {
    roomId: 'sears',
    x: 95,
    y: 10,
    width: 10,
    height: 11
  },
  {
    roomId: 'orangeJulius',
    x: 82,
    y: 22,
    width: 18,
    height: 4
  },
  {
    roomId: 'pretzelPlace',
    x: 82,
    y: 28,
    width: 18,
    height: 5
  },
  {
    roomId: 'hotDogStand',
    x: 82,
    y: 34,
    width: 18,
    height: 4
  },
  {
    roomId: 'foodCourt',
    x: 61,
    y: 22,
    width: 20,
    height: 17
  },
  {
    roomId: 'emptyStore',
    x: 49,
    y: 30,
    width: 10,
    height: 6
  },
  {
    roomId: 'obelisk',
    x: 38,
    y: 30,
    width: 10,
    height: 5
  },
  {
    roomId: 'arcade',
    x: 1,
    y: 28,
    width: 32,
    height: 5
  },
  {
    roomId: 'unconferenceFighterman',
    x: 3,
    width: 17,
    y: 22,
    height: 4
  },
  {
    roomId: 'unconferenceDance',
    x: 21,
    y: 22,
    width: 14,
    height: 4
  },
  {
    roomId: 'unconference80s',
    x: 3,
    y: 33,
    width: 17,
    height: 4
  },
  {
    roomId: 'unconferenceRacing',
    x: 21,
    y: 33,
    width: 14,
    height: 4
  },
  {
    roomId: 'americanEagle',
    x: 3,
    y: 12,
    width: 14,
    height: 7
  },
  {
    roomId: 'screen3',
    x: 24,
    y: 6,
    width: 10,
    height: 4
  },
  {
    roomId: 'screen4',
    x: 57,
    y: 6,
    width: 10,
    height: 3
  },
  {
    roomId: 'fountain',
    x: 76,
    y: 8,
    width: 11,
    height: 5
  },
  {
    roomId: 'kiosk',
    x: 78,
    width: 7,
    y: 16,
    height: 5
  },
  {
    roomId: 'photoBooth',
    x: 55,
    y: 17,
    width: 12,
    height: 5
  },
  {
    roomId: 'iceRink',
    x: 38,
    y: 15,
    width: 15,
    height: 7
  },
  {
    roomId: 'kidZone',
    x: 21,
    y: 16,
    width: 10,
    height: 5
  },
  {
    roomId: 'lockedDoor',
    x: 31,
    y: 14,
    width: 1,
    height: 1
  },
  {
    roomId: 'bookstore',
    x: 52,
    y: 9,
    width: 5,
    height: 5
  },
  {
    roomId: 'hotTopic',
    x: 63,
    y: 9,
    width: 8,
    height: 6
  }
]
