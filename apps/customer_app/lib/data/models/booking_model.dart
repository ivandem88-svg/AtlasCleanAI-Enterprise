import 'package:customer_app/data/models/cleaner_model.dart';
import 'package:customer_app/data/models/service_model.dart';
import 'package:customer_app/domain/entities/booking.dart';

class BookingModel extends Booking {
  const BookingModel({
    required super.id,
    required super.userId,
    required super.service,
    required super.cleaner,
    required super.scheduledAt,
    required super.address,
    required super.status,
    required super.totalPrice,
  });

  factory BookingModel.fromJson(Map<String, dynamic> json) {
    return BookingModel(
      id: json['id'] as String,
      userId: json['userId'] as String,
      service: ServiceModel.fromJson(json['service'] as Map<String, dynamic>),
      cleaner: CleanerModel.fromJson(json['cleaner'] as Map<String, dynamic>),
      scheduledAt: DateTime.parse(json['scheduledAt'] as String),
      address: json['address'] as String,
      status: json['status'] as String,
      totalPrice: (json['totalPrice'] as num).toDouble(),
    );
  }

  Map<String, dynamic> toJson() {
    final ServiceModel serviceModel = service is ServiceModel
        ? service as ServiceModel
        : ServiceModel(
            id: service.id,
            name: service.name,
            description: service.description,
            basePrice: service.basePrice,
          );
    final CleanerModel cleanerModel = cleaner is CleanerModel
        ? cleaner as CleanerModel
        : CleanerModel(
            id: cleaner.id,
            name: cleaner.name,
            rating: cleaner.rating,
            avatarUrl: cleaner.avatarUrl,
            specialties: cleaner.specialties,
          );

    return <String, dynamic>{
      'id': id,
      'userId': userId,
      'service': serviceModel.toJson(),
      'cleaner': cleanerModel.toJson(),
      'scheduledAt': scheduledAt.toIso8601String(),
      'address': address,
      'status': status,
      'totalPrice': totalPrice,
    };
  }

  factory BookingModel.fromEntity(Booking booking) {
    return BookingModel(
      id: booking.id,
      userId: booking.userId,
      service: ServiceModel(
        id: booking.service.id,
        name: booking.service.name,
        description: booking.service.description,
        basePrice: booking.service.basePrice,
      ),
      cleaner: CleanerModel(
        id: booking.cleaner.id,
        name: booking.cleaner.name,
        rating: booking.cleaner.rating,
        avatarUrl: booking.cleaner.avatarUrl,
        specialties: booking.cleaner.specialties,
      ),
      scheduledAt: booking.scheduledAt,
      address: booking.address,
      status: booking.status,
      totalPrice: booking.totalPrice,
    );
  }
}
