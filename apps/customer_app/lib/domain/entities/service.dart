import 'package:equatable/equatable.dart';

class Service extends Equatable {
  const Service({
    required this.id,
    required this.name,
    required this.description,
    required this.basePrice,
  });

  final String id;
  final String name;
  final String description;
  final double basePrice;

  @override
  List<Object?> get props => <Object?>[id, name, description, basePrice];
}
