const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const PayLink = require("./paylink");

const app = express();

app.use(bodyParser.json());
app.use(cors());

const payLink = new PayLink();

app.post("/payment", async (req, res) => {
  const request = req.body;
  console.log(request);
  const response = await payLink.createPaylink(request);
  res.send(response);
});

app.get("/payment/:id", async (req, res) => {
  const paymentId = req.params.id;

  const response = await payLink.getStatusById(paymentId);
  res.send(response);
});

app.post("/payment/webhook/callback", (req, res) => {
  console.log("Received data from webhook ", req.originalUrl);
  console.log(req.body);
  res.status(200);
});

app.get("/payments/history", async (req, res) => {
  // history?startDate={startDate}&endDate={endDate}
  const startDate = req.query.startDate;
  const endDate = req.query.endDate;

  const response = await payLink.getPaymentHistory(startDate, endDate);
  res.send(response);
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
