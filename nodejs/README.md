
### Nodejs (JavaScript) example

The iK Pay API examples in Nodejs.

#### Requirements

- Node.js 12 or higher ([Nodejs Download](https://nodejs.org/en/download/))

#### Setup

You can get your APP ID and APP SECRET from the [IK Dashboard](https://dashboard.ikhokha.com) in Integrations > iK Pay API.

#### Run

```bash
    npm install
```

```bash
    npm run start
```

#### Payment Request Example

Please refer to the [iK Pay API documentation](https://developer.ikhokha.com/docs/ik-pay-api) for more information on the request body.

```js
let requestBody = {
		EntityID:              "MyEntityID1234", // For your own use
		ExternalEntityID:      "MARTIANS1234", // For your own use
		Amount:                10000, // Amount in cents
		Currency:              "ZAR", // Currency code
		RequesterUrl:          "https://example.com/requester", // Your website URL
		Mode:                  "live", // live or test (only live will work for now)
		ExternalTransactionID: "TRANS789111", // For your own use
		Urls: Urls{
			CallBackUrl:    "https://example.com/callback", // The URL to send the payment response to
			SuccessPageUrl: "https://example.com/success", // The URL to redirect to after a successful payment
			FailurePageUrl: "https://example.com/failure", // The URL to redirect to after a failed payment
			CancelUrl:      "https://example.com/cancel", // The URL to redirect to after a cancelled payment
		},
	}
```
