/* eslint-disable quotes */

import tracery from 'tracery-grammar'

export const actionString = (pickupLine: string) => {
  return `${pickupLine}`
}

export const generate = () => {
  var grammar = tracery.createGrammar({
    origin: [
      '#bardIntro# "#pickupLine#"'
    ],
    bardIntro: [
      'The bard clears their throat and says:',
      'The bard puts on a cheesy grin and says: '
    ],
    pickupLine: [
      'Your RNG or mine?',
      "Do you have a name or can I (c)all you mine?",
      "Are you a potion of descent, because I think I just fell for you.",
      "Are you a secret door? Because you're just what I've been searching for.",
      "Do you believe in love at first sight, or should I go up a level and come back down?",
      "If I was procedurally generating the alphabet, I'd include a rule that U and I always appear next to each other.",
      "Do you have a scroll of magic mapping? I keep getting lost in your eyes.",
      "Are you a playing a rogue? Because you've stolen my heart.",
      "I'm out of torches; can I borrow your smile?",
      "Are you yet another stupid death? Cuz DAMN!",
      "Found this armor on level 5. Know what it's made of? Marriage material.",
      "Would you like a food ration? No? How about a date?",
      "Are you a side quest? Cuz I'll go out of my way for you!",
      "Do you need to rest? Because you've been running through my mind all day.",
      "Are you my food rations? Because without you, I'd die.",
      "Did you just read a scroll of fire? Because you're hot!",
      "Are you permadeath? Cuz if this conversation goes nowhere, I'm willing to start again from the beginning.",
      "Hey, would you like a potion of charisma-- oh, sorry, you obviously don't need it.",
      "Did you just read a scroll of summon hot date? Cuz... here I am!",
      "I just used a scroll of identify on you, and it said you're my soulmate.",
      "Are you a traditional roguelike codebase? Cuz I'd love to fork you.",
      "We may be single ASCII characters, but I can picture us together.",
      "I found a hidden key! I hope it's the one to your heart.",
      "My inventory's almost full, but there's still room for your number."
    ]
  })

  grammar.addModifiers(tracery.baseEngModifiers)
  return grammar.flatten('#origin#')
}

/* eslint-enable quotes */
