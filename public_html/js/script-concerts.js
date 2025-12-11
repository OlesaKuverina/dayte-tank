document.addEventListener('DOMContentLoaded', () => {

    // --- 1. ФУНКЦИЯ СОЗДАНИЯ И НАСТРОЙКИ МОДАЛЬНОГО ОКНА ---
    const createModal = () => {
        const modal = document.createElement('div');
        modal.id = 'gallery-modal';
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <span class="close-btn">&times;</span>
                <h3 class="modal-title">Фотографии с концерта</h3>
                <div class="gallery-content">
                    </div>
            </div>
        `;
        document.body.appendChild(modal);

        // Настройка закрытия по кнопке X
        modal.querySelector('.close-btn').onclick = () => {
            modal.style.display = 'none';
        };

        // Настройка закрытия по клику вне окна
        window.onclick = (event) => {
            if (event.target === modal) {
                modal.style.display = 'none';
            }
        };

        return modal;
    };

    let galleryModal = createModal();

    // --- 2. ОБРАБОТКА НАЖАТИЯ НА КНОПКИ ГАЛЕРЕИ ---
    const galleryButtons = document.querySelectorAll('.concert-gallery .btn-secondary');

    galleryButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            event.preventDefault();

            const card = event.target.closest('.past-concert-card');

            // 1. Получаем заголовок и пути к фото из data-атрибута
            const concertTitle = card.querySelector('h3').textContent;

            // Получаем строку путей и разбиваем ее на массив
            const photosString = button.getAttribute('data-photos');
            if (!photosString) return; // Выход, если атрибут пуст

            const photoPaths = photosString.split(',').map(path => path.trim());

            // 2. Обновляем модальное окно
            const galleryContent = galleryModal.querySelector('.gallery-content');
            galleryContent.innerHTML = ''; // Очищаем старый контент
            galleryModal.querySelector('.modal-title').textContent = `Фото: ${concertTitle}`;

            // 3. Создаем элементы <img> для каждого пути
            photoPaths.forEach((src, index) => {
                const img = document.createElement('img');
                img.src = src;
                img.alt = `${concertTitle} - Фото ${index + 1}`;
                img.className = 'gallery-photo';

                // *** НОВОЕ: Обработчик клика для открытия в полном окне ***
                img.addEventListener('click', () => {
                    openFullPhotoModal(src);
                });
                // *******************************************************

                galleryContent.appendChild(img);
            });

            // 4. Отображаем модальное окно
            galleryModal.style.display = 'flex';
        });
    });
});

// Добавьте эту новую функцию в конец вашего скрипта.
function openFullPhotoModal(src) {
    const fullPhotoModal = document.getElementById('full-photo-modal');
    const fullPhotoImg = document.getElementById('full-photo-img');

    // Если модальное окно еще не создано, создаем его
    if (!fullPhotoModal) {
        createFullPhotoModal();
        return openFullPhotoModal(src); // Повторный вызов после создания
    }
    
    // Устанавливаем источник изображения и показываем окно
    fullPhotoImg.src = src;
    fullPhotoModal.style.display = 'flex';
}

// Добавьте эту функцию, чтобы создать отдельное модальное окно для полного фото
function createFullPhotoModal() {
    const modal = document.createElement('div');
    modal.id = 'full-photo-modal';
    modal.className = 'modal full-photo-view';
    modal.innerHTML = `
        <span class="close-btn full-photo-close-btn">&times;</span>
        <img id="full-photo-img" class="full-photo-content" src="" alt="Полное изображение">
    `;
    document.body.appendChild(modal);

    // Настройка закрытия
    modal.querySelector('.full-photo-close-btn').onclick = () => {
        modal.style.display = 'none';
    };

    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
}