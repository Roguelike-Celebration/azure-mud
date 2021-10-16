/* eslint-disable quotes */

var tracery = require('tracery-grammar')

export const actionString = (poster: string) => {
  return `You look more closely at one of the pieces of paper - ${poster}.`
}

export const generate = () => {
  var grammar = tracery.createGrammar({
    origin: [
      'it reads "#apology# - #closedReason#" in a #writingMethod#',
      'but all it says is "#closedReason#"',
      'but all it says is "#apology#".',
      'it\'s #cramped#, but you can make out "#closedReason#".',
      `it's #cramped#, so all you can see is "#apology#.`
    ],
    apology: [
      'Sorry',
      'Our most humble apologies',
      'Whoopsie',
      'The needs of the one do not outweigh the needs of the many (That is, we\'re sorry, and that clerk has been sacked...)',
      'In these trying times sometimes errors are made...',
      'We screwed up',
      'Expressing regret',
      'We accept all responsibility',
      'Making restitution for errors',
      'We humbly request your forgiveness',
      'Apologies to our guests',
      'We were wrong',
      'It has become apparent there was an error',
      'This one\'s my bad',
      'Oops',
      'We apologize for any inconvenience',
      'To err is human; we are unfortunately human',
      'In an effort by the universe to keep us humble, it has come to our attention that we have been less than perfect'
    ],
    closedReason: [
      'overrun with #crustaceans#',
      '#n# destination not found',
      'we lost this one',
      'dog ate our airport',
      'we could\'nt figure out the code to lower the drawbridge',
      'we require #n# #runes#',
      'a cat is sitting on me and won\'t leave',
      'extraplanar event in progress',
      'an entire alphabet\'s worth of both capital and lowercase letters has settled in and declared independence',
      'Xom finds this hilarious!',
      'robot can\'t find kitten'
    ],
    crustaceans: [
      'crabs',
      'lobsters',
      'crayfish',
      'rabid prawn',
      'angry shrimp',
      'annoyed cocktail shrimp',
      'a legion of krill, for they are many',
      'an uncountable sum of barnacles',
      'an assortment of selfish shellfish'
    ],
    writingMethod: [
      'hasty handwritten scrawl',
      'messy crayon scribble',
      '#badfontname# font',
      'standard printed font',
      'series of letters cut from magazines',
      'unfairly beautiful calligraphy'
    ],
    badfontname: [
      'Comic Sans',
      'Papyrus',
      'Times Old Roman',
      'Heckvetica',
      'Jokerman',
      'Wingdings',
      'Curlz',
      '22 Pt. Bold Impact'
    ],
    cramped: [
      'hard to make out',
      'barely legible',
      'covered in suspicious brown splotches',
      'nearly illegible',
      'in an obscure dialect you happen to know a little',
      'full of legalese',
      'scribbled over in crayon',
      'full of ever-shifting ASCII'
    ],
    runes: [
      'runes',
      'MacGuffins',
      'lumenstones',
      'salmon',
      'spikes',
      'totally aribitrary collectable objects (TACOs)',
      'collectable robots',
      'plump helmets',
      'ornithopters',
      'report cards',
      'common enemy pellets',
      'cc\'s of #slimecolor# slime #slimejuice#',
      'bars of #preciouselement#-pressed #cheapmetal#',
      'sharks',
      'excuses',
      'orbs',
      'JIRA tickets',
      'lutefisk',
      'meters of wire'
    ],
    preciouselement: [
      'gold',
      'silver',
      'platinum',
      'mythril',
      'orchalchium',
      'eternium',
      '\'Sunny-D\''
    ],
    cheapmetal: [
      'latinum',
      'lithium',
      'magnesium',
      'beryllium',
      'potassium',
      'calcium',
      'aluminum',
      'aluminium',
      'sodium',
      'diet sodium',
      'vanadium',
      'iron',
      'nickle',
      'zinc',
      'selenium',
      'rubidium'
    ],
    slimecolor: [
      'red',
      'green',
      'gold',
      'blue',
      'metal',
      'orange',
      'yellow',
      'violet',
      'hot pink',
      'heliotrope',
      'iridescent',
      'glow-in-the-dark',
      'invisible',
      'octarine'
    ],
    slimejuice: [
      'effluvia',
      'juice',
      'goo',
      'sputum',
      'gak',
      'fluid',
      'oil'
    ],
    n: [
      '#thousands##digit##digit##digit#',
      '#leading##digit##digit#',
      '#leading##digit#',
      '#leading#',
      '#leading#'
    ],
    thousands: [
      '1',
      '2',
      '3',
      '4',
      '5'
    ],
    leading: [
      '1',
      '2',
      '3',
      '4',
      '5',
      '6',
      '7',
      '8',
      '9'
    ],
    digit: [
      '0',
      '1',
      '2',
      '3',
      '4',
      '5',
      '6',
      '7',
      '8',
      '9'
    ]
  })

  grammar.addModifiers(tracery.baseEngModifiers)
  return grammar.flatten('#origin#')
}

/* eslint-disable quotes */
