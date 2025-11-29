/**
 * Модуль для анимаций элементов интерфейса
 * 
 * Содержит функции для настройки различных анимаций:
 * - Появление карточек при загрузке и прокрутке
 * - Анимации при наведении на элементы
 * - Вращение логотипа
 * - Анимация самолета
 * - Эффект "убегания" текста от курсора
 */

/**
 * Анимация появления карточек при загрузке страницы
 * 
 * Использует Intersection Observer API для отслеживания видимости карточек.
 * Когда карточка попадает в область видимости, она плавно появляется
 * с небольшой задержкой для создания эффекта каскада.
 */
function animateCards() {
    const cards = document.querySelectorAll('.news-item');
    
    // Создаем наблюдатель для отслеживания видимости элементов
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Добавляем класс visible с задержкой для эффекта каскада
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, index * 100);
                // Прекращаем наблюдение после появления
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1 // Срабатывает когда видно 10% элемента
    });

    // Начинаем наблюдение за всеми карточками
    cards.forEach(card => {
        observer.observe(card);
    });
}

/**
 * Настройка анимаций при наведении на карточки новостей
 * 
 * Реализует вращение карточек по часовой стрелке при наведении мыши.
 * При уходе курсора карточка останавливается и возвращается в исходное состояние.
 * Сохраняет эффект поднятия карточки при наведении.
 */
function setupCardAnimations() {
    const cards = document.querySelectorAll('.news-item');
    
    cards.forEach(card => {
        let rotationInterval = null;
        let currentRotation = 0;
        let baseTransform = ''; // Базовое состояние transform (для visible карточек)
        
        // Получаем базовое состояние transform из класса visible
        if (card.classList.contains('visible')) {
            baseTransform = 'translateY(0) scale(1)';
        }
        
        // При наведении на карточку начинаем вращение
        card.addEventListener('mouseenter', function() {
            // Устанавливаем плавный переход для transform
            this.style.transition = 'transform 0.1s linear';
            
            // Получаем текущий угол поворота, если он есть
            const style = window.getComputedStyle(this);
            const matrix = style.transform || style.webkitTransform || style.mozTransform;
            
            if (matrix !== 'none' && matrix !== '') {
                // Пытаемся извлечь угол из transform
                const matrixMatch = matrix.match(/matrix.*\((.+)\)/);
                if (matrixMatch) {
                    const values = matrixMatch[1].split(', ');
                    if (values.length >= 4) {
                        const a = parseFloat(values[0]);
                        const b = parseFloat(values[1]);
                        currentRotation = Math.round(Math.atan2(b, a) * (180 / Math.PI));
                        if (currentRotation < 0) currentRotation += 360;
                    }
                }
            }
            
            // Запускаем непрерывное вращение по часовой стрелке
            // Комбинируем вращение с поднятием карточки
            rotationInterval = setInterval(() => {
                currentRotation += 2; // Увеличиваем угол на 2 градуса за кадр
                if (currentRotation >= 360) currentRotation = 0;
                // Сохраняем эффект поднятия при вращении
                this.style.transform = `translateY(-5px) rotate(${currentRotation}deg)`;
            }, 16); // ~60 FPS
        });
        
        // При уходе курсора останавливаем вращение и возвращаем в исходное состояние
        card.addEventListener('mouseleave', function() {
            // Останавливаем интервал вращения
            if (rotationInterval) {
                clearInterval(rotationInterval);
                rotationInterval = null;
            }
            
            // Плавно возвращаем карточку в исходное положение
            // Вычисляем кратчайший путь к 0 градусам
            let targetRotation = currentRotation;
            if (currentRotation > 180) {
                targetRotation = 360;
            } else {
                targetRotation = 0;
            }
            
            // Плавная анимация возврата с сохранением базового состояния
            this.style.transition = 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
            
            // Возвращаем к базовому состоянию (без поднятия и вращения)
            if (baseTransform) {
                this.style.transform = baseTransform;
            } else {
                this.style.transform = '';
            }
            
            // Сбрасываем угол после завершения анимации
            setTimeout(() => {
                currentRotation = 0;
                if (baseTransform) {
                    this.style.transform = baseTransform;
                } else {
                    this.style.transform = '';
                }
            }, 500);
        });
    });
}

/**
 * Настройка анимаций элементов сайдбара
 * 
 * Добавляет плавные переходы для элементов навигации в сайдбаре
 * при наведении курсора.
 */
function setupSidebarAnimations() {
    const sidebarItems = document.querySelectorAll('.news-types li, .all-news');
    
    sidebarItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            // Устанавливаем плавный переход для всех свойств
            this.style.transition = 'all 0.3s ease';
        });
    });
}

/**
 * Настройка вращения логотипа при клике
 * 
 * Реализует переключатель вращения логотипа: при первом клике
 * логотип начинает вращаться, при втором - останавливается,
 * сохраняя текущий угол поворота.
 */
function setupLogoRotation() {
    const logo = document.querySelector('.sidebar-header img');
    if (!logo) return;
    
    let isRotating = false;
    
    logo.addEventListener('click', function() {
        if (isRotating) {
            // Останавливаем вращение
            this.classList.remove('rotating');
            // Сохраняем текущий угол поворота для плавного перехода
            const currentRotation = getCurrentRotation(this);
            this.style.transform = `rotate(${currentRotation}deg)`;
            isRotating = false;
        } else {
            // Начинаем вращение
            // Убираем inline transform, чтобы CSS-анимация работала
            this.style.transform = '';
            this.classList.add('rotating');
            isRotating = true;
        }
    });
    
    /**
     * Получение текущего угла поворота элемента
     * 
     * Извлекает угол поворота из CSS transform matrix для сохранения
     * позиции при остановке анимации.
     * 
     * @param {HTMLElement} element - Элемент для получения угла поворота
     * @returns {number} - Угол поворота в градусах (0-360)
     */
    function getCurrentRotation(element) {
        const style = window.getComputedStyle(element);
        const matrix = style.transform || style.webkitTransform || style.mozTransform;
        
        if (matrix === 'none') return 0;
        
        const matrixType = matrix.includes('3d') ? '3d' : '2d';
        const matrixValues = matrix.match(/matrix.*\((.+)\)/)[1].split(', ');
        
        if (matrixType === '2d') {
            const a = matrixValues[0];
            const b = matrixValues[1];
            // Вычисляем угол из матрицы поворота
            const angle = Math.round(Math.atan2(b, a) * (180 / Math.PI));
            return angle < 0 ? angle + 360 : angle;
        }
        
        return 0;
    }
}

/**
 * Настройка анимации самолета
 * 
 * При клике на футер сайдбара запускается анимация полета самолета
 * через весь экран. Анимация длится 3 секунды.
 */
function setupAirplaneAnimation() {
    const sidebarFooter = document.querySelector('.sidebar-footer');
    const airplane = document.getElementById('airplane');
    
    if (!sidebarFooter || !airplane) return;
    
    // Делаем футер кликабельным
    sidebarFooter.style.cursor = 'pointer';
    
    sidebarFooter.addEventListener('click', function() {
        // Убираем класс, если он был (для повторного запуска)
        airplane.classList.remove('flying');
        
        // Небольшая задержка для сброса анимации
        setTimeout(() => {
            airplane.classList.add('flying');
            
            // Убираем класс после завершения анимации (3 секунды)
            setTimeout(() => {
                airplane.classList.remove('flying');
            }, 3000);
        }, 10);
    });
}

/**
 * Настройка эффекта "убегания" текста от курсора
 * 
 * Реализует интерактивный эффект, при котором текст "Вариант 4"
 * "убегает" от курсора мыши при приближении к нему. Чем ближе курсор,
 * тем интенсивнее убегание.
 */
function setupRunawayText() {
    const text = document.querySelector('.sidebar-header-text');
    if (!text) return;
    
    const container = text.closest('.sidebar-header');
    if (!container) return;
    
    let isHovering = false;
    const runDistance = 50; // Максимальное расстояние убегания в пикселях
    
    // Обработчик движения мыши по всему документу
    document.addEventListener('mousemove', (e) => {
        if (!isHovering) return;
        
        // Получаем позицию элемента относительно viewport
        const rect = text.getBoundingClientRect();
        const elementX = rect.left + rect.width / 2;
        const elementY = rect.top + rect.height / 2;
        
        // Вычисляем расстояние от курсора до центра элемента
        const deltaX = e.clientX - elementX;
        const deltaY = e.clientY - elementY;
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        
        // Если курсор близко к элементу (в радиусе 150px), "убегаем"
        if (distance < 150) {
            // Вычисляем направление (противоположное курсору)
            const angle = Math.atan2(deltaY, deltaX);
            // Интенсивное убегание с коэффициентом, зависящим от расстояния
            // Чем ближе курсор, тем сильнее убегание (коэффициент 1.5 для большей интенсивности)
            const moveX = -Math.cos(angle) * runDistance * (1 - distance / 150) * 1.5;
            const moveY = -Math.sin(angle) * runDistance * (1 - distance / 150) * 1.5;
            
            // Применяем трансформацию для перемещения текста
            text.style.transform = `translate(${moveX}px, ${moveY}px)`;
        } else {
            // Если курсор далеко, возвращаем текст на место
            text.style.transform = 'translate(0, 0)';
        }
    });
    
    // При наведении на элемент активируем эффект
    text.addEventListener('mouseenter', () => {
        isHovering = true;
    });
    
    // При уходе курсора деактивируем эффект и возвращаем текст
    text.addEventListener('mouseleave', () => {
        isHovering = false;
        text.style.transform = 'translate(0, 0)';
    });
}

/**
 * Настройка анимаций при прокрутке страницы
 * 
 * Отслеживает прокрутку и показывает карточки, которые попадают
 * в область видимости при скролле.
 */
function setupScrollAnimations() {
    window.addEventListener('scroll', () => {
        // Находим все карточки, которые еще не видны и не скрыты
        const cards = document.querySelectorAll('.news-item:not(.visible):not(.hidden)');
        cards.forEach(card => {
            const rect = card.getBoundingClientRect();
            // Если карточка находится в верхних 80% экрана, показываем её
            if (rect.top < window.innerHeight * 0.8) {
                card.classList.add('visible');
            }
        });
    }, { passive: true }); // passive: true для оптимизации производительности
}

/**
 * Настройка вращения заголовка "Все контакты" при наведении мыши
 * 
 * Реализует интерактивное вращение заголовка по окружности:
 * - При клике переключается направление вращения (нечетные клики - по часовой, четные - против)
 * - При наведении мыши заголовок вращается, следуя за курсором по окружности
 * - Автоматический сброс эффекта через 5 секунд бездействия
 */
function setupHeaderRotation() {
    const header = document.querySelector('.main-header h1');
    if (!header) return;
    
    let clickCount = 0; // Счетчик кликов для определения направления
    let resetTimeout = null; // Таймер для сброса эффекта
    let isHovering = false; // Флаг наведения мыши
    let isActive = false; // Флаг активности эффекта
    
    // Делаем заголовок кликабельным
    header.style.cursor = 'pointer';
    
    // Обработчик клика для переключения направления
    header.addEventListener('click', function() {
        clickCount++;
        isActive = true;
        
        // Очищаем предыдущий таймер сброса
        if (resetTimeout) {
            clearTimeout(resetTimeout);
        }
        
        // Устанавливаем таймер на 5 секунд для сброса эффекта
        resetTimeout = setTimeout(() => {
            isActive = false;
            header.style.transform = '';
            clickCount = 0;
            resetTimeout = null;
        }, 5000);
    });
    
    // Обработчик движения мыши для вращения по окружности
    document.addEventListener('mousemove', (e) => {
        if (!isActive || !isHovering) return;
        
        // Получаем позицию заголовка
        const rect = header.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        // Вычисляем угол между центром заголовка и позицией курсора
        const deltaX = e.clientX - centerX;
        const deltaY = e.clientY - centerY;
        const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
        
        // Определяем направление вращения на основе четности кликов
        // Нечетные клики (1, 3, 5...) - по часовой стрелке (положительный угол)
        // Четные клики (2, 4, 6...) - против часовой стрелки (отрицательный угол)
        const rotationAngle = clickCount % 2 === 1 ? angle : -angle;
        
        // Применяем вращение, сохраняя радужную анимацию
        header.style.transform = `rotate(${rotationAngle}deg)`;
        
        // Сбрасываем таймер при движении мыши
        if (resetTimeout) {
            clearTimeout(resetTimeout);
            resetTimeout = setTimeout(() => {
                isActive = false;
                header.style.transform = '';
                clickCount = 0;
                resetTimeout = null;
            }, 5000);
        }
    });
    
    // При наведении на заголовок активируем отслеживание
    header.addEventListener('mouseenter', () => {
        isHovering = true;
        // Если эффект еще не активирован, активируем его при первом наведении
        if (!isActive) {
            clickCount = 1; // Начинаем с нечетного (по часовой)
            isActive = true;
        }
    });
    
    // При уходе курсора останавливаем вращение, но не сбрасываем таймер
    header.addEventListener('mouseleave', () => {
        isHovering = false;
        // Не сбрасываем transform, чтобы сохранить последний угол
    });
}

