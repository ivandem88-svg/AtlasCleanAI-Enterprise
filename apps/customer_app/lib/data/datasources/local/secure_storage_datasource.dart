import 'package:flutter_secure_storage/flutter_secure_storage.dart';

class SecureStorageDatasource {
  SecureStorageDatasource({FlutterSecureStorage? storage})
      : _storage = storage ?? const FlutterSecureStorage();

  static const String _tokenKey = 'atlas_auth_token';
  final FlutterSecureStorage _storage;

  Future<void> saveToken(String token) => _storage.write(key: _tokenKey, value: token);

  Future<String?> getToken() => _storage.read(key: _tokenKey);

  Future<void> clear() => _storage.deleteAll();
}
