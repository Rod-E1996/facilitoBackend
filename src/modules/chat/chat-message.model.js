const { Schema, model } = require('mongoose');

const chatMessageSchema = new Schema(
  {
    chat_id: { type: Schema.Types.ObjectId, ref: 'Chat', required: true },
    is_sent: { type: Boolean, required: true, default: true },
    is_read: { type: Boolean, required: true, default: false },
    sender_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    time_sent: { type: Date, required: true, default: Date.now },
    message_content: { type: String, required: true, trim: true },
  },
  {
    collection: 'ChatMessages',
    versionKey: false,
  }
);

chatMessageSchema.index({ chat_id: 1, time_sent: -1 });

module.exports = model('ChatMessages', chatMessageSchema);
