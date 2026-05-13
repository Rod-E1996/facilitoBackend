const { Schema, model } = require('mongoose');

const serviceImgSchema = new Schema(
  {
    img_src: { type: String, required: true, trim: true },
    service_id: { type: Schema.Types.ObjectId, ref: 'Service', required: true },
  },
  {
    collection: 'ServiceImgs',
    versionKey: false,
  }
);

serviceImgSchema.index({ service_id: 1 });

module.exports = model('ServiceImgs', serviceImgSchema);
