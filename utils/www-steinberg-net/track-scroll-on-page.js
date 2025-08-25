let hasFiredScroll25Event = false;
let hasFiredScroll50Event = false;
let hasFiredScroll75Event = false;
let hasFiredScroll100Event = false;

function handleScrollEvent() {
  const windowHeight = window.innerHeight;
  const bodyHeight = document.body.scrollHeight;
  const scrollPercent = (window.scrollY / (bodyHeight - windowHeight)) * 100;
  window.optimizely = window.optimizely || [];

  if (scrollPercent >= 25 && !hasFiredScroll25Event) {
    window.optimizely.push({ type: "event", eventName: "scroll25" });
    hasFiredScroll25Event = true;
  }
  if (scrollPercent >= 50 && !hasFiredScroll50Event) {
    window.optimizely.push({ type: "event", eventName: "scroll50" });
    hasFiredScroll50Event = true;
  }
  if (scrollPercent >= 75 && !hasFiredScroll75Event) {
    window.optimizely.push({ type: "event", eventName: "scroll75" });
    hasFiredScroll75Event = true;
  }
  if (scrollPercent >= 100 && !hasFiredScroll100Event) {
    window.optimizely.push({ type: "event", eventName: "scroll100" });
    hasFiredScroll100Event = true;
  }
}

window.addEventListener("scroll", handleScrollEvent);
