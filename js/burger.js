document.addEventListener('DOMContentLoaded', () => {
    const burgerMenu = document.querySelector('.burger-menu');
    const navMenu = document.querySelector('.nav-menu');
    const menuOverlay = document.querySelector('.menu-overlay');
    const menuLinks = document.querySelectorAll('.nav-menu a');

    // Функция для открытия/закрытия меню
    function toggleMenu() {
        burgerMenu.classList.toggle('active');
        navMenu.classList.toggle('active');
        menuOverlay.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    }

    // Обработчики событий
    burgerMenu.addEventListener('click', toggleMenu);
    menuOverlay.addEventListener('click', toggleMenu);

    // Закрытие меню при клике на ссылку
    menuLinks.forEach(link => {
        link.addEventListener('click', () => {
            toggleMenu();
        });
    });

    // Закрытие меню при нажатии Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
            toggleMenu();
        }
    });

    // Предотвращение прокрутки страницы при прокрутке меню
    navMenu.addEventListener('wheel', (e) => {
        if (navMenu.scrollHeight > navMenu.clientHeight) {
            e.stopPropagation();
        }
    });
}); 