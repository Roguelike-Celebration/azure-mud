var tracery = require('tracery-grammar')

export const actionString = (poster: string) => {
  return `You look more closely at one of the many posters - ${poster}`
}

export const generate = () => {
  var grammar = tracery.createGrammar({
    origin: [
      'It says "#slogan#" in bold face type.',
      'Someone has scrawled "#slogan#" over it, large enough you cannot see the original text.',
      'It\'s filled with all sorts of text in small type, but you can make out "#slogan#"',
      'It looks like #friendly.a# skeleton is saying "#slogan#"'
    ],
    slogan: [
      'bones bones bones',
      'The Enemy Within',
      'The Power Inside You - Bones',
      'Hit da bricks! Real winners quit!',
      'Did you know you have a skeleton inside you right now?',
      'The average person has more than one skeleton in them!',
      'We need YOU to fight in the SKELETON WAR!',
      'Uncle #deathGod# needs YOU to fight in the SKELETON WAR!',
      'You have a bone to pick with the ENEMY!',
      'Roll them bones - Join the SKELETON WAR today!',
      'The only good organ is a pipe organ.',
      'Are you doing your part to combat FLESH?',
      'Buy CALCIUM BONDS to support the SKELETON WAR effort!',
      'Do you know this man? He has skin. He is THE ENEMY.',
      'Drink more milk! Calcium is good for you!',
      'Flesh is overrated.',
      'I can see right through you!'
    ],
    deathGod: [
      'Charon',
      'Hades',
      'Pluto',
      'Anubis',
      'Osiris',
      'Nergal',
      'Chernobog',
      'Cichol',
      'Morrigan',
      'Odin',
      'Lucifer',
      'Orcus',
      'Erebus',
      'Hecate',
      'Thanatos',
      'Cocytus',
      'Styx',
      'Mors',
      'Yama',
      'Aminon',
      'Meng Po',
      'Deng Ai',
      'Ji Ming',
      'Bao Zheng',
      'Han Qinhu',
      'Fan Zhongyan',
      'Kou Zhun',
      'Hine-nui-te-pō',
      'Manduyapit',
      'Mama Guayen',
      'Sitan',
      'Mictlantecuhtli',
      'El Tío',
      "Shai'tan",
      'Mandos',
      'Stranger',
      'Skel',
      'Skeleton',
      'Skelington',
      'Skelly'
    ],
    friendly: [
      'friendly',
      'delightful',
      'boisterous',
      'appealing',
      'excited',
      'oddly attractive',
      'spiffy',
      'proud'
    ]
  })

  grammar.addModifiers(tracery.baseEngModifiers)
  return grammar.flatten('#origin#')
}
