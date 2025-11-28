/**
 * Модуль для фильтрации новостей по категориям
 * 
 * Реализует функциональность фильтрации карточек новостей по категориям
 * с плавными анимациями появления и скрытия элементов.
 */

/**
 * Инициализация фильтрации новостей
 * 
 * Настраивает обработчики кликов на кнопки категорий в сайдбаре.
 * При клике на категорию происходит фильтрация карточек и сброс поиска.
 */
function initNewsFilter() {
    const newsItems = document.querySelectorAll('.news-item');
    const filterButtons = document.querySelectorAll('[data-category]');

    // Обработчики кликов на элементы фильтрации в сайдбаре
    filterButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const category = button.getAttribute('data-category');
            // Сбрасываем поиск при клике на категорию
            currentSearchQuery = '';
            const searchInput = document.querySelector('.search-input');
            if (searchInput) {
                searchInput.value = '';
            }
            // Применяем фильтрацию и обновляем активную кнопку
            filterByCategory(category);
            setActiveButton(button);
        });
    });
}

/**
 * Фильтрация карточек новостей по категории
 * 
 * Применяет фильтр к карточкам новостей с плавной анимацией:
 * 1. Сначала все карточки скрываются с анимацией
 * 2. Затем нужные карточки появляются с задержкой
 * 
 * @param {string} category - Категория для фильтрации ('all', 'Спорт', 'Общество', 'Экономика')
 */
function filterByCategory(category) {
    currentCategory = category;
    const newsItems = document.querySelectorAll('.news-item');

    // Анимация скрытия всех карточек с последовательной задержкой
    newsItems.forEach((item, index) => {
        setTimeout(() => {
            item.classList.add('filtering');
        }, index * 30);
    });

    // После анимации скрытия показываем нужные карточки
    setTimeout(() => {
        newsItems.forEach((item, index) => {
            const itemCategory = item.getAttribute('data-category');
            
            // Если категория совпадает или выбрано "все", показываем карточку
            if (category === 'all' || itemCategory === category) {
                item.classList.remove('hidden', 'filtering');
                // Анимация появления с задержкой для каждой карточки
                setTimeout(() => {
                    item.style.opacity = '0';
                    item.style.transform = 'translateY(20px) scale(0.95)';
                    item.classList.add('visible');
                    
                    // Плавное появление с использованием requestAnimationFrame
                    requestAnimationFrame(() => {
                        setTimeout(() => {
                            item.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
                            item.style.opacity = '1';
                            item.style.transform = 'translateY(0) scale(1)';
                        }, 50);
                    });
                }, index * 60);
            } else {
                // Скрываем карточки, не соответствующие категории
                item.classList.add('hidden');
                item.classList.remove('visible');
            }
        });
    }, 400);
}

/**
 * Установка активной кнопки фильтрации
 * 
 * Обновляет визуальное состояние кнопок в сайдбаре,
 * показывая какая категория выбрана в данный момент.
 * 
 * @param {HTMLElement} activeButton - Кнопка, которую нужно сделать активной
 */
function setActiveButton(activeButton) {
    const filterButtons = document.querySelectorAll('[data-category]');
    
    // Убираем активное состояние у всех кнопок
    filterButtons.forEach(button => {
        button.classList.remove('active');
    });

    // Добавляем активное состояние выбранной кнопке
    activeButton.classList.add('active');
    
    // Анимация выбора - небольшое масштабирование для визуального отклика
    activeButton.style.transform = 'scale(0.98)';
    setTimeout(() => {
        activeButton.style.transform = 'scale(1)';
    }, 150);
}

