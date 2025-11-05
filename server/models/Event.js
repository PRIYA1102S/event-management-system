const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  profiles: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Profile',
    required: true,
  }],
  timezone: {
    type: String,
    required: true,
  },
  start: {
    type: Date,
    required: true,
  },
  end: {
    type: Date,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  updateLogs: [{
    timestamp: {
      type: Date,
      default: Date.now,
    },
    previousValues: mongoose.Schema.Types.Mixed,
    updatedValues: mongoose.Schema.Types.Mixed,
  }],
});


eventSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Event', eventSchema);
