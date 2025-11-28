/**
 * Модуль для визуальных эффектов
 * 
 * Содержит функции для создания специальных визуальных эффектов,
 * таких как белый шум (TV static effect).
 */

/**
 * Активация эффекта белого шума
 * 
 * Создает эффект "белого шума" (как на старом телевизоре) используя
 * HTML5 Canvas. Генерирует случайные пиксели и накладывает их поверх
 * всего контента страницы.
 * 
 * Эффект активируется при выборе опции "Дикий огурец 1337" в dropdown.
 */
function activateWhiteNoise() {
    const overlay = document.getElementById('whiteNoiseOverlay');
    const canvas = document.getElementById('noiseCanvas');
    
    if (!overlay || !canvas) return;
    
    // Активируем overlay для создания эффекта наложения
    overlay.classList.add('active');
    
    // Настраиваем canvas для генерации шума
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    /**
     * Генерация белого шума на canvas
     * 
     * Создает изображение с случайными значениями пикселей для каждого канала RGB.
     * Использует низкую прозрачность (alpha = 30) для создания эффекта наложения.
     */
    function generateNoise() {
        // Создаем ImageData объект для работы с пикселями
        const imageData = ctx.createImageData(canvas.width, canvas.height);
        const data = imageData.data;
        
        // Заполняем каждый пиксель случайным значением
        for (let i = 0; i < data.length; i += 4) {
            const value = Math.random() * 255;
            data[i] = value;     // R (красный канал)
            data[i + 1] = value; // G (зеленый канал)
            data[i + 2] = value; // B (синий канал)
            data[i + 3] = 30;    // Alpha (прозрачность) - низкая для эффекта наложения
        }
        
        // Применяем сгенерированные данные к canvas
        ctx.putImageData(imageData, 0, 0);
    }
    
    // Активируем canvas
    canvas.classList.add('active');
    
    // Генерируем шум каждые 50ms для создания эффекта мерцания
    // Это создает динамический эффект, похожий на старый телевизор
    const noiseInterval = setInterval(() => {
        generateNoise();
    }, 50);
    
    /**
     * Обновление размера canvas при изменении размера окна
     * 
     * Обеспечивает корректное отображение эффекта при изменении
     * размеров окна браузера.
     */
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        generateNoise();
    }
    
    // Добавляем обработчик изменения размера окна
    window.addEventListener('resize', resizeCanvas);
    
    // Генерируем начальный шум сразу после активации
    generateNoise();
}

