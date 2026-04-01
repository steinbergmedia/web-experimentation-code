/**
 * Time on shop-or-trial-overlay tracking utility for Optimizely analytics
 * Tracks the time users spend on the shop-or-trial-overlay until they select a product
 */

const eventName = "time_on_shop_or_trial_overlay";

function sendOptimizelyEvent(eventName, value) {
  window.optimizely = window.optimizely || [];
  window.optimizely.push({
    type: "event",
    eventName,
    tags: { value },
  });
}

function trackTimeOnShopOrTrialOverlay() {
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
    sendOptimizelyEvent(eventName, elapsed);
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
  const BUTTON_SELECTOR = "button.smtg-button";

  utils.waitForElement(OVERLAY_SELECTOR).then((overlay) => {
    onOverlayShown();

    registeredButtons = Array.from(overlay.querySelectorAll(BUTTON_SELECTOR));
    registeredButtons.forEach((btn) =>
      btn.addEventListener("click", onButtonClick)
    );
  });
}

trackTimeOnShopOrTrialOverlay();
