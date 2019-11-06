const mongoose = require('mongoose')
const Schema = mongoose.Schema

const NotificationSchema = new Schema(
  {
    type: {
      type: String
    },
    date: {
      type: Date,
      default: Date.now
    },
    message: {
      type: String
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
