const { Schema, model } = require('mongoose');

const userSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    last_name: { type: String, required: true, trim: true },
    telephone: { type: String, required: true, trim: true },
    address: { type: String, trim: true },
    dui: { type: String, required: true, trim: true, unique: true },
    email: { type: String, required: true, trim: true, lowercase: true, unique: true },
    password: { type: String, required: true },
    user_role_id: { type: Schema.Types.ObjectId, ref: 'UserRole', required: true },
  },
  {
    collection: 'User',
    versionKey: false,
  }
);

module.exports = model('User', userSchema);
