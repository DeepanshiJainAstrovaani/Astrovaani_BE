const axios = require("axios");
const db = require("../config/db");
const { getZodiacId } = require("../utils/zodiacUtils");

const API_KEY = "8fdf4f35-59e6-5c1b-9502-2e3638baeb1c";

async function getHoroscopeDetails(req, res) {
    const { zodiac, date } = req.query;

    const zodiacId = getZodiacId(zodiac);
    if (!zodiacId) {
        return res.status(400).json({ error: "Invalid zodiac sign" });
    }

    try {
        console.log(`🔍 Checking database for Zodiac: ${zodiac}, Date: ${date}`);

        // ✅ Fixed Query (Select correct columns)
        const [rows] = await db.execute(
            `SELECT personallife, profession, money, health, emotion, travel, 
            family, friends, luckynumber, luckycolor, luckycolorcode 
            FROM horoscope WHERE zodiac = ? AND todaydate = ?`,
            [zodiac, date]
        );

        if (rows.length > 0) {
            console.log("✅ Found in cache! Serving from database.");
            return res.json({ source: "cache", prediction: rows[0] });
        }

        console.log("⚡ Data not found in database, calling third-party API...");

        const apiUrl = `https://api.vedicastroapi.com/v3-json/prediction/daily-sun?zodiac=${zodiacId}&date=${date}&show_same=true&api_key=${API_KEY}&lang=en&split=true&type=big`;

        const response = await axios.get(apiUrl);

        if (response.status === 200 && response.data) {
            
            const [existingRows] = await db.execute(
                "SELECT COUNT(*) AS count FROM horoscopes WHERE zodiac = ? AND todaydate = ?",
                [zodiac, date]
            );
            
            if (existingRows[0].count > 0) {
                // Update the existing row
                await db.execute(
                    `UPDATE horoscopes 
                    SET personallife = ?, profession = ?, money = ?, health = ?, emotion = ?, travel = ?, 
                    family = ?, friends = ?, luckynumber = ?, luckycolor = ?, luckycolorcode = ? 
                    WHERE zodiac = ? AND todaydate = ?`,
                    [
                        apiResponse.personallife || apiResponse.predictions?.personallife || "",
                        apiResponse.profession || apiResponse.predictions?.profession || "",
                        apiResponse.money || apiResponse.predictions?.money || "",
                        apiResponse.health || apiResponse.predictions?.health || "",
                        apiResponse.emotion || apiResponse.predictions?.emotion || "",
                        apiResponse.travel || apiResponse.predictions?.travel || "",
                        apiResponse.family || apiResponse.predictions?.family || "",
                        apiResponse.friends || apiResponse.predictions?.friends || "",
                        apiResponse.luckynumber || apiResponse.predictions?.luckynumber || "",
                        apiResponse.luckycolor || apiResponse.predictions?.luckycolor || "",
                        apiResponse.luckycolorcode || apiResponse.predictions?.luckycolorcode || "",
                        zodiac,
                        date,
                    ]
                );
            }
            console.log("✅ Data saved in database.");
            return res.json({ source: "api", prediction: response.data });
        } else {
            throw new Error("Invalid API response");
        }
    } catch (error) {
        console.error("❌ Error fetching prediction:", error.message);
        return res.status(500).json({ error: "Failed to fetch horoscope" });
    }
}

module.exports = { getHoroscopeDetails };
