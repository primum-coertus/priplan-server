const mongoose = require('mongoose');

module.exports = mongoose.model('plan', {
  title: {
    type: String,
    require: true
  },
  plan: {
    type: String
  },
  start_date: {
    type: Date,
    require: true
  },
  end_date: {
    type: Date,
    require: true
  },
  is_completed: {
    type: Boolean,
    default: false
  }
});
