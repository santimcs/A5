const playlistId = 'PL8OsnMuHiD8W6nxxq-1t7lVZ4V2FSXnOT';
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

// Function to format duration for display without seconds
function formatDurationForDisplay(duration) {
  const parts = duration.match(/PT(\d+H)?(\d+M)?/);
  const hours = parts && parts[1] ? parts[1].slice(0, -1).padStart(2, '0') : '00';
  const minutes = parts && parts[2] ? parts[2].slice(0, -1).padStart(2, '0') : '00';
  return `${hours}:${minutes}`;
}

// Function to calculate total seconds from duration
function calculateTotalSeconds(duration) {
  const parts = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
  const hours = parts && parts[1] ? parseInt(parts[1].slice(0, -1), 10) * 3600 : 0;
  const minutes = parts && parts[2] ? parseInt(parts[2].slice(0, -1), 10) * 60 : 0;
  const seconds = parts && parts[3] ? parseInt(parts[3].slice(0, -1), 10) : 0;
  return hours + minutes + seconds;
}

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
          const duration = videoData.items[0].contentDetails.duration;
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
  // Sort the videos by published date, view counts in descending order
  
  videosWithDetails.sort((a, b) => {
    // Extract just the date part (YYYY-MM-DD) from the publishedAt timestamp
    const dateA = a.snippet.publishedAt.split('T')[0];
    const dateB = b.snippet.publishedAt.split('T')[0];
  
    // Compare the dates as strings
    if (dateA < dateB) return -1;
    if (dateA > dateB) return 1;
    
    // If dates are equal, sort by view count as numbers
    const viewsA = a.viewCount;
    const viewsB = b.viewCount;
    return viewsB - viewsA;
  });
        
  let counter = 1; // Initialize the counter outside the loop

  videosWithDetails.forEach(video => {
    const { snippet, duration, viewCount } = video;
    const videoId = snippet.resourceId.videoId;
    const thumbnail = snippet.thumbnails.default.url;
    const title = snippet.title.trim();
    const publishDate = formatDate(snippet.publishedAt);
    const views = formatViews(viewCount);

    // Use the calculateTotalSeconds function for logic
    const totalSeconds = calculateTotalSeconds(duration);

    // Use the formatDurationForDisplay function for displaying the duration without seconds
    const durationForDisplay = formatDurationForDisplay(duration);

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
        <td>${durationForDisplay}</td>
        <td>${views}</td>
      `;

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