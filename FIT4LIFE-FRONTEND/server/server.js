import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fetch from 'node-fetch';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3001;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:4201';

app.use(cors());
app.use(express.json());

app.post('/api/chat', async (req, res) => {
  try {
    if (!GEMINI_API_KEY) {
      return res.status(500).json({ error: "Clé API Google Gemini manquante" });
    }

    const bodyContent = {
      contents: [{ parts: [{ text: req.body.message }] }]
    };

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyContent)
      }
    );

    const data = await response.json();
    const responseText =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Je n'ai pas compris.";
    res.json({ answer: responseText });
  } catch (error) {
    console.error("Erreur API Gemini:", error);
    res.status(500).json({ error: "Erreur de connexion avec Gemini" });
  }
});

app.post('/api/generer-entrainement', async (req, res) => {
  try {
    const token = req.headers.authorization;
    const response = await fetch(
      `${BACKEND_URL}/user/generer-entrainement`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: token } : {})
        },
        body: JSON.stringify(req.body)
      }
    );

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    console.error("Erreur proxy génération entraînement IA:", error);
    res
      .status(500)
      .json({ error: "Erreur de proxy vers le backend de génération IA" });
  }
});

app.listen(PORT, () => {
  console.log(`Serveur Express lancé sur http://localhost:${PORT}`);
});
