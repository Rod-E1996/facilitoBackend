const { Schema, model } = require('mongoose');

const userRoleSchema = new Schema(
  {
    user_role_name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
  },
  {
    collection: 'UserRole',
    versionKey: false,
  }
);

module.exports = model('UserRole', userRoleSchema);
