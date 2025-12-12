// Файл: js/videos.js

document.addEventListener('DOMContentLoaded', () => {
    // КОНСТАНТЫ ИНИЦИАЛИЗИРУЮТСЯ ЗДЕСЬ И ДОСТУПНЫ ВО ВСЕМ БЛОКЕ
    const videoCards = document.querySelectorAll('.video-card');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const modal = document.getElementById('video-modal');
    const closeModal = document.querySelector('.close-modal');
    const videoFrame = document.getElementById('video-frame');
    const filterContainer = document.querySelector('.video-filter');

    // НОВАЯ КОНСТАНТА: элемент для локального видео
    const localVideoPlayer = document.getElementById('local-video-player');

    // 2. ФУНКЦИОНАЛ МОДАЛЬНОГО ОКНА (ПОПАПА)

    // Функция для сброса всех плееров и скрытия модального окна (Доступна благодаря правильной области видимости)
    const resetModal = () => {
        modal.style.display = 'none';
        
        // 1. Сброс iframe (VK/YouTube)
        videoFrame.src = ''; 
        videoFrame.style.display = 'none';

        // 2. Сброс локального плеера
        if (localVideoPlayer) {
            localVideoPlayer.pause(); 
            localVideoPlayer.src = ''; 
            localVideoPlayer.style.display = 'none'; 
        }
    };

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
                    card.style.display = 'block'; // Показать карточку
                } else {
                    card.style.display = 'none'; // Скрыть карточку
                }
            });
        }
    });

    // Открытие модального окна при клике на видео
    videoCards.forEach(card => {
        card.addEventListener('click', () => {
            const youtubeId = card.getAttribute('data-youtube-id');
            const vkSrc = card.getAttribute('data-vk-src'); 
            const localSrc = card.getAttribute('data-local-src'); 

            // Сначала сбрасываем, чтобы избежать мерцания
            resetModal();

            if (vkSrc) {
                // ПОКАЗЫВАЕМ VK ВИДЕО
                videoFrame.src = vkSrc;
                videoFrame.style.display = 'block';
                modal.style.display = 'block';
            } else if (youtubeId) {
                // ПОКАЗЫВАЕМ YOUTUBE ВИДЕО
                const videoUrl = `https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0`;
                videoFrame.src = videoUrl;
                videoFrame.style.display = 'block';
                modal.style.display = 'block';
            } else if (localSrc && localVideoPlayer) {
                // ПОКАЗЫВАЕМ ЛОКАЛЬНОЕ ВИДЕО
                localVideoPlayer.src = localSrc;
                localVideoPlayer.style.display = 'block';
                localVideoPlayer.play();
                modal.style.display = 'block';
            }
        });
    });

    // Закрытие модального окна по кнопке (X)
    closeModal.addEventListener('click', resetModal);

    // Закрытие модального окна по клику вне него
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            resetModal();
        }
    });
}); // Здесь блок DOMContentLoaded закрывается один раз
