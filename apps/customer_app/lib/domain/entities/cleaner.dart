import 'package:equatable/equatable.dart';

class Cleaner extends Equatable {
  const Cleaner({
    required this.id,
    required this.name,
    required this.rating,
    required this.avatarUrl,
    required this.specialties,
  });

  final String id;
  final String name;
  final double rating;
  final String avatarUrl;
  final List<String> specialties;

  @override
  List<Object?> get props => <Object?>[id, name, rating, avatarUrl, specialties];
}
