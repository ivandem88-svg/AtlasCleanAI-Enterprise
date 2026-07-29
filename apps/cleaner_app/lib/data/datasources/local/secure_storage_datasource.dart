import 'package:flutter_secure_storage/flutter_secure_storage.dart';

class SecureStorageDatasource {
  SecureStorageDatasource({FlutterSecureStorage? storage})
      : _storage = storage ?? const FlutterSecureStorage();

  final FlutterSecureStorage _storage;

  Future<void> saveShiftStatus(String value) => _storage.write(key: 'shift_status', value: value);
  Future<String?> getShiftStatus() => _storage.read(key: 'shift_status');
}
