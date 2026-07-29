import 'dart:convert';

import 'package:http/http.dart' as http;

import 'models/api_response.dart';

class AtlasApiClient {
  AtlasApiClient({
    required this.baseUrl,
    http.Client? httpClient,
    this.accessToken,
    this.defaultHeaders = const <String, String>{},
  }) : _httpClient = httpClient ?? http.Client();

  final String baseUrl;
  final http.Client _httpClient;
  final String? accessToken;
  final Map<String, String> defaultHeaders;

  Future<ApiResponse<T>> get<T>(
    String path, {
    Map<String, String>? queryParameters,
    T Function(Object? json)? fromJson,
  }) {
    return _send<T>(
      method: 'GET',
      path: path,
      queryParameters: queryParameters,
      fromJson: fromJson,
    );
  }

  Future<ApiResponse<T>> post<T>(
    String path, {
    Object? body,
    T Function(Object? json)? fromJson,
  }) {
    return _send<T>(method: 'POST', path: path, body: body, fromJson: fromJson);
  }

  Future<ApiResponse<T>> put<T>(
    String path, {
    Object? body,
    T Function(Object? json)? fromJson,
  }) {
    return _send<T>(method: 'PUT', path: path, body: body, fromJson: fromJson);
  }

  Future<ApiResponse<T>> delete<T>(
    String path, {
    Object? body,
    T Function(Object? json)? fromJson,
  }) {
    return _send<T>(method: 'DELETE', path: path, body: body, fromJson: fromJson);
  }

  Future<ApiResponse<T>> _send<T>({
    required String method,
    required String path,
    Object? body,
    Map<String, String>? queryParameters,
    T Function(Object? json)? fromJson,
  }) async {
    final uri = Uri.parse('$baseUrl$path').replace(queryParameters: queryParameters);
    final headers = <String, String>{
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      ...defaultHeaders,
      if (accessToken != null && accessToken!.isNotEmpty) 'Authorization': '******',
    };

    final request = http.Request(method, uri)
      ..headers.addAll(headers)
      ..body = body == null ? '' : jsonEncode(body);

    final streamedResponse = await _httpClient.send(request);
    final response = await http.Response.fromStream(streamedResponse);

    Map<String, dynamic> payload = const <String, dynamic>{};
    if (response.body.isNotEmpty) {
      final decoded = jsonDecode(response.body);
      if (decoded is Map<String, dynamic>) {
        payload = decoded;
      } else {
        payload = <String, dynamic>{
          'success': response.statusCode >= 200 && response.statusCode < 300,
          'data': decoded,
        };
      }
    }

    return ApiResponse<T>.fromJson(
      <String, dynamic>{
        'success': payload['success'] ?? (response.statusCode >= 200 && response.statusCode < 300),
        'data': payload['data'],
        'message': payload['message'] ?? response.reasonPhrase,
        'errors': payload['errors'] ?? const <String, dynamic>{},
        'statusCode': response.statusCode,
      },
      fromJsonT: fromJson,
    );
  }

  void close() => _httpClient.close();
}
