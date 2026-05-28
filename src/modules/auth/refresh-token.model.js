const { Schema, model } = require('mongoose');

const refreshTokenSchema = new Schema(
  {
    user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    token_hash: { type: String, required: true, unique: true },
    expires_at: { type: Date, required: true },
    revoked_at: { type: Date, default: null },
  },
  {
    collection: 'RefreshToken',
    versionKey: false,
    timestamps: { createdAt: 'created_at', updatedAt: false },
  }
);

refreshTokenSchema.index({ expires_at: 1 }, { expireAfterSeconds: 0 });

module.exports = model('RefreshToken', refreshTokenSchema);
