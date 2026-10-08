import 'package:web_portal/domain/entities/portal_user.dart';
import 'package:web_portal/domain/repositories/auth_repository.dart';

class LoginUsecase {
  LoginUsecase(this._repository);

  final AuthRepository _repository;

  Future<PortalUser> call({required String email, required String password}) {
    return _repository.login(email: email, password: password);
  }
}
