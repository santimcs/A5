const videoGallery = document.getElementById('videoGallery');

// Insert the table headers with two-line headers
videoGallery.innerHTML = `
<tr>
  <th>Num<br>ber</th>
  <th>Thumb<br>nail</th>
  <th>Min<br>utes</th>
  <th>Chapt<br>Fm-To</th>
  <th>Title</th>
  <th>Date</th>
</tr>
`;

function parseCSV(csv) {
  const lines = csv.split('\n');
  const videos = [];
  
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line) {
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

const USE_FILE_INPUT = false;

async function loadVideoData(csvText = null) {
  try {
    let csvContent;
    
    if (USE_FILE_INPUT) {
      csvContent = await getCSVFromFileInput();
    } else {
      const csvUrl = 'videos.csv';
      const csvResponse = await fetch(csvUrl);
      if (!csvResponse.ok) {
        throw new Error(`Failed to load CSV file: ${csvResponse.status}`);
      }
      csvContent = await csvResponse.text();
    }
    
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
      
      const thumbnail = `https://img.youtube.com/vi/${videoId}/default.jpg`;
      const title = titleModify;
      const publishDate = dd_mmm;
      const duration = min;
      const chapters = `${fm}-${to}`;

      totalEPMinutes += parseInt(min);
      totalChapters += (parseInt(to) - parseInt(fm) + 1);

      const videoRow = document.createElement('tr');
      videoRow.innerHTML = `
        <td>${counter++}</td>
        <td class="videoThumbnail"><img src="${thumbnail}" alt="${title}" /></td>
        <td>${duration}</td>
        <td>${chapters}</td>
        <td>${title}</td>
        <td>${publishDate}</td>
      `;

      videoRow.querySelector('.videoThumbnail').addEventListener('click', () => {
        playVideo(videoId);
      });
    
      videoGallery.appendChild(videoRow);
    });

    const totalDurationFormatted = formatTotalDuration(totalEPMinutes);
    const totalChaptersFormatted = totalChapters;

    const totalsRow = document.createElement('tr');
    totalsRow.innerHTML = `
      <td>Total</td>
      <td></td>
      <td>${totalDurationFormatted}</td>
      <td>${totalChaptersFormatted}</td>
      <td></td>
      <td></td>
    `;

    videoGallery.appendChild(totalsRow);

  } catch (error) {
    console.error('Error loading video data:', error);
    videoGallery.innerHTML += `<tr><td colspan="6" style="color: red; text-align: center;">Error loading data: ${error.message}</td></tr>`;
  }
}

function formatTotalDuration(totalMinutes) {
  const adjustedMinutes = totalMinutes - 1;
  const hours = Math.floor(adjustedMinutes / 60);
  const minutes = adjustedMinutes % 60;
  
  if (minutes === 0) {
    return `${hours}h`;
  }
  return `${hours}h ${minutes}m`;
}

function getCSVFromFileInput() {
  return new Promise((resolve, reject) => {
    let fileInput = document.getElementById('csvFileInput');
    if (!fileInput) {
      fileInput = document.createElement('input');
      fileInput.type = 'file';
      fileInput.accept = '.csv';
      fileInput.id = 'csvFileInput';
      fileInput.style.display = 'none';
      document.body.appendChild(fileInput);
      
      const selectButton = document.createElement('button');
      selectButton.textContent = 'Select CSV File';
      selectButton.style.margin = '10px';
      selectButton.onclick = () => fileInput.click();
      videoGallery.parentNode.insertBefore(selectButton, videoGallery);
    }
    
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

loadVideoData();

function playVideo(videoId) {
  window.open(`https://www.youtube.com/watch?v=${videoId}`, '_blank').focus();
}