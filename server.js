const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

app.post('/chat', async (req, res) => {
    try {
        const response = await axios.post('https://api.openai.com/v1/chat/completions', {
            model: "gpt-4o",
            messages: [
                { 
                    role: "system", 
                    content: "אתה סוכן ביצוע מומחה לבניית אתרים. כשמבקשים ממך לבנות אתר, תחזיר אך ורק קוד HTML מלא, כולל CSS מודרני (אפשר להשתמש ב-Tailwind דרך CDN) ו-JS אם צריך. אל תוסיף הסברים או טקסט לפני/אחרי הקוד. תחזיר רק את הקוד עצמו." 
                },
                { role: "user", content: req.body.message }
            ],
            temperature: 0.7
        }, {
            headers: {
                'Authorization': `Bearer ${OPENAI_API_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        let aiContent = response.data.choices[0].message.content;
        
        // ניקוי תגיות Markdown אם ה-AI הוסיף אותן בטעות
        const cleanCode = aiContent.replace(/```html|```/g, '').trim();
        
        res.json({ code: cleanCode });
    } catch (error) {
        console.error("OpenAI Error:", error.response ? error.response.data : error.message);
        res.status(500).json({ error: "שגיאה פנימית בחיבור ל-OpenAI" });
    }
});

// פורט 10000 הוא ברירת המחדל של Render
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
