const mongoose = require('mongoose')
const Schema = mongoose.Schema

const FoodMacroSchema = new Schema(
  {
    name: {
      type: String
    },
    ingredients: {
      type: [String]
    },
    calories: {
      type: Number
    }
  },
  { collection: 'FoodMacro' }
)

module.exports =
  mongoose.models && mongoose.models.FoodMacro
    ? mongoose.models.FoodMacro
    : mongoose.model('FoodMacro', FoodMacroSchema)
