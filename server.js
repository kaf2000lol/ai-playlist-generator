const express = require("express");
const OpenAI = require("openai");
require("dotenv").config();

const app = express();

app.use(express.json());
app.use(express.static("public"));

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.post("/generate-playlist", async (req, res) => {

  try {

    const mood = req.body.mood;

    const completion = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        {
          role: "system",
          content: "Create a 10 song playlist. Format exactly: Song - Artist"
        },
        {
          role: "user",
          content: `Mood: ${mood}`
        }
      ]
    });

    const songs = completion.choices[0].message.content
      .split("\n")
      .filter(Boolean);

    const playlist = songs.map(song => {
      const query = encodeURIComponent(song);

      return {
        title: song,
        youtube: `https://www.youtube.com/results?search_query=${query}`
      };

    });

    res.json({ playlist });

  } catch (err) {

    console.error(err);
    res.status(500).json({ error: "AI failed" });

  }

});

app.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});
