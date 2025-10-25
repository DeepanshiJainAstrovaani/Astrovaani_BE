const Horoscope = require('./schemas/horoscopeSchema');

// Fetch all horoscopes
exports.getAllHoroscopes = async () => {
  try {
    return await Horoscope.find({});
  } catch (error) {
    throw error;
  }
};

// Get by zodiac and date
exports.getByZodiacAndDate = async (zodiac, date) => {
  try {
    const horoscope = await Horoscope.findOne({ zodiac, todaydate: date });
    
    if (horoscope) {
      console.log(`[DB] Entry found for ${zodiac} - ${date}`);
    } else {
      console.log(`[DB] No entry found for ${zodiac} - ${date}`);
    }
    
    return horoscope;
  } catch (error) {
    console.error(`[DB ERROR] Fetching ${zodiac} - ${date}:`, error);
    throw error;
  }
};

// Update existing row by zodiac
exports.updateHoroscopeByZodiac = async (zodiac, data) => {
  try {
    const updateFields = {
      personallife: data.personallife,
      profession: data.profession,
      money: data.money,
      health: data.health,
      emotion: data.emotion,
      travel: data.travel,
      family: data.family,
      friends: data.friends,
      luckynumber: data.luckynumber,
      luckycolor: data.luckycolor,
      luckycolorcode: data.luckycolorcode,
      datetext: data.datetext,
      todaydate: data.todaydate,
    };

    const result = await Horoscope.findOneAndUpdate(
      { zodiac },
      updateFields,
      { new: true, upsert: true, runValidators: true }
    );

    console.log(`[DB] Updated DB for ${zodiac} - ${data.todaydate}`);
    return result;
  } catch (error) {
    console.error(`[DB ERROR] Updating ${zodiac}:`, error);
    throw error;
  }
};
