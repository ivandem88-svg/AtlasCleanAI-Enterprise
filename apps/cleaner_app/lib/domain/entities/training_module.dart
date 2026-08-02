import 'package:equatable/equatable.dart';

class TrainingModule extends Equatable {
  const TrainingModule({
    required this.id,
    required this.title,
    required this.durationMinutes,
  });

  final String id;
  final String title;
  final int durationMinutes;

  @override
  List<Object?> get props => <Object?>[id, title, durationMinutes];
}
