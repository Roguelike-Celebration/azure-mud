require('dotenv').config()
var postmark = require("postmark");
var serverToken = process.env.POSTMARK_SERVER_TOKEN;


async function sendEmail (to: string, url: string) {
  var client = new postmark.ServerClient(serverToken);

  const result = await client.sendEmailWithTemplate({
      "TemplateId": 37710099,
      "TemplateModel": { url },
      "From": "passwordbot@roguelike.club",
      "To": to,
  });
  console.log(result)
}

export default sendEmail
