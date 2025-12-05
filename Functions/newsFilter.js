// Модуль фильтрации новостей по категориям

// Инициализация фильтрации
function initNewsFilter() {
    const newsItems = document.querySelectorAll('.news-item');
    const filterButtons = document.querySelectorAll('[data-category]');

    filterButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const category = button.getAttribute('data-category');
            currentSearchQuery = '';
            const searchInput = document.querySelector('.search-input');
            if (searchInput) {
                searchInput.value = '';
            }
            filterByCategory(category);
            setActiveButton(button);
        });
    });
}

// Фильтрация по категории
function filterByCategory(category) {
    currentCategory = category;
    const newsItems = document.querySelectorAll('.news-item');
    const container = document.querySelector('.news-container');

    newsItems.forEach((item, index) => {
        setTimeout(() => {
            item.classList.add('filtering');
        }, index * 30);
    });

    setTimeout(() => {
        const filteredItems = Array.from(newsItems).filter(item => {
            const itemCategory = item.getAttribute('data-category');
            return category === 'all' || itemCategory === category;
        });

        newsItems.forEach(item => {
            const itemCategory = item.getAttribute('data-category');
            if (category !== 'all' && itemCategory !== category) {
                item.classList.add('hidden');
                item.classList.remove('visible');
            }
        });

        filteredItems.reverse().forEach((item) => {
            if (container.firstChild !== item) {
                container.insertBefore(item, container.firstChild);
            }
        });

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

// Установка активной кнопки
function setActiveButton(activeButton) {
    const filterButtons = document.querySelectorAll('[data-category]');
    
    filterButtons.forEach(button => {
        button.classList.remove('active');
    });

    activeButton.classList.add('active');
    
    activeButton.style.transform = 'scale(0.98)';
    setTimeout(() => {
        activeButton.style.transform = 'scale(1)';
    }, 150);
}
