const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 5000;

app.post('/api/generate', async (req, res) => {
    try {
        const { prompt } = req.body;
        
        // Forwarding to On-Demand API
        const response = await axios.post('https://api.on-demand.io/chat/v1/sessions/query', 
        {
            query: `Write a short, immersive story based on this prompt: ${prompt}`,
            endpointId: "predefined-openai-gpt4.1-nano",
            responseMode: "sync"
        }, 
        {
            headers: { 'apikey': process.env.ONDEMAND_API_KEY }
        });

        res.json({ answer: response.data.data.answer });
    } catch (error) {
        console.error("API Error:", error.message);
        res.status(500).json({ error: 'The storyteller is lost in the void.' });
    }
});

app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));