import dotenv from 'dotenv';

dotenv.config({ quiet: true });

const toNumber = (value: string | undefined, fallback: number) => {
  const parsed = Number(value);

  return Number.isFinite(parsed) ? parsed : fallback;
};

export const env = {
  NODE_ENV: process.env.NODE_ENV ?? 'development',
  PORT: toNumber(process.env.PORT, 3333),
  DEEZER_API_BASE_URL: process.env.DEEZER_API_BASE_URL ?? 'https://api.deezer.com',
  MONGODB_URI:
    process.env.MONGODB_URI ?? 'mongodb://localhost:27017/deezer-mobile-clone',
  CORS_ORIGIN: process.env.CORS_ORIGIN ?? '*',
  RATE_LIMIT_WINDOW_MS: toNumber(process.env.RATE_LIMIT_WINDOW_MS, 15 * 60 * 1000),
  RATE_LIMIT_MAX: toNumber(process.env.RATE_LIMIT_MAX, 200),
};
