// Global variables
let episodes = [];
let watchedEpisodes = new Set();

// Function to check if we're in production (AWS) or local development
function isProductionEnvironment() {
    // Check if we're running on AWS (you can modify this condition based on your AWS setup)
    return window.location.hostname.includes('amazonaws.com') || 
           window.location.hostname.includes('aws') ||
           window.location.hostname !== 'localhost' && 
           window.location.hostname !== '127.0.0.1';
}

// Function to automatically load CSV in production
function loadCSVFromServer() {
    const csvUrl = 'episodes.csv'; // Same folder as the script
    
    return fetch(csvUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.text();
        })
        .then(csvContent => {
            episodes = parseCSVData(csvContent);
            console.log('Successfully loaded episodes from server CSV:', episodes.length);
            initializeAppWithData();
        })
        .catch(error => {
            console.error('Error loading CSV from server:', error);
            // Fallback to file upload if automatic load fails
            showUploadSection();
        });
}

// Function to show upload section
function showUploadSection() {
    document.getElementById('upload-section').style.display = 'block';
    document.getElementById('main-content').style.display = 'none';
}

// Function to hide upload section
function hideUploadSection() {
    document.getElementById('upload-section').style.display = 'none';
    document.getElementById('main-content').style.display = 'block';
}

// Function to handle CSV file upload (for local development)
function handleCSVUpload(event) {
    const file = event.target.files[0];
    if (!file) {
        alert('Please select a CSV file');
        return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        const csvContent = e.target.result;
        episodes = parseCSVData(csvContent);
        console.log('Successfully loaded episodes from CSV:', episodes.length);
        
        // Initialize the app with the loaded data
        initializeAppWithData();
    };
    reader.onerror = function() {
        alert('Error reading the CSV file');
    };
    reader.readAsText(file);
}

// Function to parse CSV data - UPDATED FOR NEW COLUMNS
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
        
        if (parts.length >= 3) {
            // NEW: Generate ID based on row number since CSV doesn't have ID column
            const id = i; // Use row number as ID
            
            // NEW: Map columns according to new CSV format
            const title = parts[0].trim();
            const videoId = parts[1].trim();
            const chapters = parts[2].trim(); // Treat duration as chapters
            
            // NEW: Ignore additional columns (duration_seconds, published_date, channel_title)
            
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
    if (!playButton) return;
    
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
        document.getElementById('duration-info').textContent = nextEpisode.chapters;
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
                <div class="history-details">Watched on ${item.date}</div>
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
    link.download = `n8n-tutorial-progress-${new Date().toISOString().split('T')[0]}.json`;
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
    // Using the channel URL from the CSV data
    const channelUrl = 'https://www.youtube.com/@BenYoungAI';
    window.open(channelUrl, '_blank');
    
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
    const csvUploadInput = document.getElementById('csv-upload');
    
    if (!form || !episodeSelect || !playButton || !toggleHistoryButton || !csvUploadInput) {
        console.error('Required elements not found!');
        return;
    }
    
    // CSV upload event (for local development)
    csvUploadInput.addEventListener('change', handleCSVUpload);
    
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
                document.getElementById('duration-info').textContent = episode.chapters;
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
        
        if (!episodeId) {
            alert('Please select an episode');
            return;
        }
        
        if (!date) {
            alert('Please select a date');
            return;
        }
        
        // Mark as watched
        watchedEpisodes.add(episodeId);
        saveWatchedEpisodes();
        
        // Save viewing details
        const viewingDetails = {
            date: date,
            timestamp: new Date().toISOString()
        };
        
        localStorage.setItem(`viewing_${episodeId}`, JSON.stringify(viewingDetails));
        
        // Update UI
        populateEpisodes();
        updateProgressSummary();
        updatePlayButton();
        updateWatchHistoryLog();
        
        // Reset form (but keep date default)
        episodeSelect.value = '';
        document.getElementById('episode-info').style.display = 'none';
        
        // Get the episode title for the alert message
        const episode = episodes.find(e => e.id === episodeId);
        const episodeTitle = episode ? episode.title : `Episode ${episodeId}`;
        alert(`"${episodeTitle}" marked as watched on ${date}!`);
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

// Initialize the application with loaded data
function initializeAppWithData() {
    // Load watched episodes from localStorage
    loadWatchedEpisodes();
    
    populateEpisodes();
    updateProgressSummary();
    updatePlayButton();
    updateWatchHistoryLog();
    
    // Show the main content after CSV is loaded
    hideUploadSection();
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Set up event listeners for the file upload
    setupEventListeners();
    
    // Check environment and load CSV accordingly
    if (isProductionEnvironment()) {
        console.log('Production environment detected - loading CSV automatically');
        loadCSVFromServer();
    } else {
        console.log('Local development environment - showing file upload');
        showUploadSection();
    }
});