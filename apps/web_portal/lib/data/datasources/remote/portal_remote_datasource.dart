import 'dart:async';

import 'package:web_portal/data/models/portal_user_model.dart';

class PortalRemoteDatasource {
  const PortalRemoteDatasource();

  Future<PortalUserModel> login({required String email, required String password}) async {
    await Future<void>.delayed(const Duration(milliseconds: 250));
    return PortalUserModel(email: email, displayName: 'Enterprise Admin');
  }
}
