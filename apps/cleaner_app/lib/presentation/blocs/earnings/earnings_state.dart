import 'package:cleaner_app/domain/entities/earning.dart';
import 'package:equatable/equatable.dart';

enum EarningsStatus { initial, loading, loaded, failure }

class EarningsState extends Equatable {
  const EarningsState({
    this.status = EarningsStatus.initial,
    this.earnings = const <Earning>[],
    this.errorMessage,
  });

  final EarningsStatus status;
  final List<Earning> earnings;
  final String? errorMessage;

  EarningsState copyWith({
    EarningsStatus? status,
    List<Earning>? earnings,
    String? errorMessage,
  }) {
    return EarningsState(
      status: status ?? this.status,
      earnings: earnings ?? this.earnings,
      errorMessage: errorMessage,
    );
  }

  @override
  List<Object?> get props => <Object?>[status, earnings, errorMessage];
}
