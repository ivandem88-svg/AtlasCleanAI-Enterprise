import 'package:flutter/material.dart';

class AtlasTextField extends StatelessWidget {
  const AtlasTextField({
    required this.controller,
    required this.label,
    super.key,
    this.validator,
    this.keyboardType,
    this.obscureText = false,
  });

  final TextEditingController controller;
  final String label;
  final String? Function(String?)? validator;
  final TextInputType? keyboardType;
  final bool obscureText;

  @override
  Widget build(BuildContext context) {
    return TextFormField(
      controller: controller,
      validator: validator,
      keyboardType: keyboardType,
      obscureText: obscureText,
      decoration: InputDecoration(labelText: label),
    );
  }
}
