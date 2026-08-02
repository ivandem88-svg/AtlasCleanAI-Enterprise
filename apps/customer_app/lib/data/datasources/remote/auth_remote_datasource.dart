import 'dart:async';

import 'package:customer_app/core/constants/api_constants.dart';
import 'package:customer_app/core/network/api_client.dart';
import 'package:customer_app/data/models/user_model.dart';

class AuthRemoteDatasource {
  AuthRemoteDatasource(this._apiClient);

  final ApiClient _apiClient;

  Future<UserModel> login({required String email, required String password}) async {
    await Future<void>.delayed(const Duration(milliseconds: 300));
    return UserModel(
      id: 'usr_101',
      name: 'Atlas Customer',
      email: email,
      token: 'token_${email.hashCode}_$password',
    );
  }

  Future<UserModel> register({
    required String name,
    required String email,
    required String password,
  }) async {
    await Future<void>.delayed(const Duration(milliseconds: 400));
    await _apiClient.post(ApiConstants.register, data: <String, dynamic>{
      'name': name,
      'email': email,
      'password': password,
    }).catchError((_) => <String, dynamic>{});

    return UserModel(
      id: 'usr_${DateTime.now().millisecondsSinceEpoch}',
      name: name,
      email: email,
      token: 'token_${email.hashCode}_new',
    );
  }
}
