/**
 * Preloader Script
 * Handles smooth transition and removal of preloader on page load
 */

(function() {
  'use strict';

  // Configuration
  const PRELOADER_TIMEOUT = 3000; // Minimum display time (3 seconds)
  
  // Get preloader element
  const preloader = document.getElementById('preloader');
  
  if (!preloader) {
    console.warn('Preloader element not found');
    return;
  }

  /**
   * Hide the preloader with smooth fade-out
   */
  function hidePreloader() {
    // Add hidden class to trigger fade-out animation
    preloader.classList.add('hidden');
    
    // Remove from DOM after animation completes
    setTimeout(() => {
      if (preloader.parentNode) {
        preloader.parentNode.removeChild(preloader);
      }
    }, 800); // Match CSS transition duration
  }

  /**
   * Initialize preloader on page load
   */
  function initPreloader() {
    // Ensure minimum display time for better UX
    const minDisplayTime = new Promise(resolve => {
      setTimeout(resolve, PRELOADER_TIMEOUT);
    });

    // Wait for page to fully load
    const pageLoad = new Promise(resolve => {
      if (document.readyState === 'complete') {
        resolve();
      } else {
        window.addEventListener('load', resolve, { once: true });
      }
    });

    // Hide preloader when both conditions are met
    Promise.all([minDisplayTime, pageLoad]).then(() => {
      hidePreloader();
    });
  }

  /**
   * Start preloader when DOM is ready
   */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPreloader);
  } else {
    initPreloader();
  }

  /**
   * Fallback: Hide preloader after max timeout (even if page doesn't finish loading)
   */
  setTimeout(() => {
    if (preloader && !preloader.classList.contains('hidden')) {
      hidePreloader();
    }
  }, 5000); // 5 second fallback timeout

})();
