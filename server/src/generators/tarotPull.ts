/* eslint-disable quotes */

import tracery from 'tracery-grammar'

export const actionString = (tarotPull: string) => {
  return `${tarotPull}`
}

export const generate = () => {
  var grammar = tracery.createGrammar({
    origin: [
      'Madam Chrysalia gathers the cards, #shuffle# before lifting the top card, #card#.'
    ],

    shuffle: [
      'then divides the deck in four, grasping each pair of halves before shuffling them into overlapping piles. Arcing each set into the semblance of a bridge, she lets all of the cards fall back together',
      'hesitating. Using her lower arms, she rapidly disarranges the deck with a simple overhand shuffle, all the while using the upper to meticulously preen her antennae',
      'showing you the back design--thin strands interlaced, iridescent and humming. Though neither of you have moved, something feels irrevocably different as she takes the deck from you',
      'passing the deck to you and indicating that you should shuffle. You do so, only stopping when #stop#, then pass them back. She smiles',
      'shuffling them without preamble'
    ],

    stop: [
      'something nibbles your hand',
      'you feel awkward',
      'it feels right',
      'it feels appropriate',
      'you get bored',
      'strange symbols flicker at the edge of your vision',
      'you find yourself wondering if Madam Chrysalia has ever met the Oracle'
    ],

    card: [
      'the Fool. An oddly familiar figure strolls through an open field, chasing a butterfly. #card0#',
      'the Magician. A man lifts a brush to the canvas of his bald head, creating a horned white rabbit leaning down to paint; the rabbit lowers its own brush to the curve of the man\'s cheek. Together, they paint themselves into being. #card1#',
      'the High Priestess. Madam Chrysalia herself watches from the image, holding a single card out to you. #card2#',
      'the Chariot. Two quartz Sphinxes brace a circus cannon between their great paws, proud eyes glittering. The barrel is empty, waiting for a new challenger. #card7#',
      'Strength. A Lion-woman, surrounded by a rising ring of fire, offers an armful of wildflowers. A whip lies broken on the ground. #card8#',
      'the Hermit. An ancient, stooped Cebinae monk cranks the handle of a barrel organ with long, agile fingers, his furred face wistful as old memories hang like music in the empty street. #card9#',
      'the Wheel of Fortune. A merry-go-round filled with all manner of beasts, untethered; they reach and beckon with velvet paws and wicked claws, fangs and smiles, as if to say, come ride. #card10#',
      'the Hanged Man. An aerialist, suspended, back arched and head hanging. One foot holds part of the silk taut, while the rest twines behind his back and opposing leg. His eyes are open. #card12#',
      'an unnamed card. A skeleton leans on the handle of a broom, grinning out at the empty grounds. Fallen sequins, peanut shells, and other circus detritus scatter in the wind, fleeing the unrelenting janitor. #card13#',
      'Temperance. A graceful figure balances on a thin streak of rainbow light. A birdcage rests atop their head, a small fish swimming unconcernedly inside. #card14#',
      'the Devil. A night without stars. #card15#',
      'the Tower. Hand slips from hand, and the tower built from joined arms and hearts begins to crumble. Those once held high fall limp, discarded, while those at the bottom are crushed beneath the weight of those they had supported. #card16#',
      'the Star. A solitary figure stands on a high platform, ready to dive into a pool below. Above, an endless night sky opens over the circus grounds, bright with stars. #card17#',
      'the Moon. A threadbare former sideshow performer slumps beneath a poster advertising the latest act--an entertainment automaton, its perfect porcelain mask covering the featureless, empty faceplate beneath. #card18#',
      'the World. A parade around the circus grounds, performer and guest alike--here, a bald wizard with a magenta slash of a beard, there, a bevy of sharp-toothed clowns attending the calliope. Feathers and fur, tails and scales, Dromads and Jabberwocks and big-footed mice, all are welcome. #card21#',
      'the... Obelisk? ... #cardobelisk#'
    ],

    card0: [
      'Everything lies ahead.',
      'Circus tents rise in the distance.',
      'The Obelisk rises in the distance.',
      'You hear a tiny yap.',
      'You hear a tiny mew.',
      'You are filled with potential.',
      'Your journey begins.'
    ],

    card1: [
      'As above, so below.',
      'You are filled with creativity.',
      'A lemniscate appears above your head, then disappears in a gust of wind and whirling leaves.',
      'And now, there\'s a world for you to create.',
      'You get to create yourself, too.'
    ],

    card2: [
      'This card smells strongly of #scent#.',
      'Her wings flutter.',
      'She also seems to be cleaning her right antenna.',
      'In the foreground, a few simple lines make the shape of your back.',
      'You can even faintly see the #pattern# on her garments.',
      'A vast, bulbous shape extends behind her, now uncovered.',
      'You are filled with a sense of mystery.',
      'For a moment, you see a thousand tiny versions of yourself-- now, then, soon; the you that is here, inside a cocoon smelling of #scent#; another you in a more familiar time and place, looking at a glowing surface; this universe, that universe. Madam Chrysalia really does see all.',
      'It seems to be the High Priestess.',
      'It seems to be the... Obelisk?',
      'Remember to tip.'
    ],

    card7: [
      'Charge ahead.',
      'You are filled with confidence.',
      'Get in the cannon and prepare to fly.',
      'You can do it!',
      'But the black quartz sphinx refuses to judge your vow.'
    ],

    card8: [
      'A lemniscate appears above your head, then disappears in a burst of flames and flower petals.',
      'A lemniscate appears above your head, then disappears. Sadly, your muscles remain un-augmented.',
      'Have courage.',
      'Stay determined.',
      'You are filled with determination.',
      'Something golden rises in your heart.'
    ],

    card9: [
      'Recall the earliest song you can remember. How did it make you feel?',
      'Where do you feel the most like yourself?',
      'You are filled with nostalgia.',
      'Perhaps you should think on this.',
      'You just need a moment to yourself.'
    ],

    card10: [
      'You are filled with good luck!',
      'You are out of luck.',
      'Fate can be kind.',
      'Fate can be cruel.',
      'You\'ve reached a turning point.',
      'Your lucky number is #number#.',
      'Your lucky scent is #scent#.'
    ],

    card12: [
      'Let go.',
      'You are filled with something indescribable.',
      'You have visions of a glowing rectangle.',
      'Try changing your perspective.',
      'Feathers fall all around.',
      'Nothing else exists on this card but the man, the silks, and the implied drop, but the more you stare, the more you see.',
      'Every moment can be liminal.'
    ],

    card13: [
      'Change is coming.',
      'Everything ends eventually.',
      'A chill runs down your spine.',
      'You are filled with certainty.'
    ],

    card14: [
      'Have faith in yourself, and take a step.',
      'You are filled with a sense of equilibrium.',
      'Swim through the clouds, but don\'t look down.',
      'Fly through the currents, but don\'t let yourself be carried away.',
      'Embrace your contradictions.'
    ],

    card15: [
      'You hear a distant honk.',
      'You hear a distant honk. Then another.',
      'Honk.',
      'In the foreground, you see a familiar warning sign.',
      'The night has glowing red eyes.',
      'The night has a palpable malevolence.',
      'It\'s just a black card?',
      'Don\'t look behind you.',
      'At least it isn\'t a mime.',
      'You are filled with trepidation.',
      'Whatever you\'re thinking of doing? Maybe... don\'t.'
    ],

    card16: [
      'Will it always end like this?',
      'You are filled with grief.',
      'You wonder who first let go--who didn\'t trust, who refused to talk. Maybe it doesn\'t matter.',
      'You know you can rebuild, but you miss the way your world used to be.',
      '...You refuse to look at this card any longer.'
    ],

    card17: [
      'Fall or fly, your moment awaits.',
      'You hear the rush of wings.',
      'You are filled with hope.',
      'Tiny lights sparkle beneath your skin.',
      'You make a wish.'
    ],

    card18: [
      'Sometimes that shining light is just your own, reflected.',
      'You are unfulfilled.',
      'Don\'t settle for pale imitations of brilliance.',
      'You feel uneasy...',
      'You feel like someone may be trying to make a point.'
    ],

    card21: [
      'You hear distant circus music.',
      'This is your story, too.',
      'You are filled.',
      'Everything you are is everything you ever need to be.',
      'You are whole, you are enough, and you belong here, in this parade of life.'
    ],

    cardobelisk: [
      'It pulses.',
      'It hums.',
      'You stare at it. It stares back.',
      'You silently beg the Obelisk not to fill you. It shows no mercy.',
      'You feel as if you should visit the souvenir shop.',
      'Madam Chrysalia seems nonplussed.',
      'A mysterious force prevents you from teleporting!'
    ],

    number: [
      '3',
      '7',
      '8',
      '10',
      '27',
      '42',
      '67',
      '69',
      '201',
      '413',
      '420',
      '628',
      '666',
      '667',
      '908',
      '915',
      '1225',
      'infinity',
      'infinity plus one',
      'pi',
      'the empty set',
      'green',
      'Tuesday',
      'October',
      'Elbereth'
    ]

  })

  grammar.addModifiers(tracery.baseEngModifiers)
  return grammar.flatten('#origin#')
}
/* eslint-enable quotes */
