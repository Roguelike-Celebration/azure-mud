export interface Room {
  // e.g. "kitchen"
  id: string;

  // e.g. "GitHub HQ: Kitchen"
  displayName: string;

  // e.g. "the kitchen"
  shortName: string;

  description: string;

  // Array of ids
  exits: string[];
}

export const roomData: { [name: string]: Room } = {
  kitchen: {
    id: "kitchen",
    displayName: "GitHub HQ: Kitchen",
    shortName: "the kitchen",
    description: `A series of long picnic tables made of rustic wood abut a stainless steel kitchen island. On the island are a few samovars of Sightglass coffee — don't worry, there's plenty of decaf too — and hot water for tea, plus a few trays of Arizmendi pastries.
      From here, you can walk over to the [[bar]] or grab a seat in the [[main theatre area->theatre]].`,
    exits: ["theatre", "bar"],
  },
  theatre: {
    id: "theatre",
    displayName: "GitHub HQ: Theatre",
    shortName: "the theatre",
    description: `A stage, confusingly decorated with Halloween sculls and streamers. There are a few dozen flimsy metal chairs you can sit in, plus some comfy couches in the back. You can leave to the [[kitchen]], the [[bar]], or the [[arcade]].<br/><br/><center><iframe width="560" height="315" src="https://www.youtube.com/embed/mYMdMAvTHpo" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></center><br/>`,
    exits: ["kitchen", "bar", "arcade"],
  },
  bar: {
    id: "bar",
    displayName: "GitHub HQ: Bar",
    shortName: "the bar",
    description: `A beautiful long bar with hundreds of bottles spanning up to the ceiling. A friendly bartender will happily make you whatever you want. A laminated sign on the bartop advertises tonight's specials: the Tourist (a non-alcoholic drink with lots of fruit and a fun umbrella), the Berlin Interpretation (a mojito made with some sort of hyper-caffeinated soda), and the Walls Are Shifting (a Long Island Iced Tea). You're a stone's throw away from both the [[kitchen]], the [[theatre]], and the [[arcade]].`,
    exits: ["theatre", "kitchen", "arcade"],
  },
  arcade: {
    id: "arcade",
    displayName: "GitHub HQ: Arcade Entryway",
    shortName: "the arcade",
    description: `The entryway of the GitHub office has been turned into a makeshift arcade of sorts, spotted with developers standing by foldable tables with laptops on them to show off their work-in-progress games.<br/><br/>
      You are currently looking at <a href="https://krystman.itch.io/porklike" target="_blank">Porklike</a> by <a href="https://twitter.com/krystman" target="_blank">Krystian Majewski</a>.<br/><br/>
      
      <center><iframe src="https://www.lexaloffle.com/bbs/widget.php?pid=porklike" allowfullscreen width="621" height="513" style="border:none; overflow:hidden"></iframe></center><br/><br/>
      
      From here, you can get back to the [[bar]] or the [[theatre]].`,
    exits: ["theatre", "bar"],
  },
};
