export interface NoteWallData {
  roomWallDescription: string
  noteWallButton: string
  addNoteLinkText: string
  addNotePrompt: string
  noteWallDescription: string
}

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
  noteWallData?: NoteWallData

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
    description: 'A stage, confusingly decorated with Halloween skulls and streamers. There are a few dozen flimsy metal chairs you can sit in, plus some comfy couches in the back. You can leave to the [[kitchen]], the [[bar]], the [[lounge]], or clamber into the [[shipping container->shippingContainer]].<br/><br/><center id="iframes"><iframe width="560" height="315" src="https://player.twitch.tv/?channel=roguelike_con&parent=chat.roguelike.club" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe><iframe id="captions" width="560" height="100" src="https://www.streamtext.net/player/?event=RoguelikeCelebration&chat=false&header=false&footer=false&indicator=false&ff=Consolas&fgc=93a1a1" frameborder="0" allow="autoplay; encrypted-media;" allowfullscreen></iframe></center><br/><a href="stream.html" onClick="window.open(\'stream.html#\' + window.getComputedStyle(document.body).getPropertyValue(\'background-color\'), \'stream\', \'width=560,height=450\'); return false">Pop Out Stream</a><br/>',
    allowsMedia: true,
    hasNoteWall: true,
    noteWallData: {
      roomWallDescription: 'There is a whiteboard set up to the side with "SPEAKER QUESTIONS" written at the top. "Questions for speakers not questions from speakers!" is hastily scrawled below it.',
      noteWallButton: 'Write a question',
      addNoteLinkText: 'add a question',
      addNotePrompt: 'What would you like to ask?',
      noteWallDescription: 'Questions for the current speaker, ranked by upvotes.'
    }
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
      Here you can see Gesuido by Ryosuke Mihara, Project Earth by Michael Taylor, and WizardWarsIO by quantompotato.<br/><br/>

      <div id="north-showcase" class="showcase-container">
        <div id="gesuido-entry" class="showcase-entry" style="display: inline-flex;">
          <div id="gesuido-text">
            <p><a href="https://mihararyosuke.com/gesuido" target="_blank">Gesuido</a>, by 
              <a href="https://twitter.com/oinariman" target="_blank" rel="nofollow noopener noreferrer">Ryosuke Mihara</a>
            </p>
            <p>Gesuido is a Roguelike game for iPhone that's not too dissimilar in gameplay to the original Rogue, but it features early 
              Macintosh-style black and white tile graphics and cute illustrated magic cards. The game is still developing, but I’ve made a beta 
              version available for Roguelike Celebration 2020 attendees. Feedbacks are welcome. You can find it 
              <a href="https://www.google.com" target="_blank">[beta link will be added when available]</a>!
            </p>
          </div>
          <img src="images/gesuido/gesuido_ss01.png" alt="Gesuido screenshot 1" style="width: 30%; object-fit: scale-down;">
          <img src="images/gesuido/gesuido_ss02.png" alt="Gesuido screenshot 2" style="width: 30%; object-fit: scale-down;">
        </div>

        <div id="project-earth-entry" class="showcase-entry">
          <p><a href="https://axeforge.itch.io/project-earth" target="_blank">Project Earth</a>, by Michael Taylor</p>
          <p>Project Earth is tactical Roguelike where instead of finding your gear, you craft your gear! Instead enemies drop 
            materials when defeated which you use as materials for crafting. The type of materials used affects the kinds of 
            items you make. This opens up many different tactical options. Like all Roguelikes, it's meant to be brutal and you 
            will die a bunch of times. But when you die, what happens to the items you made? After all, they are still usable in 
            anyone's possession...
          </p>
          <p>Project Earth is currently in the early stages of development. This is a playable prototype for Windows (64-bit). 
            Currently, I'm looking for feedback on the following:
          </p>
          <ul>
            <li>Combat</li>
            <li>Crafting</li>
            <li>World progression</li>
          </ul>
          <p>Feel free to mention anything else as well! Thanks for trying out Project Earth!</p>
          <p>You can find the playable prototype <a href="https://axeforge.itch.io/project-earth" target="_blank">here</a> on 
            itch.io. Instructions on how to play are on the site.
          </p>
          <p>I can be contacted in the following ways:</p>
          <ul>
            <li>Discord: AxeForge #0707 I'm on the following discord servers as well:
              <ul>
                <li>roguelikes</li>
                <li>Tangledeep</li>
                <li>Dungeonfans Academy</li>
                <li>Auto Combat Zone</li>
              </ul>
            </li>
            <li>Leaving a comment on Project Earth's itch.io page.</li>
          </ul>
        </div>

        <div id="wizard-wars-io-entry" class="showcase-entry">
          <h3><a href="https://github.com/WizardWarsIO" target="_blank">WizardWars.IO</a>, by R. Riley Holmes & quantumpotato</h3>
          <strong>Rhythmic turnbased deathmatch!</strong>
          <div>
            <p>Multiplayer roguelike combat. Toss potions, zap wands, detonate bombs, dodge minotaurs and kill players to crown 
              the leaderboard. <a href="http://206.189.227.251:8000" target="_blank">Play it online!</a>
            </p>
            <p>Press a number 1-9 to select an item. Press F + Arrow Keys to zap a wand or throw a potion. Press A to equip 
              selected item. You can move and throw in 8 directions.
            </p>
          </div>
          <img src="images/wizard-wars-io/0.png" alt="wizard wars io 0" style="width: 23%; object-fit: scale-down; max-height: 340px">
          <img src="images/wizard-wars-io/1.png" alt="wizard wars io 1" style="width: 23%; object-fit: scale-down; max-height: 340px">
          <img src="images/wizard-wars-io/2.png" alt="wizard wars io 2" style="width: 23%; object-fit: scale-down; max-height: 340px">
          <img src="images/wizard-wars-io/3.png" alt="wizard wars io 3" style="width: 23%; object-fit: scale-down; max-height: 340px">
        </div>
      </div>


      You can exit to the [[west hall->westShowcaseHall]] or [[east hall->eastShowcaseHall]]`,
    allowsMedia: true
  },
  eastShowcaseHall: {
    id: 'eastShowcaseHall',
    displayName: 'East Showcase Hall',
    shortName: 'the east showcase hall',
    description: `
      A number of booths line the sides of the hall.<br/><br/>
      Here you can see Roundguard by Andrea Roberts, Nongunz: Doppelganger Edition by Mike Corrigan, and Cantrip by Joeri Bakker.<br/><br/>

      <div id="east-showcase" class="showcase-container">
        <div id="roundguard-entry" class="showcase-entry">
          <p><a href="https://store.steampowered.com/app/848030/Roundguard" target="_blank">Roundguard</a>, by 
            <a href="https://twitter.com/TanookiFruit" target="_blank" rel="nofollow noopener noreferrer">Andrea Roberts</a> <-- personal link
          </p>
          <p>PROMO TEXT GOES HERE You can find it on 
            <a href="https://store.steampowered.com/app/848030/Roundguard" target="_blank">Steam</a>!
          </p>
          <p>MAYBE SOME PICTURES HERE</p>
        </div>

        <div id="nongunz-entry" class="showcase-entry">
          <p><a href="https://store.steampowered.com/app/1304780/Nongunz_Doppelganger_Edition/" target="_blank">Nongunz: Doppelganger Edition</a>, by 
            <a href="https://twitter.com/digeratiDM" target="_blank" rel="nofollow noopener noreferrer">Mike Corrigan</a>
          </p>
          <p>Nongunz is a roguelite action-platformer described as “The Binding of Isaac meets Cookie Clicker.” Battle grotesque 
            creatures, kill quickly to maintain your combo meter, and rescue worshipers to become part of your idle army to buy 
            upgrades. You can find the demo on 
            <a href="https://store.steampowered.com/app/1304780/Nongunz_Doppelganger_Edition/" target="_blank">Steam</a>!
          </p>
          <img src="images/nongunz-de/NongunzDE_09_Scaled.png" alt="Nongunz DE 9" style="width: 32%;">
          <img src="images/nongunz-de/NongunzDE_011_Scaled.png" alt="Nongunz DE 11" style="width: 32%;">
          <img src="images/nongunz-de/NongunzDE_012_Scaled.png" alt="Nongunz DE 12" style="width: 32%;">
        </div>

        <div id="cantrip-entry" class="showcase-entry">
          <p><a href="https://bakkerjoeri.itch.io/cantrip" target="_blank">Cantrip</a>,
              by <a href="https://twitter.com/bakkerjoeri" target="_blank" rel="nofollow noopener noreferrer">Joeri Bakker</a>
          </p>
          <p>Battle your way through 9 enemies and draft from 40+ unique cards to build up your deck with powerful synergies
            in this card battler roguelite with a twist: Your hand is your health. Damage makes you discard cards,
            and if you take a hit while your hand is empty, it's game over.
          </p>
          <iframe src="https://itch.io/embed/381590?linkback=true&amp;dark=true" width="552" height="167" frameborder="0"><a href="https://bakkerjoeri.itch.io/cantrip" target="_blank">Cantrip by Joeri</a></iframe>
          <img src="images/cantrip/0.png" alt="The battle screen of Cantrip. The player's hand visible on the bottom. The opponent's hand is face down at the top. Both have a drawing pile and graveyard next to it." style="width: 49%;">
          <img src="images/cantrip/1.png" alt="The drafting screen of Cantrip. Three cards are lined up in the middle, waiting to be picked." style="width: 49%;">
      </div>
      </div>

      You can exit to the [[north hall->northShowcaseHall]] or [[south hall->southShowcaseHall]]`,
    allowsMedia: true
  },
  southShowcaseHall: {
    id: 'southShowcaseHall',
    displayName: 'South Showcase Hall',
    shortName: 'the south showcase hall',
    description: `
      A number of booths line the sides of the hall.<br/><br/>
      Here you can see Fuzz Force: Spook Squad by Alan Igle, Mech@mor Showdown by Seth Alter, Rift Wizard by Dylan White, and Happy Grumps by Glenn LaBarre.<br/><br/>

      <div id="south-showcase" class="showcase-container">
        <div id="fuzz-force-entry" class="showcase-entry">
          <p><a href="https://fuzzforce.itch.io/fuzz-force-spook-squad" target="_blank">Fuzz Force: Spook Squad</a>, by 
            <a href="https://twitter.com/FuzzForce" target="_blank" rel="nofollow noopener noreferrer">Alan Igle</a>
          </p>
          <p> Deckbuilding meets Dice in a quest to capture the ghoulish Polter Prince. Join the Spook Squad and upgrade their 
            Dice-powered weapons to give those ghosts something to be scared of! You can find a demo on 
            <a href="https://fuzzforce.itch.io/fuzz-force-spook-squad" target="_blank">itch.io</a>!
          </p>
          <img src="images/fuzz-force/Finn_Dice_Web.jpg" alt="Finn_Dice_Web" style="width: 49%;">
          <img src="images/fuzz-force/ForestLevel_Web.jpg" alt="ForestLevel_Web" style="width: 49%;">
          <img src="images/fuzz-force/DiceSwap_Web.jpg" alt="DiceSwap_Web" style="width: 49%;">
          <img src="images/fuzz-force/FerretyShop_Dot_Web.jpg" alt="ForretyShop_Dot_Web" style="width: 49%;">
        </div>

        <div id="mech@mor-showdown-entry" class="showcase-entry">
          <p><a href="https://subalterngames.itch.io/mechamor-showdown" target="_blank">Mech@mor Showdown</a>, by 
            <a href="https://twitter.com/subalterngames" target="_blank" rel="nofollow noopener noreferrer">Seth Alter</a>
          </p>
          <p>Mech@mor showdown is an ASCII roguelike about your relationships with your mech and with your opponents. Build 
            trust between you and your mecha. Fight your foes. Flirt with your rivals. Taunt your lovers. Swap out parts for 
            better parts. Save Planet Yendor for the regime of the Kyriarch.
          </p>
          <p> Pre-release available at <a href="https://subalterngames.itch.io/mechamor-showdown" target="_blank">itch.io</a>!</p>
          <img src="images/mech@mor-showdown/0.png" alt="Mech@amor Showdown 0" style="width: 49%;">
          <img src="images/mech@mor-showdown/1.png" alt="Mech@amor Showdown 1" style="width: 49%;">
          <img src="images/mech@mor-showdown/2.png" alt="Mech@amor Showdown 2" style="width: 49%;">
          <img src="images/mech@mor-showdown/3.png" alt="Mech@amor Showdown 3" style="width: 49%;">
        </div>

        <div id="rift-wizard-entry" class="showcase-entry">
          <p><a href="https://store.steampowered.com/app/1271280/Rift_Wizard" target="_blank">Rift Wizard</a>, by
            <a href="https://twitter.com/GameDevDylanW" target="_blank" rel="nofollow noopener noreferrer">Dylan White</a>
          </p>
          <p>Rift Wizard is a tactical spellcasting roguelike. The game emphasizes combat and character builds. The character system allows the 
            player extreme freedom, with many possible synergies and combos to be discovered and exploited. Levels are compact, fitting entirely 
            on one screen, allowing the player to fully plan out a clever strategy for each battle. Diverse enemies, high impact random loot, and 
            procedurally generated battlefields ensure that each run is a unique strategic challenge.
          </p>
          <img src="images/rift-wizard/ss_16.png" alt="Rift Wizard screenshot 16" style="width: 49%; height: 150px; object-fit: none; object-position:center;">
          <img src="images/rift-wizard/ss_17.png" alt="Rift Wizard screenshot 17" style="width: 49%; height: 150px; object-fit: none; object-position:center;">
          <div style="margin: 0 auto; width: fit-content;">
            <iframe src="https://store.steampowered.com/widget/1271280/" frameborder="0" width="646" height="190"></iframe>
          </div>
        </div>

        <div id="happy-grumps-entry" class="showcase-entry">
          <div style="margin: auto; width: 50%; height: 200px;">
            <div style="display: inline-flex; margin: auto;">
              <a href="https://store.steampowered.com/app/1109170/Happy_Grumps rel="nofollow noopener noreferrer"" target="_blank">
                <img src="images/happy-grumps/logo.png" alt="Happy Grumps Logo" style="max-height: 200px;">
              </a>
              <p style="margin: auto;">by 
                <a href="https://twitter.com/HappyGrumps" target="_blank" rel="nofollow noopener noreferrer">Glenn LaBarre</a>
              </p>
            </div>
          </div>
          <p>Happy Grumps is a love letter to classic roguelike adventures with a twist. Instead of trying to steal treasure or 
            fight monsters, you are on a quest to spread happiness to a grumpy world. You can find it on 
            <a href="https://store.steampowered.com/app/1109170/Happy_Grumps rel="nofollow noopener noreferrer"" target="_blank">Steam</a>!
          </p>
          <img src="images/happy-grumps/0.png" alt="Happy Grumps 0" style="width: 49%;">
          <img src="images/happy-grumps/1.png" alt="Happy Grumps 1" style="width: 49%;">
        </div>
      </div>

      You can exit to the [[west hall->westShowcaseHall]] or [[east hall->eastShowcaseHall]]`,
    allowsMedia: true
  },
  westShowcaseHall: {
    id: 'westShowcaseHall',
    displayName: 'West Showcase Hall',
    shortName: 'the west showcase hall',
    description: `
      A number of booths line the sides of the hall.<br/><br/>
      Here you can see Computer Dungeon Slash: ZZT by KKairos, Peglin by Red Nexus Games, and AutoFire by Patrick Lipo.<br/><br/>

      <div class="showcase-container">
        <div id="cdslash-entry" class="showcase-entry">
          <p><a href="https://kkairos.itch.io/cdslash" target="_blank">Computer Dungeon Slash: ZZT</a>, by 
            <a href="https://www.kaikairos.dev" target="_blank" rel="nofollow noopener noreferrer">KKairos</a>
          </p>
          <p>Computer Dungeon Slash: ZZT is a "dungeon crawler" written for the 1991 game-creation system ZZT featuring classic "ZZT-style" action, 
            dynamic procedural level generation, and a comedic cast of characters to rescue. You can find it on 
            <a href="https://kkairos.itch.io/cdslash" target="_blank">itch.io</a>!
          </p>
          <img src="images/cdszzt/cdszzt-title.png" alt="The Computer Dungeon Slash: ZZT title screen" style="max-width: 32%;">
          <img src="images/cdszzt/cdszzt-town.png" alt="The town area of Computer Dungeon Slash: ZZT" style="max-width: 32%;">
          <img src="images/cdszzt/cdszzt-montage.png" alt="Several different 'limited viewport' levels of Computer Dungeon Slash: ZZT" style="max-width: 32%;">
        </div>

        <div id="peglin-entry" class="showcase-entry">
          <p><a href="https://store.steampowered.com/app/1296610/Peglin" target="_blank">Peglin</a>, by 
            <a href="https://twitter.com/rednexusgames" target="_blank" rel="nofollow noopener noreferrer">Red Nexus Games</a>
          </p>
          <p>Peglin is a Pachinko Roguelike: Fight enemies by collecting special orbs and popping pegs to deal damage. Acquire 
            special relics that radically change the stakes and ensure no two runs are the same. Aim carefully to survive in 
            this unique turn-based RPG! You can find it on 
            <a href="https://store.steampowered.com/app/1296610/Peglin" target="_blank">Steam</a>!
          </p>
          <div style="width: 100%">
            <video class="showcase-video" controls style="margin: auto; width: 420; height: 240;">
                <source src="images/peglin/peglin_video.mp4" type="video/mp4">
                <source src="movie.ogg" type="video/ogg">
              Your browser does not support the video tag.
            </video>
          </div>
          <img src="images/peglin/peglin1.png" alt="Peglin 1" style="max-width: 32%;">
          <img src="images/peglin/peglin2.png" alt="Peglin 2" style="max-width: 32%;">
          <img src="images/peglin/peglin3.png" alt="Peglin 3" style="max-width: 32%;">
        </div>

        <div id="auto-fire-entry" class="showcase-entry">
          <p><a href="https://vertigames.itch.io/auto-fire" target="_blank">Auto Fire</a>, by 
            <a href="https://twitter.com/autofiregame" target="_blank" rel="nofollow noopener noreferrer">Patrick Lipo</a>
          </p>
          <p><strong>Auto Fire</strong> combines classic car combat with a Tactical RPG that roams across outlaw lands in a world 
            where drivers are worshiped like celebrities. Salvage equipment and cars and build the sexiest, deadliest ride. 
            Work for a corp, haul cargo, fight in the combat arena or become a savior. The choice is yours. You can play the 
            demo at <a href="https://vertigames.itch.io/auto-fire" target="_blank">itch.io</a>, and wishlist it on 
            <a href="https://store.steampowered.com/app/1147880/Auto_Fire/">Steam</a>!
          </p>
          <img src="images/auto-fire/AutoFireDesertTarget1280.jpg" alt="Auto Fire Desert Target" style="max-width: 49%;">
          <img src="images/auto-fire/AutoFireGarage1280.jpg" alt="Auto Fire Garage" style="max-width: 49%;">
          <img src="images/auto-fire/AutoFireOverworld1280.jpg" alt="Auto Fire Overworld" style="max-width: 49%;">
          <img src="images/auto-fire/AutoFireRuinsCars1280.jpg" alt="Auto Fire RuinsCars" style="max-width: 49%;">
        </div>
      </div>

      You can exit to the [[north hall->northShowcaseHall]] or [[south hall->southShowcaseHall]]`,
    allowsMedia: true
  }
}
