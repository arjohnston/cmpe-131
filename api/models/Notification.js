const mongoose = require('mongoose')
const Schema = mongoose.Schema

const NotificationSchema = new Schema(
  {
    user: {
      type: String,
      required: true
    },
    type: {
      type: String,
      required: true
    },
    date: {
      type: Date,
      default: Date.now
    },
    message: {
      type: String,
      required: true
    },
    isUnread: {
      type: Boolean,
      default: true
    }
  },
  { collection: 'Notification' }
)

module.exports =
  mongoose.models && mongoose.models.Notification
    ? mongoose.models.Notification
    : mongoose.model('Notification', NotificationSchema)
