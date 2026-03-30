/**
 * Time on version overlay tracking utility for Optimizely analytics
 * Tracks the time users spend on the version overlay
 */

const utils = optimizely.get("utils");

function handleTimeOnVersionOverlayEvent() {
  let startTime = null;
  let buttonClicked = false;

  function onOverlayShown() {
    console.log("Overlay shown");
    if (!startTime) {
      startTime = Date.now();
      buttonClicked = false;
    }
  }

  function onButtonClick() {
    console.log("Button clicked");
    if (!startTime || buttonClicked) return;
    const elapsed = Date.now() - startTime;
    buttonClicked = true;
    console.log("Time until selection (ms):", elapsed);
    sendEvent(elapsed);
  }

  function sendEvent(time) {
    window.optimizely = window.optimizely || [];
    window.optimizely.push({
      type: "event",
      eventName: "time_on_version_overlay",
      tags: { value: time },
    });
  }

  utils
    .waitForElement(".ReactModal__Overlay--after-open .shop-or-trial-content")
    .then((overlay) => {
      onOverlayShown();

      const buttons = overlay.querySelectorAll(
        ".smtg-button.smtg-button--secondary "
      );
      buttons.forEach((btn) => {
        btn.addEventListener("click", onButtonClick);
      });
    });
}

handleTimeOnVersionOverlayEvent();
