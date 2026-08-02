/// The lifecycle state of a cleaning booking.
enum BookingStatus {
  draft,
  requested,
  confirmed,
  inProgress,
  completed,
  cancelled,
}

/// A scheduled cleaning appointment.
class Booking {
  const Booking({
    required this.id,
    required this.customerId,
    required this.serviceId,
    required this.startsAt,
    required this.status,
    this.cleanerId,
  });

  final String id;
  final String customerId;
  final String serviceId;
  final DateTime startsAt;
  final BookingStatus status;
  final String? cleanerId;
}
