export interface Room {
  // e.g. "kitchen"
  id: string

  // e.g. "GitHub HQ: Kitchen"
  displayName: string

  // e.g. "the kitchen"
  shortName: string

  description: string

  // If true, webRTC audio/video chat can happen
  allowsMedia?: boolean

  // Indicates whether the room should let users place post-it notes
  // As we add more pieces of one-off functionality,
  // having a bunch of ad-hoc flags like this will probably get frustrating quickly.
  // We may want to eventually refactor to something resembling an ECS.
  hasNoteWall?: boolean

  // If true, don't show the room in the side list
  hidden?: boolean
}

export const roomData: { [name: string]: Room } = {
  kitchen: {
    id: 'kitchen',
    displayName: 'Kitchen',
    shortName: 'the kitchen',
    description: `A series of long picnic tables made of rustic wood abut a stainless steel kitchen island. On the island are a few samovars of coffee — don't worry, there's plenty of decaf too — and hot water for tea, plus a few trays of pastries.
      From here, you can walk over to the [[bar]] or grab a seat in the [[main theatre area->theatre]].`,
    allowsMedia: true,
    hasNoteWall: true
  },
  theatre: {
    id: 'theatre',
    displayName: 'Theatre',
    shortName: 'the theatre',
    // kawa: fixed typo, changed src to Twitch per issue #89. Note 'parent' will need to be changed if we change domains, see issue #88. Twitch documentation about 'parent': https://discuss.dev.twitch.tv/t/twitch-embedded-player-updates-in-2020/23956
    description: 'A stage, confusingly decorated with Halloween skulls and streamers. There are a few dozen flimsy metal chairs you can sit in, plus some comfy couches in the back. You can leave to the [[kitchen]], the [[bar]], the [[lounge]], or clamber into the [[shipping container->shippingContainer]].<br/><br/><center id="iframes"><iframe width="560" height="315" src="https://player.twitch.tv/?channel=roguelike_con&parent=chat.roguelike.club" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe><iframe id="captions" width="560" height="100" src="https://www.streamtext.net/player/?event=RoguelikeCelebration&chat=false&header=false&footer=false&indicator=false&ff=Consolas&fgc=93a1a1" frameborder="0" allow="autoplay; encrypted-media;" allowfullscreen></iframe></center><br/>',
    allowsMedia: true
  },
  bar: {
    id: 'bar',
    displayName: 'Bar',
    shortName: 'the bar',
    description: 'A beautiful long bar with hundreds of bottles spanning up to the ceiling. A friendly bartender will happily make you whatever you want. A laminated sign on the bartop advertises tonight\'s specials: the Tourist (a non-alcoholic drink with lots of fruit and a fun umbrella), the Berlin Interpretation (a mojito made with some sort of hyper-caffeinated soda), and the Walls Are Shifting (a Long Island Iced Tea).<br/><br/>You\'re a stone\'s throw away from the [[kitchen]], the [[theatre]], the [[dance floor]], and the [[lounge]]. You can also crawl into the [[shipping container->shippingContainer]].',
    allowsMedia: true
  },
  lounge: {
    id: 'lounge',
    displayName: 'Lounge',
    shortName: 'the lounge',
    description: 'A chill space to hang away from the hustle and bustle of the main space. Comfy chairs, TVs showing video footage of roguelikes, and a fridge full of La Croix. <br/><br/>From here, you can get to the [[bar]] or the [[theatre]].',
    allowsMedia: true
  },
  statue: {
    id: 'statue',
    displayName: '@-sign Statue',
    shortName: 'the statue',
    description: 'A memorial to countless adventurers who have helped build this social space.<br/><br/>A plaque on the statue shows a list of <a href="https://github.com/lazerwalker/azure-mud/graphs/contributors" target="_blank" rel="noreferrer">code contributors</a>.<br/>There\'s also a suggestion wall for people to add comments about the social space.',
    hasNoteWall: true,
    allowsMedia: true
  },
  danceFloor: {
    id: 'danceFloor',
    displayName: 'Dance Floor',
    shortName: 'the dance floor',
    description: 'The ping-pong table has been pushed to the side for a makeshift dance floor. A DJ booth is set up where chiptunes are playing.<br/><br/>From here, you can reach [[the kitchen]] or [[the bar]].'
  },
  shippingContainer: {
    id: 'shippingContainer',
    displayName: 'Shipping Container',
    shortName: 'the shipping container',
    description: `
      It's not quite clear why there's a shipping container in the middle of the space. Seems pretty chill, though? Somebody's set up a makeshift bench.<br/><br/>
      After you climb out, you can get back to the [[bar]], the [[theatre]], the [[kitchen]], or the [[lounge]].`,
    allowsMedia: true
  },
  entryway: {
    id: 'entryway',
    displayName: 'Registration Desk',
    shortName: 'the registration desk',
    description: 'A big banner reads welcome to Roguelike Celebration! Once you\'ve got your bearings about you, you can move to the [[lounge]].',
    hidden: true
  },
  northShowcaseHall: {
    id: 'northShowcaseHall',
    displayName: 'North Showcase Hall',
    shortName: 'the north showcase hall',
    description: `
      A number of booths line the sides of the hall.<br/><br/>
      <img src="images/puppy.jpg" alt="puppy" />
      Here you can see Gesuido, by Ryosuke Mihara, Project Earth by Michael Taylor, WizardWarsIO by quantompotato, and Project Shiro by Garbriel Martinez.<br/><br/>
      <i>PLACEHOLDER TEXT - can include developer content or embeds if requested</i><br/><br/>
      You can exit to the [[west hall->westShowcaseHall]] or [[east hall->eastShowcaseHall]]`,
    allowsMedia: true
  },
  eastShowcaseHall: {
    id: 'eastShowcaseHall',
    displayName: 'East Showcase Hall',
    shortName: 'the east showcase hall',
    description: `
      A number of booths line the sides of the hall.<br/><br/>
      Here you can see Roundguard, by Andrea Roberts, Nogunz: Doppelganger Edition by Mike Corrigan, Ultimate ADOM: Caverns of Chaos by Thomas Biskup and Team ADOM, and Cantrip by Joeri Bakker.<br/><br/>
      <i>PLACEHOLDER TEXT - can include developer content or embeds if requested</i><br/><br/>
      You can exit to the [[north hall->northShowcaseHall]] or [[south hall->southShowcaseHall]]`,
    allowsMedia: true
  },
  southShowcaseHall: {
    id: 'southShowcaseHall',
    displayName: 'South Showcase Hall',
    shortName: 'the south showcase hall',
    description: `
      A number of booths line the sides of the hall.<br/><br/>
      Here you can see Fuzz Force: Spook Squad, by Alan Igle, Mech@mor Showdown by Seth Alter, Rift Wizard by Dylan White, and Happy Grumps by Glenn LaBarre.<br/><br/>
      <i>PLACEHOLDER TEXT - can include developer content or embeds if requested</i><br/><br/>
      You can exit to the [[west hall->westShowcaseHall]] or [[east hall->eastShowcaseHall]]`,
    allowsMedia: true
  },
  westShowcaseHall: {
    id: 'westShowcaseHall',
    displayName: 'West Showcase Hall',
    shortName: 'the west showcase hall',
    description: `
      A number of booths line the sides of the hall.<br/><br/>
      Here you can see Computer Dungeon Slash: ZZT, by KKairos, Peglin by Red Nexus Games, and AutoFire by Patrick Lipo.<br/><br/>

      <div class="showcase-container">
        <div class="showcase-entry">
          <p><a href="https://kkairos.itch.io/cdslash" target="_blank">Computer Dungeon Slash: ZZT</a>, by 
            <a href="https://twitter.com/Kaikairos" target="_blank" rel="nofollow noopener noreferrer">KKairos</a> <-- Twitter link, can remove or change if requested
          </p>
          <p>Computer Dungeon Slash: ZZT is a "dungeon crawler" written for the 1991 game-creation system ZZT featuring classic "ZZT-style" action, 
            dynamic procedural level generation, and a comedic cast of characters to rescue. You can find it on 
            <a href="https://kkairos.itch.io/cdslash" target="_blank">itch.io</a>!
          </p>
          <img src="images/cdszzt/cdszzt-title.png" alt="The Computer Dungeon Slash: ZZT title screen" style="max-width: 32%;">
          <img src="images/cdszzt/cdszzt-town.png" alt="The town area of Computer Dungeon Slash: ZZT" style="max-width: 32%;">
          <img src="images/cdszzt/cdszzt-montage.png" alt="Several different 'limited viewport' levels of Computer Dungeon Slash: ZZT" style="max-width: 32%;">
        </div>

        <div class="showcase-entry">
          <p><a href="https://store.steampowered.com/app/1296610/Peglin" target="_blank">Peglin</a>, by 
            <a href="https://twitter.com/rednexusgames" target="_blank" rel="nofollow noopener noreferrer">Red Nexus Games</a>
          </p>
          <p>PEGLIN TEXT GOES HERE You can find it on 
            <a href="https://store.steampowered.com/app/1296610/Peglin" target="_blank">Steam</a>!
          </p>
          <p>MAYBE SOME PICTURES HERE</p>
        </div>

        <div class="showcase-entry">
          <p><a href="https://vertigames.itch.io/auto-fire" target="_blank">Auto Fire</a>, by 
            <a href="https://twitter.com/autofiregame" target="_blank" rel="nofollow noopener noreferrer">Patrick Lipo</a>
          </p>
          <p>AUTOFIRE TEXT GOES HERE You can find it on 
            <a href="https://vertigames.itch.io/auto-fire" target="_blank">itch.io</a>!
          </p>
          <p>MAYBE SOME PICTURES HERE</p>
        </div>
      </div>

      You can exit to the [[north hall->northShowcaseHall]] or [[south hall->southShowcaseHall]]`,
    allowsMedia: true
  }
}
