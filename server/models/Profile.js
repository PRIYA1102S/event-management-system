const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  timezone: {
    type: String,
    required: true,
    default: 'UTC', 
  },
});

module.exports = mongoose.model('Profile', profileSchema);
