// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initScrollAnimations();
    initProductImageHover();
    initSmoothScrolling();
    initButtonInteractions();
    initCounterAnimations();
    initParallaxEffects();
});

// Smooth Scroll Animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
                
                // Special handling for timeline items
                if (entry.target.classList.contains('timeline-item')) {
                    setTimeout(() => {
                        entry.target.style.transform = 'translateY(0)';
                        entry.target.style.opacity = '1';
                    }, 200);
                }
                
                // Special handling for process steps
                if (entry.target.classList.contains('process-step')) {
                    const delay = Array.from(entry.target.parentNode.children).indexOf(entry.target) * 200;
                    setTimeout(() => {
                        entry.target.style.transform = 'translateY(0)';
                        entry.target.style.opacity = '1';
                    }, delay);
                }
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animatedElements = document.querySelectorAll(`
        .timeline-item,
        .process-step,
        .education-item,
        .impact-item,
        .package-item,
        .use-case
    `);

    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
        observer.observe(el);
    });
}

// Product Image Hover Effects
function initProductImageHover() {
    const productImages = document.querySelector('.product-images');
    const mainProduct = document.querySelector('.product-main');
    const secondaryProduct = document.querySelector('.product-secondary');

    if (productImages && mainProduct && secondaryProduct) {
        productImages.addEventListener('mouseenter', () => {
            mainProduct.style.transform = 'rotate(0deg) scale(1.05)';
            secondaryProduct.style.transform = 'rotate(5deg) scale(1.1)';
            secondaryProduct.style.opacity = '1';
        });

        productImages.addEventListener('mouseleave', () => {
            mainProduct.style.transform = 'rotate(-5deg) scale(1)';
            secondaryProduct.style.transform = 'rotate(10deg) scale(1)';
            secondaryProduct.style.opacity = '0.9';
        });
    }
}

// Smooth Scrolling for Navigation
function initSmoothScrolling() {
    // Add smooth scrolling to any internal links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Button Interactions
function initButtonInteractions() {
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(button => {
        // Add ripple effect
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });

        // Handle specific button actions
        if (button.textContent.includes('주문하기')) {
            button.addEventListener('click', function() {
                showOrderModal('emergency-kit');
            });
        } else if (button.textContent.includes('견적 문의')) {
            button.addEventListener('click', function() {
                showOrderModal('industrial');
            });
        } else if (button.textContent.includes('제품 주문하기')) {
            button.addEventListener('click', function() {
                showOrderModal('general');
            });
        } else if (button.textContent.includes('상담 문의')) {
            button.addEventListener('click', function() {
                showConsultationModal();
            });
        }
    });

    // Add ripple effect styles
    const style = document.createElement('style');
    style.textContent = `
        .btn {
            position: relative;
            overflow: hidden;
        }
        .ripple {
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.3);
            transform: scale(0);
            animation: ripple-animation 0.6s linear;
            pointer-events: none;
        }
        @keyframes ripple-animation {
            to {
                transform: scale(2);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
}

// Counter Animations for Statistics
function initCounterAnimations() {
    const timelineDurations = document.querySelectorAll('.timeline-duration');
    const absorptionRate = document.querySelector('.spec');
    
    const animateCounter = (element, target, suffix = '') => {
        let current = 0;
        const increment = target / 50;
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            element.textContent = Math.floor(current) + suffix;
        }, 50);
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (entry.target.classList.contains('timeline-duration')) {
                    const text = entry.target.textContent;
                    if (text.includes('2년')) {
                        animateCounter(entry.target, 2, '년');
                    } else if (text.includes('1년')) {
                        setTimeout(() => {
                            animateCounter(entry.target, 1, '년');
                        }, 500);
                    }
                }
                observer.unobserve(entry.target);
            }
        });
    });

    timelineDurations.forEach(el => observer.observe(el));
}

// Parallax Effects
function initParallaxEffects() {
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.hero::before');
        
        parallaxElements.forEach(element => {
            const speed = 0.5;
            element.style.transform = `translateY(${scrolled * speed}px)`;
        });
    });
}

// Modal Functions
function showOrderModal(type) {
    const modal = createModal();
    const modalContent = document.createElement('div');
    modalContent.className = 'modal-content';
    
    let title, description;
    switch(type) {
        case 'emergency-kit':
            title = '긴급 처리용 세트 주문';
            description = '파우더 5kg + 필로우 3kg 세트';
            break;
        case 'industrial':
            title = '산업용 대량 구매 견적';
            description = '공장용 대량 구매 특가 (1톤 이상)';
            break;
        default:
            title = 'PINESORB 제품 주문';
            description = '친환경 유흡착제 주문 문의';
    }
    
    modalContent.innerHTML = `
        <div class="modal-header">
            <h2>${title}</h2>
            <button class="modal-close">&times;</button>
        </div>
        <div class="modal-body">
            <p>${description}</p>
            <form class="order-form">
                <div class="form-group">
                    <label class="form-label">회사명/이름</label>
                    <input type="text" class="form-control" required>
                </div>
                <div class="form-group">
                    <label class="form-label">연락처</label>
                    <input type="tel" class="form-control" required>
                </div>
                <div class="form-group">
                    <label class="form-label">이메일</label>
                    <input type="email" class="form-control" required>
                </div>
                <div class="form-group">
                    <label class="form-label">필요 수량</label>
                    <input type="number" class="form-control" min="1" required>
                </div>
                <div class="form-group">
                    <label class="form-label">추가 요청사항</label>
                    <textarea class="form-control" rows="3"></textarea>
                </div>
                <button type="submit" class="btn btn--primary btn--full-width">주문 문의 전송</button>
            </form>
        </div>
    `;
    
    modal.appendChild(modalContent);
    document.body.appendChild(modal);
    
    // Add event listeners
    modal.querySelector('.modal-close').addEventListener('click', () => {
        document.body.removeChild(modal);
    });
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            document.body.removeChild(modal);
        }
    });
    
    modal.querySelector('form').addEventListener('submit', handleOrderSubmit);
}

function showConsultationModal() {
    const modal = createModal();
    const modalContent = document.createElement('div');
    modalContent.className = 'modal-content';
    
    modalContent.innerHTML = `
        <div class="modal-header">
            <h2>전문 상담 문의</h2>
            <button class="modal-close">&times;</button>
        </div>
        <div class="modal-body">
            <p>PINESORB 전문가가 귀하의 요구사항에 맞는 최적의 솔루션을 제안해드립니다.</p>
            <form class="consultation-form">
                <div class="form-group">
                    <label class="form-label">회사명/이름</label>
                    <input type="text" class="form-control" required>
                </div>
                <div class="form-group">
                    <label class="form-label">연락처</label>
                    <input type="tel" class="form-control" required>
                </div>
                <div class="form-group">
                    <label class="form-label">이메일</label>
                    <input type="email" class="form-control" required>
                </div>
                <div class="form-group">
                    <label class="form-label">사용 용도</label>
                    <select class="form-control" required>
                        <option value="">선택해주세요</option>
                        <option value="household">가정용</option>
                        <option value="small-business">소규모 사업장</option>
                        <option value="industrial">대형 산업시설</option>
                        <option value="marine">해양 환경</option>
                        <option value="other">기타</option>
                    </select>
                </div>
                <div class="form-group">
                    <label class="form-label">상담 희망 시간</label>
                    <select class="form-control">
                        <option value="">선택해주세요</option>
                        <option value="morning">오전 (9:00-12:00)</option>
                        <option value="afternoon">오후 (13:00-18:00)</option>
                        <option value="anytime">언제든지</option>
                    </select>
                </div>
                <div class="form-group">
                    <label class="form-label">상담 내용</label>
                    <textarea class="form-control" rows="4" placeholder="궁금한 사항이나 요구사항을 자세히 적어주세요"></textarea>
                </div>
                <button type="submit" class="btn btn--primary btn--full-width">상담 신청</button>
            </form>
        </div>
    `;
    
    modal.appendChild(modalContent);
    document.body.appendChild(modal);
    
    // Add event listeners
    modal.querySelector('.modal-close').addEventListener('click', () => {
        document.body.removeChild(modal);
    });
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            document.body.removeChild(modal);
        }
    });
    
    modal.querySelector('form').addEventListener('submit', handleConsultationSubmit);
}

function createModal() {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
        backdrop-filter: blur(5px);
    `;
    
    const style = document.createElement('style');
    style.textContent = `
        .modal-content {
            background: var(--color-surface);
            border-radius: var(--radius-lg);
            max-width: 500px;
            width: 90%;
            max-height: 90vh;
            overflow-y: auto;
            box-shadow: var(--shadow-lg);
        }
        .modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: var(--space-20);
            border-bottom: 1px solid var(--color-border);
        }
        .modal-header h2 {
            margin: 0;
            color: var(--color-text);
        }
        .modal-close {
            background: none;
            border: none;
            font-size: var(--font-size-3xl);
            cursor: pointer;
            color: var(--color-text-secondary);
            padding: 0;
            width: 30px;
            height: 30px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .modal-close:hover {
            color: var(--color-text);
        }
        .modal-body {
            padding: var(--space-20);
        }
        .order-form, .consultation-form {
            margin-top: var(--space-16);
        }
    `;
    
    if (!document.querySelector('#modal-styles')) {
        style.id = 'modal-styles';
        document.head.appendChild(style);
    }
    
    return modal;
}

function handleOrderSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    
    // Simulate form submission
    const submitButton = form.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    submitButton.textContent = '전송 중...';
    submitButton.disabled = true;
    
    setTimeout(() => {
        submitButton.textContent = '전송 완료!';
        submitButton.style.background = 'var(--color-success)';
        
        setTimeout(() => {
            const modal = form.closest('.modal-overlay');
            if (modal) {
                document.body.removeChild(modal);
            }
            showSuccessMessage('주문 문의가 성공적으로 전송되었습니다. 빠른 시간 내에 연락드리겠습니다.');
        }, 1000);
    }, 2000);
}

function handleConsultationSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    
    // Simulate form submission
    const submitButton = form.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    submitButton.textContent = '신청 중...';
    submitButton.disabled = true;
    
    setTimeout(() => {
        submitButton.textContent = '신청 완료!';
        submitButton.style.background = 'var(--color-success)';
        
        setTimeout(() => {
            const modal = form.closest('.modal-overlay');
            if (modal) {
                document.body.removeChild(modal);
            }
            showSuccessMessage('상담 신청이 완료되었습니다. 전문가가 곧 연락드리겠습니다.');
        }, 1000);
    }, 2000);
}

function showSuccessMessage(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--color-success);
        color: white;
        padding: var(--space-16) var(--space-20);
        border-radius: var(--radius-md);
        box-shadow: var(--shadow-lg);
        z-index: 1001;
        max-width: 300px;
        animation: slideInRight 0.3s ease-out;
    `;
    notification.textContent = message;
    
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
    `;
    
    if (!document.querySelector('#notification-styles')) {
        style.id = 'notification-styles';
        document.head.appendChild(style);
    }
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideInRight 0.3s ease-out reverse';
        setTimeout(() => {
            if (notification.parentNode) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 4000);
}

// Performance optimization: Throttle scroll events
function throttle(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Apply throttling to scroll events
window.addEventListener('scroll', throttle(() => {
    // Any scroll-based animations can be added here
}, 16)); // ~60fps