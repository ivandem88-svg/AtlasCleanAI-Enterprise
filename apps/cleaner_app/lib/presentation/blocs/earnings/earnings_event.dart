import 'package:equatable/equatable.dart';

class EarningsEvent extends Equatable {
  const EarningsEvent();

  @override
  List<Object?> get props => <Object?>[];
}

class LoadEarnings extends EarningsEvent {
  const LoadEarnings();
}
