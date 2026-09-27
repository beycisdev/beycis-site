(() => {
  const carousel = document.querySelector("[data-product-carousel]");
  if (!carousel) return;

  const viewport = carousel.querySelector("[data-carousel-viewport]");
  const track = carousel.querySelector(".product-track");
  const previous = document.querySelector("[data-carousel-previous]");
  const next = document.querySelector("[data-carousel-next]");
  const controls = document.querySelector(".carousel-controls");
  const root = document.body;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  function getStep() {
    const card = track.querySelector(".product-card");
    if (!card) return viewport.clientWidth;
    const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
    return card.getBoundingClientRect().width + gap;
  }

  function update() {
    const maxScroll = Math.max(0, viewport.scrollWidth - viewport.clientWidth);
    const hasOverflow = maxScroll > 2;
    controls.hidden = !hasOverflow;
    previous.hidden = !hasOverflow;
    next.hidden = !hasOverflow;
    previous.disabled = !hasOverflow || viewport.scrollLeft <= 2;
    next.disabled = !hasOverflow || viewport.scrollLeft >= maxScroll - 2;
    const drift = Math.min(viewport.scrollLeft * 0.16, 150);
    root.style.setProperty("--desk-drift", `${-drift}px`);
  }

  function move(direction) {
    viewport.scrollBy({
      left: getStep() * direction,
      behavior: reducedMotion.matches ? "auto" : "smooth"
    });
  }

  previous.addEventListener("click", () => move(-1));
  next.addEventListener("click", () => move(1));
  viewport.addEventListener("scroll", update, { passive: true });
  viewport.addEventListener("keydown", (event) => {
    if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
      event.preventDefault();
      move(event.key === "ArrowRight" ? 1 : -1);
    }
  });
  window.addEventListener("resize", update);

  update();
})();
