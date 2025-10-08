// Global variables
let episodes = [];
let watchedEpisodes = new Set();

// Embedded CSV data - no need for external file
const embeddedCSVData = `id,title,videoId,chapters
1,สุทธิชัย หยุ่น อ่านหนังสือดีๆ ให้ฟัง สามก๊ก ฉบับนักบริหาร  บทที่ 1-2,jYoYCbhuWNk,1-2
2,สุทธิชัย หยุ่น อ่านหนังสือดีๆ ให้ฟัง สามก๊ก ฉบับนักบริหาร  บทที่ 3-4,QGPJ-baIsC4,3-4
3,สุทธิชัย หยุ่น อ่านหนังสือดีๆ ให้ฟัง สามก๊ก ฉบับนักบริหาร  บทที่ 5-6,XoCtgcjwTPQ,5-6
4,สุทธิชัย หยุ่น อ่านหนังสือดีๆ ให้ฟัง สามก๊ก ฉบับนักบริหาร บทที่ 7-8,Srny3hSBno8,7-8
5,สุทธิชัย หยุ่น อ่านหนังสือดีๆ ให้ฟัง สามก๊ก ฉบับนักบริหาร  บทที่ 9-10,Bu1EyM1_IJU,9-10
6,สุทธิชัย หยุ่น อ่านหนังสือดีๆ ให้ฟัง สามก๊ก ฉบับนักบริหาร  บทที่ 11-12,0TUgEkGkKqQ,11-12
7,สุทธิชัย หยุ่น อ่านหนังสือดีๆ ให้ฟัง สามก๊ก ฉบับนักบริหาร บทที่ 13 -14,BR21jE9ArGA,13-14
8,อ่านหนังสือดีๆให้ฟัง ""สามก๊ก ฉบับนักบริหาร"" บทที่ 15-16,2eV3MwGycQ0,15-16
9,อ่านหนังสือดีๆให้ฟัง ""สามก๊ก ฉบับนักบริหาร"" บทที่ 17-18,Q-lCHVQ5EWw,17-18
10,สุทธิชัย หยุ่น อ่านหนังสือดีๆ ให้ฟัง สามก๊ก ฉบับนักบริหาร  บทที่ 19-20,a3wahIDyhxI,19-20
11,สุทธิชัย หยุ่น อ่านหนังสือดีๆ ให้ฟัง สามก๊ก ฉบับนักบริหาร  บทที่ 21-22,r-U9-lnAHy0,21-22
12,สุทธิชัย หยุ่น อ่านหนังสือดีๆ ให้ฟัง สามก๊ก ฉบับนักบริหาร  บทที่ 23-24,ugl1TUMJgRQ,23-24
13,สุทธิชัย หยุ่น อ่านหนังสือดีๆ ให้ฟัง สามก๊ก ฉบับนักบริหาร  บทที่ 25-26,-c4HNS_eEcE,25-26
14,สุทธิชัย หยุ่น อ่านหนังสือดีๆ ให้ฟัง สามก๊ก ฉบับนักบริหาร  บทที่ 27-28,CqEdugrHd7Q,27-28
15,สุทธิชัย หยุ่น อ่านหนังสือดีๆให้ฟัง ""สามก๊ก ฉบับนักบริหาร"" บทที่ 29-30,Io_NQjCANGA,29-30
16,สุทธิชัย หยุ่น อ่านหนังสือดีๆให้ฟัง ""สามก๊ก ฉบับนักบริหาร"" บทที่ 31-32,dvZuas3OkLE,31-32
17,สุทธิชัย หยุ่น อ่านหนังสือดีๆให้ฟัง ""สามก๊ก ฉบับนักบริหาร"" บทที่ 33-34,q2Mhqxbv9cY,33-34
18,สุทธิชัย หยุ่น อ่านหนังสือดีๆให้ฟัง ""สามก๊ก ฉบับนักบริหาร"" บทที่ 35-36,vPEChdeGDP4,35-36
19,สุทธิชัย หยุ่น อ่านหนังสือดีๆให้ฟัง ""สามก๊ก ฉบับนักบริหาร"" บทที่ 37-38,GPd0hANr4pc,37-38
20,สุทธิชัย หยุ่น อ่านหนังสือดีๆให้ฟัง ""สามก๊ก ฉบับนักบริหาร"" บทที่ 39-40,h_03elWSdDo,39-40
21,สุทธิชัย หยุ่น อ่านหนังสือดีๆให้ฟัง ""สามก๊ก ฉบับนักบริหาร"" บทที่ 41-42,mWc-zhd8ck4,41-42
22,สุทธิชัย หยุ่น อ่านหนังสือดีๆให้ฟัง ""สามก๊ก ฉบับนักบริหาร"" บทที่ 43-44,O21VlFWOb3M,43-44
23,สุทธิชัย หยุ่น อ่านหนังสือดีๆ ให้ฟัง สามก๊ก ฉบับนักบริหาร บทที่ 45-46,CuViSLtRXAc,45-46
24,สุทธิชัย หยุ่น อ่านหนังสือดีๆ ให้ฟัง สามก๊ก ฉบับนักบริหาร บทที่ 47-48,L8xqajFn_4A,47-48
25,สุทธิชัย หยุ่น อ่านหนังสือดีๆ ให้ฟัง สามก๊ก ฉบับนักบริหาร บทที่ 49-50,0_0XKR0L9Hw,49-50
26,สุทธิชัย หยุ่น อ่านหนังสือดีๆ ให้ฟัง สามก๊ก ฉบับนักบริหาร บทที่ 51-52,oYbMRcWUURY,51-52
27,สุทธิชัย หยุ่น อ่านหนังสือดีๆให้ฟัง ""สามก๊ก ฉบับนักบริหาร"" บทที่ 53-54,7wNtEuCxaJE,53-54
28,สุทธิชัย หยุ่น อ่านหนังสือดีๆให้ฟัง ""สามก๊ก ฉบับนักบริหาร"" บทที่ 55-56,Zl98E6WVdT4,55-56
29,สุทธิชัย หยุ่น อ่านหนังสือดีๆให้ฟัง ""สามก๊ก ฉบับนักบริหาร"" บทที่ 57-58,UnfXo6nQfZg,57-58
30,สุทธิชัย หยุ่น อ่านหนังสือดีๆให้ฟัง ""สามก๊ก ฉบับนักบริหาร"" บทที่ 59-60,0Xv_cDtam6w,59-60
31,สุทธิชัย หยุ่น อ่านหนังสือดีๆให้ฟัง ""สามก๊ก ฉบับนักบริหาร"" บทที่ 61-62,J16C2eXORLQ,61-62
32,สุทธิชัย หยุ่น อ่านหนังสือดีๆให้ฟัง ""สามก๊ก ฉบับนักบริหาร"" บทที่ 63-64,XpTzfuMxSRw,63-64
33,สุทธิชัย หยุ่น อ่านหนังสือดีๆให้ฟัง ""สามก๊ก ฉบับนักบริหาร"" บทที่ 65-66,XSNobNnb9Hk,65-66
34,สุทธิชัย หยุ่น อ่านหนังสือดีๆให้ฟัง ""สามก๊ก ฉบับนักบริหาร"" บทที่ 67-68,qCgTQxYtUdg,67-68
35,สุทธิชัย หยุ่น อ่านหนังสือดีๆให้ฟัง ""สามก๊ก ฉบับนักบริหาร"" บทที่ 69-70,2puYMEryX8Q,69-70
36,สุทธิชัย หยุ่น อ่านหนังสือดีๆให้ฟัง ""สามก๊ก ฉบับนักบริหาร"" บทที่ 71-72,mGAloAbEqtc,71-72
37,อ่านหนังสือดีๆให้ฟัง ""สามก๊ก ฉบับนักบริหาร"" บทที่ 73-74,qfxOhTD00wY,73-74
38,สุทธิชัย หยุ่น อ่านหนังสือดีๆให้ฟัง ""สามก๊ก ฉบับนักบริหาร"" บทที่ 75-76,i3PgrVKpOeU,75-76
39,สุทธิชัย หยุ่น อ่านหนังสือดีๆให้ฟัง ""สามก๊ก ฉบับนักบริหาร"" บทที่ 77-78,gylTdYCqoHI,77-78
40,สุทธิชัย หยุ่น อ่านหนังสือดีๆให้ฟัง ""สามก๊ก ฉบับนักบริหาร"" บทที่ 79-80,dAnG-cO8IGU,79-80
41,สุทธิชัย หยุ่น อ่านหนังสือดีๆให้ฟัง ""สามก๊ก ฉบับนักบริหาร"" บทที่ 81-82,KWOtye5_VLo,81-82
42,สุทธิชัย หยุ่น อ่านหนังสือดีๆให้ฟัง ""สามก๊ก ฉบับนักบริหาร"" บทที่ 83-84,5VbHA7K7ndA,83-84
43,สุทธิชัย หยุ่น อ่านหนังสือดีๆให้ฟัง ""สามก๊ก ฉบับนักบริหาร"" บทที่ 85-86,BbAJssdUtcw,85-86
44,สุทธิชัย หยุ่น อ่านหนังสือดีๆให้ฟัง ""สามก๊ก ฉบับนักบริหาร"" บทที่ 87-88,4tKKVQe22L0,87-88
45,สุทธิชัย หยุ่น อ่านหนังสือดีๆให้ฟัง ""สามก๊ก ฉบับนักบริหาร"" บทที่ 89-89,qeLSkw-J4bI,89-89
46,สุทธิชัย หยุ่น อ่านหนังสือดีๆให้ฟัง ""สามก๊ก ฉบับนักบริหาร"" บทที่ 90-91,3lwUSwm-zfQ,90-91
47,สุทธิชัย หยุ่น อ่านหนังสือดีๆให้ฟัง ""สามก๊ก ฉบับนักบริหาร"" บทที่ 92-93,q2il5jAIoKc,92-93
48,สุทธิชัย หยุ่น อ่านหนังสือดีๆให้ฟัง ""สามก๊ก ฉบับนักบริหาร"" บทที่ 94-95,2ZQw4IVTdZQ,94-95
49,สุทธิชัย หยุ่น อ่านหนังสือดีๆให้ฟัง ""สามก๊ก ฉบับนักบริหาร"" บทที่ 96-97,5grQmBixgAI,96-97
50,สุทธิชัย หยุ่น อ่านหนังสือดีๆให้ฟัง ""สามก๊ก ฉบับนักบริหาร"" บทที่ 98-99,lvPbrAEfvaU,98-99
51,สุทธิชัย หยุ่น อ่านหนังสือดีๆให้ฟัง ""สามก๊ก ฉบับนักบริหาร"" บทที่ 100-101,saMEAErx8cg,100-101
52,สุทธิชัย หยุ่น อ่านหนังสือดีๆให้ฟัง ""สามก๊ก ฉบับนักบริหาร"" บทที่ 102-103,THEl87er9QE,102-103
53,สุทธิชัย หยุ่น อ่านหนังสือดีๆให้ฟัง ""สามก๊ก ฉบับนักบริหาร"" บทที่ 104-105,F8Qb5ZMA7UM,104-105
54,สุทธิชัย หยุ่น อ่านหนังสือดีๆให้ฟัง ""สามก๊ก ฉบับนักบริหาร"" บทที่ 106-107,zdnbKFuK4QE,106-107
55,สุทธิชัย หยุ่น อ่านหนังสือดีๆให้ฟัง ""สามก๊ก ฉบับนักบริหาร"" บทที่ 108-109,7vDllPl1Pm8,108-109
56,สุทธิชัย หยุ่น อ่านหนังสือดีๆ ให้ฟัง สามก๊ก ฉบับนักบริหาร บทที่ 110-111,C1HcBnwiAh0,110-111
57,สุทธิชัย หยุ่น อ่านหนังสือดีๆ ให้ฟัง สามก๊ก ฉบับนักบริหาร บทที่ 112-113,uyp7ejHTuvk,112-113
58,สุทธิชัย หยุ่น อ่านหนังสือดีๆ ให้ฟัง สามก๊ก ฉบับนักบริหาร บทที่ 114-115,xQ2q_8t5wmg,114-115
59,สุทธิชัย หยุ่น อ่านหนังสือดีๆให้ฟัง ""สามก๊ก ฉบับนักบริหาร"" บทที่ 116-117,-AhZNGPr7x8,116-117
60,สุทธิชัย หยุ่น อ่านหนังสือดีๆให้ฟัง ""สามก๊ก ฉบับนักบริหาร"" บทที่ 118-119,LRaj76I6jlI,118-119
61,สุทธิชัย หยุ่น อ่านหนังสือดีๆให้ฟัง ""สามก๊ก ฉบับนักบริหาร"" บทที่ 120-121,yv8x5BdHrOk,120-121
62,สุทธิชัย หยุ่น อ่านหนังสือดีๆให้ฟัง ""สามก๊ก ฉบับนักบริหาร"" บทที่ 122-123,q2PLRl8LL1U,122-123
63,สุทธิชัย หยุ่น อ่านหนังสือดีๆให้ฟัง ""สามก๊ก ฉบับนักบริหาร"" บทที่ 124-125,t5VYQGwGJ0k,124-125
64,สุทธิชัย หยุ่น อ่านหนังสือดีๆให้ฟัง ""สามก๊ก ฉบับนักบริหาร"" บทที่ 126-127,_2_ShpSiUu0,126-127
65,สุทธิชัย หยุ่น อ่านหนังสือดีๆให้ฟัง ""สามก๊ก ฉบับนักบริหาร"" บทที่ 128-129,zK16VDUya9Q,128-129
66,สุทธิชัย หยุ่น อ่านหนังสือดีๆให้ฟัง ""สามก๊ก ฉบับนักบริหาร"" บทที่ 130-131,m6nzUSxXMBs,130-131
67,สุทธิชัย หยุ่น อ่านหนังสือดีๆให้ฟัง ""สามก๊ก ฉบับนักบริหาร"" บทที่ 132-133,ZWHDaWQCe_s,132-133
68,สุทธิชัย หยุ่น อ่านหนังสือดีๆให้ฟัง ""สามก๊ก ฉบับนักบริหาร"" บทที่ 134-135,udhGXvpDjes,134-135
69,สุทธิชัย หยุ่น อ่านหนังสือดีๆให้ฟัง ""สามก๊ก ฉบับนักบริหาร"" บทที่ 136-137,vs1n9j3kWwY,136-137
70,สุทธิชัย หยุ่น อ่านหนังสือดีๆให้ฟัง ""สามก๊ก ฉบับนักบริหาร"" บทที่ 138-138,F5Vm2gFFCJI,138-138`;

// Function to parse CSV data
function parseCSVData(csvText) {
    const lines = csvText.split('\n').filter(line => line.trim() !== '');
    const episodes = [];
    
    // Skip header row
    for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;
        
        // Simple CSV parsing - split by comma but be careful with quotes
        const parts = [];
        let currentPart = '';
        let inQuotes = false;
        
        for (let j = 0; j < line.length; j++) {
            const char = line[j];
            
            if (char === '"') {
                inQuotes = !inQuotes;
            } else if (char === ',' && !inQuotes) {
                parts.push(currentPart);
                currentPart = '';
            } else {
                currentPart += char;
            }
        }
        parts.push(currentPart); // Add the last part
        
        if (parts.length >= 4) {
            const id = parseInt(parts[0]);
            const title = parts[1].trim();
            const videoId = parts[2].trim();
            const chapters = parts[3].trim();
            
            episodes.push({
                id: id,
                title: title,
                videoId: videoId,
                chapters: chapters
            });
        }
    }
    
    return episodes;
}

// Function to generate time slots in 30-minute intervals
function generateTimeSlots() {
    const timeSlots = [];
    for (let hour = 0; hour < 24; hour++) {
        for (let minute = 0; minute < 60; minute += 30) {
            const startTime = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
            let endHour = hour;
            let endMinute = minute + 30;
            
            if (endMinute === 60) {
                endHour++;
                endMinute = 0;
            }
            
            // Handle 24:00 case
            if (endHour === 24 && endMinute === 0) {
                endHour = 0;
            }
            
            const endTime = `${endHour.toString().padStart(2, '0')}:${endMinute.toString().padStart(2, '0')}`;
            timeSlots.push(`${startTime} - ${endTime}`);
        }
    }
    return timeSlots;
}

// Function to get current time rounded to nearest 30 minutes
function getCurrentRoundedTime() {
    const now = new Date();
    let hours = now.getHours();
    let minutes = now.getMinutes();
    
    // Round minutes to nearest 30
    minutes = Math.round(minutes / 30) * 30;
    
    // Handle case when rounding 60 minutes to next hour
    if (minutes === 60) {
        hours++;
        minutes = 0;
    }
    
    // Handle midnight rollover
    if (hours === 24) {
        hours = 0;
    }
    
    const startTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    
    // Calculate end time (30 minutes later)
    let endHours = hours;
    let endMinutes = minutes + 30;
    
    if (endMinutes === 60) {
        endHours++;
        endMinutes = 0;
    }
    
    if (endHours === 24) {
        endHours = 0;
    }
    
    const endTime = `${endHours.toString().padStart(2, '0')}:${endMinutes.toString().padStart(2, '0')}`;
    
    return `${startTime} - ${endTime}`;
}

// Function to populate time slot dropdown
function populateTimeSlots() {
    const timeSlotSelect = document.getElementById('time-slot');
    if (!timeSlotSelect) return;
    
    timeSlotSelect.innerHTML = '<option value="">Select time slot</option>';
    
    const timeSlots = generateTimeSlots();
    timeSlots.forEach(slot => {
        const option = document.createElement('option');
        option.value = slot;
        option.textContent = slot;
        timeSlotSelect.appendChild(option);
    });
    
    // Set default to current time (rounded to nearest 30 minutes)
    const currentTimeSlot = getCurrentRoundedTime();
    if (timeSlots.includes(currentTimeSlot)) {
        timeSlotSelect.value = currentTimeSlot;
    } else {
        // Fallback to a reasonable time if current time not found
        const defaultSlot = '19:00 - 19:30';
        if (timeSlots.includes(defaultSlot)) {
            timeSlotSelect.value = defaultSlot;
        }
    }
}

// Function to get first unwatched episode
function getFirstUnwatchedEpisode() {
    // Find the episode with the lowest ID that hasn't been watched
    for (let i = 1; i <= episodes.length; i++) {
        if (!watchedEpisodes.has(i)) {
            return episodes.find(episode => episode.id === i);
        }
    }
    return null; // All episodes are watched
}

// Function to update play button
function updatePlayButton() {
    const playButton = document.getElementById('play-video-btn');
    const nextEpisode = getFirstUnwatchedEpisode();
    
    if (nextEpisode) {
        playButton.textContent = `Play Next: ${nextEpisode.title}`;
        playButton.disabled = false;
        playButton.style.backgroundColor = '#2196F3';
    } else {
        playButton.textContent = 'All Episodes Watched!';
        playButton.disabled = true;
        playButton.style.backgroundColor = '#cccccc';
    }
}

// Function to play first unwatched video
function playFirstUnwatchedVideo() {
    const nextEpisode = getFirstUnwatchedEpisode();
    
    if (nextEpisode) {
        // Open YouTube video in new tab
        const youtubeUrl = `https://www.youtube.com/watch?v=${nextEpisode.videoId}`;
        window.open(youtubeUrl, '_blank');
        
        // Auto-select this episode in the dropdown for convenience
        document.getElementById('episode-select').value = nextEpisode.id;
        
        // Show episode info
        document.getElementById('video-id').textContent = nextEpisode.videoId;
        document.getElementById('chapters-info').textContent = nextEpisode.chapters;
        document.getElementById('episode-info').style.display = 'block';
    }
}

// Function to get watch history
function getWatchHistory() {
    const history = [];
    
    watchedEpisodes.forEach(episodeId => {
        const viewingDetails = localStorage.getItem(`viewing_${episodeId}`);
        if (viewingDetails) {
            const details = JSON.parse(viewingDetails);
            const episode = episodes.find(e => e.id === episodeId);
            if (episode) {
                history.push({
                    episodeId: episodeId,
                    title: episode.title,
                    date: details.date,
                    timeSlot: details.timeSlot,
                    timestamp: details.timestamp
                });
            }
        }
    });
    
    // Sort by timestamp (most recent first)
    return history.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
}

// Function to update watch history log
function updateWatchHistoryLog() {
    const historyContainer = document.getElementById('watch-history');
    if (!historyContainer) return;
    
    const history = getWatchHistory();
    
    if (history.length === 0) {
        historyContainer.innerHTML = '<p>No watch history yet. Start watching episodes to see your history here.</p>';
        return;
    }
    
    let html = '<h3>Your Watch History</h3>';
    html += '<div class="history-list">';
    
    history.forEach(item => {
        html += `
            <div class="history-item">
                <div class="history-episode">Episode ${item.episodeId}: ${item.title}</div>
                <div class="history-details">Watched on ${item.date} at ${item.timeSlot}</div>
            </div>
        `;
    });
    
    html += '</div>';
    historyContainer.innerHTML = html;
}

// Function to toggle watch history visibility
function toggleWatchHistory() {
    const historyContainer = document.getElementById('watch-history');
    const toggleButton = document.getElementById('toggle-history-btn');
    
    if (historyContainer.style.display === 'none') {
        historyContainer.style.display = 'block';
        toggleButton.textContent = 'Hide Watch History';
        updateWatchHistoryLog(); // Refresh history when showing
    } else {
        historyContainer.style.display = 'none';
        toggleButton.textContent = 'Show Watch History';
    }
}

// Function to export data to JSON file
function exportData() {
    const data = {
        watchedEpisodes: Array.from(watchedEpisodes),
        viewingDetails: {},
        exportDate: new Date().toISOString()
    };
    
    // Collect all viewing details
    episodes.forEach(episode => {
        const details = localStorage.getItem(`viewing_${episode.id}`);
        if (details) {
            data.viewingDetails[episode.id] = JSON.parse(details);
        }
    });
    
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    
    // Create download link
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `three-kingdoms-progress-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    alert('Data exported successfully! Save this file and import it on your other devices.');
}

// Function to import data from JSON file
function importData() {
    if (!confirm('This will replace all your current progress. Are you sure?')) {
        return;
    }
    
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.onchange = function(e) {
        const file = e.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        
        reader.onload = function(event) {
            try {
                const data = JSON.parse(event.target.result);
                
                // Clear existing data first
                watchedEpisodes.clear();
                localStorage.removeItem('watchedEpisodes');
                episodes.forEach(episode => {
                    localStorage.removeItem(`viewing_${episode.id}`);
                });
                
                // Import watched episodes
                if (data.watchedEpisodes && Array.isArray(data.watchedEpisodes)) {
                    watchedEpisodes = new Set(data.watchedEpisodes);
                    localStorage.setItem('watchedEpisodes', JSON.stringify(data.watchedEpisodes));
                }
                
                // Import viewing details
                if (data.viewingDetails && typeof data.viewingDetails === 'object') {
                    Object.keys(data.viewingDetails).forEach(episodeId => {
                        localStorage.setItem(`viewing_${episodeId}`, JSON.stringify(data.viewingDetails[episodeId]));
                    });
                }
                
                // Update UI
                populateEpisodes();
                updateProgressSummary();
                updatePlayButton();
                updateWatchHistoryLog();
                
                alert(`Data imported successfully! ${data.watchedEpisodes ? data.watchedEpisodes.length : 0} episodes restored.`);
            } catch (error) {
                alert('Error importing data: ' + error.message);
            }
        };
        
        reader.readAsText(file);
    };
    
    input.click();
}

// Load watched episodes from localStorage
function loadWatchedEpisodes() {
    const saved = localStorage.getItem('watchedEpisodes');
    if (saved) {
        const watchedArray = JSON.parse(saved);
        watchedEpisodes = new Set(watchedArray);
    }
}

// Save watched episodes to localStorage
function saveWatchedEpisodes() {
    const watchedArray = Array.from(watchedEpisodes);
    localStorage.setItem('watchedEpisodes', JSON.stringify(watchedArray));
}

// Populate episode dropdown
function populateEpisodes() {
    const select = document.getElementById('episode-select');
    if (!select) {
        console.error('Episode select element not found!');
        return;
    }
    
    select.innerHTML = '<option value="">- Choose an episode -</option>';
    
    // Only show unwatched episodes
    const unwatchedEpisodes = episodes.filter(episode => !watchedEpisodes.has(episode.id));
    
    unwatchedEpisodes.forEach(episode => {
        const option = document.createElement('option');
        option.value = episode.id;
        // Use the actual Thai title from CSV
        option.textContent = episode.title;
        select.appendChild(option);
    });
    
    console.log('Populated episodes dropdown with', unwatchedEpisodes.length, 'unwatched episodes');
}

// Update progress summary
function updateProgressSummary() {
    const totalEpisodes = episodes.length;
    const watchedCount = watchedEpisodes.size;
    const percentage = totalEpisodes > 0 ? Math.round((watchedCount / totalEpisodes) * 100) : 0;
    const remaining = totalEpisodes - watchedCount;
    
    document.getElementById('progress-text').textContent = 
        `${watchedCount}/${totalEpisodes} episodes (${percentage}%)`;
    document.getElementById('remaining-text').textContent = 
        `${remaining} episodes remaining`;
}

// Function to open YouTube channel
function openYouTubeChannel() {
    // Using the channel's custom URL
    const channelUrl = 'https://www.youtube.com/@suthichailive';
    window.open(channelUrl, '_blank');
    
    // Optional: Track clicks (if you have analytics)
    console.log('YouTube channel link clicked');
}

// Setup event listeners
function setupEventListeners() {
    const form = document.getElementById('viewing-form');
    const episodeSelect = document.getElementById('episode-select');
    const playButton = document.getElementById('play-video-btn');
    const toggleHistoryButton = document.getElementById('toggle-history-btn');
    const exportBtn = document.getElementById('export-data');
    const importBtn = document.getElementById('import-data');
    
    if (!form || !episodeSelect || !playButton || !toggleHistoryButton) {
        console.error('Form or element not found!');
        return;
    }
    
    // Play video button event
    playButton.addEventListener('click', playFirstUnwatchedVideo);
    
    // Toggle history button event
    toggleHistoryButton.addEventListener('click', toggleWatchHistory);
    
    // Sync button event listeners
    if (exportBtn) {
        exportBtn.addEventListener('click', exportData);
    }
    if (importBtn) {
        importBtn.addEventListener('click', importData);
    }
    
    // Show episode info when episode is selected
    episodeSelect.addEventListener('change', function() {
        const episodeId = parseInt(this.value);
        if (episodeId) {
            const episode = episodes.find(e => e.id === episodeId);
            if (episode) {
                document.getElementById('video-id').textContent = episode.videoId;
                document.getElementById('chapters-info').textContent = episode.chapters;
                document.getElementById('episode-info').style.display = 'block';
            }
        } else {
            document.getElementById('episode-info').style.display = 'none';
        }
    });
    
    // Set today's date as default
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('viewing-date').value = today;
    
    // Form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const episodeId = parseInt(episodeSelect.value);
        const date = document.getElementById('viewing-date').value;
        const timeSlot = document.getElementById('time-slot').value;
        
        if (!episodeId) {
            alert('Please select an episode');
            return;
        }
        
        if (!date) {
            alert('Please select a date');
            return;
        }
        
        if (!timeSlot) {
            alert('Please select a time slot');
            return;
        }
        
        // Split time slot into start and end times
        const [startTime, endTime] = timeSlot.split(' - ');
        
        // Mark as watched
        watchedEpisodes.add(episodeId);
        saveWatchedEpisodes();
        
        // Save viewing details
        const viewingDetails = {
            date: date,
            startTime: startTime,
            endTime: endTime,
            timeSlot: timeSlot,
            timestamp: new Date().toISOString()
        };
        
        localStorage.setItem(`viewing_${episodeId}`, JSON.stringify(viewingDetails));
        
        // Update UI
        populateEpisodes();
        updateProgressSummary();
        updatePlayButton();
        updateWatchHistoryLog();
        
        // Reset form (but keep date and time slot defaults)
        episodeSelect.value = '';
        document.getElementById('episode-info').style.display = 'none';
        
        // Get the episode title for the alert message
        const episode = episodes.find(e => e.id === episodeId);
        const episodeTitle = episode ? episode.title : `Episode ${episodeId}`;
        alert(`"${episodeTitle}" marked as watched on ${date} at ${timeSlot}!`);
    });
}

// Clear all data (for testing/reset)
function clearAllData() {
    if (confirm('Are you sure you want to clear all data? This will reset your progress and history.')) {
        watchedEpisodes.clear();
        localStorage.removeItem('watchedEpisodes');
        
        // Clear all viewing details
        episodes.forEach(episode => {
            localStorage.removeItem(`viewing_${episode.id}`);
        });
        
        populateEpisodes();
        updateProgressSummary();
        updatePlayButton();
        updateWatchHistoryLog();
        alert('All data cleared!');
    }
}

// Initialize the application
function initializeApp() {
    try {
        // Use embedded CSV data directly - no file loading needed
        episodes = parseCSVData(embeddedCSVData);
        console.log('Successfully loaded episodes from embedded data');
    } catch (error) {
        console.error('Error loading episodes:', error);
        // Fallback to manual data
        episodes = [];
        for (let i = 1; i <= 70; i++) {
            episodes.push({
                id: i,
                title: `Episode ${i}`,
                videoId: `vid${String(i).padStart(3, '0')}`,
                chapters: `${i}-${i+1}`
            });
        }
        console.log('Using fallback data');
    }
    
    // Load watched episodes from localStorage
    loadWatchedEpisodes();
    
    populateEpisodes();
    populateTimeSlots();
    updateProgressSummary();
    updatePlayButton();
    updateWatchHistoryLog();
    setupEventListeners();
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', initializeApp);