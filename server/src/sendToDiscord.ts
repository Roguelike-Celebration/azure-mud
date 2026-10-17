import fetch from 'node-fetch'

interface DiscordMessageRequest {
  message: string
  username: string
}

export async function sendToDiscord ({ message, username }: DiscordMessageRequest) {
  const msg = {
    content: `${username}: ${message}`
  }

  await fetch(process.env.DISCORD_URL, {
    method: 'post',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(msg)
  })
}
