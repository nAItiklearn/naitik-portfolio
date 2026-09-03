/* ====================================================
   CONTACT.JS
   HTML5 Canvas drawing tool + Direct Gmail Submissions
   Sends text messages and doodle attachments directly
   to naiitik1526@gmail.com via FormSubmit AJAX
   ==================================================== */

(() => {
  const canvas = document.getElementById('draw-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let isDrawing = false;
  let currentColor = '#f40c3f';
  let currentSize = 4;
  let lastX = 0, lastY = 0;
  let hasDrawn = false;

  const RECIPIENT_EMAIL = 'naiitik1526@gmail.com';
  const FORMSUBMIT_AJAX_URL = `https://formsubmit.co/ajax/${RECIPIENT_EMAIL}`;

  // Set canvas resolution with DPR support
  const initCanvas = () => {
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    if (!rect.width || !rect.height) return;

    let prevCanvas = null;
    if (canvas.width > 0 && canvas.height > 0) {
      prevCanvas = document.createElement('canvas');
      prevCanvas.width = canvas.width;
      prevCanvas.height = canvas.height;
      prevCanvas.getContext('2d').drawImage(canvas, 0, 0);
    }

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    if (prevCanvas) {
      ctx.drawImage(prevCanvas, 0, 0, rect.width, rect.height);
    } else {
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, rect.width, rect.height);
    }

    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  };

  setTimeout(initCanvas, 150);
  window.addEventListener('resize', initCanvas);

  // Helper to get position relative to canvas
  const getPos = (e) => {
    const rect = canvas.getBoundingClientRect();
    const source = e.touches ? e.touches[0] : e;
    return {
      x: source.clientX - rect.left,
      y: source.clientY - rect.top,
    };
  };

  // Draw handlers
  const draw = (e) => {
    if (!isDrawing) return;
    e.preventDefault();
    const { x, y } = getPos(e);
    ctx.strokeStyle = currentColor;
    ctx.lineWidth = currentSize;
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(x, y);
    ctx.stroke();
    [lastX, lastY] = [x, y];
    hasDrawn = true;
  };

  const startDraw = (e) => {
    isDrawing = true;
    const { x, y } = getPos(e);
    [lastX, lastY] = [x, y];
  };

  const stopDraw = () => {
    isDrawing = false;
  };

  canvas.addEventListener('mousedown', startDraw);
  canvas.addEventListener('mousemove', draw);
  canvas.addEventListener('mouseup', stopDraw);
  canvas.addEventListener('mouseleave', stopDraw);
  canvas.addEventListener('touchstart', startDraw, { passive: false });
  canvas.addEventListener('touchmove', draw, { passive: false });
  canvas.addEventListener('touchend', stopDraw);

  // Color selection buttons
  document.querySelectorAll('.color-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelector('.color-btn.active')?.classList.remove('active');
      btn.classList.add('active');
      currentColor = btn.dataset.color;
    });
  });

  // Brush size buttons
  document.querySelectorAll('.size-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      currentSize = parseInt(btn.dataset.size);
    });
  });

  // Clear canvas
  document.getElementById('canvas-clear')?.addEventListener('click', () => {
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.restore();
    hasDrawn = false;
  });

  // ─── SEND DOODLE TO GMAIL ───
  const canvasSendBtn = document.getElementById('canvas-send');
  if (canvasSendBtn) {
    canvasSendBtn.addEventListener('click', async () => {
      if (!hasDrawn) {
        alert('Please draw something on the canvas first! 🎨');
        return;
      }

      const originalText = canvasSendBtn.textContent;
      canvasSendBtn.textContent = 'Sending... 🎨';
      canvasSendBtn.disabled = true;

      try {
        // Convert canvas drawing to Blob
        const blob = await new Promise((resolve) =>
          canvas.toBlob(resolve, 'image/png')
        );

        const nameInput = document.getElementById('contact-name');
        const emailInput = document.getElementById('contact-email');
        const senderName = nameInput?.value.trim() || 'A creative visitor';
        const senderEmail = emailInput?.value.trim() || 'visitor@portfolio.dev';

        const formData = new FormData();
        formData.append('name', senderName);
        formData.append('email', senderEmail);
        formData.append(
          'message',
          `🎨 ${senderName} drew a doodle for you in the "Wanna be friends?" drawing section on your portfolio!`
        );
        formData.append(
          '_subject',
          `🎨 New Doodle from ${senderName} via Portfolio!`
        );
        formData.append('_captcha', 'false');
        formData.append('_template', 'table');
        if (blob) {
          formData.append('attachment', blob, 'naitik-doodle.png');
        }

        const res = await fetch(FORMSUBMIT_AJAX_URL, {
          method: 'POST',
          body: formData,
          headers: { Accept: 'application/json' },
        });

        const result = await res.json().catch(() => ({}));

        if (res.ok || result.success === 'true' || result.success === true) {
          canvasSendBtn.textContent = 'Doodle Sent! ✓';
          canvasSendBtn.style.background = '#1a7a1a';
          canvasSendBtn.style.borderColor = '#1a7a1a';

          // Optional: also download a copy for the user
          try {
            const downloadLink = document.createElement('a');
            downloadLink.download = 'my-doodle-for-naitik.png';
            downloadLink.href = canvas.toDataURL('image/png');
            downloadLink.click();
          } catch (e) {}

          alert('Yay! Your doodle was sent straight to Naitik\'s Gmail! 🎨✉️');

          setTimeout(() => {
            canvasSendBtn.textContent = originalText;
            canvasSendBtn.style.background = '';
            canvasSendBtn.style.borderColor = '';
            canvasSendBtn.disabled = false;
          }, 4500);
        } else {
          throw new Error(result.message || 'Submission failed');
        }
      } catch (err) {
        console.error('Error sending doodle:', err);
        canvasSendBtn.textContent = originalText;
        canvasSendBtn.disabled = false;
        alert(
          'Could not send doodle automatically right now. Feel free to email Naitik directly at naiitik1526@gmail.com!'
        );
      }
    });
  }

  // ─── SEND CONTACT FORM TO GMAIL ───
  const form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const submitBtn = form.querySelector('.form__submit');
      const originalText = submitBtn.innerHTML;

      submitBtn.textContent = 'Sending message...';
      submitBtn.disabled = true;

      const formData = new FormData(form);
      const senderName = document.getElementById('contact-name')?.value.trim() || 'Visitor';

      formData.set('_subject', `📬 New Portfolio Message from ${senderName}!`);
      formData.set('_captcha', 'false');
      formData.set('_template', 'table');

      // If visitor also drew something on the canvas, attach it automatically!
      if (hasDrawn) {
        try {
          const blob = await new Promise((resolve) =>
            canvas.toBlob(resolve, 'image/png')
          );
          if (blob) {
            formData.append('attachment', blob, 'visitor-doodle.png');
            formData.append('Doodle Included', 'Yes! Attached with this email.');
          }
        } catch (e) {}
      }

      try {
        const res = await fetch(FORMSUBMIT_AJAX_URL, {
          method: 'POST',
          body: formData,
          headers: { Accept: 'application/json' },
        });

        const result = await res.json().catch(() => ({}));

        if (res.ok || result.success === 'true' || result.success === true) {
          submitBtn.textContent = 'Message Sent! ✓';
          submitBtn.style.background = '#1a7a1a';
          form.reset();

          alert('Thanks for reaching out! Your message was sent to Naitik\'s Gmail. ✉️');

          setTimeout(() => {
            submitBtn.innerHTML = originalText;
            submitBtn.style.background = '';
            submitBtn.disabled = false;
          }, 4500);
        } else {
          throw new Error(result.message || 'Submission failed');
        }
      } catch (err) {
        console.error('Error sending form:', err);
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        alert(
          'Could not send message automatically. Please reach out directly to naiitik1526@gmail.com!'
        );
      }
    });
  }
})();
