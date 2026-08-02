import 'package:shared_models/shared_models.dart';
import 'package:test/test.dart';

void main() {
  test('a customer always has the customer role', () {
    const customer = Customer(
      id: 'customer-1',
      displayName: 'Alex Smith',
      email: 'alex@example.com',
    );

    expect(customer.role, UserRole.customer);
  });
}
