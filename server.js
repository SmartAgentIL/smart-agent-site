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
                { role: "system", content: "You are an AI that builds websites. Return ONLY the full HTML code including CSS. No extra text." },
                { role: "user", content: req.body.message }
            ]
        }, {
            headers: { 
                'Authorization': `Bearer ${OPENAI_API_KEY}`,
                'Content-Type': 'application/json'
            }
        });
        const code = response.data.choices[0].message.content.replace(/```html|```/g, '');
        res.json({ code: code });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server Error" });
    }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
