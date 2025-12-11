// Добавляем новые переменные в начало скрипта
const searchInput = document.getElementById('search-input');
const clearSearchBtn = document.getElementById('clear-search');
const noResultsMessage = document.getElementById('no-results');

// Функция поиска песен (простая реализация)
function searchSongs() {
    const searchText = searchInput.value.toLowerCase().trim();
    const allTrackItems = document.querySelectorAll('.track-item');
    let foundCount = 0;

    // Прячем сообщение "не найдено" по умолчанию
    noResultsMessage.style.display = 'none';

    if (searchText === '') {
        // Если поиск пустой - показываем все песни
        allTrackItems.forEach(item => {
            item.style.display = 'flex';
            item.classList.remove('filtered');
        });
        clearSearchBtn.style.display = 'none';
        return;
    }

    // Показываем кнопку очистки
    clearSearchBtn.style.display = 'block';

    // Фильтруем песни
    allTrackItems.forEach(item => {
        const songName = item.textContent.toLowerCase();
        const songNumber = item.querySelector('.track-number').textContent.toLowerCase();

        // Проверяем совпадение в названии или номере
        if (songName.includes(searchText) || songNumber.includes(searchText)) {
            item.style.display = 'flex';
            item.classList.add('filtered');
            foundCount++;
        } else {
            item.style.display = 'none';
            item.classList.remove('filtered');
        }
    });

    // Показываем сообщение если ничего не найдено
    if (foundCount === 0) {
        noResultsMessage.style.display = 'block';
    }
}

// Функция очистки поиска
function clearSearch() {
    searchInput.value = '';
    searchSongs();
    searchInput.focus();
}

// Обработчики событий для поиска
searchInput.addEventListener('input', function () {
    searchSongs();
});

clearSearchBtn.addEventListener('click', clearSearch);

// Очистка поиска при нажатии Escape
searchInput.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') {
        clearSearch();
    }
});

// При загрузке страницы скрываем кнопку очистки
clearSearchBtn.style.display = 'none';

document.addEventListener('DOMContentLoaded', () => {
    const audio = document.getElementById('audio-element');
    const playPauseBtn = document.getElementById('play-pause-btn');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const progressBar = document.getElementById('progress-bar');
    const currentTimeDisplay = document.getElementById('current-time');
    const durationDisplay = document.getElementById('duration');
    const playlistContainer = document.getElementById('playlist');
    const trackNameDisplay = document.getElementById('current-track-name');
    const currentCover = document.getElementById('current-cover');
    const trackItems = document.querySelectorAll('.track-item');

    let currentTrackIndex = 0;
    let isPlaying = false;

    // Инициализация плейлиста
    function loadTrack(index) {
        // Сброс активного класса
        trackItems.forEach(item => item.classList.remove('active'));

        const trackElement = trackItems[index];
        const src = trackElement.getAttribute('data-src');
        const name = trackElement.getAttribute('data-name');
        const cover = trackElement.getAttribute('data-cover');

        audio.src = src;
        trackNameDisplay.textContent = name;
        currentCover.src = cover;

        trackElement.classList.add('active');
        currentTrackIndex = index;

        // Перезагрузка аудио для обновления
        audio.load();
    }

    function playTrack() {
        audio.play();
        playPauseBtn.textContent = '⏸';
        isPlaying = true;
    }

    function pauseTrack() {
        audio.pause();
        playPauseBtn.textContent = '▶';
        isPlaying = false;
    }

    function togglePlayPause() {
        if (isPlaying) {
            pauseTrack();
        } else {
            playTrack();
        }
    }

    function nextTrack() {
        let newIndex = (currentTrackIndex + 1) % trackItems.length;
        loadTrack(newIndex);
        playTrack();
    }

    function prevTrack() {
        let newIndex = (currentTrackIndex - 1 + trackItems.length) % trackItems.length;
        loadTrack(newIndex);
        playTrack();
    }

    // Обработчик кнопки Play/Pause
    playPauseBtn.addEventListener('click', togglePlayPause);

    // Обработчики Prev/Next
    prevBtn.addEventListener('click', prevTrack);
    nextBtn.addEventListener('click', nextTrack);

    // Клик по треку в плейлисте
    playlistContainer.addEventListener('click', (e) => {
        const item = e.target.closest('.track-item');
        if (item) {
            const index = Array.from(trackItems).indexOf(item);
            if (index !== currentTrackIndex) {
                loadTrack(index);
                playTrack();
            } else {
                togglePlayPause(); // Если клик по текущему треку
            }
        }
    });

    // Форматирование времени (0:00)
    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
    }

    // Обновление времени и прогресс-бара
    audio.addEventListener('timeupdate', () => {
        const currentTime = audio.currentTime;
        const duration = audio.duration;

        if (!isNaN(duration)) {
            const progressPercent = (currentTime / duration) * 100;
            progressBar.value = progressPercent;
            currentTimeDisplay.textContent = formatTime(currentTime);
        }
    });

    // Загрузка метаданных (для получения длительности)
    audio.addEventListener('loadedmetadata', () => {
        durationDisplay.textContent = formatTime(audio.duration);
    });

    // Перемотка с помощью прогресс-бара
    progressBar.addEventListener('input', () => {
        const duration = audio.duration;
        if (!isNaN(duration)) {
            const seekTime = (progressBar.value / 100) * duration;
            audio.currentTime = seekTime;
        }
    });

    // Автоматический переход к следующему треку
    audio.addEventListener('ended', nextTrack);

    // Инициализация: загрузка первого трека при старте
    if (trackItems.length > 0) {
        loadTrack(currentTrackIndex);
    }
});