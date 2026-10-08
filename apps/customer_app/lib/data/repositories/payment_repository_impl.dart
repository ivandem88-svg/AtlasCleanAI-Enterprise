import 'package:customer_app/data/datasources/remote/payment_remote_datasource.dart';
import 'package:customer_app/domain/repositories/payment_repository.dart';

class PaymentRepositoryImpl implements PaymentRepository {
  PaymentRepositoryImpl(this._remoteDatasource);

  final PaymentRemoteDatasource _remoteDatasource;

  @override
  Future<bool> processPayment({
    required String bookingId,
    required int amountInCents,
    required String currency,
  }) {
    return _remoteDatasource.processPayment(
      bookingId: bookingId,
      amountInCents: amountInCents,
      currency: currency,
    );
  }
}
