import 'package:equatable/equatable.dart';

class PortalUser extends Equatable {
  const PortalUser({required this.email, required this.displayName});

  final String email;
  final String displayName;

  @override
  List<Object?> get props => <Object?>[email, displayName];
}
