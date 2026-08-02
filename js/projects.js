/* ====================================================
   PROJECTS.JS
   Adapted from project-showcase stack animation
   Cards rise from below, then fly off screen
   ==================================================== */

(() => {
  const cards = gsap.utils.toArray('.proj-card');
  if (!cards.length) return;

  const PEEK      = 42;
  const SCALE_STEP = 0.045;

  const stackPose = (index) => ({
    y:     index * PEEK,
    scale: 1 - index * SCALE_STEP,
  });

  // Set initial positions
  cards.forEach((card, i) => {
    gsap.set(card, {
      zIndex:          cards.length - i,
      y:               window.innerHeight * 0.72 + i * PEEK,
      scale:           stackPose(i).scale * 0.9,
      rotate:          0,
      transformOrigin: '50% 0%',
    });
  });

  // Build timeline
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: '#projects',
      start: 'top top',
      end: () => `+=${cards.length * window.innerHeight}`,
      pin: true,
      scrub: true,
      invalidateOnRefresh: true,
    },
  });

  // Phase 1: cards stack in
  cards.forEach((card, i) => {
    tl.to(card, { ...stackPose(i), ease: 'power3.out', duration: 1.35 }, i * 0.06);
  });

  tl.to({}, { duration: 0.35 });

  // Phase 2: cards fly off
  const flyAt  = tl.duration();
  const flying = cards.slice(0, -1);

  flying.forEach((card, i) => {
    const time   = flyAt + i;
    const behind = cards.slice(i + 1);

    tl.to(card, {
      y:        () => -window.innerHeight * 1.15,
      rotate:   -25,
      scale:    0.94,
      ease:     'none',
      duration: 1,
    }, time);

    tl.to(behind, {
      y:        (index) => stackPose(index).y,
      scale:    (index) => stackPose(index).scale,
      ease:     'none',
      duration: 1,
    }, time);
  });

  tl.to({}, { duration: 0.4 });
})();
