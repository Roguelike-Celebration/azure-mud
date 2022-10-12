export function sendToDiscord ({ message, username }) {
  const msg = {
    content: `${username}: ${message}`
  }
  const url = process.env.DISCORD_URL
  fetch(url, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(msg)
  })
}
