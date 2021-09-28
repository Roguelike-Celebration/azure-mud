import { AzureFunction, Context, HttpRequest } from '@azure/functions'
import firebase from 'firebase/app'
import 'firebase/auth'


// For some godforsaken reason, Firebase doesn't let you use the admin SDK to do this. No, seriously -see
// https://stackoverflow.com/questions/41882626 and https://stackoverflow.com/questions/44547671. Therefore, I've
// also included the same firebase version as we're using in the client on the server.
const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  var firebaseApp = undefined
  try {
    firebaseApp = firebase.app()
  } catch (e) {
    firebaseApp = firebase.initializeApp({
      apiKey: 'AIzaSyCzLa3eL2OrsPDWlgv32yAS9NBkX89K_mE'
    })
  }

  firebaseApp.auth().applyActionCode(req.params['oobCode']).then((resp) => {
    context.res = {
      status: 200,
      body: 'Your email has been verified. Go back to the app now please.'
    }
  }).catch((error) => {
    context.res = {
      status: 400,
      body: 'The code is invalid or expired. Please verify your email address again.'
    }
  });
}

export default httpTrigger
