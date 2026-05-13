const { Schema, model } = require('mongoose');

const notificationSchema = new Schema(
  {
    user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    related_chat_id: { type: Schema.Types.ObjectId, ref: 'Chat', required: true },
    related_message_id: { type: Schema.Types.ObjectId, ref: 'ChatMessages', required: true },
    related_service_request_id: { type: Schema.Types.ObjectId, ref: 'Service_Request', required: true },
    notification_type: { type: String, required: true, trim: true },
    notification_content: { type: String, required: true, trim: true },
    is_read: { type: Boolean, required: true, default: false },
    created_at: { type: Date, required: true, default: Date.now },
  },
  {
    collection: 'Notification',
    versionKey: false,
  }
);

notificationSchema.index({ user_id: 1, is_read: 1, created_at: -1 });

module.exports = model('Notification', notificationSchema);
