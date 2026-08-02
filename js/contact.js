/* ====================================================
   CONTACT.JS
   HTML5 Canvas drawing tool
   Send via Formspree + canvas PNG attachment
   ==================================================== */

(() => {
  const canvas  = document.getElementById('draw-canvas');
  if (!canvas) return;

  const ctx     = canvas.getContext('2d');
  let isDrawing = false;
  let currentColor = '#f40c3f';
  let currentSize  = 4;
  let lastX = 0, lastY = 0;

  // Set canvas resolution
  const initCanvas = () => {
    const dpr  = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width  = rect.width  * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    ctx.fillStyle = '#111';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.lineCap  = 'round';
    ctx.lineJoin = 'round';
  };

  // Ensure canvas is sized after layout
  setTimeout(initCanvas, 100);
  window.addEventListener('resize', initCanvas);

  // Helper to get position relative to canvas
  const getPos = (e) => {
    const rect   = canvas.getBoundingClientRect();
    const dpr    = window.devicePixelRatio || 1;
    const source = e.touches ? e.touches[0] : e;
    return {
      x: (source.clientX - rect.left),
      y: (source.clientY - rect.top),
    };
  };

  // Draw
  const draw = (e) => {
    if (!isDrawing) return;
    e.preventDefault();
    const { x, y } = getPos(e);
    ctx.strokeStyle = currentColor;
    ctx.lineWidth   = currentSize;
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(x, y);
    ctx.stroke();
    [lastX, lastY] = [x, y];
  };

  const startDraw = (e) => {
    isDrawing = true;
    const { x, y } = getPos(e);
    [lastX, lastY] = [x, y];
  };

  const stopDraw = () => { isDrawing = false; };

  canvas.addEventListener('mousedown',  startDraw);
  canvas.addEventListener('mousemove',  draw);
  canvas.addEventListener('mouseup',    stopDraw);
  canvas.addEventListener('mouseleave', stopDraw);
  canvas.addEventListener('touchstart', startDraw, { passive: false });
  canvas.addEventListener('touchmove',  draw,      { passive: false });
  canvas.addEventListener('touchend',   stopDraw);

  // Color buttons
  document.querySelectorAll('.color-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelector('.color-btn.active')?.classList.remove('active');
      btn.classList.add('active');
      currentColor = btn.dataset.color;
    });
  });

  // Size buttons
  document.querySelectorAll('.size-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      currentSize = parseInt(btn.dataset.size);
    });
  });

  // Clear
  document.getElementById('canvas-clear')?.addEventListener('click', () => {
    ctx.fillStyle = '#111';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  });

  // Send — opens email with canvas as attachment description
  document.getElementById('canvas-send')?.addEventListener('click', () => {
    const dataUrl  = canvas.toDataURL('image/png');
    const subject  = encodeURIComponent('Someone drew you something!');
    const body     = encodeURIComponent(
      'Hi Naitik!\n\nSomeone drew something for you on your portfolio.\n\n[Canvas data would be sent via Formspree in production]\n\n'
    );
    window.open(`mailto:naiitik1526@gmail.com?subject=${subject}&body=${body}`);
  });

  // Contact form submission (Formspree)
  const form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = form.querySelector('.form__submit');
      btn.textContent = 'Sending...';
      btn.disabled = true;

      const data = new FormData(form);
      try {
        const res = await fetch('https://formspree.io/f/xyzgkdqb', {
          method: 'POST',
          body:   data,
          headers: { 'Accept': 'application/json' },
        });
        if (res.ok) {
          btn.textContent = 'Sent! ✓';
          btn.style.background = '#1a7a1a';
          form.reset();
        } else {
          btn.textContent = 'Send message →';
          btn.disabled = false;
          alert('Error sending. Email me directly at naiitik1526@gmail.com');
        }
      } catch {
        btn.textContent = 'Send message →';
        btn.disabled = false;
      }
    });
  }
})();
