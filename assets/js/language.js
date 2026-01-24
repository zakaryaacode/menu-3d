// Language data storage
let currentLanguage = localStorage.getItem('language') || 'en';
let translations = {};

// Load language files
async function loadLanguage(lang) {
  try {
    const response = await fetch(`assets/js/${lang}.json`);
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
      // Handle elements with children (like hero-title with spans)
      if (element.querySelector('span')) {
        // Don't replace children, just leave as is
      } else {
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
