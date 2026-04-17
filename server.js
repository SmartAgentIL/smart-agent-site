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
                { 
                    role: "system", 
                    content: "You are an AI web developer. Return ONLY the full HTML code including CSS. No extra text or explanations." 
                },
                { role: "user", content: req.body.message }
            ]
        }, {
            headers: { 
                'Authorization': `Bearer ${OPENAI_API_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        let aiContent = response.data.choices[0].message.content;
        const cleanCode = aiContent.replace(/```html|```/g, '').trim();
        
        res.json({ code: cleanCode });
    } catch (error) {
        console.error("Error:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
