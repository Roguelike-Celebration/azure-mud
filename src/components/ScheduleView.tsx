import React from 'react'

export default function ScheduleView () {
  const dateStr = (time) => `2020-10-03T${time}:00.000-07:00`

  const times = [
    ['09:15', 'Intro / Housekeeping'],
    ['09:30', 'Lisa Brown: Why do I even like roguelikes? An exploration of player motivation'],
    ['10:00', 'Tabitha Sable: Curses! A Story of UNIX Interface Hardware and Software Co-Evolution'],
    ['10:30', 'Unconferencing #1'],
    ['11:30', 'Andrew Aversa: The End of Permadeath'],
    ['12:00', 'Tyriq Plummer: YASDery Loves Company: Multiplayer in Traditional Roguelikes'],
    ['12:30', 'Break'],
    ['13:30', 'Lightning Talks 1: Rosalind Miles Chapman, Julian K. Jarboe, Albert Ford, Dustin Freeman, Andrew Clifton, Mark Gritter'],
    ['14:30', 'Darren Grey: What Is A *Rogue* Like?'],
    ['15:00', 'Andrea Roberts: Designing a Roguelike for People Who\'ve Never Played Roguelikes'],
    ['15:30', 'Break'],
    ['16:00', 'Phillip Daigle: Rogue\'s Gate: Feeling Around in the Dark'],
    ['16:30', 'Herbert Wolverson: Procedural Map Generation Techniques'],
    ['17:00', 'bhauth: What Makes *Dungeon Crawl: Stone Soup* a Good Game?'],
    ['17:30', 'Delve Bros: Help Me Steal the Mona Lisa'],
    ['18:30', 'Game Showcase / Unconferencing #2 / Afterparty'],
    ['19:30', 'Doors Close']
  ]

  // Including these here to be swapped in Saturday to Sunday.
  // const SundayTimes = [
  //   ['09:15', 'Intro / Housekeeping'],
  //   ['09:30', 'Lightning Talks 2: Xalavier Nelson Jr., Max Kreminski, Clarissa Littler, Nicholas Feinberg, Tanya X. Short'],
  //   ['10:30', 'Game Showcase / Unconferencing #3'],
  //   ['11:00', 'The Game Band: A Mysterious Blaseball Spectacular'],
  //   ['11:30', 'Cat Manning: How To Build A Character System That Doesn\'t Fall Apart Two Turns Later (with apologies to PKD)'],
  //   ['12:00', 'Gabriel Koenig: Good Mutation/Bad Mutation: Player Agency in Procedural Generation'],
  //   ['12:30', 'Break'],
  //   ['13:30', 'Caelyn Sandel: Teaching the Fun of Losing'],
  //   ['14:00', 'Ivy Melinda: A flower in the garden: cultivating a community for Caves of Qud'],
  //   ['14:30', 'Kate Compton: Making Polite Programming Languages: How to Design a Generative Language without a Programming Language Degree'],
  //   ['15:00', 'Aaron A. Reed: Cadences, Lacunae, and Subcutaneans: Ten Years of Procedural Novels'],
  //   ['15:30', 'Break'],
  //   ['16:00', 'Julian Day: Poetry at the Edge of Roguelikes: Writing Around Iterative Media'],
  //   ['16:30', 'Todd Furmanski: Mysty Roguelikes, or: Using First Person Point-and-Click Paradigms with Realtime Graphics and Simulation'],
  //   ['17:00', 'Lightning Talks 3: Lee Tusman, Alexander Martin, Josh Grams, Adrian Herbez, Younès Rabii, Duke Dougal'],
  //   ['18:00', 'Leif Bloomquist: Multiplayer Roguelike Gaming!'],
  //   ['18:30', 'Closing Announcements'],
  //   ['18:35', 'Unconferencing #4'],
  //   ['19:30', 'Wrap']
  // ]

  const formatter = new Intl.DateTimeFormat('en', { hour: 'numeric', minute: 'numeric' })

  const rows = times.map(r => {
    const date = new Date(dateStr(r[0]))

    return (
      <tr key={r[0]}>
        <td>{formatter.format(date)}</td>
        <td>{r[1]}</td>
      </tr>
    )
  })

  return (
    <div>
      <h1>Schedule</h1>
      <table>
        {rows}
      </table>
    </div>
  )
}
