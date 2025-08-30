// GlicoShield - Presell JavaScript
// Gerado automaticamente pelo Sistema Inteligente

// Countdown Timer
function initCountdown() {
    const countdown = document.getElementById('countdown');
    if (!countdown) return;
    
    const hoursEl = document.getElementById('hours');
    const minutesEl = document.getElementById('minutes');
    const secondsEl = document.getElementById('seconds');
    
    let hours = 23;
    let minutes = 59;
    let seconds = 59;
    
    function updateCountdown() {
        seconds--;
        
        if (seconds < 0) {
            seconds = 59;
            minutes--;
            
            if (minutes < 0) {
                minutes = 59;
                hours--;
                
                if (hours < 0) {
                    // Reset countdown
                    hours = 23;
                    minutes = 59;
                    seconds = 59;
                }
            }
        }
        
        hoursEl.textContent = hours.toString().padStart(2, '0');
        minutesEl.textContent = minutes.toString().padStart(2, '0');
        secondsEl.textContent = seconds.toString().padStart(2, '0');
    }
    
    // Update every second
    setInterval(updateCountdown, 1000);
}

// Conversion Tracking
function trackConversion(event) {
    // Google Analytics
    if (typeof gtag !== 'undefined') {
        gtag('event', 'conversion', {
            'event_category': 'CTA',
            'event_label': event,
            'value': 97
        });
    }
    
    // Facebook Pixel
    if (typeof fbq !== 'undefined') {
        fbq('track', 'Lead', {
            content_name: 'GlicoShield',
            content_category: 'Product',
            value: 97,
            currency: 'BRL'
        });
    }
    
    console.log('Conversion tracked:', event);
}

// Smooth Scrolling
function initSmoothScrolling() {
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

// Exit Intent (for desktop)
function initExitIntent() {
    let hasShownPopup = false;
    
    document.addEventListener('mouseleave', function(e) {
        if (e.clientY <= 0 && !hasShownPopup && window.innerWidth > 768) {
            hasShownPopup = true;
            
            if (confirm('🚨 ESPERA! Antes de sair, que tal garantir GlicoShield com 60% de desconto? Esta oferta é válida apenas hoje!')) {
                window.location.href = 'https://go.hotmart.com/glicoshield123';
            }
        }
    });
}

// Page Visibility (mobile exit intent)
function initPageVisibility() {
    let hasShownAlert = false;
    
    document.addEventListener('visibilitychange', function() {
        if (document.hidden && !hasShownAlert && window.innerWidth <= 768) {
            hasShownAlert = true;
            
            setTimeout(() => {
                if (document.hidden) {
                    // Mobile exit intent - could trigger push notification or similar
                    console.log('User left page on mobile');
                }
            }, 2000);
        }
    });
}

// Scroll Animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    document.querySelectorAll('.benefit-item, .testimonial').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initCountdown();
    initSmoothScrolling();
    initExitIntent();
    initPageVisibility();
    initScrollAnimations();
    
    console.log('GlicoShield Presell initialized');
    
    // Track page view
    trackConversion('page_view');
});

// Performance optimization
window.addEventListener('load', function() {
    // Remove loading states, optimize images, etc.
    document.body.classList.add('loaded');
});