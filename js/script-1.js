

// burger-menu.js - Универсальный скрипт для бургер-меню

document.addEventListener('DOMContentLoaded', function() {
    // Ищем элементы бургер-меню на странице
    const burgerMenu = document.querySelector('.burger-menu');
    const navLinks = document.querySelector('.nav-links');
    const menuOverlay = document.querySelector('.menu-overlay');
    
    // Проверяем, существуют ли элементы на текущей странице
    if (burgerMenu && navLinks && menuOverlay) {
        // Функция для открытия/закрытия меню
        function toggleMenu() {
            const isActive = navLinks.classList.contains('active');
            
            if (isActive) {
                closeMenu();
            } else {
                openMenu();
            }
        }
        
        // Функция для открытия меню
        function openMenu() {
            burgerMenu.classList.add('active');
            navLinks.classList.add('active');
            menuOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
            document.addEventListener('keydown', handleEscapeKey);
        }
        
        // Функция для закрытия меню
        function closeMenu() {
            burgerMenu.classList.remove('active');
            navLinks.classList.remove('active');
            menuOverlay.classList.remove('active');
            document.body.style.overflow = '';
            document.removeEventListener('keydown', handleEscapeKey);
        }
        
        // Обработка нажатия Escape
        function handleEscapeKey(e) {
            if (e.key === 'Escape') {
                closeMenu();
            }
        }
        
        // Открытие/закрытие меню при клике на бургер
        burgerMenu.addEventListener('click', function(e) {
            e.stopPropagation();
            toggleMenu();
        });
        
        // Закрытие меню при клике на оверлей
        menuOverlay.addEventListener('click', closeMenu);
        
        // Закрытие меню при клике на ссылку в меню
        const navLinksItems = document.querySelectorAll('.nav-links a');
        navLinksItems.forEach(item => {
            item.addEventListener('click', closeMenu);
        });
        
        // Закрытие меню при клике вне меню
        document.addEventListener('click', function(e) {
            if (!navLinks.contains(e.target) && 
                !burgerMenu.contains(e.target) && 
                navLinks.classList.contains('active')) {
                closeMenu();
            }
        });
        
        // Адаптация для ресайза окна
        window.addEventListener('resize', function() {
            if (window.innerWidth > 768 && navLinks.classList.contains('active')) {
                closeMenu();
            }
        });
        
        // Добавляем активный класс для текущей страницы
        highlightCurrentPage();
    }
    
    // Функция для подсветки текущей страницы в меню
    function highlightCurrentPage() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const navLinks = document.querySelectorAll('.nav-links a');
        
        navLinks.forEach(link => {
            const linkHref = link.getAttribute('href');
            if (linkHref && linkHref.includes(currentPage)) {
                link.classList.add('active');
            }
        });
    }
    
    // Дополнительные утилиты для работы с меню
    window.BurgerMenu = {
        open: function() {
            const burgerMenu = document.querySelector('.burger-menu');
            const navLinks = document.querySelector('.nav-links');
            const menuOverlay = document.querySelector('.menu-overlay');
            
            if (burgerMenu && navLinks && menuOverlay) {
                burgerMenu.classList.add('active');
                navLinks.classList.add('active');
                menuOverlay.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        },
        
        close: function() {
            const burgerMenu = document.querySelector('.burger-menu');
            const navLinks = document.querySelector('.nav-links');
            const menuOverlay = document.querySelector('.menu-overlay');
            
            if (burgerMenu && navLinks && menuOverlay) {
                burgerMenu.classList.remove('active');
                navLinks.classList.remove('active');
                menuOverlay.classList.remove('active');
                document.body.style.overflow = '';
            }
        },
        
        toggle: function() {
            const burgerMenu = document.querySelector('.burger-menu');
            const navLinks = document.querySelector('.nav-links');
            
            if (burgerMenu && navLinks) {
                if (navLinks.classList.contains('active')) {
                    this.close();
                } else {
                    this.open();
                }
            }
        }
    };
});