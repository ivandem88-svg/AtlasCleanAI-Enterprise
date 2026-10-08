import 'package:dio/dio.dart';

import 'package:customer_app/core/constants/api_constants.dart';
import 'package:customer_app/core/constants/app_constants.dart';
import 'package:customer_app/core/network/interceptors.dart';

class ApiClient {
  ApiClient({Dio? dio}) : _dio = dio ?? Dio(
    BaseOptions(
      baseUrl: ApiConstants.baseUrl,
      connectTimeout: AppConstants.networkTimeout,
      receiveTimeout: AppConstants.networkTimeout,
      sendTimeout: AppConstants.networkTimeout,
    ),
  ) {
    _dio.interceptors.add(AtlasRequestInterceptor());
  }

  final Dio _dio;

  Future<Map<String, dynamic>> get(String path) async {
    final Response<dynamic> response = await _dio.get<dynamic>(path);
    return Map<String, dynamic>.from(response.data as Map<dynamic, dynamic>);
  }

  Future<Map<String, dynamic>> post(
    String path, {
    Map<String, dynamic>? data,
  }) async {
    final Response<dynamic> response = await _dio.post<dynamic>(path, data: data);
    return Map<String, dynamic>.from(response.data as Map<dynamic, dynamic>);
  }
}
