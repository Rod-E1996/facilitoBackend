const dotenv = require('dotenv');

dotenv.config();

function parseClientOrigin(value) {
  if (!value || value.trim() === '' || value.trim() === '*') {
    return '*';
  }

  const origins = value
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

  return origins.length ? origins : '*';
}

module.exports = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: Number(process.env.PORT) || 3000,
  MONGODB_ATLAS: process.env.MONGODB_ATLAS,
  MONGODB_DB_NAME: process.env.MONGODB_DB_NAME || 'damb',
  CLIENT_ORIGIN: parseClientOrigin(process.env.CLIENT_ORIGIN),
  SOCKET_PATH: process.env.SOCKET_PATH || '/socket.io',
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || '30d',
  REDIS_URL: process.env.REDIS_URL || '',
  SUPABASE_URL: process.env.SUPABASE_URL,
  SUPABASE_BUCKET_NAME: process.env.SUPABASE_BUCKET_NAME,
  SUPABASE_PUBLISHABLE_KEY: process.env.SUPABASE_PUBLISHABLE_KEY,
  SUPABASE_SECRET_KEY: process.env.SUPABASE_SECRET_KEY,
};
