// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    // Инициализация кастомного выпадающего списка
    const dropdown = document.getElementById('customDropdown');
    if (dropdown) {
        initCustomDropdown(dropdown);
    }

    // Инициализация фильтрации новостей
    initNewsFilter();

    // Анимация карточек
    animateCards();
    
    // Настройка анимаций карточек
    setupCardAnimations();
    
    // Настройка анимаций сайдбара
    setupSidebarAnimations();
    
    // Настройка вращения логотипа
    setupLogoRotation();
    
    // Настройка анимации самолёта
    setupAirplaneAnimation();

    // Настройка эффекта "убегания" текста
    setupRunawayText();

    // Инициализация поиска
    initSearch();

    // Настройка вращения заголовка "Все контакты"
    setupHeaderRotation();

    // Анимация заголовка
    const title = document.querySelector('.main-header h1');
    if (title) {
        title.style.animation = 'fadeIn 0.6s ease-out';
    }

    // Настройка прокрутки
    setupScrollAnimations();
});

