/**
 * @fileoverview Optimizely experiment for dynamically changing hero claim text
 * based on language from URL. Monitors navigation events and updates text accordingly.
 */

const utils = optimizely.get("utils");

/**
 * Translations for different languages
 * @type {Object.<string, string>}
 */
const translations = {
  de: "German translation",
  es: "Spanish translation",
  fr: "French translation",
  ja: "Japanese translation",
  default: "English translation",
};

/**
 * Extracts language from URL path
 * @returns {string} Language code or "default"
 */
function getLanguageFromPath() {
  const pathSegments = window.location.pathname.split("/").filter(Boolean);

  return pathSegments[0] || "default";
}

/**
 * Sets new headline text based on current language
 * @param {HTMLElement} element - The element whose text should be changed
 */
function setNewHeadline(element) {
  if (!element) {
    return;
  }

  const language = getLanguageFromPath();

  element.innerHTML = translations[language] || translations.default;
}

/**
 * Monitors History API changes and executes callback
 * @param {Function} fn - Callback function executed on navigation
 */
function observeHistory(fn) {
  const originalPush = history.pushState;
  const originalReplace = history.replaceState;

  history.pushState = function (...args) {
    originalPush.apply(this, args);
    fn();
  };

  history.replaceState = function (...args) {
    originalReplace.apply(this, args);
    fn();
  };

  window.addEventListener("popstate", fn);
}

/**
 * Main function to change hero claim text
 */
function changeHeroClaim() {
  utils.waitForElement(".steinberg-hero-wrapper").then((wrapper) => {
    const claim = wrapper.querySelector("p.claim");

    setNewHeadline(claim);
  });
}

// Initialization
changeHeroClaim();

observeHistory(() => {
  changeHeroClaim();
});
