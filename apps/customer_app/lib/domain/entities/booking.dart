import 'package:equatable/equatable.dart';

import 'package:customer_app/domain/entities/cleaner.dart';
import 'package:customer_app/domain/entities/service.dart';

class Booking extends Equatable {
  const Booking({
    required this.id,
    required this.userId,
    required this.service,
    required this.cleaner,
    required this.scheduledAt,
    required this.address,
    required this.status,
    required this.totalPrice,
  });

  final String id;
  final String userId;
  final Service service;
  final Cleaner cleaner;
  final DateTime scheduledAt;
  final String address;
  final String status;
  final double totalPrice;

  @override
  List<Object?> get props => <Object?>[
        id,
        userId,
        service,
        cleaner,
        scheduledAt,
        address,
        status,
        totalPrice,
      ];
}
