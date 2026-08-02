import 'package:flutter_test/flutter_test.dart';

import 'package:customer_app/domain/entities/user.dart';
import 'package:customer_app/domain/repositories/auth_repository.dart';
import 'package:customer_app/domain/usecases/auth/login_usecase.dart';
import 'package:customer_app/domain/usecases/auth/register_usecase.dart';

class _FakeAuthRepository implements AuthRepository {
  @override
  Future<User> login({required String email, required String password}) async {
    return User(id: '1', name: 'Tester', email: email, token: 'token');
  }

  @override
  Future<User> register({
    required String name,
    required String email,
    required String password,
  }) async {
    return User(id: '2', name: name, email: email, token: 'token');
  }

  @override
  Future<void> logout() async {}
}

void main() {
  group('Auth use cases', () {
    final _FakeAuthRepository repository = _FakeAuthRepository();

    test('login returns an authenticated user', () async {
      final User user = await LoginUsecase(repository)(
        email: 'test@atlasclean.ai',
        password: 'Password123',
      );

      expect(user.email, 'test@atlasclean.ai');
      expect(user.token, isNotNull);
    });

    test('register returns a created user', () async {
      final User user = await RegisterUsecase(repository)(
        name: 'Taylor',
        email: 'taylor@atlasclean.ai',
        password: 'Password123',
      );

      expect(user.name, 'Taylor');
    });
  });
}
