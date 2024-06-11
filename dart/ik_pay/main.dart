import 'dart:convert';
import 'package:crypto/crypto.dart';
import 'package:http/http.dart' as http;
import 'models/payment_models.dart';

String generateSignature(String body, String endpoint, String secret) {
  final uri = Uri.parse(endpoint);
  final basePath = uri.path;
  if (basePath.isEmpty) {
    throw Exception('No basePath in url');
  }

  final sanitizedBody = "$basePath$body".replaceAllMapped(
      RegExp(r'[\\"\' '\u0000]'), (match) => '\\${match.group(0)}');

  final key = utf8.encode(secret);
  final bytes = utf8.encode(sanitizedBody);

  final hmacSha256 = Hmac(sha256, key);
  final digest = hmacSha256.convert(bytes);

  return digest.toString();
}

Future<PaymentResponse> createPayLink(PaymentRequest request) async {
  final apiUrl = "https://api.ikhokha.com/public-api/v1/api/payment";
  final appId = "Your App ID here";
  final appKey = "Your App Key here";
  final payload = jsonEncode(request.toJson());

  final signature = generateSignature(payload, apiUrl, appKey);

  final response = await http.post(
    Uri.parse(apiUrl),
    headers: {
      'Content-Type': 'application/json',
      'IK-APPID': appId,
      'IK-SIGN': signature,
    },
    body: payload,
  );

  if (response.statusCode != 200) {
    throw Exception('Failed to create paylink');
  }

  print(response.body);

  return PaymentResponse.fromJson(jsonDecode(response.body));
}

void main() async {
  final requestBody = PaymentRequest(
    entityID: 'RANDOM1234',
    externalEntityID: 'ENTITY1234',
    amount: 10000,
    currency: 'ZAR',
    requesterUrl: 'https://example.com/requester',
    mode: 'live',
    externalTransactionID: 'TRANS789111',
    urls: Urls(
      callbackUrl: 'https://example.com/callback',
      successPageUrl: 'https://example.com/success',
      failurePageUrl: 'https://example.com/failure',
      cancelUrl: 'https://example.com/cancel',
    ),
  );

  try {
    print('Creating paylink...');
    final response = await createPayLink(requestBody);
    print('Paylink created: ${response.paymentLink}');
  } catch (e) {
    print('Error creating paylink: $e');
  }
}
