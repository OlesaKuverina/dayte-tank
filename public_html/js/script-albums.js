// --- Playlist Data (Using public domain audio placeholders) ---
const playlist = [
    { title: 'Конец', artist: 'Дайте Танк (!)', src: 'https://music.yandex.ru/track/136723110?utm_source=web&utm_medium=copy_link', album: 'Хрупко' },
    { title: 'М', artist: 'Дайте Танк (!)', src: 'https://cdn.pixabay.com/download/audio/2022/10/24/audio_985532588e.mp3?filename=emotional-inspiring-piano-127110.mp3', album: 'Хрупко' },
    { title: 'Фамилия', artist: 'Дайте Танк (!)', src: 'https://cdn.pixabay.com/download/audio/2022/07/04/audio_cd9f52f36f.mp3?filename=abstract-emotional-ambient-113203.mp3', album: 'Хрупко' },
    { title: 'Просьба', artist: 'Дайте Танк (!)', src: 'https://cdn.pixabay.com/download/audio/2022/08/04/audio_331b268f7f.mp3?filename=cinematic-piano-emotional-uplifting-115391.mp3', album: 'Хрупко' },
    { title: 'Штрих', artist: 'Дайте Танк (!)', src: 'https://cdn.pixabay.com/download/audio/2022/08/17/audio_9ec1618335.mp3?filename=lo-fi-type-beat-instrumental-116744.mp3', album: 'Хрупко' },
    { title: 'Пунктир', artist: 'Дайте Танк (!)', src: 'https://cdn.pixabay.com/download/audio/2022/08/16/audio_9c0b15b139.mp3?filename=ambient-piano-reflective-116666.mp3', album: 'Хрупко' },
    { title: 'Рекурсия', artist: 'Дайте Танк (!)', src: 'https://cdn.pixabay.com/download/audio/2022/08/02/audio_f52cc3be39.mp3?filename=just-breathe-114420.mp3', album: 'Хрупко' },
    { title: 'Эфир', artist: 'Дайте Танк (!)', src: 'https://cdn.pixabay.com/download/audio/2022/08/04/audio_8731b74797.mp3?filename=dreamland-115340.mp3', album: 'Хрупко' },
    { title: 'Сюрприз', artist: 'Дайте Танк (!)', src: 'https://cdn.pixabay.com/download/audio/2022/08/04/audio_515904005c.mp3?filename=dream-catcher-115335.mp3', album: 'Хрупко' },
    { title: 'Гармония', artist: 'Дайте Танк (!)', src: 'https://cdn.pixabay.com/download/audio/2022/08/04/audio_73138b3211.mp3?filename=emotional-piano-115338.mp3', album: 'Хрупко' },
    { title: 'Логика', artist: 'Дайте Танк (!)', src: 'https://cdn.pixabay.com/download/audio/2022/07/04/audio_b04a544971.mp3?filename=abstract-emotional-ambient-113204.mp3', album: 'Хрупко' },
    { title: 'Путь', artist: 'Дайте Танк (!)', src: 'https://cdn.pixabay.com/download/audio/2022/07/07/audio_c3c3e8009d.mp3?filename=ambient-and-dreamy-113264.mp3', album: 'Хрупко' }
];

// --- DOM Elements ---
const audio = document.getElementById('main-audio');
const playPauseBtn = document.getElementById('play-pause-btn');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const seekSlider = document.getElementById('seek-slider');
const currentTrackEl = document.getElementById('current-track');
const currentArtistEl = document.getElementById('current-artist');
const currTimeEl = document.getElementById('curr-time');
const durTimeEl = document.getElementById('dur-time');
const tracklistContainer = document.getElementById('tracklist-container');

// --- Player State ---
let currentTrackIndex = 0;
let isPlaying = false;
let seekUpdateInterval;

// --- Helper Functions ---

/**
 * Formats time in seconds to mm:ss string.
 * @param {number} seconds 
 * @returns {string}
 */
function formatTime(seconds) {
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
}

/**
 * Loads a track from the playlist into the audio element.
 * @param {number} index 
 */
function loadTrack(index) {
    if (index < 0 || index >= playlist.length) return;

    // Reset current highlight
    const oldActiveTrack = document.querySelector('.track-item.active');
    if (oldActiveTrack) {
        oldActiveTrack.classList.remove('active');
    }

    currentTrackIndex = index;
    const track = playlist[currentTrackIndex];
    audio.src = track.src;

    // Update display info
    currentTrackEl.textContent = track.title;
    currentArtistEl.textContent = track.artist;
    
    // Highlight new active track
    const newActiveTrack = document.getElementById(`track-${index}`);
    if (newActiveTrack) {
        newActiveTrack.classList.add('active');
    }

    // Reset time display
    currTimeEl.textContent = '0:00';
    durTimeEl.textContent = '0:00';
    seekSlider.value = 0;
    
    // Load and prepare for playback
    audio.load();

    // The duration is only available after metadata is loaded
    audio.addEventListener('loadedmetadata', () => {
        durTimeEl.textContent = formatTime(audio.duration);
        // Set the seek slider max value to the audio duration
        seekSlider.max = audio.duration;
    }, { once: true });
}

/**
 * Controls play/pause state.
 */
function playPause() {
    if (audio.src) {
        if (isPlaying) {
            audio.pause();
        } else {
            audio.play();
        }
    } else {
        // If no track is loaded, load the first one and play
        loadTrack(0);
        audio.play();
    }
}

/**
 * Switches to the next track.
 */
function nextTrack() {
    let nextIndex = (currentTrackIndex + 1) % playlist.length;
    loadTrack(nextIndex);
    if (isPlaying) {
        audio.play();
    }
}

/**
 * Switches to the previous track.
 */
function prevTrack() {
    let prevIndex = (currentTrackIndex - 1 + playlist.length) % playlist.length;
    loadTrack(prevIndex);
    if (isPlaying) {
        audio.play();
    }
}

/**
 * Updates the progress and time display.
 */
function updateProgress() {
    seekSlider.value = audio.currentTime;
    currTimeEl.textContent = formatTime(audio.currentTime);
}

/**
 * Generates the track list in the HTML using DocumentFragment for faster rendering.
 */
function generateTracklist() {
    // ОПТИМИЗАЦИЯ: Создаем DocumentFragment для минимизации операций с DOM.
    // Элементы добавляются во фрагмент, и только после цикла весь фрагмент
    // вставляется в "живой" DOM одной операцией.
    const fragment = document.createDocumentFragment();
    tracklistContainer.innerHTML = ''; // Очищаем контейнер один раз

    playlist.forEach((track, index) => {
        const trackItem = document.createElement('div');
        trackItem.classList.add('track-item');
        trackItem.id = `track-${index}`;
        trackItem.dataset.index = index;
        
        // Используем внутренние строковые шаблоны для быстрого создания структуры
        trackItem.innerHTML = `
            <span class="track-number">${index + 1}.</span>
            <span class="track-title">${track.title}</span>
            <span class="track-artist">${track.artist}</span>
        `;
        
        // Add click listener to load and play the selected track
        trackItem.addEventListener('click', () => {
            loadTrack(index);
            audio.play();
        });

        // Добавляем элемент во фрагмент, а не в живой DOM
        fragment.appendChild(trackItem);
    });

    // ОПТИМИЗАЦИЯ: Добавляем все элементы сразу одной операцией
    tracklistContainer.appendChild(fragment);
}

// --- Event Listeners ---

// Play/Pause button control
playPauseBtn.addEventListener('click', playPause);

// Next/Previous buttons
nextBtn.addEventListener('click', nextTrack);
prevBtn.addEventListener('click', prevTrack);

// Update progress bar and time during playback
audio.addEventListener('timeupdate', updateProgress);

// Handle seeking via the range slider
seekSlider.addEventListener('input', () => {
    audio.currentTime = seekSlider.value;
});

// Audio event: playback started
audio.addEventListener('play', () => {
    isPlaying = true;
    playPauseBtn.textContent = '⏸';
    seekSlider.max = audio.duration; // Ensure max is set when playing starts
});

// Audio event: playback paused
audio.addEventListener('pause', () => {
    isPlaying = false;
    playPauseBtn.textContent = '▶';
});

// Audio event: track finished
audio.addEventListener('ended', nextTrack);


// --- Initialization ---
window.onload = function() {
    generateTracklist();
    // Load the first track automatically on page load
    loadTrack(0); 
};