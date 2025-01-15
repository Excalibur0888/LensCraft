document.addEventListener('DOMContentLoaded', function() {
    // Gallery filtering with animation
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');
    const gallery = document.querySelector('.gallery-grid');

    if (gallery) {
        // Initialize Masonry layout
        const masonry = new Masonry(gallery, {
            itemSelector: '.gallery-item',
            columnWidth: '.gallery-item',
            percentPosition: true,
            transitionDuration: '0.6s',
            stagger: 30
        });

        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Remove active class from all buttons
                filterButtons.forEach(btn => btn.classList.remove('active'));
                // Add active class to clicked button
                this.classList.add('active');

                const category = this.dataset.category;

                // Filter items with animation
                galleryItems.forEach(item => {
                    const shouldShow = category === 'all' || item.dataset.category === category;
                    item.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
                    
                    if (shouldShow) {
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                        item.style.display = 'block';
                    } else {
                        item.style.opacity = '0';
                        item.style.transform = 'scale(0.8)';
                        setTimeout(() => {
                            item.style.display = 'none';
                        }, 600);
                    }
                });

                // Update masonry layout
                setTimeout(() => {
                    masonry.layout();
                }, 700);
            });
        });
    }

    // Lightbox functionality
    const createLightbox = () => {
        const lightbox = document.createElement('div');
        lightbox.className = 'lightbox';
        lightbox.innerHTML = `
            <div class="lightbox-content">
                <button class="lightbox-close">&times;</button>
                <button class="lightbox-prev">&#8249;</button>
                <button class="lightbox-next">&#8250;</button>
                <img src="" alt="">
                <div class="lightbox-caption">
                    <h3></h3>
                    <p></p>
                </div>
            </div>
        `;
        document.body.appendChild(lightbox);
        return lightbox;
    };

    const lightbox = createLightbox();
    let currentIndex = 0;
    const visibleItems = () => Array.from(galleryItems).filter(item => item.style.display !== 'none');

    // Gallery image click handling
    galleryItems.forEach(item => {
        item.addEventListener('click', function() {
            const img = this.querySelector('img');
            const caption = this.querySelector('.gallery-caption');
            const lightboxImg = lightbox.querySelector('img');
            const lightboxCaption = lightbox.querySelector('.lightbox-caption');
            
            if (img && caption) {
                currentIndex = visibleItems().indexOf(this);
                lightboxImg.src = img.src || img.dataset.src;
                lightboxCaption.querySelector('h3').textContent = caption.querySelector('h3').textContent;
                lightboxCaption.querySelector('p').textContent = caption.querySelector('p').textContent;
                lightbox.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });
    });

    // Lightbox navigation
    const showImage = (index) => {
        const items = visibleItems();
        currentIndex = (index + items.length) % items.length;
        const item = items[currentIndex];
        const img = item.querySelector('img');
        const caption = item.querySelector('.gallery-caption');
        const lightboxImg = lightbox.querySelector('img');
        const lightboxCaption = lightbox.querySelector('.lightbox-caption');

        lightboxImg.src = img.src || img.dataset.src;
        lightboxCaption.querySelector('h3').textContent = caption.querySelector('h3').textContent;
        lightboxCaption.querySelector('p').textContent = caption.querySelector('p').textContent;
    };

    lightbox.querySelector('.lightbox-close').addEventListener('click', () => {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    });

    lightbox.querySelector('.lightbox-prev').addEventListener('click', () => {
        showImage(currentIndex - 1);
    });

    lightbox.querySelector('.lightbox-next').addEventListener('click', () => {
        showImage(currentIndex + 1);
    });

    // Close lightbox on outside click
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            lightbox.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    // Keyboard navigation for lightbox
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;

        switch (e.key) {
            case 'Escape':
                lightbox.classList.remove('active');
                document.body.style.overflow = '';
                break;
            case 'ArrowLeft':
                showImage(currentIndex - 1);
                break;
            case 'ArrowRight':
                showImage(currentIndex + 1);
                break;
        }
    });

    // Lazy loading for gallery img
    const lazyLoad = () => {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        img.classList.add('loaded');
                    }
                    observer.unobserve(img);
                }
            });
        }, {
            rootMargin: '50px'
        });

        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    };

    lazyLoad();

    // Add smooth scroll for gallery navigation
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
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
}); 