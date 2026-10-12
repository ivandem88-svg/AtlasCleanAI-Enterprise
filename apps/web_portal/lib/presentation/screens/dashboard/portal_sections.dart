import 'package:flutter/material.dart';

class PortalRow {
  const PortalRow({required this.title, required this.subtitle, required this.trailing});

  final String title;
  final String subtitle;
  final String trailing;
}

class PortalSection {
  const PortalSection({
    required this.slug,
    required this.title,
    required this.icon,
    required this.summary,
    required this.rows,
  });

  final String slug;
  final String title;
  final IconData icon;
  final String summary;
  final List<PortalRow> rows;
}

const List<PortalSection> portalSections = <PortalSection>[
  PortalSection(
    slug: 'bookings',
    title: 'Bookings',
    icon: Icons.calendar_month,
    summary: '3 bookings scheduled for today',
    rows: <PortalRow>[
      PortalRow(title: 'Deep clean - Maple St', subtitle: '09:00, assigned to Ana R.', trailing: 'Confirmed'),
      PortalRow(title: 'Office clean - Harbor Tower', subtitle: '13:00, assigned to Luis M.', trailing: 'In progress'),
      PortalRow(title: 'Move-out clean - Oak Ave', subtitle: '16:30, unassigned', trailing: 'Pending'),
    ],
  ),
  PortalSection(
    slug: 'cleaners',
    title: 'Cleaners',
    icon: Icons.groups_2_outlined,
    summary: '12 active cleaners, average rating 4.8',
    rows: <PortalRow>[
      PortalRow(title: 'Ana Rodrigues', subtitle: '214 jobs completed', trailing: '4.9'),
      PortalRow(title: 'Luis Martins', subtitle: '168 jobs completed', trailing: '4.8'),
      PortalRow(title: 'Sofia Alves', subtitle: '97 jobs completed', trailing: '4.7'),
    ],
  ),
  PortalSection(
    slug: 'invoices',
    title: 'Invoices',
    icon: Icons.receipt_long_outlined,
    summary: 'EUR 4,640 outstanding this month',
    rows: <PortalRow>[
      PortalRow(title: 'INV-1042 - Harbor Tower', subtitle: 'Due in 5 days', trailing: 'EUR 1,950'),
      PortalRow(title: 'INV-1041 - Maple St', subtitle: 'Paid yesterday', trailing: 'EUR 180'),
      PortalRow(title: 'INV-1040 - Oak Ave', subtitle: 'Overdue by 2 days', trailing: 'EUR 2,690'),
    ],
  ),
  PortalSection(
    slug: 'automation',
    title: 'Automation',
    icon: Icons.auto_graph_outlined,
    summary: '4 automations running',
    rows: <PortalRow>[
      PortalRow(title: 'Smart scheduling', subtitle: 'Matches cleaners to open bookings', trailing: 'Active'),
      PortalRow(title: 'Dynamic pricing', subtitle: 'Adjusts quotes to demand', trailing: 'Active'),
      PortalRow(title: 'Payment reminders', subtitle: 'Emails overdue invoices', trailing: 'Paused'),
    ],
  ),
  PortalSection(
    slug: 'sla',
    title: 'SLA',
    icon: Icons.verified_outlined,
    summary: '98.4% of jobs met their SLA this week',
    rows: <PortalRow>[
      PortalRow(title: 'On-time arrival', subtitle: 'Target 95%', trailing: '97.1%'),
      PortalRow(title: 'Quality score', subtitle: 'Target 4.5', trailing: '4.8'),
      PortalRow(title: 'Complaint resolution', subtitle: 'Target 24h', trailing: '19h'),
    ],
  ),
  PortalSection(
    slug: 'support',
    title: 'Support',
    icon: Icons.support_agent_outlined,
    summary: '2 open tickets',
    rows: <PortalRow>[
      PortalRow(title: 'Missed spot - Maple St', subtitle: 'Opened 3h ago', trailing: 'Open'),
      PortalRow(title: 'Invoice question - Oak Ave', subtitle: 'Opened yesterday', trailing: 'Waiting'),
      PortalRow(title: 'Key handover - Harbor Tower', subtitle: 'Closed 2 days ago', trailing: 'Resolved'),
    ],
  ),
];

PortalSection? findPortalSection(String slug) {
  for (final PortalSection section in portalSections) {
    if (section.slug == slug) {
      return section;
    }
  }
  return null;
}
