/**
 * Модуль для работы с кастомным выпадающим списком
 * 
 * Реализует функциональность кастомного dropdown-меню с анимациями,
 * обработкой выбора опций и интеграцией с фильтрацией новостей.
 */

// Глобальные переменные для доступа из других модулей
let currentCategory = 'all';
let currentSearchQuery = '';

/**
 * Инициализация кастомного выпадающего списка
 * 
 * Настраивает обработчики событий для открытия/закрытия dropdown,
 * выбора опций и синхронизации с фильтрацией новостей.
 * 
 * @param {HTMLElement} container - Контейнер с классом .custom-dropdown
 */
function initCustomDropdown(container) {
    const selected = container.querySelector('.dropdown-selected');
    const options = container.querySelector('.dropdown-options');
    const optionItems = container.querySelectorAll('.dropdown-option');
    const selectedText = container.querySelector('.selected-text');
    let isOpen = false;

    // Обработчик клика на выбранный элемент - открывает/закрывает список
    selected.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleDropdown();
    });

    // Обработчики для каждой опции в списке
    optionItems.forEach(option => {
        // Клик по опции - выбор элемента
        option.addEventListener('click', (e) => {
            e.stopPropagation();
            selectOption(option);
        });

        // Анимация при наведении - опция сдвигается вправо
        option.addEventListener('mouseenter', () => {
            if (!option.classList.contains('selected')) {
                option.style.transform = 'translateX(4px)';
            }
        });

        // Возврат в исходное положение при уходе курсора
        option.addEventListener('mouseleave', () => {
            option.style.transform = 'translateX(0)';
        });
    });

    // Закрытие dropdown при клике вне его области
    document.addEventListener('click', (e) => {
        if (!container.contains(e.target)) {
            closeDropdown();
        }
    });

    // Установка начального выбранного элемента на основе текста
    const defaultOption = Array.from(optionItems).find(
        opt => opt.textContent.trim() === selectedText.textContent.trim()
    );
    if (defaultOption) {
        defaultOption.classList.add('selected');
    }

    /**
     * Переключение состояния dropdown (открыт/закрыт)
     */
    function toggleDropdown() {
        isOpen = !isOpen;
        if (isOpen) {
            openDropdown();
        } else {
            closeDropdown();
        }
    }

    /**
     * Открытие выпадающего списка с анимацией появления опций
     * 
     * Опции появляются последовательно с небольшой задержкой,
     * создавая эффект каскадного появления.
     */
    function openDropdown() {
        selected.classList.add('active');
        options.classList.add('show');
        
        // Анимация появления опций с задержкой для каждой
        optionItems.forEach((option, index) => {
            option.style.transitionDelay = `${index * 0.05}s`;
            option.style.opacity = '0';
            option.style.transform = 'translateX(-10px)';
            
            setTimeout(() => {
                option.style.opacity = '1';
                option.style.transform = 'translateX(0)';
            }, 50);
        });
    }

    /**
     * Закрытие выпадающего списка
     * 
     * Сбрасывает все анимационные задержки и возвращает опции
     * в исходное состояние.
     */
    function closeDropdown() {
        selected.classList.remove('active');
        options.classList.remove('show');
        
        // Сброс задержек анимации и возврат опций в исходное состояние
        optionItems.forEach(option => {
            option.style.transitionDelay = '0s';
            option.style.opacity = '1';
            option.style.transform = 'translateX(0)';
        });
    }

    /**
     * Обработка выбора опции из списка
     * 
     * Обновляет отображаемый текст, применяет визуальную анимацию
     * и вызывает обработчик изменения для синхронизации с фильтрацией.
     * 
     * @param {HTMLElement} option - Выбранный элемент опции
     */
    function selectOption(option) {
        // Удаляем класс selected у всех опций
        optionItems.forEach(opt => opt.classList.remove('selected'));
        
        // Добавляем класс selected к выбранной опции
        option.classList.add('selected');
        
        // Обновляем текст в выбранном элементе
        const value = option.getAttribute('data-value');
        const text = option.textContent.trim();
        selectedText.textContent = text;
        
        // Анимация выбора - небольшое масштабирование
        selected.style.transform = 'scale(0.98)';
        setTimeout(() => {
            selected.style.transform = 'scale(1)';
        }, 150);
        
        // Закрываем список после выбора
        closeDropdown();
        
        // Вызываем обработчик изменения для синхронизации с фильтрацией
        handleDropdownChange(value, text);
    }

    /**
     * Обработчик изменения выбранной опции в dropdown
     * 
     * Синхронизирует выбор с фильтрацией новостей и обновляет
     * активные кнопки в сайдбаре. Также обрабатывает специальный
     * случай "Дикий огурец 1337" для активации белого шума.
     * 
     * @param {string} value - Значение data-value выбранной опции
     * @param {string} text - Текст выбранной опции
     */
    function handleDropdownChange(value, text) {
        console.log('Выбрано:', value, text);
        
        // Если выбрана опция "Дикий огурец 1337", активируем белый шум
        if (value === 'random') {
            activateWhiteNoise();
            return;
        }
        
        // Получаем категорию из data-атрибута опции
        const selectedOption = Array.from(optionItems).find(opt => opt.getAttribute('data-value') === value);
        const category = selectedOption ? (selectedOption.getAttribute('data-category') || 'all') : 'all';
        
        // Сбрасываем поиск при выборе из dropdown
        currentSearchQuery = '';
        const searchInput = document.querySelector('.search-input');
        if (searchInput) {
            searchInput.value = '';
        }
        
        // Применяем фильтрацию по выбранной категории
        filterByCategory(category);
        
        // Обновляем активную кнопку в сайдбаре для синхронизации
        const filterButtons = document.querySelectorAll('[data-category]');
        filterButtons.forEach(button => {
            if (button.getAttribute('data-category') === category) {
                setActiveButton(button);
            } else if (category === 'all' && button.classList.contains('all-news')) {
                setActiveButton(button);
            } else {
                button.classList.remove('active');
            }
        });
    }
}

