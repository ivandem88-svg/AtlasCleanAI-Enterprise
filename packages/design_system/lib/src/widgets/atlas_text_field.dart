import 'package:flutter/material.dart';

/// A standard labelled text input for AtlasCleanAI forms.
class AtlasTextField extends StatelessWidget {
  const AtlasTextField({
    required this.label,
    super.key,
    this.controller,
    this.hintText,
    this.keyboardType,
    this.obscureText = false,
    this.validator,
  });

  final String label;
  final TextEditingController? controller;
  final String? hintText;
  final TextInputType? keyboardType;
  final bool obscureText;
  final String? Function(String?)? validator;

  @override
  Widget build(BuildContext context) {
    return TextFormField(
      controller: controller,
      keyboardType: keyboardType,
      obscureText: obscureText,
      validator: validator,
      decoration: InputDecoration(labelText: label, hintText: hintText),
    );
  }
}
