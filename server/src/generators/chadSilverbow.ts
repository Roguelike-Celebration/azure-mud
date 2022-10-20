/* eslint-disable quotes */

import tracery from 'tracery-grammar'

export const actionString = (chadSilverbow: string) => {
  return `${chadSilverbow}`
}

export const generate = () => {
  var grammar = tracery.createGrammar({
    origin: [
      'You can see fresh oil glistening across his muscular chest, which he put prominently on display.',
      'He takes some bags out of his pockets and starts to juggle, but immediately drops one and hits himself with the other two.',
      'You take a moment to admite all the golden medallions and other jewelry dangling from his jaunty bard outfit',
      'He\'s holding #instrument.a# and threatening to play it. You may want to cover your ears.',
      'Coming from his mouth is a sound that most closely resembles a cat being rhythmically stepped on.',
      'He appears to still be setting up for a joke he began 5 minutes ago, and the audience looks ready to attack.',
      'His brightly-colored bard garb looks to be custom tailored by the finest tailor a king\'s ransom could buy.',
      'He exudes an aura of just earnestly wanting everyone around him to be happy.',
      'He tells another horrible joke and then gives you a knowing look.'
    ],
    instrument: [
      'lute',
      'ukelele',
      'acoustic guitar',
      'pan flute',
      'accordion',
      'otamatone',
      'trombone'
    ]
  })

  grammar.addModifiers(tracery.baseEngModifiers)
  return grammar.flatten('#origin#')
}
/* eslint-enable quotes */
