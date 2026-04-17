const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

app.post('/chat', async (req, res) => {
    try {
        const response = await axios.post('https://api.openai.com/v1/chat/completions', {
            model: "gpt-4o",
            messages: [
                { role: "system", content: "אתה סוכן ביצוע שבונה אתרים. כשמבקשים ממך אתר, תחזיר אך ורק קוד HTML מלא, כולל CSS פנימי. אל תוסיף הסברים, רק קוד." },
                { role: "user", content: req.body.message }
            ]
        }, {
            headers: { 'Authorization': `Bearer ${OPENAI_API_KEY}` }
        });

        const aiContent = response.data.choices[0].message.content;
        const cleanCode = aiContent.replace(/```html|```/g, '');
        res.json({ code: cleanCode });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "שגיאה פנימית בשרת" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
