const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    maxlegnth: 30,
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
  },
});

module.exports = mongoose.model('user', userSchema);
