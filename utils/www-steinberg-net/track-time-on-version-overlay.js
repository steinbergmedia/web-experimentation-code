/**
 * Time on version overlay tracking utility for Optimizely analytics
 * Tracks the time users spend on the version overlay
 */

function sendOptimizelyEvent(eventName, value) {
  window.optimizely = window.optimizely || [];
  window.optimizely.push({
    type: "event",
    eventName,
    tags: { value },
  });
}

function trackTimeOnVersionOverlay() {
  const utils = optimizely.get("utils");

  let startTime = null;
  let hasSelected = false;

  function onOverlayShown() {
    if (startTime) return;
    startTime = Date.now();
    hasSelected = false;
    console.log("Overlay shown");
  }

  function onButtonClick() {
    if (!startTime || hasSelected) return;
    const elapsed = Date.now() - startTime;
    hasSelected = true;
    console.log("Time until selection (ms):", elapsed);
    sendOptimizelyEvent("time_on_version_overlay", elapsed);
    cleanup();
  }

  let registeredButtons = [];

  function cleanup() {
    registeredButtons.forEach((btn) =>
      btn.removeEventListener("click", onButtonClick)
    );
    registeredButtons = [];
  }

  const OVERLAY_SELECTOR =
    ".ReactModal__Overlay--after-open .shop-or-trial-content";
  const BUTTON_SELECTOR = ".smtg-button";

  utils.waitForElement(OVERLAY_SELECTOR).then((overlay) => {
    onOverlayShown();

    registeredButtons = Array.from(overlay.querySelectorAll(BUTTON_SELECTOR));
    registeredButtons.forEach((btn) =>
      btn.addEventListener("click", onButtonClick)
    );
  });
}

trackTimeOnVersionOverlay();
