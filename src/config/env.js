const dotenv = require('dotenv');

dotenv.config();

module.exports = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: Number(process.env.PORT) || 3000,
  MONGODB_ATLAS: process.env.MONGODB_ATLAS,
  MONGODB_DB_NAME: process.env.MONGODB_DB_NAME || 'damb',
};
