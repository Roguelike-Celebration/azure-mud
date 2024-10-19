const { EmailClient } = require('@azure/communication-email')
require('dotenv').config()

// This code demonstrates how to fetch your connection string
// from an environment variable.
const connectionString = process.env.COMMUNICATION_SERVICES_CONNECTION_STRING
const emailClient = new EmailClient(connectionString)

async function sendEmail (to: string, url: string) {
  try {
    const message = {
      senderAddress: '<donotreply@xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx.azurecomm.net>',
      content: {
        subject: 'Log in to Roguelike Celebration',
        plainText: `You (or someone using your email address) has a requested to log in to the Roguelike Celebration social space! If this was you, click the link below to log in. If it wasn't you, you can ignore this email.\n\n${url}`
      },
      recipients: {
        to: [
          {
            address: to
          // displayName: "Customer Name",
          }
        ]
      }
    }

    const poller = await emailClient.beginSend(message)

    if (!poller.getOperationState().isStarted) {
      throw 'Poller was not started.'
    }

    let timeElapsed = 0
    while (!poller.isDone()) {
      poller.poll()
      console.log('Email send polling in progress')

      await new Promise(resolve => setTimeout(resolve, POLLER_WAIT_TIME * 1000))
      timeElapsed += 10

      if (timeElapsed > 18 * POLLER_WAIT_TIME) {
        throw 'Polling timed out.'
      }
    }

    if (poller.getResult().status === KnownEmailSendStatus.Succeeded) {
      console.log(`Successfully sent the email (operation id: ${poller.getResult().id})`)
    } else {
      throw poller.getResult().error
    }
  } catch (e) {
    console.log(e)
  }
}

export default sendEmail
