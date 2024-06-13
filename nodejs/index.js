import crypto from "crypto-js";
import url from "url";
import axios from "axios";

class PayLink {
  config = {
    apiEndPoint: "",
    applicationId: "",
    applicationKey: "",
  };

  constructor({ apiEndPoint, applicationId, applicationKey }) {
    this.config = {
      apiEndPoint,
      applicationId,
      applicationKey,
    };
    if (Object.values(this.config).some((value) => value === "")) {
      throw new Error("Please provide all required configuration values");
    }
  }

  /**
   * Creates a payment link
   * @param {Object} request - The paylink request object
   */
  async createPaylink(request) {
    const requestBody = JSON.stringify(request);

    const payloadToSign = this.createPayloadToSign(apiEndPoint, requestBody);
    const signature = crypto
      .HmacSHA256(payloadToSign, ApplicationKey.trim())
      .toString(crypto.enc.Hex);

    const response = await axios.post(`${apiEndPoint}`, request, {
      headers: {
        Accept: "application/json",
        "IK-APPID": ApplicationId.trim(),
        "IK-SIGN": signature.trim(),
      },
    });
    const { responseCode, paylinkUrl, paylinkID, externalTransactionID } =
      response.data;
    return {
      responseCode,
      paylinkUrl,
      paylinkID,
      externalTransactionID,
    };
  }

  createPayloadToSign(urlPath, body = "") {
    const parsedUrl = new url.parse(urlPath);
    const basePath = parsedUrl.path;

    if (!basePath) throw new Error("No basePath in url");
    const payload = basePath + body;
    return payload.replace(/[\\"']/g, "\\$&").replace(/\u0000/g, "\\0");
  }
}

const request = {
  entityID: "4",
  externalEntityID: "4",
  amount: 200,
  currency: "ZAR",
  requesterUrl: "https://example.com/requester",
  description: "Test Description 1",
  paymentReference: "4",
  mode: "live",
  externalTransactionID: "4",
  urls: {
    callbackUrl: "https://example.com/callback",
    successPageUrl: "https://example.com/success",
    failurePageUrl: "https://example.com/failure",
    cancelUrl: "https://example.com/cancel",
  },
};

const apiEndPoint = "https://api.ikhokha.com/public-api/v1/api/payment";
const ApplicationId = "Your Application Id Here";
const ApplicationKey = "Your Application Key Here";

const payLink = new PayLink({
  apiEndPoint,
  applicationId: ApplicationId,
  applicationKey: ApplicationKey,
});

payLink
  .createPaylink(request)
  .then((response) => {
    console.log(response);

    console.log("Paylink created successfully: ", response.paylinkUrl);
  })
  .catch((error) => {
    console.error("An error occurred: ", error);
  });
