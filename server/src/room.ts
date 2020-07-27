export interface Room {
  // e.g. "kitchen"
  id: string;

  // e.g. "GitHub HQ: Kitchen"
  displayName: string;

  // e.g. "the kitchen"
  shortName: string;

  description: string;

  // If true, webRTC audio/video chat can happen
  allowsMedia?: boolean;
}

export const roomData: { [name: string]: Room } = {
  kitchen: {
    id: "kitchen",
    displayName: "GitHub HQ: Kitchen",
    shortName: "the kitchen",
    description: `A series of long picnic tables made of rustic wood abut a stainless steel kitchen island. On the island are a few samovars of Sightglass coffee — don't worry, there's plenty of decaf too — and hot water for tea, plus a few trays of Arizmendi pastries.
      From here, you can walk over to the [[bar]] or grab a seat in the [[main theatre area->theatre]].`,
    allowsMedia: true,
  },
  theatre: {
    id: "theatre",
    displayName: "GitHub HQ: Theatre",
    shortName: "the theatre",
    description: `A stage, confusingly decorated with Halloween sculls and streamers. There are a few dozen flimsy metal chairs you can sit in, plus some comfy couches in the back. You can leave to the [[kitchen]], the [[bar]], or the [[arcade]].<br/><br/><center><iframe width="560" height="315" src="https://www.youtube.com/embed/mYMdMAvTHpo" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></center><br/>`,
  },
  bar: {
    id: "bar",
    displayName: "GitHub HQ: Bar",
    shortName: "the bar",
    description: `A beautiful long bar with hundreds of bottles spanning up to the ceiling. A friendly bartender will happily make you whatever you want. A laminated sign on the bartop advertises tonight's specials: the Tourist (a non-alcoholic drink with lots of fruit and a fun umbrella), the Berlin Interpretation (a mojito made with some sort of hyper-caffeinated soda), and the Walls Are Shifting (a Long Island Iced Tea).<br/><br/>You're a stone's throw away from the [[kitchen]], the [[theatre]], and the [[arcade]].`,
  },
  arcade: {
    id: "arcade",
    displayName: "GitHub HQ: Arcade Entryway",
    shortName: "the arcade",
    description: `The entryway of the GitHub office has been turned into a makeshift arcade of sorts. Developers are standing at folding tables with laptops, eager to show off their works-in-progress.<br/><br/>
      You are currently looking at <a href="https://krystman.itch.io/porklike" target="_blank">Porklike</a> by <a href="https://twitter.com/krystman" target="_blank">Krystian Majewski</a>.<br/><br/>
      
      <center><iframe src="https://www.lexaloffle.com/bbs/widget.php?pid=porklike" allowfullscreen width="621" height="513" style="border:none; overflow:hidden"></iframe></center><br/><br/>
      
      From here, you can get back to the [[bar]] or the [[theatre]].`,
  },
  conference: {
    id: "conference",
    displayName: "The Executive Suite Conference Room",
    shortName: "the conference room",
    description:
      "An executive conference room, straight out of a movie: a beautiful mahogany conferenece table, floor-to-ceiling windows overlooking the city, top-of-the-line conference equipment. A poster hangs on the wall expressing Garfield's hatred of Mondays, but it's impeccably framed and very classy.",
    allowsMedia: true,
  },
};
