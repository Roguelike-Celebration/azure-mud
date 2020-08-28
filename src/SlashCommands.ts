interface SlashCommand {
    name: string;
    description: string;
    invocations: string[];
}

const SlashCommand = (
  name: string,
  description: string,
  invocations: string[]
): SlashCommand => { return { name: name, description: description, invocations: invocations } }

export const SlashCommands: SlashCommand[] = [
  SlashCommand('move', 'Move from one room to another. You can also click on the link in the room description.', ['/go', '/move']),
  SlashCommand('whisper', 'Whisper another user. You can also click directly on their name and select the whisper option.', ['/whisper']),
  SlashCommand('shout', 'Sends a message to everybody at once - has a 5 minute cooldown. Do not abuse this!', ['/shout']),
  SlashCommand('emote', 'Like a normal message, but in italics!', ['/emote', '/me']),
  SlashCommand('contact a moderator', 'Sends a message to the mod team. We will be in touch shortly afterwards.', ['/mod', '/mods', '/moderator', '/moderators']),
  SlashCommand('look', 'View the profile of another user. You can also click on their name and select the Profile option.', ['/look'])
]

export function matchingSlashCommand (message: String): SlashCommand | undefined {
  // Tacking on a required whitespace works only because we have no one-parameter commands so far!
  return SlashCommands.find((c) => c.invocations.find((i) => message.startsWith(i + ' ')))
}
