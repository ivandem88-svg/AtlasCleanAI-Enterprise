import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:web_portal/presentation/screens/landing/landing_screen.dart';

void main() {
  testWidgets('landing screen renders CTA', (WidgetTester tester) async {
    await tester.pumpWidget(const MaterialApp(home: LandingScreen()));

    expect(find.text('AtlasCleanAI Portal'), findsOneWidget);
    expect(find.text('Access portal'), findsOneWidget);
  });
}
