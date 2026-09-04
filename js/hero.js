/* ====================================================
   HERO.JS — Interactive Draggable Mood Board Stickers
   Move, drag, and place cutouts anywhere in the hero section
   ==================================================== */

(function initHeroStickers() {
  function setup() {
    const hero = document.getElementById('hero');
    const stickers = document.querySelectorAll('.hero__sticker');
    if (!hero || !stickers.length) return;

    let highestZ = 50;

    stickers.forEach((sticker) => {
      let isDragging = false;
      let startPointerX = 0;
      let startPointerY = 0;
      let startStickerLeft = 0;
      let startStickerTop = 0;
      let initialRotation = 0;

      // Extract initial tilt angle from computed style or class
      if (sticker.classList.contains('hero__sticker--cupcake')) initialRotation = -8;
      else if (sticker.classList.contains('hero__sticker--batman')) initialRotation = 4;
      else if (sticker.classList.contains('hero__sticker--banana')) initialRotation = -6;
      else if (sticker.classList.contains('hero__sticker--nyan')) initialRotation = 2;
      else if (sticker.classList.contains('hero__sticker--horn')) initialRotation = 10;
      else if (sticker.classList.contains('hero__sticker--ironman')) initialRotation = -5;
      else if (sticker.classList.contains('hero__sticker--kafka')) initialRotation = 7;
      else if (sticker.classList.contains('hero__sticker--gengar')) initialRotation = -6;
      else if (sticker.classList.contains('hero__sticker--charizard')) initialRotation = 8;
      else if (sticker.classList.contains('hero__sticker--hp')) initialRotation = -4;

      sticker.addEventListener('pointerdown', (e) => {
        // Prevent default text selection or image drag
        e.preventDefault();
        e.stopPropagation();

        isDragging = true;
        try {
          sticker.setPointerCapture(e.pointerId);
        } catch (err) {}

        // Bring to front
        highestZ++;
        sticker.style.zIndex = highestZ;

        // Pause ambient CSS float animation
        sticker.style.animation = 'none';

        // Capture starting positions relative to #hero
        const heroRect = hero.getBoundingClientRect();
        const stickerRect = sticker.getBoundingClientRect();

        startPointerX = e.clientX;
        startPointerY = e.clientY;

        // Current coordinates relative to hero top-left
        startStickerLeft = stickerRect.left - heroRect.left;
        startStickerTop = stickerRect.top - heroRect.top;

        // Apply direct pixel coordinates
        sticker.style.left = startStickerLeft + 'px';
        sticker.style.top = startStickerTop + 'px';
        sticker.style.right = 'auto';
        sticker.style.bottom = 'auto';

        sticker.classList.add('is-dragging');
        sticker.style.transform = `rotate(${initialRotation}deg) scale(1.1)`;
        sticker.style.cursor = 'grabbing';
      });

      sticker.addEventListener('pointermove', (e) => {
        if (!isDragging) return;
        e.preventDefault();

        const heroRect = hero.getBoundingClientRect();
        const stickerRect = sticker.getBoundingClientRect();

        const deltaX = e.clientX - startPointerX;
        const deltaY = e.clientY - startPointerY;

        let newLeft = startStickerLeft + deltaX;
        let newTop = startStickerTop + deltaY;

        // Strict boundary clamping within the hero section
        const maxLeft = heroRect.width - stickerRect.width;
        const maxTop = heroRect.height - stickerRect.height;

        newLeft = Math.max(0, Math.min(newLeft, maxLeft));
        newTop = Math.max(0, Math.min(newTop, maxTop));

        sticker.style.left = newLeft + 'px';
        sticker.style.top = newTop + 'px';
      });

      const endDrag = (e) => {
        if (!isDragging) return;
        isDragging = false;

        try {
          sticker.releasePointerCapture(e.pointerId);
        } catch (err) {}

        sticker.classList.remove('is-dragging');
        sticker.style.cursor = 'grab';
        sticker.style.transform = `rotate(${initialRotation}deg) scale(1)`;

        // Keep ambient bobbing around the new custom placed position
        setTimeout(() => {
          if (!isDragging) {
            sticker.style.animation = '';
          }
        }, 150);
      };

      sticker.addEventListener('pointerup', endDrag);
      sticker.addEventListener('pointercancel', endDrag);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setup);
  } else {
    setup();
  }
})();
