/* eslint-disable @stylistic/quotes */

import tracery from 'tracery-grammar'

export const actionString = (rule: string) => {
  return `Your rule is: ${rule}!`
}

export const generate = () => {
  var grammar = tracery.createGrammar({
    origin: [
      "To score a point you must #action# #restriction#"
    ],
    action: [
      'Hit a homerun',
      'Get a slam dunk',
      'Score a 3-Pointer',
      'Kick a field goal',
      'Kick a goal post',
      'Get a hole in one',
      'Get a touchdown',
      'Get a first down',
      'Play hackey sack',
      'Do a barrel roll',
      'Do a kickflip',
      'Catch a frisbee',
      'Do five pushups',
      'Stick a wicket',
      'Row five laps',
      'Eat 52 hotdogs',
      'Get a perfect K.O.',
      'Get a KDR of 5:1',
      'Catch a live eel',
      'Catch a live chicken'
    ],
    restriction: [
      'while in a burlap sack',
      'while poisoned',
      'with a fire flower',
      'with a pool noodle',
      'while transformed into a fish',
      'with goat legs',
      'while a guy named Jeff watches you, unblinking',
      'while juggling',
      'while juggling flaming balls',
      'while juggling live goats',
      'while spinning a fire staff',
      'while hula dancing',
      'under the light of a full moon',
      'under the influence',
      'under water',
      'on a boat',
      'on a train',
      'on a chevy suburban',
      'in zero gravity',
      'while upside down',
      'with your eyes closed',
      'remotely via datalink',
      'remotely via muppet',
      'while dodging dodgeballs',
      'while bound and gagged',
      'while suspended from the ceiling',
      'while being whipped',
      'while being tenderly cuddled',
      'while watching the extended Lord of the Rings',
      'while writing a book report',
      'while doing your math homework',
      'while coaching a little league team',
      'with your hands in mittens',
      'without using your hands',
      'without using your feet',
      'while holding your breath',
      'while covered in eels'
    ]
  })

  grammar.addModifiers(tracery.baseEngModifiers)
  return grammar.flatten('#origin#')
}
/* eslint-enable @stylistic/quotes */
