// Jest global setup: provide required environment variables for all test suites.
// These values are test-only and must never be used in production.
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-jwt-secret-min-32-chars-padding';
process.env.JWT_REFRESH_SECRET = 'test-refresh-secret-min-32-chars-p';
process.env.DATABASE_URL = process.env.DATABASE_URL ?? 'postgresql://localhost:5432/atlasclean_test';
process.env.REDIS_URL = process.env.REDIS_URL ?? 'redis://localhost:6379';
