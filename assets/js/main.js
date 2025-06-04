// 메인 JavaScript 파일
document.addEventListener('DOMContentLoaded', function() {
    console.log('고령군 탄소중립 마을 웹사이트가 로드되었습니다.');
    
    // 모든 초기화 함수 실행
    initializeAOS();
    initializeNavigation();
    initializeCounters();
    initializeMobileMenu();
    initializeScrollEffects();
    initializeInteractiveElements();
    initializeCharts();
    initializeSlider(); // 슬라이더 초기화 추가
    
    // 페이지 로드 완료 이벤트
    window.addEventListener('load', function() {
        document.body.classList.add('loaded');
        console.log('모든 리소스가 로드되었습니다.');
    });
});

// AOS (Animate On Scroll) 초기화
function initializeAOS() {
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-in-out',
            once: true,
            offset: 100,
            disable: function() {
                var maxWidth = 768;
                return window.innerWidth < maxWidth;
            }
        });
        console.log('AOS 애니메이션이 초기화되었습니다.');
    }
}

// 네비게이션 관련 기능
function initializeNavigation() {
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // 스크롤 시 네비게이션 스타일 변경
    function handleNavbarScroll() {
        if (navbar && window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else if (navbar) {
            navbar.classList.remove('scrolled');
        }
    }
    
    // 활성 네비게이션 링크 업데이트
    function updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPosition = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
    
    // 부드러운 스크롤 (페이지 내 링크만)
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // href가 #으로 시작하는 페이지 내 링크인 경우만 부드러운 스크롤 적용
            if (href && href.startsWith('#')) {
                e.preventDefault();
                const targetSection = document.querySelector(href);
                
                if (targetSection) {
                    const offsetTop = targetSection.offsetTop - 80;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            }
            // 외부 링크(파일 경로)는 기본 동작 유지 (새 페이지로 이동)
        });
    });
    
    // 스크롤 이벤트 리스너
    let ticking = false;
    function onScroll() {
        if (!ticking) {
            requestAnimationFrame(function() {
                handleNavbarScroll();
                updateActiveNavLink();
                ticking = false;
            });
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', onScroll);
    console.log('네비게이션 기능이 초기화되었습니다.');
}

// 숫자 카운터 애니메이션
function initializeCounters() {
    const counters = document.querySelectorAll('[data-count]');
    
    function animateCounter(element) {
        const target = parseInt(element.getAttribute('data-count'));
        const duration = 2000; // 2초
        const increment = target / (duration / 16); // 60fps
        let current = 0;
        
        element.classList.add('counting');
        
        const timer = setInterval(function() {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
                element.classList.remove('counting');
            }
            
            // 숫자 포맷팅 (콤마 추가)
            if (target >= 1000) {
                element.textContent = Math.floor(current).toLocaleString();
            } else if (target >= 10) {
                element.textContent = Math.floor(current);
            } else {
                element.textContent = current.toFixed(1);
            }
        }, 16);
    }
    
    // Intersection Observer로 뷰포트에 들어올 때 애니메이션 시작
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const counterObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
                entry.target.classList.add('animated');
                animateCounter(entry.target);
            }
        });
    }, observerOptions);
    
    counters.forEach(counter => {
        counterObserver.observe(counter);
    });
    
    console.log(`${counters.length}개의 카운터가 초기화되었습니다.`);
}

// 모바일 메뉴 기능
function initializeMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const navbar = document.getElementById('navbar');
    
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            navbar.classList.toggle('mobile-menu-open');
            
            // 아이콘 변경 (햄버거 <-> X)
            const icon = this.querySelector('svg');
            if (navbar.classList.contains('mobile-menu-open')) {
                icon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>';
            } else {
                icon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>';
            }
        });
    }
    
    console.log('모바일 메뉴가 초기화되었습니다.');
}

// 스크롤 관련 효과들
function initializeScrollEffects() {
    // 스크롤 진행률 표시
    function updateScrollProgress() {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        
        // 프로그레스 바가 있다면 업데이트
        const progressBar = document.querySelector('.scroll-progress');
        if (progressBar) {
            progressBar.style.width = scrollPercent + '%';
        }
        
        // 스크롤 위치에 따른 추가 효과들
        if (scrollPercent > 10) {
            document.body.classList.add('scrolled');
        } else {
            document.body.classList.remove('scrolled');
        }
    }
    
    // 패럴럭스 효과
    function handleParallax() {
        const parallaxElements = document.querySelectorAll('.parallax');
        const scrollTop = window.scrollY;
        
        parallaxElements.forEach(element => {
            const speed = element.dataset.speed || 0.5;
            const yPos = -(scrollTop * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });
    }
    
    // 스크롤 이벤트 최적화
    let scrollTicking = false;
    function onScrollOptimized() {
        if (!scrollTicking) {
            requestAnimationFrame(function() {
                updateScrollProgress();
                handleParallax();
                scrollTicking = false;
            });
            scrollTicking = true;
        }
    }
    
    window.addEventListener('scroll', onScrollOptimized);
    console.log('스크롤 효과가 초기화되었습니다.');
}

// 인터랙티브 요소들
function initializeInteractiveElements() {
    // 카드 호버 효과
    const cards = document.querySelectorAll('.card-hover');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // 버튼 클릭 효과
    const buttons = document.querySelectorAll('button, .btn');
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            // 리플 효과
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
    });
    
    // 툴팁 기능
    const tooltipElements = document.querySelectorAll('[data-tooltip]');
    tooltipElements.forEach(element => {
        element.addEventListener('mouseenter', showTooltip);
        element.addEventListener('mouseleave', hideTooltip);
    });
    
    console.log('인터랙티브 요소들이 초기화되었습니다.');
}

// 차트 초기화 (Chart.js 사용)
function initializeCharts() {
    // 에너지 절감 효과 차트
    const energySavingsChart = document.getElementById('energySavingsChart');
    if (energySavingsChart && typeof Chart !== 'undefined') {
        const ctx = energySavingsChart.getContext('2d');
        new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['절감액', '기존 비용'],
                datasets: [{
                    data: [72, 108],
                    backgroundColor: ['#4CAF50', '#E0E0E0'],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }
    
    // CO2 감축 차트
    const co2ReductionChart = document.getElementById('co2ReductionChart');
    if (co2ReductionChart && typeof Chart !== 'undefined') {
        const ctx = co2ReductionChart.getContext('2d');
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['현재', '1년 후', '3년 후', '5년 후'],
                datasets: [{
                    label: 'CO₂ 배출량 (톤)',
                    data: [234, 70, 50, 35],
                    backgroundColor: ['#FF5722', '#FF9800', '#FFC107', '#4CAF50'],
                    borderRadius: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }
    
    console.log('차트가 초기화되었습니다.');
}

// 유틸리티 함수들
const Utils = {
    // 숫자 포맷팅
    formatNumber(num) {
        return num.toLocaleString('ko-KR');
    },
    
    // 통화 포맷팅
    formatCurrency(amount) {
        return new Intl.NumberFormat('ko-KR', {
            style: 'currency',
            currency: 'KRW'
        }).format(amount);
    },
    
    // 퍼센트 포맷팅
    formatPercent(value) {
        return (value * 100).toFixed(1) + '%';
    },
    
    // 날짜 포맷팅
    formatDate(date) {
        return new Intl.DateTimeFormat('ko-KR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }).format(date);
    },
    
    // 디바운싱
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },
    
    // 스로틀링
    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },
    
    // 요소가 뷰포트에 있는지 확인
    isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    },
    
    // 부드러운 스크롤
    smoothScrollTo(target, duration = 800) {
        const targetElement = typeof target === 'string' ? document.querySelector(target) : target;
        if (!targetElement) return;
        
        const targetPosition = targetElement.offsetTop - 80;
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition;
        let startTime = null;
        
        function animation(currentTime) {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const run = Utils.easeInOutQuad(timeElapsed, startPosition, distance, duration);
            window.scrollTo(0, run);
            if (timeElapsed < duration) requestAnimationFrame(animation);
        }
        
        requestAnimationFrame(animation);
    },
    
    // 이징 함수
    easeInOutQuad(t, b, c, d) {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t + b;
        t--;
        return -c / 2 * (t * (t - 2) - 1) + b;
    }
};

// 토스트 알림 시스템
const Toast = {
    container: null,
    
    init() {
        if (!this.container) {
            this.container = document.createElement('div');
            this.container.className = 'toast-container';
            this.container.style.cssText = `
                position: fixed;
                top: 2rem;
                right: 2rem;
                z-index: 10000;
                display: flex;
                flex-direction: column;
                gap: 1rem;
            `;
            document.body.appendChild(this.container);
        }
    },
    
    show(message, type = 'info', duration = 3000) {
        this.init();
        
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `
            <div class="toast-content">
                <span class="toast-message">${message}</span>
                <button class="toast-close" onclick="this.parentElement.parentElement.remove()">×</button>
            </div>
        `;
        
        this.container.appendChild(toast);
        
        // 애니메이션
        setTimeout(() => toast.classList.add('show'), 100);
        
        // 자동 제거
        if (duration > 0) {
            setTimeout(() => {
                toast.classList.remove('show');
                setTimeout(() => toast.remove(), 300);
            }, duration);
        }
    },
    
    success(message, duration) {
        this.show(message, 'success', duration);
    },
    
    error(message, duration) {
        this.show(message, 'error', duration);
    },
    
    warning(message, duration) {
        this.show(message, 'warning', duration);
    }
};

// 모달 시스템
const Modal = {
    open(content, options = {}) {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal-content" style="max-width: ${options.maxWidth || '600px'}">
                <div class="modal-header">
                    <h3>${options.title || ''}</h3>
                    <button class="modal-close" onclick="Modal.close(this)">×</button>
                </div>
                <div class="modal-body">
                    ${content}
                </div>
                ${options.showFooter !== false ? `
                    <div class="modal-footer">
                        <button class="btn btn-secondary" onclick="Modal.close(this)">닫기</button>
                        ${options.confirmText ? `<button class="btn btn-primary" onclick="${options.onConfirm || ''}">${options.confirmText}</button>` : ''}
                    </div>
                ` : ''}
            </div>
        `;
        
        document.body.appendChild(modal);
        setTimeout(() => modal.classList.add('active'), 100);
        
        // ESC 키로 닫기
        const escHandler = (e) => {
            if (e.key === 'Escape') {
                this.close(modal);
                document.removeEventListener('keydown', escHandler);
            }
        };
        document.addEventListener('keydown', escHandler);
        
        // 배경 클릭으로 닫기
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.close(modal);
            }
        });
        
        return modal;
    },
    
    close(element) {
        const modal = element.closest ? element.closest('.modal-overlay') : element;
        if (modal) {
            modal.classList.remove('active');
            setTimeout(() => modal.remove(), 300);
        }
    }
};

// 성능 모니터링
const Performance = {
    startTime: Date.now(),
    
    log(message) {
        const elapsed = Date.now() - this.startTime;
        console.log(`[${elapsed}ms] ${message}`);
    },
    
    measure(name, fn) {
        const start = performance.now();
        const result = fn();
        const end = performance.now();
        console.log(`${name}: ${(end - start).toFixed(2)}ms`);
        return result;
    }
};

// 에러 핸들링
window.addEventListener('error', function(e) {
    console.error('JavaScript 에러:', e.error);
    Toast.error('일시적인 오류가 발생했습니다. 페이지를 새로고침해 주세요.');
});

window.addEventListener('unhandledrejection', function(e) {
    console.error('Promise 에러:', e.reason);
    Toast.error('네트워크 오류가 발생했습니다.');
});

// 풀스크린 슬라이더 시스템
let currentSlide = 0;
let slideInterval;
let isSliderPlaying = true;
let slideElements = [];
let totalSlides = 0;

// 슬라이더 초기화
function initializeSlider() {
    try {
        slideElements = document.querySelectorAll('.slide');
        totalSlides = slideElements.length;
        
        if (totalSlides === 0) {
            console.log('슬라이드 요소를 찾을 수 없습니다.');
            return;
        }
        
        // 첫 번째 슬라이드 활성화
        showSlide(0);
        
        // 자동 슬라이드 시작
        startAutoSlide();
        
        // 키보드 이벤트
        initializeSliderKeyboard();
        
        // 터치 이벤트 (모바일)
        initializeSliderTouch();
        
        // 마우스 휠 이벤트
        initializeSliderWheel();
        
        // 윈도우 리사이즈 이벤트
        window.addEventListener('resize', handleSliderResize);
        
        // 페이지 가시성 변경 시 슬라이더 제어
        document.addEventListener('visibilitychange', handleVisibilityChange);
        
        console.log(`풀스크린 슬라이더가 초기화되었습니다. (총 ${totalSlides}개 슬라이드)`);
    } catch (error) {
        console.error('슬라이더 초기화 중 오류 발생:', error);
    }
}

// 슬라이드 표시
function showSlide(index) {
    try {
        if (totalSlides === 0 || !slideElements || slideElements.length === 0) return;
        
        // 인덱스 범위 체크
        if (index >= totalSlides) {
            currentSlide = 0;
        } else if (index < 0) {
            currentSlide = totalSlides - 1;
        } else {
            currentSlide = index;
        }
        
        // 모든 슬라이드 비활성화
        slideElements.forEach((slide, i) => {
            if (slide) {
                slide.classList.remove('active');
                if (i === currentSlide) {
                    slide.classList.add('active');
                }
            }
        });
        
        // 인디케이터 업데이트
        updateIndicators();
        
        // 프로그레스 바 업데이트
        updateProgressBar();
        
        // 슬라이드 변경 이벤트 발생
        dispatchSlideChangeEvent();
    } catch (error) {
        console.error('슬라이드 표시 중 오류:', error);
    }
}

// 다음 슬라이드
function nextSlide() {
    showSlide(currentSlide + 1);
}

// 이전 슬라이드
function previousSlide() {
    showSlide(currentSlide - 1);
}

// 특정 슬라이드로 이동
function goToSlide(index) {
    showSlide(index);
    resetAutoSlide();
}

// 인디케이터 업데이트
function updateIndicators() {
    try {
        const indicators = document.querySelectorAll('.indicator');
        if (indicators.length === 0) return;
        
        indicators.forEach((indicator, index) => {
            if (indicator) {
                indicator.classList.remove('active');
                if (index === currentSlide) {
                    indicator.classList.add('active');
                }
            }
        });
    } catch (error) {
        console.error('인디케이터 업데이트 중 오류:', error);
    }
}

// 프로그레스 바 업데이트
function updateProgressBar() {
    try {
        const progressBar = document.getElementById('progressBar');
        if (progressBar && totalSlides > 0) {
            const progress = ((currentSlide + 1) / totalSlides) * 100;
            progressBar.style.width = progress + '%';
        }
    } catch (error) {
        console.error('프로그레스 바 업데이트 중 오류:', error);
    }
}

// 자동 슬라이드 시작
function startAutoSlide() {
    if (slideInterval) clearInterval(slideInterval);
    
    slideInterval = setInterval(() => {
        if (isSliderPlaying && document.visibilityState === 'visible') {
            nextSlide();
        }
    }, 8000); // 8초로 변경 (기존 5초에서)
}

// 자동 슬라이드 리셋
function resetAutoSlide() {
    if (isSliderPlaying) {
        startAutoSlide();
    }
}

// 슬라이드 일시정지/재생
function toggleSliderPlayback() {
    isSliderPlaying = !isSliderPlaying;
    
    if (isSliderPlaying) {
        startAutoSlide();
    } else {
        clearInterval(slideInterval);
    }
}

// 키보드 이벤트 초기화
function initializeSliderKeyboard() {
    document.addEventListener('keydown', (e) => {
        switch(e.key) {
            case 'ArrowLeft':
                e.preventDefault();
                previousSlide();
                resetAutoSlide();
                break;
            case 'ArrowRight':
                e.preventDefault();
                nextSlide();
                resetAutoSlide();
                break;
            case ' ': // 스페이스바
                e.preventDefault();
                toggleSliderPlayback();
                break;
            case 'Home':
                e.preventDefault();
                goToSlide(0);
                break;
            case 'End':
                e.preventDefault();
                goToSlide(totalSlides - 1);
                break;
        }
    });
}

// 터치 이벤트 초기화 (모바일 스와이프)
function initializeSliderTouch() {
    try {
        const sliderContainer = document.querySelector('.slider-container');
        if (!sliderContainer) {
            console.log('슬라이더 컨테이너를 찾을 수 없습니다.');
            return;
        }
        
        let touchStartX = 0;
        let touchEndX = 0;
        let touchStartY = 0;
        let touchEndY = 0;
        const minSwipeDistance = 50;
        
        sliderContainer.addEventListener('touchstart', (e) => {
            if (e.changedTouches && e.changedTouches[0]) {
                touchStartX = e.changedTouches[0].screenX;
                touchStartY = e.changedTouches[0].screenY;
            }
        }, { passive: true });
        
        sliderContainer.addEventListener('touchend', (e) => {
            if (e.changedTouches && e.changedTouches[0]) {
                touchEndX = e.changedTouches[0].screenX;
                touchEndY = e.changedTouches[0].screenY;
                
                const deltaX = touchEndX - touchStartX;
                const deltaY = touchEndY - touchStartY;
                
                // 수평 스와이프가 수직 스와이프보다 큰지 확인
                if (Math.abs(deltaX) > Math.abs(deltaY)) {
                    if (Math.abs(deltaX) > minSwipeDistance) {
                        if (deltaX > 0) {
                            previousSlide();
                        } else {
                            nextSlide();
                        }
                        resetAutoSlide();
                    }
                }
            }
        }, { passive: true });
    } catch (error) {
        console.error('터치 이벤트 초기화 중 오류:', error);
    }
}

// 마우스 휠 이벤트 초기화 (비활성화)
function initializeSliderWheel() {
    // 마우스 휠로 슬라이더 변경 기능을 제거하고
    // 자연스러운 페이지 스크롤을 허용합니다.
    console.log('마우스 휠 슬라이더 제어가 비활성화되었습니다. 자연스러운 스크롤을 사용합니다.');
    
    // 필요한 경우 여기에 다른 휠 관련 기능을 추가할 수 있습니다
}

// 윈도우 리사이즈 처리
function handleSliderResize() {
    // 필요한 경우 슬라이드 레이아웃 재계산
    updateProgressBar();
}

// 페이지 가시성 변경 처리
function handleVisibilityChange() {
    if (document.hidden) {
        // 페이지가 숨겨지면 슬라이더 일시정지
        clearInterval(slideInterval);
    } else {
        // 페이지가 다시 보이면 슬라이더 재시작
        if (isSliderPlaying) {
            startAutoSlide();
        }
    }
}

// 슬라이드 변경 커스텀 이벤트 발생
function dispatchSlideChangeEvent() {
    const event = new CustomEvent('slideChange', {
        detail: {
            currentSlide: currentSlide,
            totalSlides: totalSlides,
            slideElement: slideElements[currentSlide]
        }
    });
    document.dispatchEvent(event);
}

// 슬라이드 변경 이벤트 리스너 예제
document.addEventListener('slideChange', (e) => {
    // 개발 모드에서만 로그 출력
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        console.log(`슬라이드 변경: ${e.detail.currentSlide + 1}/${e.detail.totalSlides}`);
    }
    
    // 필요한 경우 여기에 슬라이드별 특정 동작 추가
    // 예: 특정 슬라이드에서 애니메이션 시작, 비디오 재생 등
});

// 슬라이더 제어 API
window.SliderAPI = {
    next: nextSlide,
    previous: previousSlide,
    goTo: goToSlide,
    play: () => {
        isSliderPlaying = true;
        startAutoSlide();
    },
    pause: () => {
        isSliderPlaying = false;
        clearInterval(slideInterval);
    },
    toggle: toggleSliderPlayback,
    getCurrentSlide: () => currentSlide,
    getTotalSlides: () => totalSlides,
    isPlaying: () => isSliderPlaying
};

// 전역 객체로 내보내기
window.Utils = Utils;
window.Toast = Toast;
window.Modal = Modal;
window.Performance = Performance;

// 개발 모드에서만 성능 로그
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    Performance.log('메인 스크립트 로드 완료');
}

console.log('고령군 탄소중립 마을 웹사이트 JavaScript 초기화 완료 ✅');