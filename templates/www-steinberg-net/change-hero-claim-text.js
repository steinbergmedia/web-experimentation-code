const utils = optimizely.get("utils");

const translations = {
  de: "German translation",
  es: "Spanish translation",
  fr: "French translation",
  ja: "Japanese translation",
  default: "English translation",
};

function getLanguageFromPath() {
  const pathSegments = window.location.pathname.split("/").filter(Boolean);

  return pathSegments[0] || "default";
}

function setNewHeadline(element) {
  if (!element) {
    return;
  }

  const language = getLanguageFromPath();

  element.innerHTML = translations[language] || translations.default;
}

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

function changeHeroClaim() {
  utils.waitForElement(".steinberg-hero-wrapper").then((wrapper) => {
    const claim = wrapper.querySelector("p.claim");

    setNewHeadline(claim);
  });
}

changeHeroClaim();

observeHistory(() => {
  changeHeroClaim();
});
