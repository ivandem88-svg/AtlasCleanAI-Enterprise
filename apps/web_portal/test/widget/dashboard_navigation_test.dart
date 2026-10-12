import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:web_portal/app.dart';

void main() {
  testWidgets('dashboard tiles navigate to their section and back', (WidgetTester tester) async {
    tester.view.physicalSize = const Size(1400, 1000);
    tester.view.devicePixelRatio = 1;
    addTearDown(tester.view.reset);

    await tester.pumpWidget(const WebPortalApp());
    await tester.tap(find.text('Access portal'));
    await tester.pumpAndSettle();
    await tester.tap(find.text('Continue'));
    await tester.pumpAndSettle();

    for (final String title in <String>['Bookings', 'Cleaners', 'Invoices', 'Automation', 'SLA', 'Support']) {
      await tester.tap(find.text(title));
      await tester.pumpAndSettle();
      expect(
        find.descendant(of: find.byType(AppBar), matching: find.text(title)),
        findsOneWidget,
        reason: '$title tile should open the $title section',
      );
      expect(find.byTooltip('Back to dashboard'), findsOneWidget, reason: title);
      await tester.tap(find.byTooltip('Back to dashboard'));
      await tester.pumpAndSettle();
    }
  });
}
