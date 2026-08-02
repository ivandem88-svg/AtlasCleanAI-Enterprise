/// The access role assigned to an AtlasCleanAI user.
enum UserRole { customer, cleaner, manager }

/// The base identity shared by all AtlasCleanAI user types.
class User {
  const User({
    required this.id,
    required this.displayName,
    required this.email,
    required this.role,
  });

  final String id;
  final String displayName;
  final String email;
  final UserRole role;
}
