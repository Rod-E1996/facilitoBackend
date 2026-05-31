const mongoose = require('mongoose');
const { MONGODB_ATLAS, MONGODB_DB_NAME } = require('./env');

require('../modules');

async function connectDatabase() {
  if (!MONGODB_ATLAS) throw new Error('La variable MONGODB_ATLAS no está definida en el entorno.');

  if (!MONGODB_ATLAS.startsWith('mongodb://') && !MONGODB_ATLAS.startsWith('mongodb+srv://')) {
    throw new Error('La variable MONGODB_ATLAS debe iniciar con mongodb:// o mongodb+srv://');
  }

  await mongoose.connect(MONGODB_ATLAS, { dbName: MONGODB_DB_NAME });
  return mongoose.connection;
}

module.exports = {
  connectDatabase,
};
