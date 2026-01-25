// Language data storage
let currentLanguage = localStorage.getItem('language') || 'en';
let translations = {};

// Load language files
async function loadLanguage(lang) {
  try {
    // Detect the correct path based on the current page location
    let basePath = 'assets/js/';
    
    // Check if we're in a subdirectory (e.g., assets/3D/pizza/)
    const currentPath = window.location.pathname;
    const depth = (currentPath.match(/\//g) || []).length;
    
    // If we're in assets/3D/X/ folder (3 levels deep from root), adjust the path
    if (currentPath.includes('/assets/3D/')) {
      basePath = '../../js/';
    }
    
    const response = await fetch(`${basePath}${lang}.json`);
    const data = await response.json();
    translations = data;
    currentLanguage = lang;
    localStorage.setItem('language', lang);
    updatePageLanguage();
  } catch (error) {
    console.error('Error loading language file:', error);
  }
}

// Update all text on the page
function updatePageLanguage() {
  const elements = document.querySelectorAll('[data-lang-key]');
  elements.forEach(element => {
    const key = element.getAttribute('data-lang-key');
    if (translations[key]) {
      // Handle placeholder attributes
      if (element.hasAttribute('placeholder')) {
        element.setAttribute('placeholder', translations[key]);
      }
      // Handle elements with child elements (like hero-title with spans)
      else if (element.children.length > 0 && element.tagName !== 'INPUT' && element.tagName !== 'TEXTAREA') {
        // Don't replace textContent if it has child elements
      } 
      else {
        element.textContent = translations[key];
      }
    }
  });
}

// Language button click handler
document.addEventListener('DOMContentLoaded', () => {
  // Load initial language
  loadLanguage(currentLanguage);

  // Language option buttons
  const langOptions = document.querySelectorAll('.lang-option');
  langOptions.forEach(button => {
    button.addEventListener('click', () => {
      const lang = button.getAttribute('data-lang');
      loadLanguage(lang);
    });
  });
});
