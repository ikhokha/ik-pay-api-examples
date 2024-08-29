const crypto = require("crypto-js");
const axios = require("axios");
const url = require("url");

const BASE_URL = "https://api.ikhokha.com/public-api/v1/api";
const APP_ID = "<YOUR_APP_ID>";
const APP_KEY = "<YOUR_APP_KEY>";

class PayLink {
  /**
   * Creates a payment link
   * @param {Object} request - The paylink request object
   */
  async createPaylink(request) {
    const requestBody = JSON.stringify(request);
    const endpoint = `${BASE_URL}/payment`;

    // Create signature
    const path = new url.parse(endpoint).path;
    const payload = (path + requestBody)
      .replace(/[\\"']/g, "\\$&")
      .replace(/\u0000/g, "\\0"); // Escape characters
    const signature = crypto
      .HmacSHA256(payload, APP_KEY.trim())
      .toString(crypto.enc.Hex);

    const response = await axios.post(endpoint, request, {
      headers: {
        "IK-APPID": APP_ID.trim(),
        "IK-SIGN": signature.trim(),
      },
    });
    return response.data;
  }

  /**
   * Get the status of a payment link by its ID
   * @param {string} paylinkID - The ID of the payment link
   */
  async getStatusById(paylinkID) {
    const endpoint = `${BASE_URL}/getStatus/${paylinkID}`;
    const path = new url.parse(endpoint).path;

    const signature = crypto
      .HmacSHA256(path, APP_KEY.trim())
      .toString(crypto.enc.Hex);

    const response = await axios.get(endpoint, {
      headers: {
        "IK-APPID": APP_ID,
        "IK-SIGN": signature,
      },
    });

    return response.data;
  }

  async getPaymentHistory(startDate, endDate) {
    const endpoint = `${BASE_URL}/payments/history`;
    const path = new url.parse(endpoint).path;
    const signature = crypto
      .HmacSHA256(path, APP_KEY.trim())
      .toString(crypto.enc.Hex);

    const response = await axios.get(
      `${endpoint}?startDate=${startDate}&endDate=${endDate}`,
      {
        headers: {
          "IK-APPID": APP_ID,
          "IK-SIGN": signature,
        },
      },
    );

    return response.data;
  }
}

module.exports = PayLink;
