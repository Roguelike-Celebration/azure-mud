export interface SlashCommand {
    type: string;
    description: string;
    invocations: string[];
    singleParameter: boolean;
}

const SlashCommand = (
  name: string,
  description: string,
  invocations: string[],
  singleParameter: boolean
): SlashCommand => { return { type: name, description: description, invocations: invocations, singleParameter: singleParameter } }

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
  SlashCommand(SlashCommandType.Move, 'Move from one room to another. You can also click on the link in the room description.', ['/go', '/move'], false),
  SlashCommand(SlashCommandType.Whisper, 'Whisper another user. You can also click directly on their name and select the whisper option.', ['/whisper'], false),
  SlashCommand(SlashCommandType.Shout, 'Sends a message to everybody at once - has a 5 minute cooldown. Do not abuse this!', ['/shout'], false),
  SlashCommand(SlashCommandType.Emote, 'Like a normal message, but in italics!', ['/emote', '/me'], false),
  SlashCommand(SlashCommandType.Dance, 'Bust a move!', ['/dance'], true),
  SlashCommand(SlashCommandType.ContactMod, 'Sends a message to the mod team. We will be in touch shortly afterwards.', ['/mod', '/mods', '/moderator', '/moderators'], false),
  SlashCommand(SlashCommandType.Look, 'View the profile of another user. You can also click on their name and select the Profile option.', ['/look'], false),
  SlashCommand(SlashCommandType.Interact, 'Interact with or get something in a room by referencing the name in the description - experiment as you explore!', ['/interact', '/get'], false)
]

export function matchingSlashCommand (cmd: string, arg: string | undefined): SlashCommand | 'SlashCommandArgumentExpected' | 'UnregisteredSlashCommand' {
  const found = SlashCommands.find((command) => command.invocations.find((inv) => cmd === inv))
  if (found === undefined) {
    return 'UnregisteredSlashCommand'
  }
  if (!found.singleParameter && arg === undefined) {
    return 'SlashCommandArgumentExpected'
  }
  return found
}
