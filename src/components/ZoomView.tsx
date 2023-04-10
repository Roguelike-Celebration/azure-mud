import React from "react";

import ZoomMtgEmbedded from "@zoomus/websdk/embedded";

function App() {
  const client = ZoomMtgEmbedded.createClient();

  // setup your signature endpoint here: https://github.com/zoom/meetingsdk-sample-signature-node.js
  var signatureEndpoint = "";
  // This Sample App has been updated to use SDK App type credentials https://marketplace.zoom.us/docs/guides/build/sdk-app
  var sdkKey = "";
  var meetingNumber = "123456789";
  var role = 0;
  var userName = "React";
  var userEmail = "";
  var passWord = "";
  // pass in the registrant's token if your meeting or webinar requires registration. More info here:
  // Meetings: https://marketplace.zoom.us/docs/sdk/native-sdks/web/component-view/meetings#join-registered
  // Webinars: https://marketplace.zoom.us/docs/sdk/native-sdks/web/component-view/webinars#join-registered
  var registrantToken = "";

  function getSignature(e) {
    e.preventDefault();

    fetch(signatureEndpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        meetingNumber: meetingNumber,
        role: role,
      }),
    })
      .then((res) => res.json())
      .then((response) => {
        startMeeting(response.signature);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  function startMeeting(signature) {
    let meetingSDKElement = document.getElementById("meetingSDKElement");

    client.init({
      debug: true,
      zoomAppRoot: meetingSDKElement,
      language: "en-US",
      customize: {
        meetingInfo: [
          "topic",
          "host",
          "mn",
          "pwd",
          "telPwd",
          "invite",
          "participant",
          "dc",
          "enctype",
        ],
        toolbar: {
          buttons: [
            {
              text: "Custom Button",
              className: "CustomButton",
              onClick: () => {
                console.log("custom button");
              },
            },
          ],
        },
      },
    });

    client.join({
      sdkKey: sdkKey,
      signature: signature,
      meetingNumber: meetingNumber,
      password: passWord,
      userName: userName,
      userEmail: userEmail,
      tk: registrantToken,
    });
  }

  return (
    <div>
      <div id="meetingSDKElement">
        {/* Zoom Meeting SDK Component View Rendered Here */}
      </div>

      <button onClick={getSignature}>Join Meeting</button>
    </div>
  );
}

export default App;
