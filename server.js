const express = require("express");
const OpenAI = require("openai");
const SpotifyWebApi = require("spotify-web-api-node");
require("dotenv").config();

import dotenv from "dotenv";
dotenv.config();

const app = express();

app.use(express.json());
app.use(express.static("public"));

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  redirectUri: process.env.REDIRECT_URI
});

app.get("/login", (req, res) => {

  const scopes = [
    "playlist-modify-public",
    "playlist-modify-private"
  ];

  const authorizeURL = spotifyApi.createAuthorizeURL(scopes);

  res.redirect(authorizeURL);

});

app.get("/callback", async (req, res) => {

  const code = req.query.code;

  const data = await spotifyApi.authorizationCodeGrant(code);

  spotifyApi.setAccessToken(data.body.access_token);
  spotifyApi.setRefreshToken(data.body.refresh_token);

  res.send("Spotify connected! Go back and generate a playlist.");

});

app.post("/generate-playlist", async (req, res) => {

  try {

    const mood = req.body.mood;

    // Generate songs with OpenAI
    const completion = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        {
          role: "system",
          content: "Generate a 10 song playlist. Format: Song - Artist"
        },
        {
          role: "user",
          content: `Mood: ${mood}`
        }
      ]
    });

    const songs = completion.choices[0].message.content.split("\n");

    // Get Spotify user
    const me = await spotifyApi.getMe();

    const playlist = await spotifyApi.createPlaylist(me.body.id, {
      name: `AI Mood Playlist: ${mood}`,
      public: true
    });

    const trackUris = [];

    for (let song of songs) {

      const search = await spotifyApi.searchTracks(song);

      if (search.body.tracks.items.length > 0) {
        trackUris.push(search.body.tracks.items[0].uri);
      }

    }

    await spotifyApi.addTracksToPlaylist(
      playlist.body.id,
      trackUris
    );

    res.json({
      message: "Playlist created!",
      playlist: playlist.body.external_urls.spotify
    });

  } catch (err) {

    console.error(err);
    res.status(500).json({ error: "Something failed" });

  }

});

app.listen(3000, () => {
  console.log("Running on http://localhost:3000");
});
