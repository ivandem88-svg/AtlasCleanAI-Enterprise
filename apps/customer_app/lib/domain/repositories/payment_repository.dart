abstract class PaymentRepository {
  Future<bool> processPayment({
    required String bookingId,
    required int amountInCents,
    required String currency,
  });
}
