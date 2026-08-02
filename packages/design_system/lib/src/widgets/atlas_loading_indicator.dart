import 'package:flutter/material.dart';

/// A centred loading state with accessible status text.
class AtlasLoadingIndicator extends StatelessWidget {
  const AtlasLoadingIndicator({super.key, this.label = 'Loading'});

  final String label;

  @override
  Widget build(BuildContext context) {
    return Semantics(
      label: label,
      child: const Center(child: CircularProgressIndicator()),
    );
  }
}
