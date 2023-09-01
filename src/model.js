const mongoose = require('mongoose');

module.exports = mongoose.model('plan', {
  title: {
    type: String,
    required: true
  },
  plan: {
    type: String
  },
  start_date: {
    type: Date,
    required: true
  },
  end_date: {
    type: Date,
    required: true
  },
  is_completed: {
    type: Boolean,
    default: false
  }
});
