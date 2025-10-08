const apiKey = 'AIzaSyBYOWoFmf3cG5Ez653Qdmw9xHmchEMz4Ys';
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
  return date.toISOString().split('T')[0];
}

function formatDurationForDisplay(duration) {
  const parts = duration.match(/PT(\d+H)?(\d+M)?/);
  const hours = parts && parts[1] ? parts[1].slice(0, -1).padStart(2, '0') : '00';
  const minutes = parts && parts[2] ? parts[2].slice(0, -1).padStart(2, '0') : '00';
  return `${hours}:${minutes}`;
}

function calculateTotalSeconds(duration) {
  const parts = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
  const hours = parts && parts[1] ? parseInt(parts[1].slice(0, -1), 10) * 3600 : 0;
  const minutes = parts && parts[2] ? parseInt(parts[2].slice(0, -1), 10) * 60 : 0;
  const seconds = parts && parts[3] ? parseInt(parts[3].slice(0, -1), 10) : 0;
  return hours + minutes + seconds;
}

function formatViews(views) {
  if (views >= 1000000) {
    return (views / 1000000).toFixed(1) + 'M';
  } else if (views >= 1000) {
    return (views / 1000).toFixed(0) + 'K';
  }
  return views;
}

function parseCSV(csv) {
  const lines = csv.split('\n');
  const videoIds = [];
  
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line) {
      const [number, videoId] = line.split(',');
      if (videoId) {
        videoIds.push(videoId.trim());
      }
    }
  }
  
  return videoIds;
}

// ========== CONFIGURATION ==========
// For LOCAL development: Use file input method
// For AWS S3 deployment: Change to false
const USE_FILE_INPUT = true;
// ===================================

async function loadVideoData(csvText = null) {
  try {
    let csvContent;
    
    if (USE_FILE_INPUT) {
      // Local development mode - use file input
      csvContent = await getCSVFromFileInput();
    } else {
      // AWS S3 mode - fetch from file
      const csvUrl = 'yt_videos.csv'; // This works on S3
      const csvResponse = await fetch(csvUrl);
      if (!csvResponse.ok) {
        throw new Error(`Failed to load CSV file: ${csvResponse.status}`);
      }
      csvContent = await csvResponse.text();
    }
    
    const videoIds = parseCSV(csvContent);
    
    if (videoIds.length === 0) {
      throw new Error('No video IDs found in CSV file');
    }

    // Fetch video details for each video ID
    const videoDetailsPromises = videoIds.map(videoId => {
      return fetch(`https://www.googleapis.com/youtube/v3/videos?id=${videoId}&key=${apiKey}&part=snippet,contentDetails,statistics`)
        .then(response => response.json())
        .then(videoData => {
          if (videoData.items && videoData.items.length > 0) {
            const item = videoData.items[0];
            const snippet = item.snippet;
            const duration = item.contentDetails.duration;
            const viewCount = item.statistics.viewCount;
            
            return {
              snippet,
              duration,
              viewCount,
              resourceId: { videoId: videoId }
            };
          }
          return null;
        })
        .catch(error => {
          console.error(`Error fetching data for video ${videoId}:`, error);
          return null;
        });
    });

    const videosWithDetails = await Promise.all(videoDetailsPromises);
    
    // Filter out any null results (failed fetches)
    const validVideos = videosWithDetails.filter(video => video !== null);

    // Sort the videos by published date, view counts in descending order
    validVideos.sort((a, b) => {
      const dateA = a.snippet.publishedAt.split('T')[0];
      const dateB = b.snippet.publishedAt.split('T')[0];
    
      if (dateA < dateB) return -1;
      if (dateA > dateB) return 1;
      
      const viewsA = a.viewCount;
      const viewsB = b.viewCount;
      return viewsB - viewsA;
    });
          
    let counter = 1;
    let totalEPSeconds = 0;
    let totalEPViews = 0;

    validVideos.forEach(video => {
      const { snippet, duration, viewCount } = video;
      const videoId = video.resourceId.videoId;
      const thumbnail = snippet.thumbnails.default.url;
      const title = snippet.title.trim();
      const publishDate = formatDate(snippet.publishedAt);
      const views = formatViews(viewCount);

      const totalSeconds = calculateTotalSeconds(duration);
      const durationForDisplay = formatDurationForDisplay(duration);

      const unicodeString = '\u3010\u4E2D\u65E5\u5B57\u5E55\u3011';
      const isFilteredTitle = title.startsWith(unicodeString);

      if (totalSeconds >= 60 && !isFilteredTitle) {
        totalEPSeconds += calculateTotalSeconds(duration);
        totalEPViews += parseInt(viewCount.replace(/,/g, ''), 10);

        const videoRow = document.createElement('tr');
        videoRow.innerHTML = `
          <td>${counter++}</td>
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

    const totalDurationFormatted = new Date(totalEPSeconds * 1000).toISOString().substr(11, 8);
    const totalViewsFormatted = formatViews(totalEPViews);

    const totalsRow = document.createElement('tr');
    totalsRow.innerHTML = `
      <td></td>
      <td></td>
      <td></td>
      <td>Total</td> 
      <td>${totalDurationFormatted}</td>
      <td>${totalViewsFormatted}</td>
    `;

    videoGallery.appendChild(totalsRow);

  } catch (error) {
    console.error('Error loading video data:', error);
    videoGallery.innerHTML += `<tr><td colspan="6" style="color: red; text-align: center;">Error loading data: ${error.message}</td></tr>`;
  }
}

// File input method for local development
function getCSVFromFileInput() {
  return new Promise((resolve, reject) => {
    // Create file input if it doesn't exist
    let fileInput = document.getElementById('csvFileInput');
    if (!fileInput) {
      fileInput = document.createElement('input');
      fileInput.type = 'file';
      fileInput.accept = '.csv';
      fileInput.id = 'csvFileInput';
      fileInput.style.display = 'none';
      document.body.appendChild(fileInput);
      
      // Add a button to trigger file selection
      const selectButton = document.createElement('button');
      selectButton.textContent = 'Select CSV File';
      selectButton.style.margin = '10px';
      selectButton.onclick = () => fileInput.click();
      videoGallery.parentNode.insertBefore(selectButton, videoGallery);
    }
    
    // Create status message
    let statusDiv = document.getElementById('statusMessage');
    if (!statusDiv) {
      statusDiv = document.createElement('div');
      statusDiv.id = 'statusMessage';
      statusDiv.style.margin = '10px';
      videoGallery.parentNode.insertBefore(statusDiv, videoGallery);
    }
    
    statusDiv.textContent = 'Please select the yt_videos.csv file';
    
    const handleFileSelect = (event) => {
      const file = event.target.files[0];
      if (!file) {
        reject(new Error('No file selected'));
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (e) => {
        statusDiv.textContent = 'CSV file loaded successfully!';
        resolve(e.target.result);
        // Remove the event listener after first successful load
        fileInput.removeEventListener('change', handleFileSelect);
      };
      reader.onerror = () => {
        reject(new Error('Error reading file'));
        statusDiv.textContent = 'Error reading file';
        statusDiv.style.color = 'red';
      };
      reader.readAsText(file);
    };
    
    fileInput.addEventListener('change', handleFileSelect);
  });
}

// Start loading the data
loadVideoData();

function playVideo(videoId) {
  window.open(`https://www.youtube.com/watch?v=${videoId}`, '_blank').focus();
}