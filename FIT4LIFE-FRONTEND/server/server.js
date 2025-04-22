import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fetch from 'node-fetch';

dotenv.config();
const app = express();
const PORT = 3001;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

app.use(cors());
app.use(express.json());

app.post('/api/chat', async (req, res) => {
    console.log("Requête reçue:", req.body);

    if (!GEMINI_API_KEY) {
        return res.status(500).json({ error: "Clé API Google Gemini manquante" });
    }

    try {
        const bodyContent = {
            contents: [{ parts: [{ text: req.body.message }] }]
        };
        
        const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(bodyContent)
        });
        
        
        const data = await response.json();

        if (data.error) {
            return res.status(400).json({ error: data.error.message });
        }

        const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text || "Je n'ai pas compris.";
        res.json({ answer: responseText });

    } catch (error) {
        console.error(" Erreur API Gemini:", error);
        res.status(500).json({ error: "Erreur de connexion avec Gemini" });
    }
});

app.post('/api/generer-entrainement', async (req, res) => {
    const { objectif, experience, type } = req.body;

    const bodyContent = {
        contents: [
            {
                parts: [
                    {
                        text: `Crée un plan d'entraînement pour quelqu'un qui veut ${objectif}, a un niveau ${experience} et préfère un style ${type}. Donne moi le plan sous forme de tableau clair et précis , avec exercices, séries, répétitions.`
                    }
                ]
            }
        ]
    };

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(bodyContent)
        });

        const data = await response.json();

        if (data.error) {
            return res.status(400).json({ error: data.error.message });
        }

        const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text || "Je n'ai pas compris.";
        res.json({ answer: responseText });
    } catch (e) {
        console.error("Erreur IA:", e);
        res.status(500).json({ error: "Erreur IA" });
    }
});



const server = app.listen(PORT, () => {
    console.log(`Serveur Express lancé sur http://localhost:${PORT}`);
});

server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`Le port ${PORT} est déjà utilisé, tentative sur un autre port...`);
        server.listen(PORT + 1);  
    } else {
        console.error('Erreur serveur:', err);
    }
});

