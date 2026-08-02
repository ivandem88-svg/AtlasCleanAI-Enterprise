import 'package:flutter_bloc/flutter_bloc.dart';

import 'package:customer_app/domain/usecases/auth/login_usecase.dart';
import 'package:customer_app/domain/usecases/auth/register_usecase.dart';
import 'package:customer_app/presentation/blocs/auth/auth_event.dart';
import 'package:customer_app/presentation/blocs/auth/auth_state.dart';

class AuthBloc extends Bloc<AuthEvent, AuthState> {
  AuthBloc({
    required LoginUsecase loginUsecase,
    required RegisterUsecase registerUsecase,
  })  : _loginUsecase = loginUsecase,
        _registerUsecase = registerUsecase,
        super(const AuthState(status: AuthStatus.unauthenticated)) {
    on<LoginSubmitted>(_onLoginSubmitted);
    on<RegisterSubmitted>(_onRegisterSubmitted);
    on<LogoutRequested>(_onLogoutRequested);
  }

  final LoginUsecase _loginUsecase;
  final RegisterUsecase _registerUsecase;

  Future<void> _onLoginSubmitted(
    LoginSubmitted event,
    Emitter<AuthState> emit,
  ) async {
    emit(state.copyWith(status: AuthStatus.loading, errorMessage: null));
    try {
      final user = await _loginUsecase(email: event.email, password: event.password);
      emit(state.copyWith(status: AuthStatus.authenticated, user: user, errorMessage: null));
    } catch (error) {
      emit(state.copyWith(status: AuthStatus.failure, errorMessage: error.toString()));
    }
  }

  Future<void> _onRegisterSubmitted(
    RegisterSubmitted event,
    Emitter<AuthState> emit,
  ) async {
    emit(state.copyWith(status: AuthStatus.loading, errorMessage: null));
    try {
      final user = await _registerUsecase(
        name: event.name,
        email: event.email,
        password: event.password,
      );
      emit(state.copyWith(status: AuthStatus.authenticated, user: user, errorMessage: null));
    } catch (error) {
      emit(state.copyWith(status: AuthStatus.failure, errorMessage: error.toString()));
    }
  }

  Future<void> _onLogoutRequested(
    LogoutRequested event,
    Emitter<AuthState> emit,
  ) async {
    emit(const AuthState(status: AuthStatus.unauthenticated));
  }
}
