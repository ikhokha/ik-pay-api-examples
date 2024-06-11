class PaymentRequest {
  final String entityID;
  final String externalEntityID;
  final int amount;
  final String currency;
  final String requesterUrl;
  final String mode;
  final String externalTransactionID;
  final Urls urls;

  PaymentRequest({
    required this.entityID,
    required this.externalEntityID,
    required this.amount,
    required this.currency,
    required this.requesterUrl,
    required this.mode,
    required this.externalTransactionID,
    required this.urls,
  });

  Map<String, dynamic> toJson() => {
        'entityID': entityID,
        'externalEntityID': externalEntityID,
        'amount': amount,
        'currency': currency,
        'requesterUrl': requesterUrl,
        'mode': mode,
        'externalTransactionID': externalTransactionID,
        'urls': urls.toJson(),
      };
}

class Urls {
  final String callbackUrl;
  final String successPageUrl;
  final String failurePageUrl;
  final String cancelUrl;

  Urls({
    required this.callbackUrl,
    required this.successPageUrl,
    required this.failurePageUrl,
    required this.cancelUrl,
  });

  Map<String, dynamic> toJson() => {
        'callbackUrl': callbackUrl,
        'successPageUrl': successPageUrl,
        'failurePageUrl': failurePageUrl,
        'cancelUrl': cancelUrl,
      };
}

class PaymentResponse {
  final String paylinkID;
  final String paymentLink;
  final String externalTransactionID;
  final String responseCode;

  PaymentResponse({
    required this.paylinkID,
    required this.paymentLink,
    required this.externalTransactionID,
    required this.responseCode,
  });

  factory PaymentResponse.fromJson(Map<String, dynamic> json) {
    return PaymentResponse(
      paylinkID: json['paylinkID'],
      paymentLink: json['paylinkUrl'],
      externalTransactionID: json['externalTransactionID'],
      responseCode: json['responseCode'],
    );
  }
}
