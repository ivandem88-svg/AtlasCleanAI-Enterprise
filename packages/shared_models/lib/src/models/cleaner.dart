import 'user.dart';

/// A cleaning professional available for assignments.
class Cleaner extends User {
  const Cleaner({
    required super.id,
    required super.displayName,
    required super.email,
    this.rating,
  }) : super(role: UserRole.cleaner);

  final double? rating;
}
