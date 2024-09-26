import authenticate from "../src/authenticate"

module.exports = async function (context, req, connection) {
  // This is simple enough (and Azure-specific) that we don't use full-on AzureWrap
  // but we do need to make sure you're authenticated
  const result = await authenticate(req.headers, context.log)
  if (result.error) {
    context.res = result.error
  } else if (result.user) {
    // This will only be the case if there's a valid auth token that matches the userId
    context.res = { body: connection }
    context.done()
  } else { // Unknown??
    context.res = {
      status: 500,
      body: "An unknown error has occurred"
    }
  }
}
