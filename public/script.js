async function generatePlaylist(){

const mood = document.getElementById("moodInput").value;
const playlistDiv = document.getElementById("playlist");
const loading = document.getElementById("loading");

playlistDiv.textContent = "";
loading.textContent = "Generating playlist...";

const response = await fetch("/generate-playlist",{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({mood})
});

const data = await response.json();

loading.textContent = "";
playlistDiv.textContent = data.playlist;

}
