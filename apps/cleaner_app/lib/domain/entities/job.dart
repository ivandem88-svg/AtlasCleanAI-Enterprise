import 'package:equatable/equatable.dart';

class Job extends Equatable {
  const Job({
    required this.id,
    required this.customerName,
    required this.serviceName,
    required this.address,
    required this.scheduledAt,
    required this.status,
    required this.payout,
  });

  final String id;
  final String customerName;
  final String serviceName;
  final String address;
  final DateTime scheduledAt;
  final String status;
  final double payout;

  @override
  List<Object?> get props => <Object?>[
        id,
        customerName,
        serviceName,
        address,
        scheduledAt,
        status,
        payout,
      ];
}
