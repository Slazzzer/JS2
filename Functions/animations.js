// Модуль анимаций элементов интерфейса

// Анимация появления карточек при загрузке
function animateCards() {
    const cards = document.querySelectorAll('.news-item');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, index * 100);
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });

    cards.forEach(card => {
        observer.observe(card);
    });
}

// 3D вращение карточек как юла при наведении
function setupCardAnimations() {
    const cards = document.querySelectorAll('.news-item');
    
    cards.forEach(card => {
        let rotationInterval = null;
        let currentRotationY = 0;
        let baseTransform = '';
        
        if (card.classList.contains('visible')) {
            baseTransform = 'translateY(0) scale(1)';
        }
        
        card.style.transformStyle = 'preserve-3d';
        card.style.backfaceVisibility = 'visible';
        
        card.addEventListener('mouseenter', function() {
            this.style.transition = 'transform 0.05s linear';
            
            rotationInterval = setInterval(() => {
                currentRotationY -= 3;
                if (currentRotationY <= -360) currentRotationY = 0;
                this.style.transform = `translateY(-5px) rotateY(${currentRotationY}deg)`;
            }, 16);
        });
        
        card.addEventListener('mouseleave', function() {
            if (rotationInterval) {
                clearInterval(rotationInterval);
                rotationInterval = null;
            }
            
            this.style.transition = 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
            
            if (baseTransform) {
                this.style.transform = baseTransform;
            } else {
                this.style.transform = '';
            }
            
            setTimeout(() => {
                currentRotationY = 0;
                if (baseTransform) {
                    this.style.transform = baseTransform;
                } else {
                    this.style.transform = '';
                }
            }, 500);
        });
    });
}

// Анимации элементов сайдбара
function setupSidebarAnimations() {
    const sidebarItems = document.querySelectorAll('.news-types li, .all-news');
    
    sidebarItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transition = 'all 0.3s ease';
        });
    });
}

// Вращение и движение логотипа по прямоугольнику экрана
function setupLogoRotation() {
    const logo = document.querySelector('.sidebar-header img');
    if (!logo) return;
    
    let isAnimating = false;
    let animationFrameId = null;
    const originalPosition = { left: null, top: null };
    
    logo.style.cursor = 'pointer';
    
    const sidebarHeader = document.querySelector('.sidebar-header');
    if (sidebarHeader) {
        const rect = sidebarHeader.getBoundingClientRect();
        originalPosition.left = rect.left;
        originalPosition.top = rect.top;
    }
    
    logo.addEventListener('click', function() {
        if (isAnimating) {
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId);
                animationFrameId = null;
            }
            this.classList.remove('rotating', 'moving-around');
            isAnimating = false;
            this.style.position = '';
            this.style.left = '';
            this.style.top = '';
            this.style.transform = '';
        } else {
            this.style.position = 'fixed';
            this.style.zIndex = '10001';
            this.style.transition = 'none';
            this.classList.add('rotating', 'moving-around');
            isAnimating = true;
            animateLogoAroundScreen(this, originalPosition);
        }
    });
    
    function animateLogoAroundScreen(logoElement, originalPos) {
        const startTime = Date.now();
        const duration = 8000;
        const logoSize = 40;
        
        function animate() {
            if (!isAnimating) return;
            
            const screenWidth = window.innerWidth;
            const screenHeight = window.innerHeight;
            const perimeter = 2 * (screenWidth + screenHeight);
            
            const elapsed = Date.now() - startTime;
            const progress = (elapsed % duration) / duration;
            
            let distance = progress * perimeter;
            let x, y;
            
            if (distance < screenWidth) {
                x = distance;
                y = 0;
            } else if (distance < screenWidth + screenHeight) {
                x = screenWidth;
                y = distance - screenWidth;
            } else if (distance < 2 * screenWidth + screenHeight) {
                x = screenWidth - (distance - screenWidth - screenHeight);
                y = screenHeight;
            } else {
                x = 0;
                y = screenHeight - (distance - 2 * screenWidth - screenHeight);
            }
            
            logoElement.style.left = (x - logoSize / 2) + 'px';
            logoElement.style.top = (y - logoSize / 2) + 'px';
            
            animationFrameId = requestAnimationFrame(animate);
        }
        
        animate();
    }
}

// Анимация самолета с блокировкой футера
function setupAirplaneAnimation() {
    const sidebarFooter = document.querySelector('.sidebar-footer');
    const airplane = document.getElementById('airplane');
    
    if (!sidebarFooter || !airplane) return;
    
    let isBlocked = false;
    
    sidebarFooter.style.cursor = 'pointer';
    
    sidebarFooter.addEventListener('click', function() {
        if (isBlocked) {
            return;
        }
        
        isBlocked = true;
        sidebarFooter.classList.add('blocked');
        sidebarFooter.style.cursor = 'not-allowed';
        sidebarFooter.style.opacity = '0.6';
        
        airplane.classList.remove('flying');
        
        setTimeout(() => {
            airplane.classList.add('flying');
            
            setTimeout(() => {
                airplane.classList.remove('flying');
                
                isBlocked = false;
                sidebarFooter.classList.remove('blocked');
                sidebarFooter.style.cursor = 'pointer';
                sidebarFooter.style.opacity = '1';
            }, 3000);
        }, 10);
    });
}

// Эффект "убегания" текста от курсора
function setupRunawayText() {
    const text = document.querySelector('.sidebar-header-text');
    if (!text) return;
    
    const container = text.closest('.sidebar-header');
    if (!container) return;
    
    let isHovering = false;
    const runDistance = 50;
    
    document.addEventListener('mousemove', (e) => {
        if (!isHovering) return;
        
        const rect = text.getBoundingClientRect();
        const elementX = rect.left + rect.width / 2;
        const elementY = rect.top + rect.height / 2;
        
        const deltaX = e.clientX - elementX;
        const deltaY = e.clientY - elementY;
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        
        if (distance < 150) {
            const angle = Math.atan2(deltaY, deltaX);
            const moveX = -Math.cos(angle) * runDistance * (1 - distance / 150) * 1.5;
            const moveY = -Math.sin(angle) * runDistance * (1 - distance / 150) * 1.5;
            
            text.style.transform = `translate(${moveX}px, ${moveY}px)`;
        } else {
            text.style.transform = 'translate(0, 0)';
        }
    });
    
    text.addEventListener('mouseenter', () => {
        isHovering = true;
    });
    
    text.addEventListener('mouseleave', () => {
        isHovering = false;
        text.style.transform = 'translate(0, 0)';
    });
}

// Вращение заголовка "Все контакты" при наведении мыши
function setupHeaderRotation() {
    const header = document.querySelector('.main-header h1');
    if (!header) return;
    
    let clickCount = 0;
    let resetTimeout = null;
    let isHovering = false;
    let isActive = false;
    
    header.style.cursor = 'pointer';
    
    header.addEventListener('click', function() {
        clickCount++;
        isActive = true;
        
        if (resetTimeout) {
            clearTimeout(resetTimeout);
        }
        
        resetTimeout = setTimeout(() => {
            isActive = false;
            header.style.transform = '';
            clickCount = 0;
            resetTimeout = null;
        }, 5000);
    });
    
    document.addEventListener('mousemove', (e) => {
        if (!isActive || !isHovering) return;
        
        const rect = header.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        const deltaX = e.clientX - centerX;
        const deltaY = e.clientY - centerY;
        const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
        
        const rotationAngle = clickCount % 2 === 1 ? angle : -angle;
        
        header.style.transform = `rotate(${rotationAngle}deg)`;
        
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
    
    header.addEventListener('mouseenter', () => {
        isHovering = true;
        if (!isActive) {
            clickCount = 1;
            isActive = true;
        }
    });
    
    header.addEventListener('mouseleave', () => {
        isHovering = false;
    });
}
