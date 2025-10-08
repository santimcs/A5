const playlistId = 'PLxBReoeYDcrtpElaJAhTK9OOBygxo5bvJ';
const apiKey = 'AIzaSyBYOWoFmf3cG5Ez653Qdmw9xHmchEMz4Ys'; // Replace with your actual YouTube API key
const videoGallery = document.getElementById('videoGallery');

// Insert the table headers
videoGallery.innerHTML = `
<tr>
  <th>Thumbnail</th>
  <th>Title</th>
  <th>Publish Date</th>
  <th>Duration</th>
  <th>No. of Views</th>
</tr>
`;

// ... rest of the script

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toISOString().split('T')[0]; // This will return the date in YYYY-MM-DD format
}

// ... rest of the script

function formatDuration(duration) {
  // Matches PT#H#M#S format and captures the time values
  const matches = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
  const hours = matches[1] ? matches[1].slice(0, -1).padStart(2, '0') : '00';
  const minutes = matches[2] ? matches[2].slice(0, -1).padStart(2, '0') : '00';
  const seconds = matches[3] ? matches[3].slice(0, -1).padStart(2, '0') : '00';
  return `${hours}:${minutes}:${seconds}`;
}

// ... rest of the script

// Function to format the view count
function formatViews(views) {
  if (views >= 1000000) {
    return (views / 1000000).toFixed(1) + 'M views';
  } else if (views >= 1000) {
    return (views / 1000).toFixed(0) + 'K views';
  }
  return views ;
  // return views + ' views';
}

// Update the gallery header in HTML to include Number of Views
// ...

fetch(`https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${playlistId}&key=${apiKey}&maxResults=50`)
  .then(response => response.json())
  .then(data => {
    const videoDetailsPromises = data.items.map(item => {
      const videoId = item.snippet.resourceId.videoId;
      // Get video details including viewCount
      return fetch(`https://www.googleapis.com/youtube/v3/videos?id=${videoId}&key=${apiKey}&part=contentDetails,statistics`)
        .then(response => response.json())
        .then(videoData => {
          const duration = formatDuration(videoData.items[0].contentDetails.duration);
          const viewCount = formatViews(videoData.items[0].statistics.viewCount);
          return {
            ...item,
            duration,
            viewCount
          };
        });
    });

    Promise.all(videoDetailsPromises).then(videosWithDetails => {
      // Sort the videos by published date in ascending order
      videosWithDetails.sort((a, b) => new Date(a.snippet.publishedAt) - new Date(b.snippet.publishedAt));

      videosWithDetails.forEach(video => {
        const { snippet, duration, viewCount } = video;
        const videoId = snippet.resourceId.videoId;
        const thumbnail = snippet.thumbnails.default.url;
        const title = snippet.title;
        const publishDate = formatDate(snippet.publishedAt);
        const views = formatViews(viewCount);

        const videoRow = document.createElement('tr');
        videoRow.innerHTML = `
          <td class="videoThumbnail"><img src="${thumbnail}" alt="${title}" /></td>
          <td>${title}</td>
          <td>${publishDate}</td>
          <td>${duration}</td>
          <td>${views}</td> <!-- Added view count cell -->
        `;
        videoRow.addEventListener('click', () => {
          playVideo(videoId);
        });

        videoGallery.appendChild(videoRow);
      });
    });
  });

// ... rest of the script


function playVideo(videoId) {
  // Open the YouTube video in a new tab
  window.open(`https://www.youtube.com/watch?v=${videoId}`, '_blank').focus();
}

// ... rest of the script

// function playVideo(videoId) {
//   const videoPlayer = document.getElementById('videoPlayer');
//   videoPlayer.innerHTML = `
//     <iframe width="640" height="360" src="https://www.youtube.com/embed/${videoId}?autoplay=1" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>
//   `;
// }

