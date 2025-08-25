/**
 * Scroll tracking utility for Optimizely analytics
 * Tracks user scroll progress at 25%, 50%, 75%, and 100% milestones
 */

/** @type {boolean} Flag to prevent duplicate 25% scroll events */
let hasFiredScroll25Event = false;
/** @type {boolean} Flag to prevent duplicate 50% scroll events */
let hasFiredScroll50Event = false;
/** @type {boolean} Flag to prevent duplicate 75% scroll events */
let hasFiredScroll75Event = false;
/** @type {boolean} Flag to prevent duplicate 100% scroll events */
let hasFiredScroll100Event = false;

/**
 * Handles scroll events and sends tracking data to Optimizely
 * Calculates scroll percentage and fires events at specific milestones
 * @function handleScrollEvent
 */
function handleScrollEvent() {
  const windowHeight = window.innerHeight;
  const bodyHeight = document.body.scrollHeight;
  const scrollPercent = (window.scrollY / (bodyHeight - windowHeight)) * 100;

  // Initialize Optimizely array if it doesn't exist
  window.optimizely = window.optimizely || [];

  // Track 25% scroll milestone
  if (scrollPercent >= 25 && !hasFiredScroll25Event) {
    window.optimizely.push({ type: "event", eventName: "scroll25" });
    hasFiredScroll25Event = true;
  }
  // Track 50% scroll milestone
  if (scrollPercent >= 50 && !hasFiredScroll50Event) {
    window.optimizely.push({ type: "event", eventName: "scroll50" });
    hasFiredScroll50Event = true;
  }
  // Track 75% scroll milestone
  if (scrollPercent >= 75 && !hasFiredScroll75Event) {
    window.optimizely.push({ type: "event", eventName: "scroll75" });
    hasFiredScroll75Event = true;
  }
  // Track 100% scroll milestone
  if (scrollPercent >= 100 && !hasFiredScroll100Event) {
    window.optimizely.push({ type: "event", eventName: "scroll100" });
    hasFiredScroll100Event = true;
  }
}

// Register scroll event listener to track user scroll behavior
window.addEventListener("scroll", handleScrollEvent);
