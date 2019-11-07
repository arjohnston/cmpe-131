const mongoose = require('mongoose')
const Schema = mongoose.Schema

const DoctorVisitSchema = new Schema(
  {
    user: {
      type: String,
      required: true
    },
    date: {
      type: Date,
      default: Date.now
    },
    notes: {
      type: String
    }
  },
  { collection: 'DoctorVisit' }
)

module.exports =
  mongoose.models && mongoose.models.DoctorVisit
    ? mongoose.models.DoctorVisit
    : mongoose.model('DoctorVisit', DoctorVisitSchema)
