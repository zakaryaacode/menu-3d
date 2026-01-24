// Register ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

document.addEventListener('DOMContentLoaded', () => {
    
    // --- Selectors ---
    const menuBtn = document.getElementById('menu-btn');
    const closeBtn = document.getElementById('close-btn');
    const sideMenu = document.getElementById('side-menu');
    const menuOverlay = document.getElementById('menu-overlay');
    const themeBtn = document.getElementById('theme-toggle');
    const body = document.body;

    // --- Initialize Theme from localStorage ---
    const savedTheme = localStorage.getItem('theme') || 'light';
    body.setAttribute('data-theme', savedTheme);
    body.classList.remove('light-theme', 'dark-theme');
    body.classList.add(savedTheme === 'dark' ? 'dark-theme' : 'light-theme');
    themeBtn.checked = savedTheme === 'dark';

    // --- Theme Toggling ---
    themeBtn.addEventListener('change', () => {
        const isDark = themeBtn.checked;
        const newTheme = isDark ? 'dark' : 'light';
        body.setAttribute('data-theme', newTheme);
        body.classList.remove('light-theme', 'dark-theme');
        body.classList.add(isDark ? 'dark-theme' : 'light-theme');
        localStorage.setItem('theme', newTheme);
    });

    // --- Menu Animation (GSAP) ---
    const menuTimeline = gsap.timeline({ paused: true });

    menuTimeline
        .to(menuOverlay, { 
            duration: 0.3, 
            opacity: 1, 
            pointerEvents: 'all', 
            ease: 'power2.inOut' 
        })
        .to(sideMenu, { 
            duration: 0.5, 
            x: 0, 
            ease: 'power3.out' 
        }, "-=0.2") // Start slightly before overlay finishes
        .from('.menu-links li', {
            duration: 0.4,
            opacity: 0,
            x: 20,
            stagger: 0.1,
            ease: 'power2.out'
        }, "-=0.3");

    // Open Menu
    menuBtn.addEventListener('click', () => menuTimeline.play());

    // Close Menu (Btn or Overlay)
    const closeMenu = () => menuTimeline.reverse();
    closeBtn.addEventListener('click', closeMenu);
    menuOverlay.addEventListener('click', closeMenu);

    // --- Hero Section Animation (GSAP Entrance) ---
    const heroTl = gsap.timeline({ defaults: { ease: "power3.out" } });

    heroTl
        .to('.hero-title', { 
            duration: 1, 
            opacity: 1, 
            y: 0, 
            startAt: { y: 50 } 
        })
        .to('.hero-subtitle', { 
            duration: 1, 
            opacity: 1, 
            y: 0, 
            startAt: { y: 30 } 
        }, "-=0.6")
        .to('.cta-btn', { 
            duration: 0.8, 
            opacity: 1, 
            y: 0, 
            startAt: { y: 20 } 
        }, "-=0.6");


    // --- Hover Effect for Buttons (Magnetic feel optional) ---
    // Simple custom GSAP hover
    const buttons = document.querySelectorAll('.cta-btn, .card-btn');
    buttons.forEach(btn => {
        btn.addEventListener('mouseenter', () => {
            gsap.to(btn, { scale: 1.05, duration: 0.3, ease: "power1.out" });
        });
        btn.addEventListener('mouseleave', () => {
            gsap.to(btn, { scale: 1, duration: 0.3, ease: "power1.out" });
        });
    });
});