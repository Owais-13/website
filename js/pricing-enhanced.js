/* Enhanced Pricing Section JavaScript */

$(document).ready(function() {
    
    // Initialize pricing animations
    initPricingAnimations();
    
    // Add interactive effects
    addInteractiveEffects();
    
    // Add scroll animations
    addScrollAnimations();
    
    // Add particle effects
    addParticleEffects();
    
    // Enhanced enrollment functionality
    enhanceEnrollmentButtons();
});

// Initialize pricing card animations
function initPricingAnimations() {
    // Animate pricing cards on page load
    $('.pricing-entry').each(function(index) {
        const $card = $(this);
        
        // Stagger animation delays
        setTimeout(function() {
            $card.addClass('loaded');
        }, index * 200);
    });
    
    // Add floating animation on scroll
    $(window).scroll(function() {
        const scrollPos = $(window).scrollTop();
        const windowHeight = $(window).height();
        
        $('.pricing-entry').each(function() {
            const $card = $(this);
            const cardOffset = $card.offset().top;
            
            if (scrollPos + windowHeight > cardOffset + 100) {
                $card.addClass('in-view');
            }
        });
    });
}

// Add interactive hover and click effects
function addInteractiveEffects() {
    // Enhanced hover effects for pricing cards
    $('.pricing-entry').hover(
        function() {
            $(this).addClass('hover-effect');
            
            // Add ripple effect
            const $ripple = $('<div class="ripple-effect"></div>');
            $(this).append($ripple);
            
            // Animate other cards
            $('.pricing-entry').not(this).addClass('dimmed');
            
            // Add sound effect (optional)
            playHoverSound();
        },
        function() {
            $(this).removeClass('hover-effect');
            $('.ripple-effect').remove();
            $('.pricing-entry').removeClass('dimmed');
        }
    );
    
    // Add click animation to buttons
    $('.enroll-btn').click(function(e) {
        e.preventDefault();
        
        const $btn = $(this);
        const $card = $btn.closest('.pricing-entry');
        
        // Add click animation
        $btn.addClass('clicked');
        $card.addClass('selected');
        
        // Create success animation
        setTimeout(function() {
            showSuccessAnimation($card);
        }, 300);
        
        // Reset after animation
        setTimeout(function() {
            $btn.removeClass('clicked');
            $card.removeClass('selected');
        }, 2000);
        
        // Trigger enrollment modal or action
        const courseName = $card.find('h3').text();
        const price = $card.find('.price').text();
        triggerEnrollment(courseName, price);
    });
}

// Add scroll-based animations
function addScrollAnimations() {
    // Create intersection observer for enhanced animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const $card = $(entry.target);
                
                // Add entrance animation
                $card.addClass('animate-in');
                
                // Animate price counter
                animatePriceCounter($card);
                
                // Add sparkle effects
                addSparkleEffect($card);
            }
        });
    }, {
        threshold: 0.3,
        rootMargin: '0px 0px -50px 0px'
    });
    
    // Observe all pricing cards
    $('.pricing-entry').each(function() {
        observer.observe(this);
    });
}

// Add particle effects to the background
function addParticleEffects() {
    const $section = $('.ielts-programs-section');
    
    // Create floating particles
    for (let i = 0; i < 20; i++) {
        const $particle = $('<div class="floating-particle"></div>');
        $particle.css({
            position: 'absolute',
            width: Math.random() * 6 + 2 + 'px',
            height: Math.random() * 6 + 2 + 'px',
            background: 'rgba(255, 255, 255, 0.3)',
            borderRadius: '50%',
            left: Math.random() * 100 + '%',
            top: Math.random() * 100 + '%',
            animation: `float ${Math.random() * 10 + 5}s linear infinite`,
            animationDelay: Math.random() * 5 + 's'
        });
        
        $section.append($particle);
    }
}

// Enhanced enrollment button functionality
function enhanceEnrollmentButtons() {
    $('.enroll-btn').each(function() {
        const $btn = $(this);
        
        // Add loading state
        $btn.on('click', function() {
            const originalText = $btn.text();
            
            // Show loading state
            $btn.html('<i class="fas fa-spinner fa-spin"></i> Processing...');
            $btn.prop('disabled', true);
            
            // Simulate processing time
            setTimeout(function() {
                $btn.html(originalText);
                $btn.prop('disabled', false);
            }, 2000);
        });
        
        // Add keyboard accessibility
        $btn.on('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                $(this).click();
            }
        });
    });
}

// Animate price counter effect
function animatePriceCounter($card) {
    const $price = $card.find('.price');
    const priceText = $price.text();
    const priceNumber = parseInt(priceText.replace(/[^\d]/g, ''));
    
    if (priceNumber) {
        let currentNumber = 0;
        const increment = priceNumber / 50;
        const currency = priceText.charAt(0);
        
        const counter = setInterval(function() {
            currentNumber += increment;
            if (currentNumber >= priceNumber) {
                currentNumber = priceNumber;
                clearInterval(counter);
            }
            
            $price.text(currency + Math.floor(currentNumber).toLocaleString());
        }, 30);
    }
}

// Add sparkle effect to cards
function addSparkleEffect($card) {
    for (let i = 0; i < 5; i++) {
        const $sparkle = $('<div class="sparkle"></div>');
        $sparkle.css({
            position: 'absolute',
            width: '4px',
            height: '4px',
            background: '#fff',
            borderRadius: '50%',
            left: Math.random() * 100 + '%',
            top: Math.random() * 100 + '%',
            animation: 'sparkle 1s ease-out forwards',
            animationDelay: Math.random() * 0.5 + 's',
            pointerEvents: 'none'
        });
        
        $card.append($sparkle);
        
        // Remove sparkle after animation
        setTimeout(function() {
            $sparkle.remove();
        }, 1500);
    }
}

// Show success animation
function showSuccessAnimation($card) {
    const $success = $('<div class="success-overlay"><i class="fas fa-check-circle"></i><span>Added to Cart!</span></div>');
    $card.append($success);
    
    setTimeout(function() {
        $success.addClass('show');
    }, 100);
    
    setTimeout(function() {
        $success.removeClass('show');
        setTimeout(function() {
            $success.remove();
        }, 300);
    }, 1500);
}

// Play hover sound (optional)
function playHoverSound() {
    // Create audio context for subtle sound effects
    if (typeof AudioContext !== 'undefined' || typeof webkitAudioContext !== 'undefined') {
        try {
            const audioContext = new (AudioContext || webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 0.1);
            
            gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.1);
        } catch (e) {
            // Sound not supported or blocked
        }
    }
}

// Trigger enrollment action
function triggerEnrollment(courseName, price) {
    // You can customize this function to integrate with your enrollment system
    console.log(`Enrolling in: ${courseName} - ${price}`);
    
    // Example: Show modal, redirect to payment, etc.
    if (typeof $ !== 'undefined' && $('#enrollModal').length) {
        $('#enrollModal').modal('show');
        $('#enrollModal .modal-title').text(`Enroll in ${courseName}`);
        $('#enrollModal .course-price').text(price);
    }
}

// Add CSS animations dynamically
const enhancedStyles = `
<style>
.ripple-effect {
    position: absolute;
    border-radius: 50%;
    background: rgba(102, 126, 234, 0.3);
    transform: scale(0);
    animation: ripple 0.6s linear;
    pointer-events: none;
}

@keyframes ripple {
    to {
        transform: scale(4);
        opacity: 0;
    }
}

.pricing-entry.dimmed {
    opacity: 0.7;
    transform: scale(0.98);
}

.pricing-entry.clicked .enroll-btn {
    transform: scale(0.95);
    animation: pulse 0.3s ease;
}

@keyframes pulse {
    0%, 100% { transform: scale(0.95); }
    50% { transform: scale(1.05); }
}

.success-overlay {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: rgba(40, 167, 69, 0.95);
    color: white;
    padding: 20px;
    border-radius: 15px;
    text-align: center;
    opacity: 0;
    transition: opacity 0.3s ease;
    z-index: 10;
}

.success-overlay.show {
    opacity: 1;
}

.success-overlay i {
    font-size: 2rem;
    margin-bottom: 10px;
    display: block;
}

@keyframes sparkle {
    0% {
        opacity: 0;
        transform: scale(0);
    }
    50% {
        opacity: 1;
        transform: scale(1);
    }
    100% {
        opacity: 0;
        transform: scale(0);
    }
}

.floating-particle {
    animation: float 8s linear infinite;
}

@keyframes float {
    0%, 100% {
        transform: translateY(0px) rotate(0deg);
    }
    25% {
        transform: translateY(-20px) rotate(90deg);
    }
    50% {
        transform: translateY(-40px) rotate(180deg);
    }
    75% {
        transform: translateY(-20px) rotate(270deg);
    }
}

.pricing-entry.animate-in {
    animation: bounceInUp 0.8s ease-out;
}

@keyframes bounceInUp {
    0% {
        opacity: 0;
        transform: translateY(200px);
    }
    60% {
        opacity: 1;
        transform: translateY(-10px);
    }
    80% {
        transform: translateY(5px);
    }
    100% {
        transform: translateY(0);
    }
}
</style>
`;

// Inject enhanced styles
$('head').append(enhancedStyles); 