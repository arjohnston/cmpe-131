const mongoose = require('mongoose')
const Schema = mongoose.Schema

const FoodMacroSchema = new Schema(
  {
    user: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    ingredients: {
      type: [String],
      required: true
    },
    calories: {
      type: Number,
      required: true
    }
  },
  { collection: 'FoodMacro' }
)

module.exports =
  mongoose.models && mongoose.models.FoodMacro
    ? mongoose.models.FoodMacro
    : mongoose.model('FoodMacro', FoodMacroSchema)
