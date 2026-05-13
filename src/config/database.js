const mongoose = require('mongoose');
const { MONGODB_ATLAS, MONGODB_DB_NAME } = require('./env');

require('../modules');

async function connectDatabase() {
  if (!MONGODB_ATLAS) throw new Error('La variable MONGODB_ATLAS no está definida en el entorno.');
  await mongoose.connect(MONGODB_ATLAS, { dbName: MONGODB_DB_NAME });
  return mongoose.connection;
}

module.exports = {
  connectDatabase,
};
