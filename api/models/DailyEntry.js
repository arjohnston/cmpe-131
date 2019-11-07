const mongoose = require('mongoose')
const Schema = mongoose.Schema

// 1. Date (Date)
// 2. Notes (String)
// 3. Blood pressure (number)
// 4. Heart rate (number)
// 5. Daily exercise (minutes) (number)
// 6. Weight (number)
// 7. Food entry:
//      calories  (number)
//      food name (String)
//      food macro (object?)

const DailyEntrySchema = new Schema(
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
    },
    bloodPressure: {
      type: Number
    },
    heartRate: {
      type: Number
    },
    dailyExercise: {
      type: Number
    },
    weight: {
      type: Number
    },
    foodCalorie: {
      type: [Number] // array of numbers
    },
    foodName: {
      type: [String] // array of strings
    }
  },
  { collection: 'DailyEntry' }
)

module.exports =
  mongoose.models && mongoose.models.DailyEntry
    ? mongoose.models.DailyEntry
    : mongoose.model('DailyEntry', DailyEntrySchema)
