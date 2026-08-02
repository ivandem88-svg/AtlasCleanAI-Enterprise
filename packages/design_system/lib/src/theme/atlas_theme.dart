import 'package:flutter/material.dart';

import 'atlas_colors.dart';
import 'atlas_typography.dart';

/// Material 3 theme used by the AtlasCleanAI application suite.
abstract final class AtlasTheme {
  static ThemeData light() {
    final ColorScheme scheme = ColorScheme.fromSeed(
      seedColor: AtlasColors.brand,
      brightness: Brightness.light,
      surface: AtlasColors.surface,
      error: AtlasColors.danger,
    );

    return ThemeData(
      useMaterial3: true,
      colorScheme: scheme,
      scaffoldBackgroundColor: AtlasColors.surface,
      textTheme: AtlasTypography.textTheme,
      inputDecorationTheme: InputDecorationTheme(
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: AtlasColors.border),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: AtlasColors.border),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: AtlasColors.brand, width: 2),
        ),
      ),
    );
  }
}
