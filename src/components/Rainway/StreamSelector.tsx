import React, { useEffect, useState } from 'react'
import { RainwayStreamAnnouncement } from '@rainway/web'

interface Props {
  announcements: RainwayStreamAnnouncement[];
  onChosen: (e: RainwayStreamAnnouncement) => void;
}

export const StreamSelector = (props: Props) => {
  const { announcements, onChosen } = props
  const [chosen, setChosen] = useState<RainwayStreamAnnouncement>()

  useEffect(() => {
    setChosen(announcements[0])
  }, [announcements])

  if (announcements.length === 0) {
    return <></>
  } else {
    const identifyAndSelect = (id: string) => {
      const selectedId = Number(id).valueOf()
      const identified = announcements.find(
        (e) => e.info.streamId === selectedId
      )

      if (identified) {
        setChosen(identified)
      }
    }

    return (
      <div className="stream-selector">
        <select onBlur={(e) => identifyAndSelect(e.target.value)}>
          {announcements.map((announcement) => (
            <option
              key={announcement.info.streamId.toString()}
              value={announcement.info.streamId.toString()}
            >
              Stream {announcement.info.streamId.toString()}
            </option>
          ))}
        </select>
        <button
          onClick={() => {
            if (chosen) {
              onChosen(chosen)
            }
          }}
        >
          Join Stream
        </button>
      </div>
    )
  }
}
