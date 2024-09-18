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

  return new Promise(async (resolve, reject) => {
    log('in promise ')
    const userId = await DB.getOrGenerateUserIdForEmail(email)
    log(userId)

    const secret = await DB.getOrGenerateTokenSecret()

    // For our purposes, it's fine as long as the token doesn't expire over the course of the weekend
    const oneDay = 24 * 3600 * 1000;
    const expiry = oneDay * 3

    const enp = require("easy-no-password")(secret, expiry)
    enp.createToken(userId, (err, token) => {
      console.log('creAted token for ', userId)
      if (err) {
        log("Token generation error: ", err);
        reject(err)
      } else {
        // TODO: Email
        log(`Email: '${email}', URL: http://localhost:1234?userId=${userId}&token=${token}`);
        resolve(token);
      }
    });
  }); 
}

export default sendMagicEmail
