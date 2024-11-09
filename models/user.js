const mongoose = require('mongoose')

const schema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      minlength: 3
    },
    passwordHash: {
      type: String,
      required: true
    },
    favoriteGenre: {
      type: String
    },
    books: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book'
      }
    ],
  },
  { collection : 'users' }
)

module.exports = mongoose.model('User', schema)