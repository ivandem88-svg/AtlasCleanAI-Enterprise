import 'package:web_portal/domain/entities/portal_user.dart';

abstract class AuthRepository {
  Future<PortalUser> login({required String email, required String password});
}
