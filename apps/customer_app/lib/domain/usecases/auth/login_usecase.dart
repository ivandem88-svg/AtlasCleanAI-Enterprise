import 'package:customer_app/domain/entities/user.dart';
import 'package:customer_app/domain/repositories/auth_repository.dart';

class LoginUsecase {
  LoginUsecase(this._repository);

  final AuthRepository _repository;

  Future<User> call({required String email, required String password}) {
    return _repository.login(email: email, password: password);
  }
}
