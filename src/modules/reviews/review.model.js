const { Schema, model } = require('mongoose');

const reviewSchema = new Schema(
  {
    service_request_id: { type: Schema.Types.ObjectId, ref: 'Service_Request', required: true },
    reviewer_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    business_id: { type: Schema.Types.ObjectId, ref: 'Business', required: true },
    review_comment: { type: String, required: true, trim: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    review_date: { type: Date, required: true, default: Date.now },
  },
  {
    collection: 'Review',
    versionKey: false,
  }
);

reviewSchema.index({ business_id: 1, review_date: -1 });

module.exports = model('Review', reviewSchema);
