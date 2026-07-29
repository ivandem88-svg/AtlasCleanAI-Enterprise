import 'package:flutter/material.dart';

import '../colors/atlas_colors.dart';

abstract final class AtlasTypography {
  static const String fontFamily = 'Inter';

  static TextTheme textTheme = const TextTheme(
    displayLarge: TextStyle(fontSize: 40, fontWeight: FontWeight.w700, letterSpacing: -1.2),
    displayMedium: TextStyle(fontSize: 32, fontWeight: FontWeight.w700, letterSpacing: -0.8),
    headlineMedium: TextStyle(fontSize: 24, fontWeight: FontWeight.w700),
    titleLarge: TextStyle(fontSize: 20, fontWeight: FontWeight.w600),
    titleMedium: TextStyle(fontSize: 16, fontWeight: FontWeight.w600),
    bodyLarge: TextStyle(fontSize: 16, fontWeight: FontWeight.w400, height: 1.5),
    bodyMedium: TextStyle(fontSize: 14, fontWeight: FontWeight.w400, height: 1.45),
    labelLarge: TextStyle(fontSize: 14, fontWeight: FontWeight.w600, letterSpacing: 0.2),
    labelMedium: TextStyle(fontSize: 12, fontWeight: FontWeight.w600, letterSpacing: 0.2),
  ).apply(
    bodyColor: AtlasColors.textPrimary,
    displayColor: AtlasColors.textPrimary,
  );
}
