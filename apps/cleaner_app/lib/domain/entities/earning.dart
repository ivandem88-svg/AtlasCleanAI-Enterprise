import 'package:equatable/equatable.dart';

class Earning extends Equatable {
  const Earning({
    required this.periodLabel,
    required this.total,
    required this.completedJobs,
  });

  final String periodLabel;
  final double total;
  final int completedJobs;

  @override
  List<Object?> get props => <Object?>[periodLabel, total, completedJobs];
}
