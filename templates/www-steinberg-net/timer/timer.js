/**
 * @fileoverview Optimizely experiment for displaying a countdown timer with language translation.
 * Monitors navigation events and updates text accordingly.
 */

const utils = optimizely.get("utils");

/**
 * Translations for different languages
 * @type {Object.<string, string>}
 */
const translations = {
  de: "Unser Sale endet bald!",
  es: "¡Esta oferta termina pronto!",
  fr: "La promo expire bientôt !",
  ja: "セールはまもなく終了します",
  default: "Our sale ends soon!",
};

/**
 * Extracts the language from the URL path
 * @returns {string} Language code or "default"
 */
function getLanguageFromPath() {
  const pathSegments = window.location.pathname.split("/").filter(Boolean);
  return pathSegments[0] || "default";
}

/**
 * Sets the href attribute based on the current language
 * @param {HTMLElement} element - The element whose href should be set
 */
function setHref(element) {
  if (!element) {
    return;
  }

  const language = getLanguageFromPath();
  element.href =
    language.length > 2 ? "/promotion/" : `/${language}/promotion/`;
}

/**
 * Sets the text of the element based on the current language
 * @param {HTMLElement} element - The element whose text should be set
 */
function setText(element) {
  if (!element) {
    return;
  }

  const language = getLanguageFromPath();
  element.innerHTML = translations[language] || translations.default;
}

/**
 * Observes browser history changes and executes callback
 * @param {Function} fn - Callback function executed on history changes
 */
function observeHistory(fn) {
  const originalPush = history.pushState;
  const originalReplace = history.replaceState;

  // Override pushState to observe changes
  history.pushState = function (...args) {
    originalPush.apply(this, args);
    fn();
  };

  // Override replaceState to observe changes
  history.replaceState = function (...args) {
    originalReplace.apply(this, args);
    fn();
  };

  // Listen to browser back/forward buttons
  window.addEventListener("popstate", fn);
}

// Wait for the timer element and initialize the countdown
utils.waitForElement(".opti_timer").then((timer) => {
  const container = document.querySelector("[data-target-ts]");
  if (!container) return;

  // DOM elements for timer display
  const display = container.querySelector(".cdt-display");
  const text = container.querySelector(".cdt-text");
  const announcer = container.querySelector(".cdt-announcer");

  // Target timestamp in UTC milliseconds
  const targetMs = Number(container.dataset.targetTs);
  let lastAnnounced = null;

  /**
   * Formats milliseconds into days, hours, minutes, seconds
   * @param {number} ms - Milliseconds
   * @returns {Object} Object with formatted time values
   */
  function fmt(ms) {
    const totalSec = Math.max(0, Math.floor(ms / 1000));
    const days = Math.floor(totalSec / 86400);
    const hours = Math.floor((totalSec % 86400) / 3600);
    const minutes = Math.floor((totalSec % 3600) / 60);
    const seconds = totalSec % 60;

    return {
      total: totalSec,
      label: [
        String(days).padStart(2, "0"),
        String(hours).padStart(2, "0"),
        String(minutes).padStart(2, "0"),
        String(seconds).padStart(2, "0"),
      ].join(" : "),
      days,
      hours,
      minutes,
      seconds,
    };
  }

  /**
   * Provides accessibility announcements for important time points
   * @param {Object} t - Formatted time object
   */
  function announce(t) {
    // Prevent duplicate announcements
    if (t.total === lastAnnounced) return;
    lastAnnounced = t.total;

    const inLast10 = t.total <= 10;
    const onFullHour = t.minutes === 0 && t.seconds === 0;

    // Only announce during last 10 seconds or on full hours
    if (!inLast10 && !onFullHour) return;

    let msg;
    if (t.total === 0) {
      msg = "Time is up!";
    } else if (inLast10) {
      msg = `${t.seconds} seconds remaining!`;
    } else {
      msg = `${t.days} days ${t.hours} hours remaining!`;
    }

    announcer.textContent = msg;
  }

  /**
   * Updates the timer display in each frame
   */
  function tick() {
    const now = Date.now();
    const remaining = targetMs - now;
    const t = fmt(remaining);

    // Update visual display
    display.textContent = t.label;
    announce(t);

    // Stop the timer when time is up
    if (remaining <= 0) return;
    requestAnimationFrame(tick);
  }

  // Initialize the timer with language and start countdown
  setText(text);
  setHref(timer);
  tick();

  // Update language on navigation without a page reload
  observeHistory(() => {
    setText(text);
    setHref(timer);
  });
});
