async function generatePlaylist(){

const mood = document.getElementById("moodInput").value;

const response = await fetch("/generate-playlist",{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({mood})
});

const data = await response.json();

document.getElementById("playlist").textContent = data.playlist;

}
