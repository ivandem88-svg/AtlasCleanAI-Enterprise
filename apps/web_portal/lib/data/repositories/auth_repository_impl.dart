import 'package:web_portal/data/datasources/remote/portal_remote_datasource.dart';
import 'package:web_portal/domain/entities/portal_user.dart';
import 'package:web_portal/domain/repositories/auth_repository.dart';

class AuthRepositoryImpl implements AuthRepository {
  AuthRepositoryImpl(this._remoteDatasource);

  final PortalRemoteDatasource _remoteDatasource;

  @override
  Future<PortalUser> login({required String email, required String password}) {
    return _remoteDatasource.login(email: email, password: password);
  }
}
