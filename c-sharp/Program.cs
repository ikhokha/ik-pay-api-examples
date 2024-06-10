using System.Text;
using Newtonsoft.Json;
using System.Security.Cryptography;
using System.Text.RegularExpressions;

class PayLinkResponse
{
    public string paylinkID { get; set; }
    public string paylinkUrl { get; set; }
    public string externalTransactionID { get; set; }
    public string responseCode { get; set; }
}
class Program
{
    const string apiEndPoint = "https://api.ikhokha.com/public-api/v1/api/payment";
    const string ApplicationId = "Your Application Id";
    const string ApplicationKey = "Your Application Key";

    static async Task Main()
    {
        try
        {
            var paymentLink = await CreatePaymentLink();
            if (paymentLink != null)
            {
                Console.WriteLine("Payment Link: " + paymentLink?.paylinkUrl);
            }
        }
        catch (Exception ex)
        {
            Console.Error.WriteLine("Error occurred: " + ex.Message);
        }
    }

    // Create Payment Link
    // Note  - The amount field has to be in CENTS
    public static async Task<PayLinkResponse> CreatePaymentLink()
    {
        var request = new
        {
            entityID = Guid.NewGuid().ToString(),
            externalEntityID = Guid.NewGuid().ToString(),
            amount = 200,   // Note amount is in cents 
            currency = "ZAR",
            requesterUrl = "https://example.com/success",
            description = "Test Description 1",
            paymentReference = Guid.NewGuid().ToString(),
            mode = "live",
            externalTransactionID = Guid.NewGuid().ToString(),
            urls = new
            {
                callbackUrl = "https://example.com/success",
                successPageUrl = "https://example.com/success",
                failurePageUrl = "https://example.com/failure",
                cancelUrl = "https://example.com/cancel",
            },
        };

        string requestBodyStr = JsonConvert.SerializeObject(request);

        var requestBody = JsonConvert.SerializeObject(request);

        if (requestBody.StartsWith("'") && requestBody.EndsWith("'"))
        {
            requestBody = requestBody.Substring(1, requestBody.Length - 1);
        }

        string payloadToSign = CreatePayloadToSign(apiEndPoint, requestBodyStr);
        string signature = SignPayload(payloadToSign, ApplicationKey);

        var requestContent = new StringContent(requestBodyStr, Encoding.UTF8, "application/json");

        using (HttpClient client = new HttpClient())
        {
            client.DefaultRequestHeaders.Accept.Add(new System.Net.Http.Headers.MediaTypeWithQualityHeaderValue("application/json"));
            client.DefaultRequestHeaders.Add("IK-APPID", ApplicationId);
            client.DefaultRequestHeaders.Add("IK-SIGN", signature);

            var response = await client.PostAsync(apiEndPoint, requestContent);
            if (response.IsSuccessStatusCode)
            {
                var responseBody = await response.Content.ReadAsStringAsync();

                var paylink = new PayLinkResponse();

                if (responseBody != null)
                {
                    paylink = JsonConvert.DeserializeObject<PayLinkResponse>(responseBody);
                }


                return paylink;
            }
            else
            {
                throw new Exception($"Failed to send request: {response.StatusCode}");
            }
        }
    }

    //Main changes start from here
    static string CreatePayloadToSign(string url, string body)
    {
        var uri = new Uri(url);
        //Get base path from url
        string basePath = uri.AbsolutePath;
        // Directly use the body string that was already JSON serialized.
        string fullPayload = basePath + body;
        return JsStringEscape(fullPayload);
    }
    static string JsStringEscape(string str)
    {
        // Correctly escaping backslashes, quotes, and other necessary characters.
        str = str.Replace("\\", "\\\\"); // Escape backslashes first to prevent double escaping
        str = str.Replace("\"", "\\\""); // Escape double quotes
        str = Regex.Replace(str, "\u0000", "\\0"); // Null character if necessary
        return str;
    }

    static string SignPayload(string payload, string key)
    {
        //Code for generating signature 
        using (var hmacsha256 = new HMACSHA256(Encoding.UTF8.GetBytes(key)))
        {
            byte[] hashmessage = hmacsha256.ComputeHash(Encoding.UTF8.GetBytes(payload));
            return BitConverter.ToString(hashmessage).Replace("-", string.Empty).ToLower();
        }
    }
}
