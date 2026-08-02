import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';

import 'package:customer_app/core/utils/validators.dart';
import 'package:customer_app/presentation/blocs/auth/auth_bloc.dart';
import 'package:customer_app/presentation/blocs/auth/auth_event.dart';
import 'package:customer_app/presentation/blocs/auth/auth_state.dart';
import 'package:customer_app/presentation/widgets/common/atlas_button.dart';
import 'package:customer_app/presentation/widgets/common/atlas_text_field.dart';

class RegisterScreen extends StatefulWidget {
  const RegisterScreen({super.key});

  @override
  State<RegisterScreen> createState() => _RegisterScreenState();
}

class _RegisterScreenState extends State<RegisterScreen> {
  final GlobalKey<FormState> _formKey = GlobalKey<FormState>();
  final TextEditingController _nameController = TextEditingController();
  final TextEditingController _emailController = TextEditingController();
  final TextEditingController _passwordController = TextEditingController();

  @override
  void dispose() {
    _nameController.dispose();
    _emailController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  void _submit() {
    if (_formKey.currentState!.validate()) {
      context.read<AuthBloc>().add(
            RegisterSubmitted(
              name: _nameController.text.trim(),
              email: _emailController.text.trim(),
              password: _passwordController.text,
            ),
          );
    }
  }

  @override
  Widget build(BuildContext context) {
    return BlocListener<AuthBloc, AuthState>(
      listener: (BuildContext context, AuthState state) {
        if (state.status == AuthStatus.authenticated) {
          context.go('/home');
        }
      },
      child: Scaffold(
        appBar: AppBar(title: const Text('Create account')),
        body: Padding(
          padding: const EdgeInsets.all(24),
          child: Form(
            key: _formKey,
            child: Column(
              children: <Widget>[
                AtlasTextField(
                  controller: _nameController,
                  label: 'Full name',
                  validator: (String? value) => Validators.validateRequired(value, 'Name'),
                ),
                const SizedBox(height: 16),
                AtlasTextField(
                  controller: _emailController,
                  label: 'Email',
                  validator: Validators.validateEmail,
                ),
                const SizedBox(height: 16),
                AtlasTextField(
                  controller: _passwordController,
                  label: 'Password',
                  obscureText: true,
                  validator: Validators.validatePassword,
                ),
                const SizedBox(height: 24),
                AtlasButton(label: 'Register', onPressed: _submit),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
