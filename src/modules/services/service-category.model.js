const { Schema, model } = require('mongoose');

const serviceCategorySchema = new Schema(
  {
    service_category_name: { type: String, required: true, trim: true, unique: true },
  },
  {
    collection: 'ServiceCategory',
    versionKey: false,
  }
);

module.exports = model('ServiceCategory', serviceCategorySchema);
