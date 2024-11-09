const mongoose = require('mongoose')

const schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: 5
    },
    born: {
      type: Number,
      min: 1000
    },
    bookCount: {
      type: Number
    }
  },
  { collection : 'authors' }
)

module.exports = mongoose.model('Author', schema)