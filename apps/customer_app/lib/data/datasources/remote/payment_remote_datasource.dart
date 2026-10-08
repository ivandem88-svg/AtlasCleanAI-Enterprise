import 'dart:async';

class PaymentRemoteDatasource {
  const PaymentRemoteDatasource();

  Future<bool> processPayment({
    required String bookingId,
    required int amountInCents,
    required String currency,
  }) async {
    await Future<void>.delayed(const Duration(milliseconds: 500));
    return bookingId.isNotEmpty && amountInCents > 0 && currency.isNotEmpty;
  }
}
