const express = require("express");
const OpenAI = require("openai");
require("dotenv").config();

const app = express();

app.use(express.json());
app.use(express.static("public"));

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

app.post("/generate-playlist", async (req, res) => {

  try {

    const mood = req.body.mood;

    const completion = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        {
          role: "system",
          content: "You are a music expert that creates playlists."
        },
        {
          role: "user",
          content: `Create a 10 song playlist for someone feeling: ${mood}. 
          Format like: Song - Artist`
        }
      ]
    });

    const playlist = completion.choices[0].message.content;

    res.json({ playlist });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to generate playlist" });
  }

});

app.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});

app.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});
