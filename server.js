import express from "express";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.static("public"));

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.post("/generate-playlist", async (req, res) => {
  const { mood } = req.body;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are a music expert that creates playlists."
        },
        {
          role: "user",
          content: `Create a 10 song playlist for this mood or activity: ${mood}. Only return a numbered list with song and artist.`
        }
      ]
    });

    const playlist = response.choices[0].message.content;

    res.json({ playlist });

  } catch (error) {
    console.error(error);
    res.status(500).send("Error generating playlist");
  }
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
