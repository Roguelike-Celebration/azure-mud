var tracery = require('tracery-grammar')

export const actionString = (poster: string) => {
  return `You look more closely at one of the pieces of paper - ${poster}.`
}

export const generate = () => {
  var grammar = tracery.createGrammar({
    origin: [
      'it reads "#apology# - #closedReason#" in a #writingMethod#',
      'but all it says is "#closedReason#"',
      'it\'s #cramped#, but you can make out #closedReason#'
    ],
    apology: [
      'Sorry',
      'Apologies to our guests',
      'This one\'s my bad',
      'Oops',
      'We apologize for any inconvenience'
    ],
    closedReason: [
      'overrun with crabs',
      '#n# destination not found',
      'we lost this one',
      'dog ate our airport',
      'we could\'nt figure out the code to lower the drawbridge',
      'we require #n# #runes#',
      'a cat is sitting on me and won\'t leave',
      'Xom finds this hilarious!'
    ],
    writingMethod: [
      'hasty handwritten scrawl',
      'messy crayon scribble',
      'comic sans font',
      'standard printed font',
      'series of letters cut from magazines',
      'unfairly beautiful calligraphy'
    ],
    cramped: [
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
      'plump helmets',
      'sharks',
      'excuses'
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
