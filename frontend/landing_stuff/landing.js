document.addEventListener('DOMContentLoaded', () => {
    const splashScreen = document.getElementById('splash-screen');
    const revealer = document.getElementById('center-revealer');
    const logoText = document.getElementById('logo-text');
    const mainContent = document.getElementById('main-content');


    const EXPANSION_DELAY = 100;
    const LOGO_FADE_IN_DELAY = 1500;
    const TOTAL_DURATION = 5000; 

    // 1. STAGE 1: Start the rectangle expansion
    setTimeout(() => {
        revealer.classList.add('expanded');
    }, EXPANSION_DELAY);

    // 2. STAGE 2: Fade in the logo text once the box is expanding
    setTimeout(() => {
        logoText.classList.add('visible');
    }, LOGO_FADE_IN_DELAY);


    // 3. STAGE 3: Hide the splash screen and reveal the main content (at 5 seconds)
    setTimeout(() => {
        // Start the fade-out of the entire splash screen
        splashScreen.style.opacity = '0';

        // Wait for the CSS fade-out transition (0.5s) to complete
        setTimeout(() => {
            splashScreen.style.display = 'none';
            // Reveal the main content by setting its opacity to 1 (handled by CSS transition)
            mainContent.classList.remove('hidden');
            mainContent.style.opacity = '1';
        }, 500);

    }, TOTAL_DURATION);

    document.querySelectorAll('.nav-button, .nav-item, .cta-primary').forEach(link => {
        link.addEventListener('click', (e) => {
            console.log(`${e.target.textContent} clicked!`);
        });
    });

});