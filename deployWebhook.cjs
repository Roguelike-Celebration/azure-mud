/* Calls our webhook to notify the system that a new frontend release has been deployed. */

fetch(`https://${process.env.APP_NAME}.azurewebsites.net/api/clientDeployedWebhook`, {
  method: 'POST',
  headers: { 'content-type': 'application/json' },
  body: JSON.stringify({ key: process.env.TOKEN })
}).then((resp) => {
  if (resp.ok) {
    console.log(`clientDeployedWebhook: Success: HTTP ${resp.status}`)
  } else {
    console.log(`::warning::clientDeployedWebhook: Failure: HTTP ${resp.status} ${resp.statusText}`)
  }
})
