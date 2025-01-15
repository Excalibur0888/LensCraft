document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const navList = document.querySelector('.nav-list');

    if (menuBtn && navList) {
        menuBtn.addEventListener('click', function() {
            navList.classList.toggle('active');
            document.body.classList.toggle('menu-open');
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!event.target.closest('.mobile-menu-btn') && !event.target.closest('.nav-list')) {
                navList.classList.remove('active');
                document.body.classList.remove('menu-open');
            }
        });

        // Close menu when clicking on a link
        const navLinks = navList.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navList.classList.remove('active');
                document.body.classList.remove('menu-open');
            });
        });
    }

    // Header scroll behavior with smooth animation
    let lastScroll = 0;
    const scrollThreshold = 100;

    window.addEventListener('scroll', () => {
        const header = document.querySelector('header');
        const currentScroll = window.scrollY;
        
        // Add/remove scrolled class smoothly
        if (currentScroll > scrollThreshold) {
            if (!header.classList.contains('scrolled')) {
                requestAnimationFrame(() => {
                    header.classList.add('scrolled');
                });
            }
        } else {
            if (header.classList.contains('scrolled')) {
                requestAnimationFrame(() => {
                    header.classList.remove('scrolled');
                });
            }
        }
        
        lastScroll = currentScroll;
    });

    // Gallery functionality
    const galleryGrid = document.querySelector('.gallery-grid');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const lightbox = document.querySelector('.lightbox');
    const lightboxImg = lightbox?.querySelector('img');
    const lightboxCaption = lightbox?.querySelector('.lightbox-caption');
    const lightboxClose = lightbox?.querySelector('.lightbox-close');
    const lightboxPrev = lightbox?.querySelector('.lightbox-prev');
    const lightboxNext = lightbox?.querySelector('.lightbox-next');

    if (galleryGrid && filterBtns.length > 0) {
        // Gallery filtering
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Remove active class from all buttons
                filterBtns.forEach(b => b.classList.remove('active'));
                // Add active class to clicked button
                btn.classList.add('active');

                const category = btn.getAttribute('data-category');
                const items = galleryGrid.querySelectorAll('.gallery-item');

                items.forEach(item => {
                    if (category === 'all' || item.getAttribute('data-category') === category) {
                        item.style.display = 'block';
                        setTimeout(() => {
                            item.style.opacity = '1';
                            item.style.transform = 'scale(1)';
                        }, 50);
                    } else {
                        item.style.opacity = '0';
                        item.style.transform = 'scale(0.8)';
                        setTimeout(() => {
                            item.style.display = 'none';
                        }, 300);
                    }
                });
            });
        });

        // Lightbox functionality
        if (lightbox && lightboxImg && lightboxCaption) {
            let currentIndex = 0;
            const galleryItems = galleryGrid.querySelectorAll('.gallery-item');

            galleryItems.forEach((item, index) => {
                item.addEventListener('click', () => {
                    currentIndex = index;
                    const img = item.querySelector('img');
                    const caption = item.querySelector('.gallery-caption');
                    
                    lightboxImg.src = img.src;
                    lightboxCaption.innerHTML = caption.innerHTML;
                    lightbox.classList.add('active');
                    document.body.style.overflow = 'hidden';
                });
            });

            // Close lightbox
            lightboxClose?.addEventListener('click', () => {
                lightbox.classList.remove('active');
                document.body.style.overflow = '';
            });

            // Navigate through img
            lightboxPrev?.addEventListener('click', () => {
                currentIndex = (currentIndex - 1 + galleryItems.length) % galleryItems.length;
                updateLightboxContent();
            });

            lightboxNext?.addEventListener('click', () => {
                currentIndex = (currentIndex + 1) % galleryItems.length;
                updateLightboxContent();
            });

            // Update lightbox content
            function updateLightboxContent() {
                const currentItem = galleryItems[currentIndex];
                const img = currentItem.querySelector('img');
                const caption = currentItem.querySelector('.gallery-caption');
                
                lightboxImg.src = img.src;
                lightboxCaption.innerHTML = caption.innerHTML;
            }

            // Close lightbox on escape key
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    lightbox.classList.remove('active');
                    document.body.style.overflow = '';
                }
                if (e.key === 'ArrowLeft') {
                    lightboxPrev?.click();
                }
                if (e.key === 'ArrowRight') {
                    lightboxNext?.click();
                }
            });
        }
    }

    // Lazy loading for img
    const lazyimg = document.querySelectorAll('img[]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.add('loaded');
                    observer.unobserve(img);
                }
            });
        });

        lazyimg.forEach(img => imageObserver.observe(img));
    }

    // Smooth scroll for anchor links
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

    // Обработка прокрутки для Featured Works на мобильных устройствах
    const featuredGrid = document.querySelector('.featured-grid');
    const featuredContainer = document.querySelector('.featured-container');

    if (featuredGrid && window.innerWidth <= 768) {
        featuredGrid.addEventListener('scroll', function() {
            const scrollPercentage = (featuredGrid.scrollLeft / (featuredGrid.scrollWidth - featuredGrid.clientWidth)) * 100;
            featuredContainer.style.setProperty('--scroll', `${scrollPercentage}%`);
        });

        // Добавляем индикатор возможности прокрутки
        const canScrollLeft = () => featuredGrid.scrollLeft > 0;
        const canScrollRight = () => featuredGrid.scrollLeft < featuredGrid.scrollWidth - featuredGrid.clientWidth;

        const updateScrollIndicators = () => {
            featuredContainer.classList.toggle('can-scroll-left', canScrollLeft());
            featuredContainer.classList.toggle('can-scroll-right', canScrollRight());
        };

        featuredGrid.addEventListener('scroll', updateScrollIndicators);
        window.addEventListener('resize', updateScrollIndicators);
        updateScrollIndicators();
    }
}); 