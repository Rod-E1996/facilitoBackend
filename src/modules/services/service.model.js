const { Schema, model } = require('mongoose');

const serviceSchema = new Schema(
  {
    service_name: { type: String, required: true, trim: true },
    service_description: { type: String, required: true, trim: true },
    business_id: { type: Schema.Types.ObjectId, ref: 'Business', required: true },
  },
  {
    collection: 'Service',
    versionKey: false,
  }
);

serviceSchema.index({ business_id: 1 });

module.exports = model('Service', serviceSchema);
