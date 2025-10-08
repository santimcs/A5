// Replace 'YOUR_API_KEY' with your actual YouTube API key
const apiKey = 'AIzaSyBYOWoFmf3cG5Ez653Qdmw9xHmchEMz4Ys';
// Replace 'YOUR_PLAYLIST_ID' with your actual YouTube Playlist ID
const playlistId = 'PLxBReoeYDcrtpElaJAhTK9OOBygxo5bvJ';
const apiUrl = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet,contentDetails&playlistId=${playlistId}&key=${apiKey}&maxResults=50`;
// const apiUrl = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet,contentDetails,statiastics&playlistId=${playlistId}&key=${apiKey}&maxResults=50`;
// const apiUrl = `https://www.googleapis.com/youtube/v3/playlistItems?part=&part=contentDetails,statistics&playlistId=${playlistId}&key=${apiKey}&maxResults=50`;

// Function to get episodes from YouTube API
// function getEpisodes(apiUrl) {
//     fetch(apiUrl)
//         .then(response => response.json())
//         .then(data => {
//             const episodes = data.items.map(item => ({
//                 thumbnailUrl: item.snippet.thumbnails.medium.url,
//                 title: item.snippet.title,
//                 publishDate: new Date(item.contentDetails.videoPublishedAt).toISOString().split('T')[0],
//                 duration: item.contentDetails.duration,
//                 // views: item.statistics.viewCount,
//                 videoId: item.contentDetails.videoId
//             }));
//             displayEpisodes(sortEpisodes(episodes));
//         })
//         .catch(error => console.error('Error fetching data: ', error));
// }

function getEpisodes(apiUrl) {
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            const episodes = data.items.map(item => ({
                thumbnailUrl: item.snippet.thumbnails.medium.url,
                title: item.snippet.title,
                publishDate: new Date(item.contentDetails.videoPublishedAt).toISOString().split('T')[0],
                duration: item.contentDetails.duration,
                views: item.statistics ? item.statistics.viewCount : 'N/A', // Corrected line
                videoId: item.contentDetails.videoId
            }));
            displayEpisodes(sortEpisodes(episodes));
        })
        .catch(error => console.error('Error fetching data: ', error));
}



// Function to sort episodes
function sortEpisodes(episodes) {
    // Your sorting logic here
    return episodes.sort((a, b) => {
        // Sort logic...
    });
}

// Function to display episodes in the table
function displayEpisodes(episodes) {
    const tableBody = document.getElementById('episodesTable').getElementsByTagName('tbody')[0];
    episodes.forEach(episode => {
        let row = tableBody.insertRow();
        row.innerHTML = `
            <td><a href="https://www.youtube.com/watch?v=${episode.videoId}" target="_blank"><img src="${episode.thumbnailUrl}" alt="Thumbnail"></a></td>
            <td>${episode.title}</td>
            <td>${episode.publishDate}</td>
            <td>${episode.duration}</td>
            <td>${formatViews(episode.views)}</td>
        `;
    });
}

// Function to format the view count
function formatViews(viewCount) {
    if (viewCount >= 1000000) {
        return (viewCount / 1000000).toFixed(1) + 'M views';
    } else if (viewCount >= 1000) {
        return (viewCount / 1000).toFixed(1) + 'K views';
    } else {
        return viewCount + ' views';
    }
}

// Call the function to get and display episodes
getEpisodes(apiUrl);
