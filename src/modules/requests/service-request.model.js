const { Schema, model } = require('mongoose');

const serviceRequestSchema = new Schema(
  {
    customer_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    service_id: { type: Schema.Types.ObjectId, ref: 'Service', required: true },
    service_request_date: { type: Date, required: true, default: Date.now },
    service_request_description: { type: String, required: true, trim: true },
  },
  {
    collection: 'Service_Request',
    versionKey: false,
  }
);

serviceRequestSchema.index({ customer_id: 1 });
serviceRequestSchema.index({ service_id: 1 });

module.exports = model('Service_Request', serviceRequestSchema);
