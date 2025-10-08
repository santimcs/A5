const playlistId = 'PL2kaA2y8FUAbvejbXsDLLAr_levvcF3MG';
const apiKey = 'AIzaSyBYOWoFmf3cG5Ez653Qdmw9xHmchEMz4Ys'; // Replace with your actual YouTube API key
const videoGallery = document.getElementById('videoGallery');

// Insert the table headers
videoGallery.innerHTML = `
<tr>
  <th>No.</th>
  <th>Thumbnail</th>
  <th>Title</th>
  <th>Publish Date</th>
  <th>Duration</th>
  <th>Views</th>
</tr>
`;

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toISOString().split('T')[0]; // This will return the date in YYYY-MM-DD format
}

function formatDuration(duration) {
  // Matches PT#H#M#S format and captures the time values
  const matches = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
  const hours = matches[1] ? matches[1].slice(0, -1).padStart(2, '0') : '00';
  const minutes = matches[2] ? matches[2].slice(0, -1).padStart(2, '0') : '00';
  const seconds = matches[3] ? matches[3].slice(0, -1).padStart(2, '0') : '00';
  return `${hours}:${minutes}:${seconds}`;
}

// function formatDuration(duration) {
//   // Matches PT#H#M#S format and captures the time values
//   const matches = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
//   const hours = matches[1] ? matches[1].slice(0, -1).padStart(2, '0') : '00';
//   const minutes = matches[2] ? matches[2].slice(0, -1).padStart(2, '0') : '00';
//   const seconds = matches[3] ? matches[3].slice(0, -1).padStart(2, '0') : '00';
//   return `${hours}:${minutes}`;
// }

// function formatDuration(duration) {
//   const matches = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
//   if (matches) {
//     const hours = matches[1] ? matches[1].slice(0, -1).padStart(2, '0') : '00';
//     const minutes = matches[2] ? matches[2].slice(0, -1).padStart(2, '0') : '00';
//     return `${hours}:${minutes}`;
//   }
//   return '00:00'; // Fallback in case matches are null
// }

// function formatDuration(duration) {
//   const matches = duration.match(/PT(\d+H)?(\d+M)?/);
//   if (!matches) return '00:00'; // Return a default value if no match is found
//     const hours = matches[1] ? matches[1].slice(0, -1).padStart(2, '0') : '00';
//     const minutes = matches[2] ? matches[2].slice(0, -1).padStart(2, '0') : '00';
//     return `${hours}:${minutes}`;
// }

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
          // const viewCount = formatViews(videoData.items[0].statistics.viewCount);
          const viewCount = videoData.items[0].statistics.viewCount;
          // console.log(viewCount);
          return {
            ...item,
            duration,
            viewCount
          };
        });
    });

// ... previous code ...

Promise.all(videoDetailsPromises).then(videosWithDetails => {
  // Sort the videos by published date in descending order
  
  videosWithDetails.sort((a, b) => {
    // Extract just the date part (YYYY-MM-DD) from the publishedAt timestamp
    const dateA = a.snippet.publishedAt.split('T')[0];
    const dateB = b.snippet.publishedAt.split('T')[0];
  
    // Compare the dates as strings
    if (dateA < dateB) return 1;
    if (dateA > dateB) return -1;
    
    // If dates are equal, sort by view count as numbers
    const viewsA = a.viewCount;
    const viewsB = b.viewCount;
    // const viewsA = parseInt(a.viewCount.replace(/,/g, ''), 10);
    // const viewsB = parseInt(b.viewCount.replace(/,/g, ''), 10);
    // console.log(viewsA, viewsB);
    // Ensure that sorting by view count is in ascending order
    return viewsA - viewsB;
  });
        
  let counter = 1; // Initialize the counter outside the loop

  videosWithDetails.forEach(video => {
    const { snippet, duration, viewCount } = video;
    const videoId = snippet.resourceId.videoId;
    const thumbnail = snippet.thumbnails.default.url;
    const title = snippet.title.trim();
    const publishDate = formatDate(snippet.publishedAt);
    const views = formatViews(viewCount);

    // Convert duration to total seconds for comparison
    const totalSeconds = duration.split(':').reduce((acc, time) => (60 * acc) + +time, 0);

    // Using Unicode representation for comparison
    const unicodeString = '\u3010\u4E2D\u65E5\u5B57\u5E55\u3011'; // Unicode for 【中日字幕]
    const isFilteredTitle = title.startsWith(unicodeString);
    // console.log(`Filtered by title (${title}): ${isFilteredTitle}`); // Log the result of the title comparison

    if (totalSeconds >= 60 && !isFilteredTitle) {
      const videoRow = document.createElement('tr');
      videoRow.innerHTML = `
        <td>${counter++}</td> <!-- Add this line to include the running number -->
        <td class="videoThumbnail"><img src="${thumbnail}" alt="${title}" /></td>
        <td>${title}</td>
        <td>${publishDate}</td>
        <td>${duration}</td>
        <td>${views}</td>
      `;

      // videoRow.addEventListener('click', () => {
      //   playVideo(videoId);
      // });

      videoRow.querySelector('.videoThumbnail').addEventListener('click', () => {
        playVideo(videoId);
      });
      
      videoGallery.appendChild(videoRow);
    }
  });
});

});
// ... rest of the script ...
function playVideo(videoId) {
  // Open the YouTube video in a new tab
  window.open(`https://www.youtube.com/watch?v=${videoId}`, '_blank').focus();
}