import tracery from 'tracery-grammar'

export const actionString = (item: string) => {
  return `You make the mistake of reading the catalog out loud. Coins vanish from your purse, and ${item} appears at your feet as ominous laughter echoes in the distance.`
}

export const generate = () => {
  var grammar = tracery.createGrammar({
    origin: [
      '#item#',
      '#medicine#',
      '#diabloToy#',
      '#housing#',
      '#appliance#',
      '#appliance#'
    ],
    medicine: [
      '#pillType# Pills for #malady#',
      '#person#\'s #cureType# Cure',
      '#cureType# Cure for #malady#',
      '#person#\'s Medical Discovery',
      '#malady# Tonic',
      '#cureType# Tincture'
    ],
    diabloToy: [
      '#toy# of #suffix#',
      '#prefix# #toy#',
      '#prefix# #toy# of #suffix#'
    ],
    item: [
      'System Builder and Lung Restorer',
      'Giant Power Electric Belt',
      'Griffons\' Plush Cape',
      'Maternity Outfit For Mother',
      'Seer\'s Motor Buggy',
      'Saving Plan For Upper Planes Home Buyer',
      'A Chicken',
      'Tasha\'s Hideous Sweater',
      'Xanthar\'s Guide to Everything in the Mall',
      'Mordenkainen\'s Magnificent Mustache Oil',
      'Rary\'s System Enhancer',
      'Murlynd\'s Collectible Spoon Set',
      'Hadar\'s Protein Powder',
      'Wide Cuffed Pants +1',
      'Snake Oil +2',
      'lutefisk'
    ],
    person: [
      'Syzygyrior',
      'Dr Mandelbrot',
      'Brown',
      'Rodney',
      'Mehmet',
      'Argyve',
      'Charon',
      'Freddy Merchantry',
      'Oracle'
    ],
    pillType: [
      'Goblin',
      'Wizard',
      'Cursed',
      'Blessed',
      'Definitely Not Cursed',
      'Math',
      'Comically Oversized',
      'Tiny',
      'Electric Pink',
      'Fey-touched'
    ],
    cureType: [
      'Consumption',
      'Quick',
      'Vegetable',
      'Instant',
      'Organic',
      'Probiotic',
      'Antibiotic',
      'Cholineric',
      'Vegan',
      'All Natural',
      'All Undead'
    ],
    malady: [
      'Weak Goblins',
      'Low T (Treasure)',
      'Collapsed Wave Functions',
      'Kobold Weakness',
      'Persistent Undeath',
      'Cockatrice Stones',
      'Un-Becoming',
      'Joint Crackling'
    ],
    prefix: [
      'Flame-Tongue',
      'Giant Slayer',
      'Crimson',
      'Azure',
      'Pearl',
      'Topaz',
      'Rusted',
      'Strong',
      'Valiant',
      'Glorious',
      'Holy',
      'Weird',
      'Iron',
      'Steel',
      'Tin',
      'Deadly',
      'Heavy',
      'Brutal',
      'Savage',
      'Warrior\'s',
      'Fine',
      'Champion\'s',
      'Raven\'s',
      'Dragon\'s',
      'Serpent\'s'
    ],
    toy: [
      'Walkman',
      'Skip It',
      'Furby',
      'Pogs',
      'Beanie Baby',
      'Super Soaker',
      'Koosh Ball',
      'Troll Doll',
      'Stretch Armstrong',
      'TalkBoy',
      'Scrunchie'
    ],
    suffix: [
      'Wounding',
      'Life Stealing',
      'Paralysis',
      'Accuracy',
      'Precision',
      'Sorcery',
      'Power',
      'Giants',
      'Life',
      'Zest',
      'Vigor',
      'the Moon',
      'the Heavens',
      'the Zodiac',
      'trouble',
      'the Vulture',
      'the Whale',
      'the Eagle',
      'Quality',
      'Slaying',
      'Carnage',
      'Plenty',
      'the Ages',
      'Pain',
      'Tears',
      'Health',
      'Protection',
      'Flame',
      'the Leech',
      'Blood',
      'the Bat',
      'Haste',
      'Balance',
      'the Dark',
      'Radiance',
      'Corruption',
      'Thorns'
    ],
    housing: ['#house_desc# #house_type#'],
    house_desc: ['pre-built', 'pre-assembled', 'self-assembling', 'self-constructing', 'portable', 'minature', 'pre-haunted', 'endless', 'plywood', 'crystal'],
    house_type: ['wizard\'s tower', 'dungeon of doom', 'labyrinth', 'evil lair', 'fortress', 'treehouse', 'dirigible', 'pocket dimension', 'mirror maze', 'sewer', 'circus'],
    appliance: ['#appliance_desc# #appliance_type#'],
    appliance_type: ['drill', 'shoehorn', 'blender', 'spatula', 'mallet', 'chainsaw', 'shovel', 'lawnmower', 'anvil', 'stepladder', 'egg beater', 'spud wrench', 'air fryer', 'brazier', 'kitchen sink', 'cheesemelter', 'crepe maker', 'waffle iron', 'espresso machine', 'hot plate', 'multicooker', 'panini press', 'rice cooker', 'toaster', 'wine cooler', 'corkscrew', 'melon baller', 'rolling pin', 'spoon', 'fondue pot'],
    appliance_desc: ['invisible', 'sentient', 'miniature', 'decorative', 'blessed', 'cursed', 'interplanar', 'legendary', 'dimensionally shifted', 'unstable', 'extradimensional', 'engraved', 'flaming', 'psionic', 'masterwork', 'spiked', 'hexagonal', 'runed', 'jeweled', 'platinum', 'iridium', 'crystal', 'elven', 'dwarvish', 'orcish']
  })

  grammar.addModifiers(tracery.baseEngModifiers)
  return grammar.flatten('#origin#')
}
