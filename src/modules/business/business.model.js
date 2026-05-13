const { Schema, model } = require('mongoose');

const businessSchema = new Schema(
  {
    business_name: { type: String, required: true, trim: true },
    business_description: { type: String, required: true, trim: true },
    business_pic_src: { type: String, required: true, trim: true },
    user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  {
    collection: 'Business',
    versionKey: false,
  }
);

businessSchema.index({ user_id: 1 });

module.exports = model('Business', businessSchema);
