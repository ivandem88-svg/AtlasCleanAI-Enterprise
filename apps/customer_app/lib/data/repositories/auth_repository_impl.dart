import 'package:customer_app/data/datasources/local/secure_storage_datasource.dart';
import 'package:customer_app/data/datasources/remote/auth_remote_datasource.dart';
import 'package:customer_app/domain/entities/user.dart';
import 'package:customer_app/domain/repositories/auth_repository.dart';

class AuthRepositoryImpl implements AuthRepository {
  AuthRepositoryImpl({
    required AuthRemoteDatasource remoteDatasource,
    required SecureStorageDatasource secureStorageDatasource,
  })  : _remoteDatasource = remoteDatasource,
        _secureStorageDatasource = secureStorageDatasource;

  final AuthRemoteDatasource _remoteDatasource;
  final SecureStorageDatasource _secureStorageDatasource;

  @override
  Future<User> login({required String email, required String password}) async {
    final User user = await _remoteDatasource.login(email: email, password: password);
    if (user.token != null) {
      await _secureStorageDatasource.saveToken(user.token!);
    }
    return user;
  }

  @override
  Future<User> register({
    required String name,
    required String email,
    required String password,
  }) async {
    final User user = await _remoteDatasource.register(
      name: name,
      email: email,
      password: password,
    );
    if (user.token != null) {
      await _secureStorageDatasource.saveToken(user.token!);
    }
    return user;
  }

  @override
  Future<void> logout() => _secureStorageDatasource.clear();
}
