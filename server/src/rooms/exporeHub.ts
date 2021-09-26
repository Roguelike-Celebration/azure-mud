export const exploreHub = {
	id: 'exploreHub',
	displayName: 'Verdant Passages',
	shortName: 'green passageways',
	description: `Something about digging into a lush world. Avoid feeling like you're colonizing it, though. You can go back to the central [[hall]], or into the [[temple]].` ,
	hasNoteWall: true,
	noteWallData: {
		roomWallDescription: `A mage's tome rests on a pillar, labeled "True Facts about Roguelikes 2021".`,
		noteWallLinkText: `??`,
		addNoteLinkText: `??`,
		addNotePrompt: `??`,
		noteWallDescription: `??`
	}
}
	
export const temple = {
	id: 'temple',
	displayName: 'Temple of Transmutations',
	shortName: 'the temple',
	description: `Most of the priests of the temple are busy crafting potions - you recognize the crates they're filling as matching the ones from the bar. There are three areas available though: [[Light]], [[Libations]], and [[Quest]].`
}
// Light should lead to the equivalent of RainbowGate (/src/components/feature), not sure how to extract that from Travis' old dungeon. Libations leads to learning about the classes of emoji available; Quest discusses The Quest (for fancier emoji).

export const lights = {
	id: 'lights',
	displayName: 'Hall of Lights',
	shortName: 'the lights',
	description: `Two platforms, one with a column of ever-shifting sparkles, one seemingly perpetually in shadow.`
}

export const quest = {
	id: 'quest',
	displayName: 'Quest for the Whatevers',
	shortName: 'the quest giver',
	description: `Oh, I'm so glad you're here! We're on a search for <strong>four items</strong> scattered throughout this strange space. If you find them all, bring them back here and I will be able to show you our greatest secret.`
}