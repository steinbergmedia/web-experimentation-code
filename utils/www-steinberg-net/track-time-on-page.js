/**
 * Time on page tracking utility for Optimizely analytics
 * Tracks user spent time on the page
 */

const eventName = "time_on_page";
const start = performance.now();
let sent = false;

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
 * Sends tracking data to Optimizely if the page is visible and has been active for at least 2 seconds
 */
function send() {
  if (sent) return;
  sent = true;

  const spent = Math.round((performance.now() - start) / 1000);
  if (spent < 2) return;

  window.optimizely = window.optimizely || [];
  window.optimizely.push({
    type: "event",
    eventName,
    tags: { value: spent },
  });
}

// Attach event listener for page visibility change
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "hidden") {
    send();
  }
});

// Monitor navigation changes
observeHistory(() => {
  send();
});
