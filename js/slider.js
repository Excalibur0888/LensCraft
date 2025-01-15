class Slider {
    constructor(sliderSelector, options = {}) {
        this.slider = document.querySelector(sliderSelector);
        if (!this.slider) return;

        this.slides = this.slider.querySelectorAll('.slide');
        if (this.slides.length === 0) return;

        this.currentSlide = 0;
        this.autoplay = options.autoplay || false;
        this.interval = options.interval || 5000;
        this.touchStartX = 0;
        this.touchEndX = 0;
        this.init();
    }

    init() {
        // Show first slide
        this.showSlide(this.currentSlide);

        // Add event listeners to controls
        const prevBtn = this.slider.parentElement.querySelector('.prev');
        const nextBtn = this.slider.parentElement.querySelector('.next');

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                this.prevSlide();
                if (this.autoplay) {
                    this.resetAutoplay();
                }
            });
        }
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                this.nextSlide();
                if (this.autoplay) {
                    this.resetAutoplay();
                }
            });
        }

        // Add touch events for mobile
        this.slider.addEventListener('touchstart', (e) => {
            this.touchStartX = e.touches[0].clientX;
        });

        this.slider.addEventListener('touchmove', (e) => {
            this.touchEndX = e.touches[0].clientX;
        });

        this.slider.addEventListener('touchend', () => {
            const touchDiff = this.touchStartX - this.touchEndX;
            if (Math.abs(touchDiff) > 50) {
                if (touchDiff > 0) {
                    this.nextSlide();
                } else {
                    this.prevSlide();
                }
                if (this.autoplay) {
                    this.resetAutoplay();
                }
            }
        });

        // Add keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (this.isSliderInViewport()) {
                if (e.key === 'ArrowLeft') {
                    this.prevSlide();
                    if (this.autoplay) {
                        this.resetAutoplay();
                    }
                } else if (e.key === 'ArrowRight') {
                    this.nextSlide();
                    if (this.autoplay) {
                        this.resetAutoplay();
                    }
                }
            }
        });

        // Start autoplay if enabled
        if (this.autoplay) {
            this.startAutoplay();
        }

        // Add intersection observer for pause/resume autoplay
        this.observeVisibility();
    }

    showSlide(index) {
        this.slides.forEach((slide, i) => {
            slide.classList.remove('active');
            if (i === index) {
                slide.classList.add('active');
                // Trigger any animations or transitions
                this.animateSlideContent(slide);
            }
        });
    }

    nextSlide() {
        this.currentSlide = (this.currentSlide + 1) % this.slides.length;
        this.showSlide(this.currentSlide);
    }

    prevSlide() {
        this.currentSlide = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
        this.showSlide(this.currentSlide);
    }

    startAutoplay() {
        this.autoplayInterval = setInterval(() => {
            this.nextSlide();
        }, this.interval);

        // Pause on hover
        this.slider.addEventListener('mouseenter', () => {
            this.pauseAutoplay();
        });

        this.slider.addEventListener('mouseleave', () => {
            this.resumeAutoplay();
        });
    }

    pauseAutoplay() {
        if (this.autoplayInterval) {
            clearInterval(this.autoplayInterval);
            this.autoplayInterval = null;
        }
    }

    resumeAutoplay() {
        if (this.autoplay && !this.autoplayInterval) {
            this.startAutoplay();
        }
    }

    resetAutoplay() {
        this.pauseAutoplay();
        this.resumeAutoplay();
    }

    isSliderInViewport() {
        const rect = this.slider.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }

    observeVisibility() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.resumeAutoplay();
                } else {
                    this.pauseAutoplay();
                }
            });
        }, { threshold: 0.5 });

        observer.observe(this.slider);
    }

    animateSlideContent(slide) {
        // Add any custom animations for slide content
        const elements = slide.querySelectorAll('.animate-on-show');
        elements.forEach((element, index) => {
            element.style.animation = 'none';
            element.offsetHeight; // Trigger reflow
            element.style.animation = `fadeInUp 0.5s ease forwards ${index * 0.2}s`;
        });
    }
}

// Initialize sliders when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Services slider
    new Slider('.services-slider', { autoplay: true, interval: 5000 });

    // Team slider
    new Slider('.team-slider', { autoplay: true, interval: 6000 });

    // Featured slider
    new Slider('.featured-slider', { autoplay: true, interval: 4000 });

    // Package slider
    new Slider('.package-slider', { autoplay: true, interval: 7000 });
}); 