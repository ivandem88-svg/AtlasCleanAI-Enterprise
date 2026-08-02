import 'package:equatable/equatable.dart';

class Report extends Equatable {
  const Report({
    required this.name,
    required this.generatedAt,
    required this.status,
  });

  final String name;
  final DateTime generatedAt;
  final String status;

  @override
  List<Object?> get props => <Object?>[name, generatedAt, status];
}
