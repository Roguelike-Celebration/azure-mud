interface DiscordMessageRequest {
  message: string
  username: string
}

export async function sendToDiscord ({ message, username }: DiscordMessageRequest): Promise<void> {
  const msg = {
    content: `${username}: ${message}`
  }

  const discordUrl = process.env.DISCORD_URL
  if (!discordUrl) {
    throw new Error('Cannot send message to Discord: env var DISCORD_URL is not set')
  }
  await fetch(discordUrl, {
    method: 'post',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(msg)
  })
}
