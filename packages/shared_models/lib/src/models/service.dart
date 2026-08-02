/// A bookable cleaning service offered through AtlasCleanAI.
class CleaningService {
  const CleaningService({
    required this.id,
    required this.name,
    required this.basePrice,
  });

  final String id;
  final String name;
  final double basePrice;
}
