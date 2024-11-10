const mongoose = require('mongoose')

const schema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      minlength: 1
    },
    author: {  
      type: mongoose.Schema.Types.ObjectId,  
      ref: 'Author'  
    },
    published: {
      type: Number,
      required: true,
      min: 1000
    },
    genres: [{
      type: String,
      minlength: 1
    }]
  },
  { collection : 'books' }
)

module.exports = mongoose.model('Book', schema)