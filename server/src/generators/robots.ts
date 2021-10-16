/* eslint-disable quotes */

var tracery = require('tracery-grammar')

export const actionString = (robot: string) => {
  return `${robot}`
}

export const generate = () => {
  var grammar = tracery.createGrammar({
    origin: [
      '#soundEffect#! You watch #visualCues.a# #robot# rolls off the assembly line that #activities#.',
      'You see #visualCues.a# #robot# roll off the assembly line. A part of you wishes you could adopt it for yourself.',
      'You watch as #visualCues.a# #robot# is made.',
      'You watch as #robot.a# that #activities# is made.'
    ],
    soundEffect: [
      'Clonk',
      'Boop',
      'Cshhhhh',
      'Fwoop',
      'Ka-chunk',
      'Zoop',
      'Beep beep beep',
      'Clang',
      'Clink',
      'Swoosh'
    ],
    robot: [
      'cute robot',
      "robot",
      "machine",
      "automaton",
      "android",
      "synthetic life form"
    ],
    visualCues: [
      "eight-legged",
      "rusted",
      "weatherbeaten",
      "shiny chrome",
      "yellowing plastic",
      "retro chunky",
      "vaguely canine",
      "liquid metal",
      "small humanoid",
      "sleek black",
      "matte gray",
      "surprisingly glittery",
      "tread-footed",
      "multi-armed",
      "roughly trash-can-shaped",
      "tall gold",
      "extremely pale",
      "sassy",
      "heavily armored",
      "helicopter-ish",
      "cuboid",
      "red-eyed",
      "bright green",
      "dazzlingly fabulous"
    ],
    activities: [
      "may not injure a human being or, through inaction, allow a human being to come to harm",
      "stays alert for Movie Sign",
      "dreams of electric sheep",
      "beeps quietly to itself as it tries to resolve a logical paradox",
      "happily scoots along the floor, sucking up all the dirt in its path",
      "trundles along slowly, as if depressed",
      "displays the message '70:Hazard:None'",
      "emits a sustained high-pitched squeal",
      "repeats everything you say to it as a question",
      "hovers unsteadily about two meters off the ground",
      "beeps and squeals angrily every few minutes",
      "sings a happy little song when the laundry's done",
      "occasionally emits a shower of sparks",
      "falls right to the bottom of the uncanny valley",
      "...wait this is just a toaster",
      "is trying to reach you about your car's extended warranty",
      "seems to be watching a soap opera",
      "mostly spins around in circles",
      "constantly refuses to open the pod bay doors"
    ]
  })

  grammar.addModifiers(tracery.baseEngModifiers)
  return grammar.flatten('#origin#')
}
/* eslint-enable quotes */
