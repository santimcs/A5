// script.js
// Load the IFrame Player API code asynchronously.
var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// Replace the 'playlist' variable with the actual playlist ID
var playlistId = 'PLxBReoeYDcrtpElaJAhTK9OOBygxo5bvJ';
var player;
var playlistItems = [];
const apiKey = 'AIzaSyBYOWoFmf3cG5Ez653Qdmw9xHmchEMz4Ys'; // Replace with your actual YouTube API key

function onYouTubeIframeAPIReady() {
    // This function creates an <iframe> (and YouTube player) after the API code downloads.
    player = new YT.Player('player', {
        height: '390',
        width: '640',
        events: {
            'onReady': onPlayerReady
        }
    });
}

function onPlayerReady(event) {
    // Use the YouTube Data API to load playlist items
    fetch(`https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${playlistId}&key=${apiKey}&maxResults=50`)
        .then(response => response.json())
        .then(data => {
            playlistItems = data.items;
            populatePlaylist();
        });
}

function populatePlaylist() {
    var playlistElement = document.getElementById('playlist');
    playlistItems.forEach(item => {
        var li = document.createElement('li');
        li.textContent = item.snippet.title;
        li.onclick = function() {
            player.loadVideoById(item.snippet.resourceId.videoId);
        };
        playlistElement.appendChild(li);
    });
}

