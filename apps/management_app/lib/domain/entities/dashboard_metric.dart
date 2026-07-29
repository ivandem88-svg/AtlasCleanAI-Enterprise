import 'package:equatable/equatable.dart';

class DashboardMetric extends Equatable {
  const DashboardMetric({
    required this.title,
    required this.value,
    required this.delta,
  });

  final String title;
  final String value;
  final String delta;

  @override
  List<Object?> get props => <Object?>[title, value, delta];
}
