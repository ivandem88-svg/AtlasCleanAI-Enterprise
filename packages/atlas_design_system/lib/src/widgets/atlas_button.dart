import 'package:flutter/material.dart';

import '../colors/atlas_colors.dart';

class AtlasButton extends StatelessWidget {
  const AtlasButton({
    super.key,
    required this.label,
    this.onPressed,
    this.icon,
    this.isLoading = false,
    this.variant = AtlasButtonVariant.primary,
  });

  final String label;
  final VoidCallback? onPressed;
  final Widget? icon;
  final bool isLoading;
  final AtlasButtonVariant variant;

  @override
  Widget build(BuildContext context) {
    final style = switch (variant) {
      AtlasButtonVariant.primary => ElevatedButton.styleFrom(
          backgroundColor: AtlasColors.brandPrimary,
          foregroundColor: Colors.white,
        ),
      AtlasButtonVariant.secondary => ElevatedButton.styleFrom(
          backgroundColor: AtlasColors.surfaceVariant,
          foregroundColor: AtlasColors.textPrimary,
          elevation: 0,
        ),
      AtlasButtonVariant.destructive => ElevatedButton.styleFrom(
          backgroundColor: AtlasColors.danger,
          foregroundColor: Colors.white,
        ),
    };

    return ElevatedButton(
      onPressed: isLoading ? null : onPressed,
      style: style,
      child: Row(
        mainAxisSize: MainAxisSize.min,
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          if (isLoading)
            const SizedBox(
              width: 18,
              height: 18,
              child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white),
            )
          else if (icon != null)
            icon!,
          if ((isLoading || icon != null) && label.isNotEmpty) const SizedBox(width: 10),
          Text(label),
        ],
      ),
    );
  }
}

enum AtlasButtonVariant {
  primary,
  secondary,
  destructive,
}
