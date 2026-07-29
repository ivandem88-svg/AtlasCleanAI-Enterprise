import 'package:customer_app/domain/entities/user.dart';
import 'package:customer_app/domain/repositories/auth_repository.dart';

class RegisterUsecase {
  RegisterUsecase(this._repository);

  final AuthRepository _repository;

  Future<User> call({
    required String name,
    required String email,
    required String password,
  }) {
    return _repository.register(name: name, email: email, password: password);
  }
}
