import { EndpointFunction, LogFn } from "../endpoint";

const KJUR = require("jsrsasign");

const zoomToken: EndpointFunction = async (inputs: any, log: LogFn) => {
  const iat = Math.round(new Date().getTime() / 1000) - 30;
  const exp = iat + 60 * 60 * 2;

  const oHeader = { alg: "HS256", typ: "JWT" };

  const oPayload = {
    sdkKey: process.env.ZOOM_SDK_KEY,
    mn: inputs.meetingNumber,
    role: inputs.role,
    iat: iat,
    exp: exp,
    appKey: process.env.ZOOM_SDK_KEY,
    tokenExp: iat + 60 * 60 * 2,
  };

  const sHeader = JSON.stringify(oHeader);
  const sPayload = JSON.stringify(oPayload);
  const signature = KJUR.jws.JWS.sign(
    "HS256",
    sHeader,
    sPayload,
    process.env.ZOOM_SDK_SECRET
  );

  return {
    httpResponse: {
      status: 200,
      body: { signature },
    },
  };
};

export default zoomToken;
