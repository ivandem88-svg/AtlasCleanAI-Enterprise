import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:customer_app/domain/entities/user.dart';
import 'package:customer_app/domain/repositories/auth_repository.dart';
import 'package:customer_app/domain/usecases/auth/login_usecase.dart';
import 'package:customer_app/domain/usecases/auth/register_usecase.dart';
import 'package:customer_app/presentation/blocs/auth/auth_bloc.dart';
import 'package:customer_app/presentation/screens/auth/login_screen.dart';

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
  testWidgets('login screen renders fields and button', (WidgetTester tester) async {
    final _FakeAuthRepository repository = _FakeAuthRepository();

    await tester.pumpWidget(
      MaterialApp(
        home: BlocProvider<AuthBloc>(
          create: (_) => AuthBloc(
            loginUsecase: LoginUsecase(repository),
            registerUsecase: RegisterUsecase(repository),
          ),
          child: const LoginScreen(),
        ),
      ),
    );

    expect(find.text('Customer Login'), findsOneWidget);
    expect(find.text('Sign In'), findsOneWidget);
    expect(find.byType(TextFormField), findsNWidgets(2));
  });
}
