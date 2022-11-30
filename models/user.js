const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    maxlength: 30,
    minlength: 2,
    required: true,
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  email: {
    type: String,
    unique: true,
    required: true,
    validate: {
      validator(v) {
        return /[a-zA-Z0-9]*@[a-zA-Z0-0]*\.[a-zA-Z0-9]*/.test(v);
      },
    },
  },
});

module.exports = mongoose.model('user', userSchema);
