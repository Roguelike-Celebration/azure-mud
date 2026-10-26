interface DiscordMessageRequest {
  message: string
  username: string
}

export async function sendToDiscord ({ message, username }: DiscordMessageRequest): Promise<void> {
  const msg = {
    content: `${username}: ${message}`
  }

  await fetch(process.env.DISCORD_URL, {
    method: 'post',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(msg)
  })
}
