import 'package:customer_app/domain/entities/cleaner.dart';

class CleanerModel extends Cleaner {
  const CleanerModel({
    required super.id,
    required super.name,
    required super.rating,
    required super.avatarUrl,
    required super.specialties,
  });

  factory CleanerModel.fromJson(Map<String, dynamic> json) {
    return CleanerModel(
      id: json['id'] as String,
      name: json['name'] as String,
      rating: (json['rating'] as num).toDouble(),
      avatarUrl: json['avatarUrl'] as String,
      specialties: List<String>.from(json['specialties'] as List<dynamic>),
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'id': id,
      'name': name,
      'rating': rating,
      'avatarUrl': avatarUrl,
      'specialties': specialties,
    };
  }
}
