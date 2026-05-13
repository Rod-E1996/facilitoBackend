const { Schema, model } = require('mongoose');

const detailedServiceCatSchema = new Schema(
  {
    service_id: { type: Schema.Types.ObjectId, ref: 'Service', required: true },
    service_category_id: { type: Schema.Types.ObjectId, ref: 'ServiceCategory', required: true },
  },
  {
    collection: 'DetailedServiceCat',
    versionKey: false,
  }
);

detailedServiceCatSchema.index({ service_id: 1, service_category_id: 1 }, { unique: true });

module.exports = model('DetailedServiceCat', detailedServiceCatSchema);
