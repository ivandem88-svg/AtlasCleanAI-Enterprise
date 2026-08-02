import 'package:flutter/material.dart';

import 'atlas_colors.dart';

/// Typography defaults for AtlasCleanAI interfaces.
abstract final class AtlasTypography {
  static TextTheme textTheme = Typography.material2021().black.apply(
    bodyColor: AtlasColors.ink,
    displayColor: AtlasColors.ink,
  );
}
