const mongoose = require('mongoose');

const horoscopeSchema = new mongoose.Schema({
  zodiac: {
    type: String,
    required: [true, 'Zodiac sign is required'],
    trim: true,
    maxlength: 20
  },
  todaydate: {
    type: String,
    required: [true, 'Date is required']
  },
  datetext: {
    type: String,
    trim: true
  },
  personallife: {
    type: String,
    trim: true
  },
  profession: {
    type: String,
    trim: true
  },
  money: {
    type: String,
    trim: true
  },
  health: {
    type: String,
    trim: true
  },
  emotion: {
    type: String,
    trim: true
  },
  travel: {
    type: String,
    trim: true
  },
  family: {
    type: String,
    trim: true
  },
  friends: {
    type: String,
    trim: true
  },
  luckynumber: {
    type: String,
    trim: true
  },
  luckycolor: {
    type: String,
    trim: true
  },
  luckycolorcode: {
    type: String,
    trim: true
  }
}, {
  timestamps: true,
  collection: 'horoscope'
});

// Compound unique index for zodiac and date
horoscopeSchema.index({ zodiac: 1, todaydate: 1 }, { unique: true });

const Horoscope = mongoose.model('Horoscope', horoscopeSchema);

module.exports = Horoscope;
