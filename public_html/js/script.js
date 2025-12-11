// --- ДАННЫЕ ДЛЯ ШКАЛЫ ВРЕМЕНИ (ВЫНЕСЕНЫ ИЗ HTML) ---
const timelineData = {
    '2006': {
        title: "2007 - Основание группы",
        description: "Группа «Дайте Танк (!)» была основана в 2007 году в Коломне. Первые репетиции проходили в небольшой студии, где музыканты экспериментировали со звуком и создавали свои первые композиции. В этот период формировалось уникальное звучание коллектива.",
        image: "../img/2007-g.jpg"
    },
    '2009': {
        title: "2009 - Дебютный альбом",
        description: "После трех лет работы группа выпустила свой первый студийный альбом. Запись проходила на московской студии под руководством известного продюсера. Альбом получил положительные отзывы критиков и помог группе обрести первых преданных поклонников.",
        image: "../img/2011-s.webp"
    },
    '2012': {
        title: "2013 - Первое большое турне",
        description: "Группа вышла за пределы московских клубов и отправилась в первое масштабное турне по России. Благодаря растущей популярности и хитам, они собрали полные залы в 15 городах, закрепив за собой статус одной из ведущих инди-групп страны.",
        image: "../img/2007-g.jpg"
    },
    '2015': {
        title: "2016 - Фестивали и признание",
        description: "Участие в крупнейших российских музыкальных фестивалях. Их энергичные выступления получили широкое признание, и критики начали называть их «голосом поколения». Выпуск альбома, ставшего платиновым.",
        image: "../img/2007-g.jpg"
    },
    '2020': {
        title: "2025 - Эксперименты и новый звук",
        description: "В период пандемии группа активно работала над новым материалом, экспериментируя с электронным звучанием и коллаборациями. Это привело к выпуску альбома, который показал коллектив с совершенно новой, более зрелой стороны.",
        image: "../img/2007-g.jpg"
    }
};

function initTimeline() {
    const pointsContainer = document.querySelector('.timeline-points');
    const contentArea = document.querySelector('.timeline-content');
    
    if (!pointsContainer || !contentArea) {
        // Если контейнеры не найдены на этой странице, просто выходим
        return;
    }
    
    // Функция для обновления контента
    const updateContent = (year) => {
        const data = timelineData[year];
        if (!data) return;

        // 1. Обновляем HTML-контент
        contentArea.innerHTML = `
            <h3>${data.title}</h3>
            ${data.image ? `<img src="${data.image}" alt="Иллюстрация события ${year}">` : ''}
            <p>${data.description}</p>
        `;

        // 2. Обновляем активную кнопку
        pointsContainer.querySelectorAll('.point').forEach(btn => {
            btn.classList.remove('active');
            if (btn.getAttribute('data-year') === year) {
                btn.classList.add('active');
            }
        });
    };

    // Добавляем обработчики событий
    pointsContainer.addEventListener('click', (event) => {
        const target = event.target;
        if (target.classList.contains('point')) {
            const year = target.getAttribute('data-year');
            updateContent(year);
        }
    });

    // Инициализация: загружаем контент для первого года при загрузке страницы
    updateContent('2006');
}

// Вызовите эту функцию в основном обработчике DOMContentLoaded:
document.addEventListener('DOMContentLoaded', () => {
    // ... другие функции инициализации (например, initMobileMenu)
    initTimeline(); 
});