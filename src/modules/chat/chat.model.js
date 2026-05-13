const { Schema, model } = require('mongoose');

const chatSchema = new Schema(
  {
    service_request_id: { type: Schema.Types.ObjectId, ref: 'Service_Request', required: true },
    business_id: { type: Schema.Types.ObjectId, ref: 'Business', required: true },
  },
  {
    collection: 'Chat',
    versionKey: false,
  }
);

chatSchema.index({ service_request_id: 1, business_id: 1 }, { unique: true });

module.exports = model('Chat', chatSchema);
