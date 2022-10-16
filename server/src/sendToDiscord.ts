const request = require('request')

export function sendToDiscord ({ message, username }) {
  const msg = {
    content: `${username}: ${message}`
  }

  request.post({
    url: process.env.DISCORD_URL,
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(msg)
  })
}
