const videoGallery = document.getElementById('videoGallery');

// Insert the table headers
videoGallery.innerHTML = `
<tr>
  <th>No.</th>
  <th>Thumbnail</th>
  <th>Title</th>
  <th>Date</th>
  <th>Duration (min)</th>
  <th>Chapters</th>
</tr>
`;



function formatTotalDuration(totalMinutes) {
  // Deduct 1 minute to make it exactly 33h
  const adjustedMinutes = totalMinutes - 1;
  const hours = Math.floor(adjustedMinutes / 60);
  const minutes = adjustedMinutes % 60;
  
  // If minutes become 0 after adjustment, show only hours
  if (minutes === 0) {
    return `${hours}h`;
  }
  return `${hours}h ${minutes}m`;
}

function parseCSV(csv) {
  const lines = csv.split('\n');
  const videos = [];
  
  // Skip header row and process each line
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line) {
      // Handle CSV with potential quotes and commas within fields
      const parts = line.split(',');
      if (parts.length >= 7) {
        const number = parts[0].replace(/"/g, '').trim();
        const videoId = parts[1].replace(/"/g, '').trim();
        const titleModify = parts[2].replace(/"/g, '').trim();
        const fm = parts[3].replace(/"/g, '').trim();
        const to = parts[4].replace(/"/g, '').trim();
        const min = parts[5].replace(/"/g, '').trim();
        const dd_mmm = parts[6].replace(/"/g, '').trim();
        const titleOrigin = parts.length > 7 ? parts.slice(7).join(',').replace(/"/g, '').trim() : '';
        
        if (videoId && number) {
          videos.push({
            number,
            videoId,
            titleModify,
            fm,
            to,
            min,
            dd_mmm,
            titleOrigin
          });
        }
      }
    }
  }
  
  return videos;
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
      const csvUrl = 'videos.csv'; // Changed to videos.csv
      const csvResponse = await fetch(csvUrl);
      if (!csvResponse.ok) {
        throw new Error(`Failed to load CSV file: ${csvResponse.status}`);
      }
      csvContent = await csvResponse.text();
    }
    
    // Remove BOM if present
    if (csvContent.charCodeAt(0) === 0xFEFF) {
      csvContent = csvContent.slice(1);
    }
    
    const videos = parseCSV(csvContent);
    
    if (videos.length === 0) {
      throw new Error('No videos found in CSV file');
    }

    let counter = 1;
    let totalEPMinutes = 0;
    let totalChapters = 0;

    videos.forEach(video => {
      const { number, videoId, titleModify, fm, to, min, dd_mmm } = video;
      
      // Create thumbnail URL from video ID
      const thumbnail = `https://img.youtube.com/vi/${videoId}/default.jpg`;
      const title = titleModify;
      const publishDate = dd_mmm;
      const duration = min; // Use minutes directly from CSV
      const chapters = `${fm}-${to}`;

      // Accumulate totals
      totalEPMinutes += parseInt(min);
      totalChapters += (parseInt(to) - parseInt(fm) + 1);

      const videoRow = document.createElement('tr');
      // videoRow.innerHTML = `
      //   <td>${counter++}</td>
      //   <td class="videoThumbnail"><img src="${thumbnail}" alt="${title}" /></td>
      //   <td>${title}</td>
      //   <td>${publishDate}</td>
      //   <td>${duration}</td>
      //   <td>${chapters}</td>
      // `;

// In your video row creation
videoRow.innerHTML = `
  <td class="col-number">${counter++}</td>
  <td class="col-thumbnail videoThumbnail"><img src="${thumbnail}" alt="${title}" /></td>
  <td class="col-title">${title}</td>
  <td class="col-date">${publishDate}</td>
  <td class="col-duration">${duration}</td>
  <td class="col-chapters">${chapters}</td>
`;

      videoRow.querySelector('.videoThumbnail').addEventListener('click', () => {
        playVideo(videoId);
      });
    
      videoGallery.appendChild(videoRow);
    });

    // Format totals with 1 minute deduction
    const totalDurationFormatted = formatTotalDuration(totalEPMinutes);
    const totalChaptersFormatted = totalChapters;

    // Append the totals row to the table
    const totalsRow = document.createElement('tr');
    totalsRow.innerHTML = `
      <td></td>
      <td></td>
      <td></td>
      <td>Total</td> 
      <td>${totalDurationFormatted}</td>
      <td>${totalChaptersFormatted}</td>
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
    
    statusDiv.textContent = 'Please select the videos.csv file';
    
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