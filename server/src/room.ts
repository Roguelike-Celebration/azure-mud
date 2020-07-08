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
      From here, you can walk over to the [[bar]] or grab a seat in the [[main theatre area->theatre]]`,
    exits: ["theatre", "bar"],
  },
  theatre: {
    id: "theatre",
    displayName: "GitHub HQ: Theatre",
    shortName: "the theatre",
    description: `A stage, confusingly decorated with Halloween sculls and streamers. There are a few dozen flimsy metal chairs you can sit in, plus some comfy couches in the back. You can leave to the [[kitchen]] or the [[bar]]`,
    exits: ["kitchen", "bar"],
  },
  bar: {
    id: "bar",
    displayName: "GitHub HQ: Bar",
    shortName: "the bar",
    description: `A beautiful long bar with hundreds of bottles spanning up to the ceiling. A friendly bartender will happily make you whatever you want. You're a stone's throw away from both the [[kitchen]] and the [[theatre]]`,
    exits: ["theatre", "kitchen"],
  },
};
