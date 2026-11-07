interface SlashCommand {
    type: string;
    description: string;
    invocations: string[];
    noArgs: boolean;
    usageMsgArgs: string;
}

const SlashCommand = (
  name: string,
  description: string,
  invocations: string[],
  noArgs: boolean,
  usageMsgArgs: string = ''
): SlashCommand => { return { type: name, description: description, invocations: invocations, noArgs: noArgs, usageMsgArgs: usageMsgArgs } }

export enum SlashCommandType {
  Help = 'HELP',
  Move = 'MOVE',
  Whisper = 'WHISPER',
  Shout = 'SHOUT',
  Emote = 'EMOTE',
  Dance = 'DANCE',
  Interact = 'INTERACT',
  ContactMod = 'CONTACT_MOD',
  Look = 'LOOK'
}

export const SlashCommands: SlashCommand[] = [
  SlashCommand(SlashCommandType.Help, 'Lists the available commands', ['/help'], true),
  SlashCommand(SlashCommandType.Move, 'Move from one room to another. You can also click on the link in the room description.', ['/go', '/move'], false, '<room>'),
  SlashCommand(SlashCommandType.Whisper, 'Whisper another user. You can also click directly on their name and select the whisper option.', ['/whisper'], false, '<user> <message>'),
  SlashCommand(SlashCommandType.Shout, 'Sends a message to everybody at once - has a 5 minute cooldown. Do not abuse this!', ['/shout'], false, '<message>'),
  SlashCommand(SlashCommandType.Emote, 'Like a normal message, but in italics!', ['/emote', '/me'], false, '<action>'),
  SlashCommand(SlashCommandType.Dance, 'Bust a move!', ['/dance'], true),
  SlashCommand(SlashCommandType.ContactMod, 'Sends a message to the mod team. We will be in touch shortly afterwards.', ['/mod', '/mods', '/moderator', '/moderators'], false, '<message>'),
  SlashCommand(SlashCommandType.Look, 'View the profile of another user. You can also click on their name and select the Profile option.', ['/look'], false, '<user>'),
  SlashCommand(SlashCommandType.Interact, 'Interact with or get something in a room by referencing the name in the description - experiment as you explore!', ['/interact', '/get'], false, '<thing>')
]

/** Get the command a message invokes. Commands that take args also match an invocation with no args
 *  so a usage hint can be shown. */
export function matchingSlashCommand (message: String): SlashCommand | undefined {
  return SlashCommands.find((command) =>
    command.invocations.find((invocation) =>
      message === invocation || message.startsWith(invocation + ' ')
    )
  )
}
