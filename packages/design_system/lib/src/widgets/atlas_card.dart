import 'package:flutter/material.dart';

import '../theme/atlas_spacing.dart';

/// A consistently padded surface for grouped content.
class AtlasCard extends StatelessWidget {
  const AtlasCard({required this.child, super.key, this.padding});

  final Widget child;
  final EdgeInsetsGeometry? padding;

  @override
  Widget build(BuildContext context) {
    return Card(
      child: Padding(
        padding: padding ?? const EdgeInsets.all(AtlasSpacing.md),
        child: child,
      ),
    );
  }
}
