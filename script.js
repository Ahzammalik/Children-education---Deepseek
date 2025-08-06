document.addEventListener('DOMContentLoaded', function() {
    // Hide loading screen after delay
    setTimeout(function() {
        const loadingScreen = document.getElementById('loading-screen');
        loadingScreen.style.opacity = '0';
        setTimeout(function() {
            loadingScreen.style.display = 'none';
        }, 500);
    }, 2000);
    
    // Initialize navigation
    initNavigation();
    
    // Initialize activity cards
    initActivityCards();
    
    // Add hover effects
    initHoverEffects();
    
    // Initialize testimonial carousel
    initTestimonialCarousel();
});

function initNavigation() {
    const navButtons = document.querySelectorAll('.nav-btn');
    const sectionContents = document.querySelectorAll('.section-content');
    
    // Show home section by default
    document.getElementById('home').style.display = 'block';
    
    navButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            navButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Hide all sections
            sectionContents.forEach(section => {
                section.style.display = 'none';
            });
            
            // Show selected section
            const sectionId = this.getAttribute('data-section');
            document.getElementById(sectionId).style.display = 'block';
            
            // Initialize section if needed
            if (sectionId !== 'home' && document.getElementById(sectionId).innerHTML === '') {
                loadSectionContent(sectionId);
            }
        });
    });
}

function initActivityCards() {
    const activityCards = document.querySelectorAll('.activity-card');
    
    activityCards.forEach(card => {
        card.addEventListener('click', function() {
            const sectionId = this.getAttribute('data-section');
            const correspondingButton = document.querySelector(`.nav-btn[data-section="${sectionId}"]`);
            
            if (correspondingButton) {
                correspondingButton.click();
            }
        });
        
        // Add keyboard accessibility
        card.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                this.click();
            }
        });
    });
}

function initHoverEffects() {
    const cards = document.querySelectorAll('.feature-card, .activity-card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
            this.style.boxShadow = '0 6px 15px rgba(0, 0, 0, 0.1)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = '';
            this.style.boxShadow = '';
        });
    });
}

function initTestimonialCarousel() {
    // In a real app, this would handle multiple testimonials
    // For now, we'll just animate the single testimonial
    const testimonial = document.querySelector('.testimonial-card');
    
    if (testimonial) {
        setInterval(function() {
            testimonial.style.transform = 'translateY(-5px)';
            setTimeout(function() {
                testimonial.style.transform = '';
            }, 500);
        }, 5000);
    }
}

function loadSectionContent(sectionId) {
    const section = document.getElementById(sectionId);
    
    // Show loading state
    section.innerHTML = `
        <div class="loading-indicator">
            <div class="spinner">
                <div class="spinner-inner"></div>
            </div>
            <p>Loading ${sectionId} content...</p>
        </div>
    `;
    
    // Simulate content loading
    setTimeout(function() {
        let content = '';
        
        switch(sectionId) {
            case 'english':
                content = createEnglishContent();
                break;
            case 'math':
                content = createMathContent();
                break;
            case 'poems':
                content = createPoemsContent();
                break;
            case 'coloring':
                content = createColoringContent();
                break;
            default:
                content = '<p>Content not available</p>';
        }
        
        section.innerHTML = content;
        
        // Add entrance animation
        section.style.animation = 'fadeIn 0.5s ease';
    }, 1000);
}

// Content creation functions would be expanded in a real app
function createEnglishContent() {
    return '<h2>English Section</h2><p>English learning content will appear here</p>';
}

function createMathContent() {
    return '<h2>Math Section</h2><p>Math learning content will appear here</p>';
}

function createPoemsContent() {
    return '<h2>Poems Section</h2><p>Poems content will appear here</p>';
}

function createColoringContent() {
    return '<h2>Coloring Section</h2><p>Coloring content will appear here</p>';
}
