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
    return (views / 1000000).toFixed(1) + 'M';
  } else if (views >= 1000) {
    return (views / 1000).toFixed(0) + 'K';
  }
  return views;
}

// CSV data from yt_videos.csv
const csvData = `number,video_id
1,QGPJ-baIsC4
2,jYoYCbhuWNk
3,Srny3hSBno8
4,XoCtgcjwTPQ
5,Bu1EyM1_IJU
6,0TUgEkGkKqQ
7,BR21jE9ArGA
8,2eV3MwGycQ0
9,a3wahIDyhxI
10,Q-lCHVQ5EWw
11,ugl1TUMJgRQ
12,r-U9-lnAHy0
13,-c4HNS_eEcE
14,CqEdugrHd7Q
15,dvZuas3OkLE
16,Io_NQjCANGA
17,q2Mhqxbv9cY
18,vPEChdeGDP4
19,GPd0hANr4pc
20,h_03elWSdDo
21,mWc-zhd8ck4
22,O21VlFWOb3M
23,CuViSLtRXAc
24,L8xqajFn_4A
25,0_0XKR0L9Hw
26,oYbMRcWUURY
27,7wNtEuCxaJE
28,Zl98E6WVdT4
29,UnfXo6nQfZg
30,0Xv_cDtam6w
31,XpTzfuMxSRw
32,J16C2eXORLQ
33,XSNobNnb9Hk
34,qCgTQxYtUdg
35,mGAloAbEqtc
36,2puYMEryX8Q
37,5HYSqoTtfW0
38,qfxOhTD00wY
39,i3PgrVKpOeU
40,gylTdYCqoHI
41,dAnG-cO8IGU
42,KWOtye5_VLo
43,5VbHA7K7ndA
44,BbAJssdUtcw
45,qeLSkw-J4bI
46,4tKKVQe22L0
47,3lwUSwm-zfQ
48,q2il5jAIoKc
49,2ZQw4IVTdZQ
50,5grQmBixgAI
51,lvPbrAEfvaU
52,saMEAErx8cg
53,hDS4y-8UW-g
54,THEl87er9QE
55,F8Qb5ZMA7UM
56,zdnbKFuK4QE
57,C1HcBnwiAh0
58,7vDllPl1Pm8
59,uyp7ejHTuvk
60,xQ2q_8t5wmg
61,LRaj76I6jlI
62,yv8x5BdHrOk
63,q2PLRl8LL1U
64,_2_ShpSiUu0
65,t5VYQGwGJ0k
66,zK16VDUya9Q
67,m6nzUSxXMBs
68,ZWHDaWQCe_s
69,udhGXvpDjes
70,vs1n9j3kWwY
71,F5Vm2gFFCJI
72,BiVIXBMw_W4`;

// Parse CSV data
function parseCSV(csv) {
  const lines = csv.split('\n');
  const videoIds = [];
  
  // Skip header row and process each line
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

// Get video IDs from CSV
const videoIds = parseCSV(csvData);

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

Promise.all(videoDetailsPromises).then(videosWithDetails => {
  // Filter out any null results (failed fetches)
  const validVideos = videosWithDetails.filter(video => video !== null);

  // Sort the videos by published date, view counts in descending order
  validVideos.sort((a, b) => {
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

  // Initialize total values
  let totalEPSeconds = 0;
  let totalEPViews = 0;

  validVideos.forEach(video => {
    const { snippet, duration, viewCount } = video;
    const videoId = video.resourceId.videoId;
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

    if (totalSeconds >= 60 && !isFilteredTitle) {

      // Accumulate total duration in seconds
      totalEPSeconds += calculateTotalSeconds(duration);
      
      // Accumulate total views
      totalEPViews += parseInt(viewCount.replace(/,/g, ''), 10);

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

    } // End of Filter Condition

  });  // End of validVideos.forEach

  // After processing all videos, calculate and format the totals
  const totalDurationFormatted = new Date(totalEPSeconds * 1000).toISOString().substr(11, 8);
  const totalViewsFormatted = formatViews(totalEPViews);

  // Append the totals row to the table
  const totalsRow = document.createElement('tr');

  totalsRow.innerHTML = `
    <td></td> <!-- Empty cell for no column -->
    <td></td> <!-- Empty cell for thumbnail column -->
    <td></td> <!-- Empty cell for title column -->
    <td>Total</td> 
    <td>${totalDurationFormatted}</td>
    <td>${totalViewsFormatted}</td>
  `;

  videoGallery.appendChild(totalsRow);

}); // End of Promise.all

function playVideo(videoId) {
  // Open the YouTube video in a new tab
  window.open(`https://www.youtube.com/watch?v=${videoId}`, '_blank').focus();
}