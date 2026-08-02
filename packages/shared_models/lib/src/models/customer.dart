import 'user.dart';

/// A customer who books cleaning services.
class Customer extends User {
  const Customer({
    required super.id,
    required super.displayName,
    required super.email,
    this.defaultAddress,
  }) : super(role: UserRole.customer);

  final String? defaultAddress;
}
