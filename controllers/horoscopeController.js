const horoscopeModel = require('../models/horoscopeModel');
const axios = require('axios');

// Get all horoscopes
exports.getAllHoroscopes = async (req, res) => {
  try {
    const results = await horoscopeModel.getAllHoroscopes();
    res.json(results);
  } catch (error) {
    console.error('Error fetching horoscopes:', error);
    return res.status(500).json({ error: 'Database error', message: error.message });
  }
};

exports.getDailyPrediction = async (req, res) => {
    const zodiac = req.query.zodiac;
    const todayDate = new Date().toLocaleDateString('en-GB'); // "DD/MM/YYYY"

    if (!zodiac) {
        console.warn('[WARN] Zodiac is missing in request');
        return res.status(400).json({ error: 'Zodiac is required' });
    }

    try {
        // Check if today's data already exists
        const existing = await horoscopeModel.getByZodiacAndDate(zodiac, todayDate);

        if (existing) {
            console.log(`[CACHE HIT] Fetched from DB for ${zodiac} - ${todayDate}`);
            return res.json(existing); // ✅ return cached version
        }

        console.log(`[CACHE MISS] No DB entry for ${zodiac} - ${todayDate}. Fetching from API...`);

        // 🔁 Else fetch from 3rd party
        const apiKey = 'ee6ba1f7-c2cb-57ec-b68d-12ed2daff037';
        const dateParam = todayDate;
        const zodiacMap = {
            Aries: 1, Tauras: 2, Gemini: 3, Cancer: 4,
            Leo: 5, Virgo: 6, Libra: 7, Scorpio: 8,
            Sagittarius: 9, Capricorn: 10, Aquarius: 11, Pisces: 12
        };

        const zodiacNum = zodiacMap[zodiac];
        if (!zodiacNum) {
            console.warn(`[ERROR] Invalid zodiac: ${zodiac}`);
            return res.status(400).json({ error: 'Invalid zodiac name' });
        }

        const url = `https://api.vedicastroapi.com/v3-json/prediction/daily-sun?zodiac=${zodiacNum}&date=${dateParam}&show_same=true&api_key=${apiKey}&lang=en&split=true&type=big`;

        const response = await axios.get(url);
        const data = response.data.response;

        console.log(`[API] Data fetched for ${zodiac} from third-party API`);

        // Format for DB update
        const formatted = {
            zodiac: data.zodiac,
            todaydate: todayDate,
            personallife: data.bot_response.relationship.split_response,
            profession: data.bot_response.career.split_response,
            money: data.bot_response.finances.split_response,
            health: data.bot_response.health.split_response,
            emotion: data.bot_response.status.split_response,
            travel: data.bot_response.travel.split_response,
            family: data.bot_response.family.split_response,
            friends: data.bot_response.friends.split_response,
            luckynumber: data.lucky_number.join(', '),
            luckycolor: data.lucky_color,
            luckycolorcode: data.lucky_color_code,
            datetext: Math.floor(Date.now() / 1000).toString()
        };

        // 🔄 Update the existing zodiac record
        await horoscopeModel.updateHoroscopeByZodiac(zodiac, formatted);

        // Return updated data
        const updated = await horoscopeModel.getByZodiacAndDate(zodiac, todayDate);
        console.log(`[DB] Final data sent to client for ${zodiac}`);
        res.json(updated);

    } catch (err) {
        console.error('[ERROR] Internal Server Error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};
