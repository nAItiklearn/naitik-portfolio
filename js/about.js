/* ====================================================
   ABOUT.JS
   Adapted from scroll-animation component
   Rotating panels that unwind on scroll
   ==================================================== */

(() => {
  const panels = document.querySelectorAll('.about-panel');
  if (!panels.length) return;

  panels.forEach((panel, index) => {
    const inner = panel.querySelector('.about-panel__inner');

    // Unwind rotation from 25deg to 0deg as panel scrolls into view
    gsap.to(inner, {
      rotate: 0,
      ease: 'none',
      scrollTrigger: {
        trigger: panel,
        start: 'top bottom',
        end: 'top center',
        scrub: true,
      }
    });

    // Pin panel while next one scrolls up (except last panel)
    if (index !== panels.length - 1) {
      ScrollTrigger.create({
        trigger: panel,
        start: 'bottom bottom',
        end: 'bottom top',
        pin: true,
        pinSpacing: false,
      });
    }
  });
})();
