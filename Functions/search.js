// Модуль поиска по новостям

// Инициализация поиска
function initSearch() {
    const searchInput = document.querySelector('.search-input');
    if (!searchInput) return;
    
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.trim().toLowerCase();
        currentSearchQuery = query;
        
        if (query === '') {
            filterByCategory(currentCategory);
            return;
        }
        
        filterBySearch(query);
    });
}

// Фильтрация по поисковому запросу
function filterBySearch(query) {
    const newsItems = document.querySelectorAll('.news-item');
    
    if (query === 'все новости' || query === 'все') {
        filterByCategory('all');
        return;
    }
    
    newsItems.forEach((item, index) => {
        setTimeout(() => {
            item.classList.add('filtering');
        }, index * 30);
    });
    
    setTimeout(() => {
        const container = document.querySelector('.news-container');
        const filteredItems = Array.from(newsItems).filter(item => {
            const itemCategory = item.getAttribute('data-category');
            const titleElement = item.querySelector('h3');
            const titleText = titleElement ? titleElement.textContent.toLowerCase() : '';
            
            // Проверяем совпадение в категории или в заголовке
            const matchesCategory = itemCategory && itemCategory.toLowerCase().includes(query);
            const matchesTitle = titleText.includes(query);
            
            return matchesCategory || matchesTitle;
        });

        newsItems.forEach(item => {
            const itemCategory = item.getAttribute('data-category');
            const titleElement = item.querySelector('h3');
            const titleText = titleElement ? titleElement.textContent.toLowerCase() : '';
            
            // Проверяем совпадение в категории или в заголовке
            const matchesCategory = itemCategory && itemCategory.toLowerCase().includes(query);
            const matchesTitle = titleText.includes(query);
            
            if (!matchesCategory && !matchesTitle) {
                item.classList.add('hidden');
                item.classList.remove('visible');
            }
        });

        if (container) {
            filteredItems.reverse().forEach((item) => {
                if (container.firstChild !== item) {
                    container.insertBefore(item, container.firstChild);
                }
            });
        }

        filteredItems.forEach((item, index) => {
            item.classList.remove('hidden', 'filtering');
            
            item.style.position = 'relative';
            item.style.left = '-100%';
            item.style.opacity = '0';
            item.style.transform = 'translateX(-100px) scale(0.9)';
            item.classList.add('visible');
            
            setTimeout(() => {
                item.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
                item.style.left = '0';
                item.style.opacity = '1';
                item.style.transform = 'translateX(0) scale(1)';
            }, index * 100);
        });
    }, 400);
}
