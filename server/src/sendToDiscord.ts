import fetch from 'node-fetch'

export async function sendToDiscord ({ message, username }) {
  const msg = {
    content: `${username}: ${message}`
  }

  await fetch(process.env.DISCORD_URL, {
    method: 'post',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(msg)
  })
}
