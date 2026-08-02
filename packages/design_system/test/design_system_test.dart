import 'package:design_system/design_system.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  testWidgets('AtlasButton renders its label', (WidgetTester tester) async {
    await tester.pumpWidget(
      MaterialApp(
        theme: AtlasTheme.light(),
        home: const Scaffold(
          body: AtlasButton(label: 'Book a clean', onPressed: null),
        ),
      ),
    );

    expect(find.text('Book a clean'), findsOneWidget);
  });
}
