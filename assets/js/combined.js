/* ============================================
   COMBINED JAVASCRIPT FILE - All scripts merged
   ============================================ */

// ============ PRELOADER.JS ============
/**
 * Preloader Script
 * Handles smooth transition and removal of preloader on page load
 */

(function () {
  "use strict";

  // Configuration
  const PRELOADER_TIMEOUT = 2000; // Minimum display time (2 seconds)

  // Get preloader element
  const preloader = document.getElementById("preloader");

  if (!preloader) {
    console.warn("Preloader element not found");
    return;
  }

  /**
   * Hide the preloader with smooth fade-out
   */
  function hidePreloader() {
    // Add hidden class to trigger fade-out animation
    preloader.classList.add("hidden");

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
    const minDisplayTime = new Promise((resolve) => {
      setTimeout(resolve, PRELOADER_TIMEOUT);
    });

    // Wait for page to fully load
    const pageLoad = new Promise((resolve) => {
      if (document.readyState === "complete") {
        resolve();
      } else {
        window.addEventListener("load", resolve, { once: true });
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
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initPreloader);
  } else {
    initPreloader();
  }

  /**
   * Fallback: Hide preloader after max timeout (even if page doesn't finish loading)
   */
  setTimeout(() => {
    if (preloader && !preloader.classList.contains("hidden")) {
      hidePreloader();
    }
  }, 4000); // 4 second fallback timeout
})();

// ============ LANGUAGE.JS ============
// Language data storage
let currentLanguage = localStorage.getItem("language") || "en";
let translations = {};

// Load language files
async function loadLanguage(lang) {
  try {
    // Detect the correct path based on the current page location
    let basePath = "assets/js/";

    // Check if we're in a subdirectory (e.g., assets/3D/pizza/)
    const currentPath = window.location.pathname;
    const depth = (currentPath.match(/\//g) || []).length;

    // If we're in assets/3D/X/ folder (3 levels deep from root), adjust the path
    if (currentPath.includes("/assets/3D/")) {
      basePath = "../../js/";
    }

    const response = await fetch(`${basePath}${lang}.json`);
    const data = await response.json();
    translations = data;
    currentLanguage = lang;
    localStorage.setItem("language", lang);
    updatePageLanguage();
  } catch (error) {
    console.error("Error loading language file:", error);
  }
}

// Update all text on the page
function updatePageLanguage() {
  const elements = document.querySelectorAll("[data-lang-key]");
  elements.forEach((element) => {
    const key = element.getAttribute("data-lang-key");
    if (translations[key]) {
      // Handle placeholder attributes
      if (element.hasAttribute("placeholder")) {
        element.setAttribute("placeholder", translations[key]);
      }
      // Handle elements with child elements (like hero-title with spans)
      else if (
        element.children.length > 0 &&
        element.tagName !== "INPUT" &&
        element.tagName !== "TEXTAREA"
      ) {
        // Don't replace textContent if it has child elements
      } else {
        element.textContent = translations[key];
      }
    }
  });
}

// Language button click handler
document.addEventListener("DOMContentLoaded", () => {
  // Load initial language
  loadLanguage(currentLanguage);

  // Language option buttons
  const langOptions = document.querySelectorAll(".lang-option");
  langOptions.forEach((button) => {
    button.addEventListener("click", () => {
      const lang = button.getAttribute("data-lang");
      loadLanguage(lang);
    });
  });
});

// ============ MAIN.JS ============
// Register ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

document.addEventListener("DOMContentLoaded", () => {
  // --- Selectors ---
  const menuBtn = document.getElementById("menu-btn");
  const closeBtn = document.getElementById("close-btn");
  const sideMenu = document.getElementById("side-menu");
  const menuOverlay = document.getElementById("menu-overlay");
  const themeBtn = document.getElementById("theme-toggle");
  const body = document.body;

  // --- Initialize Theme from localStorage ---
  const savedTheme = localStorage.getItem("theme") || "light";
  body.setAttribute("data-theme", savedTheme);
  body.classList.remove("light-theme", "dark-theme");
  body.classList.add(savedTheme === "dark" ? "dark-theme" : "light-theme");
  themeBtn.checked = savedTheme === "dark";

  // --- Theme Toggling ---
  themeBtn.addEventListener("change", () => {
    const isDark = themeBtn.checked;
    const newTheme = isDark ? "dark" : "light";
    body.setAttribute("data-theme", newTheme);
    body.classList.remove("light-theme", "dark-theme");
    body.classList.add(isDark ? "dark-theme" : "light-theme");
    localStorage.setItem("theme", newTheme);
  });

  // --- Menu Animation (GSAP) ---
  const menuTimeline = gsap.timeline({ paused: true });

  menuTimeline
    .to(menuOverlay, {
      duration: 0.3,
      opacity: 1,
      pointerEvents: "all",
      ease: "power2.inOut",
    })
    .to(
      sideMenu,
      {
        duration: 0.5,
        x: 0,
        ease: "power3.out",
      },
      "-=0.2",
    ) // Start slightly before overlay finishes
    .from(
      ".menu-links li",
      {
        duration: 0.4,
        opacity: 0,
        x: 20,
        stagger: 0.1,
        ease: "power2.out",
      },
      "-=0.3",
    );

  // Open Menu
  menuBtn.addEventListener("click", () => menuTimeline.play());

  // Close Menu (Btn or Overlay)
  const closeMenu = () => menuTimeline.reverse();
  closeBtn.addEventListener("click", closeMenu);
  menuOverlay.addEventListener("click", closeMenu);

  // --- Hero Section Animation (GSAP Entrance) ---
  const heroTl = gsap.timeline({ defaults: { ease: "power3.out" } });

  heroTl
    .to(".hero-title", {
      duration: 1,
      opacity: 1,
      y: 0,
      startAt: { y: 50 },
    })
    .to(
      ".hero-subtitle",
      {
        duration: 1,
        opacity: 1,
        y: 0,
        startAt: { y: 30 },
      },
      "-=0.6",
    )
    .to(
      ".cta-btn",
      {
        duration: 0.8,
        opacity: 1,
        y: 0,
        startAt: { y: 20 },
      },
      "-=0.6",
    );

  // --- Hover Effect for Buttons (Magnetic feel optional) ---
  // Simple custom GSAP hover
  const buttons = document.querySelectorAll(".cta-btn, .card-btn");
  buttons.forEach((btn) => {
    btn.addEventListener("mouseenter", () => {
      gsap.to(btn, { scale: 1.05, duration: 0.3, ease: "power1.out" });
    });
    btn.addEventListener("mouseleave", () => {
      gsap.to(btn, { scale: 1, duration: 0.3, ease: "power1.out" });
    });
  });
});
// Minimal Javascript to handle loading states for a premium feel
const onProgress = (event) => {
  const progressBar = event.target.querySelector(".progress-bar");
  const updatingBar = event.target.querySelector(".update-bar");

  if (event.detail.totalProgress === 0) {
    progressBar.classList.remove("hide");
  } else {
    updatingBar.style.width = `${event.detail.totalProgress * 100}%`;
    if (event.detail.totalProgress === 1) {
      progressBar.classList.add("hide");
    }
  }
};

// Attach listeners to all model-viewers
document.querySelectorAll("model-viewer").forEach((viewer) => {
  viewer.addEventListener("progress", onProgress);
});
