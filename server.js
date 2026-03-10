const express = require("express");
require("dotenv").config();

const app = express();

app.use(express.json());
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

app.post("/generate-playlist", (req, res) => {

  const mood = req.body.mood;

  const playlist = `
1. Midnight City - M83
2. Electric Feel - MGMT
3. Time to Pretend - MGMT
4. Dreams - Fleetwood Mac
5. Nightcall - Kavinsky
6. After Dark - Mr. Kitty
7. Blinding Lights - The Weeknd
8. Midnight - Lane 8
9. Kids - MGMT
10. Daydreaming - Instrumental
`;

  res.json({ playlist });

});

app.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});
