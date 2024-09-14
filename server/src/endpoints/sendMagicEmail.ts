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

  return new Promise((resolve, reject) => {
    const userId = DB.getOrGenerateUserIdForEmail(email)
    const enp = require("easy-no-password")(DB.getOrGenerateTokenSecret())
    enp.createToken(userId, (err, token) => {
      if (err) {
        log("Token generation error: ", err);
        reject(err)
      } else {
        // TODO: Email
        log(`Email: '${email}', userId: '${userId}', token: '${token}'`);
        resolve(token);
      }
    });
  }); 
}

export default sendMagicEmail
