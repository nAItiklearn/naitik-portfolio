/* ====================================================
   PROJECTS.JS — Codegrid Otsuka 3D Cards
   3D flip on hover, cursor parallax tilt, GitHub navigation
   ==================================================== */

(() => {
  const stage = document.querySelector('.projects__stage');
  const cardWrappers = document.querySelectorAll('.otsuka-card');
  if (!cardWrappers.length) return;

  const PARALLAX_STRENGTH = 35;

  cardWrappers.forEach((cardWrapper) => {
    const cardCube = cardWrapper.querySelector('.otsuka-cube');
    if (!cardCube) return;

    const cardDepth = parseFloat(
      getComputedStyle(cardWrapper).getPropertyValue('--card-depth') || '300'
    );

    const rotation = { flip: 0, tiltX: 0, tiltY: 0 };
    let isFlipped = false;

    function render() {
      gsap.set(cardCube, {
        rotationX: rotation.flip + rotation.tiltX,
        rotationY: rotation.tiltY,
        z: -cardDepth / 2,
      });
    }
    render();

    cardWrapper.addEventListener('mouseenter', () => {
      isFlipped = false;
      gsap.to(rotation, {
        flip: 180,
        duration: 0.55,
        ease: 'power2.inOut',
        overwrite: 'flip',
        onUpdate: render,
        onComplete: () => {
          isFlipped = true;
        },
      });
    });

    cardWrapper.addEventListener('mouseleave', () => {
      isFlipped = false;
      gsap.to(rotation, {
        flip: 0,
        tiltX: 0,
        tiltY: 0,
        duration: 0.6,
        ease: 'power3.out',
        overwrite: true,
        onUpdate: render,
      });
    });

    cardWrapper.addEventListener('mousemove', (event) => {
      if (!isFlipped) return;

      const bounds = cardWrapper.getBoundingClientRect();
      const centerX = bounds.left + bounds.width / 2;
      const centerY = bounds.top + bounds.height / 2;

      const offsetX = (event.clientX - centerX) / bounds.width;
      const offsetY = (event.clientY - centerY) / bounds.height;

      gsap.to(rotation, {
        tiltY: offsetX * PARALLAX_STRENGTH,
        tiltX: -offsetY * PARALLAX_STRENGTH,
        duration: 0.5,
        ease: 'power2.out',
        overwrite: 'tilt',
        onUpdate: render,
      });
    });

    // Allow clicking the card anywhere on the back to navigate
    cardWrapper.addEventListener('click', (e) => {
      // Don't duplicate click if clicked directly on anchor
      if (e.target.closest('a')) return;
      const link = cardWrapper.dataset.link;
      if (link) {
        window.open(link, '_blank', 'noopener,noreferrer');
      }
    });
  });

  // Smooth drag-to-scroll on stage
  if (stage) {
    let isDown = false;
    let startX = 0;
    let scrollLeft = 0;

    stage.addEventListener('mousedown', (e) => {
      // Don't drag if clicking link
      if (e.target.closest('a') || e.target.closest('button')) return;
      isDown = true;
      startX = e.pageX - stage.offsetLeft;
      scrollLeft = stage.scrollLeft;
    });

    window.addEventListener('mouseup', () => {
      isDown = false;
    });

    stage.addEventListener('mouseleave', () => {
      isDown = false;
    });

    stage.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - stage.offsetLeft;
      const walk = (x - startX) * 1.6;
      stage.scrollLeft = scrollLeft - walk;
    });
  }
})();
