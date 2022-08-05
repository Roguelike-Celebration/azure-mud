const request = require('request')
request.post({
  url: `https://${process.env.APP_NAME}.azurewebsites.net/api/clientDeployedWebhook`,
  headers: { 'content-type': 'application/json' },
  body: JSON.stringify({ key: process.env.TOKEN })
})
