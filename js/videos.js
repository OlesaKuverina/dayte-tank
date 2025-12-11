document.addEventListener('DOMContentLoaded', () => {
    const videoCards = document.querySelectorAll('.video-card');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const modal = document.getElementById('video-modal');
    const closeModal = document.querySelector('.close-modal');
    const videoFrame = document.getElementById('video-frame');
    const filterContainer = document.querySelector('.video-filter');

    // 1. ФУНКЦИОНАЛ ФИЛЬТРАЦИИ
    filterContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('filter-btn')) {
            // Обновить активную кнопку
            filterBtns.forEach(btn => btn.classList.remove('active'));
            e.target.classList.add('active');

            const filterValue = e.target.getAttribute('data-filter');

            // Показать/Скрыть карточки
            videoCards.forEach(card => {
                const category = card.getAttribute('data-category');
                
                if (filterValue === 'all' || category === filterValue) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        }
    });


    // 2. ФУНКЦИОНАЛ МОДАЛЬНОГО ОКНА (ПОПАПА)
    
    // Открытие модального окна при клике на видео
    videoCards.forEach(card => {
        card.addEventListener('click', () => {
            const youtubeId = card.getAttribute('data-youtube-id');
            if (youtubeId) {
                // Создаем ссылку для автозапуска видео YouTube
                const videoUrl = `https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0`;
                videoFrame.src = videoUrl;
                modal.style.display = 'block';
            }
        });
    });

    // Закрытие модального окна по кнопке (X)
    closeModal.addEventListener('click', () => {
        modal.style.display = 'none';
        videoFrame.src = ''; // Остановить видео, очистив src
    });

    // Закрытие модального окна по клику вне него
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
            videoFrame.src = ''; // Остановить видео
        }
    });
});