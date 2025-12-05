// Модуль кастомного выпадающего списка

let currentCategory = 'all';
let currentSearchQuery = '';

// Инициализация dropdown
function initCustomDropdown(container) {
    const selected = container.querySelector('.dropdown-selected');
    const options = container.querySelector('.dropdown-options');
    const optionItems = container.querySelectorAll('.dropdown-option');
    const selectedText = container.querySelector('.selected-text');
    let isOpen = false;

    selected.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleDropdown();
    });

    optionItems.forEach(option => {
        option.addEventListener('click', (e) => {
            e.stopPropagation();
            selectOption(option);
        });

        option.addEventListener('mouseenter', () => {
            if (!option.classList.contains('selected')) {
                option.style.transform = 'translateX(4px)';
            }
        });

        option.addEventListener('mouseleave', () => {
            option.style.transform = 'translateX(0)';
        });
    });

    document.addEventListener('click', (e) => {
        if (!container.contains(e.target)) {
            closeDropdown();
        }
    });

    function toggleDropdown() {
        isOpen = !isOpen;
        if (isOpen) {
            openDropdown();
        } else {
            closeDropdown();
        }
    }

    function openDropdown() {
        selected.classList.add('active');
        options.classList.add('show');
        
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

    function closeDropdown() {
        selected.classList.remove('active');
        options.classList.remove('show');
        
        optionItems.forEach(option => {
            option.style.transitionDelay = '0s';
            option.style.opacity = '1';
            option.style.transform = 'translateX(0)';
        });
    }

    function selectOption(option) {
        optionItems.forEach(opt => opt.classList.remove('selected'));
        option.classList.add('selected');
        
        const value = option.getAttribute('data-value');
        const text = option.textContent.trim();
        selectedText.textContent = text;
        
        selected.style.transform = 'scale(0.98)';
        setTimeout(() => {
            selected.style.transform = 'scale(1)';
        }, 150);
        
        closeDropdown();
        handleDropdownChange(value, text);
    }

    function handleDropdownChange(value, text) {
        console.log('Выбрано:', value, text);
        
        const selectedOption = Array.from(optionItems).find(opt => opt.getAttribute('data-value') === value);
        const category = selectedOption ? (selectedOption.getAttribute('data-category') || 'all') : 'all';
        
        currentSearchQuery = '';
        const searchInput = document.querySelector('.search-input');
        if (searchInput) {
            searchInput.value = '';
        }
        
        filterByCategory(category);
        
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
