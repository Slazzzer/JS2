/**
 * Модуль для поиска по новостям
 * 
 * Реализует функциональность поиска карточек новостей по категориям
 * с обработкой специальных запросов типа "Все новости".
 */

/**
 * Инициализация поиска
 * 
 * Настраивает обработчик ввода в поле поиска для фильтрации
 * карточек новостей в реальном времени.
 */
function initSearch() {
    const searchInput = document.querySelector('.search-input');
    if (!searchInput) return;
    
    // Обработчик ввода текста в поле поиска
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.trim().toLowerCase();
        currentSearchQuery = query;
        
        // Если поиск пустой, показываем все карточки текущей категории
        if (query === '') {
            filterByCategory(currentCategory);
            return;
        }
        
        // Фильтруем по поисковому запросу
        filterBySearch(query);
    });
}

/**
 * Фильтрация карточек новостей по поисковому запросу
 * 
 * Ищет карточки, категория которых содержит введенный текст.
 * Обрабатывает специальные запросы "все новости" и "все".
 * 
 * @param {string} query - Поисковый запрос (в нижнем регистре)
 */
function filterBySearch(query) {
    const newsItems = document.querySelectorAll('.news-item');
    
    // Если введено "все новости" или "все", показываем все карточки
    if (query === 'все новости' || query === 'все') {
        filterByCategory('all');
        return;
    }
    
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
            // Проверяем, содержит ли категория поисковый запрос
            const categoryMatch = itemCategory && itemCategory.toLowerCase().includes(query);
            
            if (categoryMatch) {
                // Показываем карточку с анимацией появления
                item.classList.remove('hidden', 'filtering');
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
                // Скрываем карточки, не соответствующие запросу
                item.classList.add('hidden');
                item.classList.remove('visible');
            }
        });
    }, 400);
}

