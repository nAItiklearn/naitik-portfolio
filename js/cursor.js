/* ====================================================
   CURSOR.JS — Desktop Custom Animated Cursor
   Smooth 0-lag tracking with interactive state feedback
   ==================================================== */

(() => {
  // Never run on touch devices or screens <= 768px (mobile/tablet)
  if (window.matchMedia('(max-width: 768px), (hover: none), (pointer: coarse)').matches) return;

  function initCursor() {
    const cursorEl = document.getElementById('custom-cursor');
    if (!cursorEl) return;

    document.body.classList.add('has-custom-cursor');

    let isVisible = false;
    let mouseX = -100;
    let mouseY = -100;
    let rafId = null;

    function renderCursor() {
      cursorEl.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
      rafId = null;
    }

    window.addEventListener(
      'mousemove',
      (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;

        if (!isVisible) {
          isVisible = true;
          cursorEl.style.opacity = '1';
        }

        if (!rafId) {
          rafId = requestAnimationFrame(renderCursor);
        }
      },
      { passive: true }
    );

    document.addEventListener('mouseleave', () => {
      isVisible = false;
      cursorEl.style.opacity = '0';
    });

    document.addEventListener('mouseenter', () => {
      isVisible = true;
      cursorEl.style.opacity = '1';
    });

    document.addEventListener('mousedown', () => {
      cursorEl.classList.add('is-active');
    });

    document.addEventListener('mouseup', () => {
      cursorEl.classList.remove('is-active');
    });

    // Interactive element hover detection
    const hoverSelector =
      'a, button, input, textarea, select, [role="button"], .hero__sticker, .otsuka-card, .project-list a, .color-btn, .size-btn, .canvas-action-btn, .skill-tag, .card-github-btn';

    document.addEventListener('mouseover', (e) => {
      if (e.target.closest(hoverSelector)) {
        cursorEl.classList.add('is-hovering');
      }
    });

    document.addEventListener('mouseout', (e) => {
      if (e.target.closest(hoverSelector)) {
        cursorEl.classList.remove('is-hovering');
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCursor);
  } else {
    initCursor();
  }
})();
