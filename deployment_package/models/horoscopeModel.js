const db = require('../config/db');

// Fetch all horoscopes
exports.getAllHoroscopes = (callback) => {
  const query = 'SELECT * FROM horoscope';
  db.query(query, callback);
};

// Get by zodiac and date
exports.getByZodiacAndDate = (zodiac, date, callback) => {
  return new Promise((resolve, reject) => {
    db.query(
      'SELECT * FROM horoscope WHERE zodiac = ? AND todaydate = ?',
      [zodiac, date],
      (err, results) => {
        if (err) {
          console.error(`[DB ERROR] Fetching ${zodiac} - ${date}:`, err);
          return reject(err);
        }

        if (results.length > 0) {
          console.log(`[DB] Entry found for ${zodiac} - ${date}`);
        } else {
          console.log(`[DB] No entry found for ${zodiac} - ${date}`);
        }

        resolve(results[0] || null);
      }
    );
  });
};

// Update existing row by zodiac
exports.updateHoroscopeByZodiac = (zodiac, data) => {
  return new Promise((resolve, reject) => {
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
      todaydate: data.todaydate, // ✅ update todaydate separately
    };

    db.query(
      'UPDATE horoscope SET ? WHERE zodiac = ?',
      [updateFields, zodiac],
      (err, results) => {
        if (err) {
          console.error(`[DB ERROR] Updating ${zodiac}:`, err);
          return reject(err);
        }
        console.log(`[DB] Updated DB for ${zodiac} - ${data.todaydate}`);
        resolve(results);
      }
    );
  });
};
