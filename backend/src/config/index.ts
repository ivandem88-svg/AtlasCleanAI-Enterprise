export interface AppConfig {
  env: string;
  port: number;
  apiPrefix: string;
  clientUrl: string;
  logLevel: string;
  databaseUrl: string;
  redisUrl: string;
  jwt: {
    secret: string;
    refreshSecret: string;
    expiresIn: string;
    refreshExpiresIn: string;
  };
  security: {
    bcryptRounds: number;
  };
  stripe: {
    secretKey?: string;
    webhookSecret?: string;
  };
  smtp: {
    host?: string;
    port: number;
    user?: string;
    pass?: string;
    from: string;
  };
  firebase: {
    projectId?: string;
    clientEmail?: string;
    privateKey?: string;
  };
  atlasAI: {
    apiUrl?: string;
    apiKey?: string;
  };
}

const getEnv = (key: string, fallback?: string): string => {
  const value = process.env[key] ?? fallback;

  if (value === undefined) {
    throw new Error(`Missing required environment variable: ${key}`);
  }

  return value;
};

const getOptionalNumber = (key: string, fallback: number): number => {
  const value = process.env[key];
  if (!value) {
    return fallback;
  }

  const parsed = Number(value);
  if (Number.isNaN(parsed)) {
    throw new Error(`Environment variable ${key} must be a number`);
  }

  return parsed;
};

export const config: AppConfig = {
  env: process.env.NODE_ENV ?? 'development',
  port: getOptionalNumber('PORT', 4000),
  apiPrefix: process.env.API_PREFIX ?? '/api/v1',
  clientUrl: process.env.CLIENT_URL ?? 'http://localhost:3000',
  logLevel: process.env.LOG_LEVEL ?? 'info',
  databaseUrl: process.env.DATABASE_URL ?? 'postgresql://localhost:5432/atlascleanai?schema=public',
  redisUrl: process.env.REDIS_URL ?? 'redis://localhost:6379',
  jwt: {
    secret: getEnv('JWT_SECRET'),
    refreshSecret: getEnv('JWT_REFRESH_SECRET'),
    expiresIn: process.env.JWT_EXPIRES_IN ?? '15m',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN ?? '7d',
  },
  security: {
    bcryptRounds: getOptionalNumber('BCRYPT_ROUNDS', 12),
  },
  stripe: {
    secretKey: process.env.STRIPE_SECRET_KEY,
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
  },
  smtp: {
    host: process.env.SMTP_HOST,
    port: getOptionalNumber('SMTP_PORT', 587),
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
    from: process.env.SMTP_FROM ?? 'noreply@atlasclean.ai',
  },
  firebase: {
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  },
  atlasAI: {
    apiUrl: process.env.ATLAS_AI_API_URL,
    apiKey: process.env.ATLAS_AI_API_KEY,
  },
};

export const isProduction = config.env === 'production';
export const isTest = config.env === 'test';
