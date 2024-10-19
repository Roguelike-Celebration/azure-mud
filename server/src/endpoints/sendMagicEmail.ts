import { EndpointFunction, LogFn } from '../endpoint'
import DB from '../redis'

const sendMagicEmail: EndpointFunction = async (inputs: any, log: LogFn) => {
  const email = inputs.email
  if (!email) {
    return {
      httpResponse: {
        status: 400,
        body: "You didn't include an email address!"
      }
    }
  }
  log('Sending magic email to', email)

  const userId = await DB.getOrGenerateUserIdForEmail(email)
  log(userId)

  const secret = await DB.getOrGenerateTokenSecret()

  return new Promise((resolve, reject) => {
    log('in promise ')

    // For our purposes, it's fine as long as the token doesn't expire over the course of the weekend
    const oneDay = 24 * 3600 * 1000
    const expiry = oneDay * 3

    const enp = require('easy-no-password')(secret, expiry)
    enp.createToken(userId, (err, token) => {
      console.log('created token for ', userId)
      const url = `${process.env.ClientHostname}?userId=${userId}&token=${token}`
      if (err) {
        log('Token generation error: ', err)
        reject(err)
      } else {
        log(`Email: '${email}', URL: ${url}`)

        if (process.env.NODE_ENV === 'development') {
          console.log('development')
          resolve({
            httpResponse: { status: 200, body: url }
          })
        } else {
          resolve({
            httpResponse: { status: 202 }
          })
        }

        // TODO: Email
      }
    })
  })
}

export default sendMagicEmail
