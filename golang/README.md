## iK Pay API Examples


### /golang

The iK Pay API examples in Golang.

#### Requirements

- Go 1.16 or higher

#### Setup

- Create a `.env` file in the root of the project and add the following:

```env
IK_API_URL="https://api.ikhokha.com/public-api/v1/api/payment"
IK_APP_ID="Your APP ID"
IK_APP_SECRET="Your APP SECRET"
```

You can get your APP ID and APP SECRET from the [IK Dashboard](https://dashboard.ikhokha.com) in Integrations > iK Pay API.

#### Run

```bash
go run main.go
```

#### Payment Request Example

Please refer to the [iK Pay API documentation](https://developer.ikhokha.com/docs/ik-pay-api) for more information on the request body.

```go
requestBody := PaymentRequest{
		EntityID:              "MyEntityID1234",
		ExternalEntityID:      "MARTIANS1234",
		Amount:                10000,
		Currency:              "ZAR",
		RequesterUrl:          "https://example.com/requester",
		Mode:                  "live",
		ExternalTransactionID: "TRANS789111",
		Urls: Urls{
			CallBackUrl:    "https://example.com/callback",
			SuccessPageUrl: "https://example.com/success",
			FailurePageUrl: "https://example.com/failure",
			CancelUrl:      "https://example.com/cancel",
		},
	}
```
