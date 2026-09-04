/* ====================================================
   CONTACT.JS
   HTML5 Canvas drawing tool + Direct Gmail Submissions
   Sends text messages and doodle attachments directly
   to naiitik1526@gmail.com via FormSubmit Multipart Form
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

  // Form & Input Elements
  const form = document.getElementById('contact-form');
  const contactNameInput = document.getElementById('contact-name');
  const contactEmailInput = document.getElementById('contact-email');
  const contactMessageInput = document.getElementById('contact-message');
  const nameError = document.getElementById('name-error');
  const emailError = document.getElementById('email-error');
  const messageError = document.getElementById('message-error');
  const canvasAuthorInput = document.getElementById('canvas-author');
  const canvasAuthorError = document.getElementById('canvas-author-error');
  const doodleFileInput = document.getElementById('doodle-file-input');
  const canvasSendBtn = document.getElementById('canvas-send');

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
    clearError(canvasAuthorInput, canvasAuthorError);
  });

  // ─── VALIDATION HELPERS ───
  const isValidEmail = (email) => {
    if (!email || typeof email !== 'string') return false;
    const trimmed = email.trim().toLowerCase();
    // Standard RFC-compliant email pattern: local@domain.tld
    const regex = /^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)+$/;
    if (!regex.test(trimmed)) return false;

    const parts = trimmed.split('@');
    if (parts.length !== 2) return false;
    const domain = parts[1];
    const domainParts = domain.split('.');
    if (domainParts.length < 2) return false;
    const tld = domainParts[domainParts.length - 1];
    if (tld.length < 2 || /^\d+$/.test(tld)) return false;
    // Block common placeholder / fake domains
    if (['test', 'example', 'fake', 'invalid', 'localhost'].includes(tld)) return false;
    return true;
  };

  const isValidName = (name) => {
    if (!name || typeof name !== 'string') return false;
    const trimmed = name.trim();
    return trimmed.length >= 2;
  };

  const showError = (inputEl, errorEl, message) => {
    if (inputEl) {
      inputEl.classList.add('is-invalid');
      inputEl.focus();
    }
    if (errorEl) {
      errorEl.textContent = message;
      errorEl.style.display = 'block';
    }
  };

  const clearError = (inputEl, errorEl) => {
    if (inputEl) inputEl.classList.remove('is-invalid');
    if (errorEl) {
      errorEl.textContent = '';
      errorEl.style.display = 'none';
    }
  };

  // Real-time error clearing when user types
  ['input', 'change'].forEach((evt) => {
    contactNameInput?.addEventListener(evt, () => clearError(contactNameInput, nameError));
    contactEmailInput?.addEventListener(evt, () => clearError(contactEmailInput, emailError));
    contactMessageInput?.addEventListener(evt, () => clearError(contactMessageInput, messageError));
    canvasAuthorInput?.addEventListener(evt, () => {
      clearError(canvasAuthorInput, canvasAuthorError);
      clearError(contactNameInput, nameError);
      clearError(contactEmailInput, emailError);
    });
  });

  // Sync author bar with contact inputs
  canvasAuthorInput?.addEventListener('input', () => {
    const val = canvasAuthorInput.value.trim();
    if (val.includes('@')) {
      if (contactEmailInput && !contactEmailInput.value) contactEmailInput.value = val;
    } else {
      if (contactNameInput && !contactNameInput.value) contactNameInput.value = val;
    }
  });

  // ─── SEND DOODLE TO GMAIL ───
  if (canvasSendBtn) {
    canvasSendBtn.addEventListener('click', async () => {
      if (!hasDrawn) {
        showError(canvasAuthorInput, canvasAuthorError, 'Please draw something on the canvas first! 🎨');
        return;
      }

      // Check author identity: requires valid email or name or both
      const authorVal = canvasAuthorInput?.value.trim() || '';
      const formName = contactNameInput?.value.trim() || '';
      const formEmail = contactEmailInput?.value.trim() || '';

      let senderName = '';
      let senderEmail = '';

      if (authorVal) {
        if (authorVal.includes('@')) {
          if (!isValidEmail(authorVal)) {
            showError(canvasAuthorInput, canvasAuthorError, 'Please enter a valid, real email address (e.g. name@domain.com)');
            return;
          }
          senderEmail = authorVal;
          senderName = isValidName(formName) ? formName : authorVal.split('@')[0];
        } else {
          if (!isValidName(authorVal)) {
            showError(canvasAuthorInput, canvasAuthorError, 'Please enter your name (at least 2 letters) or a valid email');
            return;
          }
          senderName = authorVal;
          if (formEmail) {
            if (!isValidEmail(formEmail)) {
              showError(canvasAuthorInput, canvasAuthorError, 'The email in the contact form is invalid. Please fix or clear it.');
              return;
            }
            senderEmail = formEmail;
          }
        }
      } else {
        // Author bar is empty, check if form name or email is filled on the left
        const hasFormName = isValidName(formName);
        const hasFormEmail = formEmail.length > 0;

        if (hasFormEmail && !isValidEmail(formEmail)) {
          showError(canvasAuthorInput, canvasAuthorError, 'Please enter a valid, real email address so Naitik knows who drew this!');
          showError(contactEmailInput, emailError, 'Please enter a valid, real email');
          return;
        }

        if (hasFormName && hasFormEmail && isValidEmail(formEmail)) {
          senderName = formName;
          senderEmail = formEmail;
        } else if (hasFormName) {
          senderName = formName;
        } else if (hasFormEmail && isValidEmail(formEmail)) {
          senderEmail = formEmail;
          senderName = formEmail.split('@')[0];
        } else {
          showError(
            canvasAuthorInput,
            canvasAuthorError,
            'Please write your name or a valid email so Naitik knows who drew this! 🎨'
          );
          return;
        }
      }

      clearError(canvasAuthorInput, canvasAuthorError);

      const originalText = canvasSendBtn.textContent;
      canvasSendBtn.textContent = 'Sending doodle... 🎨';
      canvasSendBtn.disabled = true;

      try {
        // Convert canvas drawing to high-res Blob
        const blob = await new Promise((resolve) =>
          canvas.toBlob(resolve, 'image/png')
        );

        if (!blob) throw new Error('Could not convert canvas to image');

        const cleanName = (senderName || 'Artist').replace(/[^a-zA-Z0-9_-]/g, '_');
        const fileName = `${cleanName}_doodle.png`;

        // Attach image to file input so FormSubmit multipart upload attaches it to Gmail
        if (doodleFileInput) {
          const file = new File([blob], fileName, { type: 'image/png' });
          const dt = new DataTransfer();
          dt.items.add(file);
          doodleFileInput.files = dt.files;
        }

        // Set form fields for submission
        if (contactNameInput) contactNameInput.value = senderName;
        if (contactEmailInput) {
          contactEmailInput.value = senderEmail || `${cleanName.toLowerCase()}@portfolio-visitor.dev`;
        }
        if (contactMessageInput) {
          contactMessageInput.value = `🎨 ${senderName} drew a doodle for you in the drawing canvas on your portfolio! Attached as a full-resolution PNG image file.`;
        }

        const subjectInput = form?.querySelector('input[name="_subject"]');
        if (subjectInput) {
          subjectInput.value = `🎨 New Doodle from ${senderName}${senderEmail ? ' (' + senderEmail + ')' : ''}!`;
        }

        // Submit form seamlessly via hidden iframe
        if (form) {
          form.submit();
        }

        canvasSendBtn.textContent = 'Doodle Sent! ✓';
        canvasSendBtn.style.background = '#1a7a1a';
        canvasSendBtn.style.borderColor = '#1a7a1a';

        // Download a souvenir copy for the user
        try {
          const downloadLink = document.createElement('a');
          downloadLink.download = `${cleanName}-doodle-for-naitik.png`;
          downloadLink.href = canvas.toDataURL('image/png');
          downloadLink.click();
        } catch (e) {}

        alert(`Yay! Your doodle was sent straight to Naitik's Gmail as an attachment! 🎨✉️`);

        setTimeout(() => {
          canvasSendBtn.textContent = originalText;
          canvasSendBtn.style.background = '';
          canvasSendBtn.style.borderColor = '';
          canvasSendBtn.disabled = false;
        }, 4500);
      } catch (err) {
        console.error('Error sending doodle:', err);
        canvasSendBtn.textContent = originalText;
        canvasSendBtn.disabled = false;
        showError(canvasAuthorInput, canvasAuthorError, 'Could not send doodle. Please try again!');
      }
    });
  }

  // ─── SEND CONTACT FORM TO GMAIL ───
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const nameVal = contactNameInput?.value.trim() || '';
      const emailVal = contactEmailInput?.value.trim() || '';
      const messageVal = contactMessageInput?.value.trim() || '';

      // Both Name and Email are strictly required for sending a message
      if (!isValidName(nameVal)) {
        showError(contactNameInput, nameError, 'Please enter your name (at least 2 characters)');
        return;
      }

      if (!isValidEmail(emailVal)) {
        showError(contactEmailInput, emailError, 'Please enter a valid, real email address (e.g. name@domain.com)');
        return;
      }

      if (messageVal.length < 3) {
        showError(contactMessageInput, messageError, 'Please write a message before sending :)');
        return;
      }

      clearError(contactNameInput, nameError);
      clearError(contactEmailInput, emailError);
      clearError(contactMessageInput, messageError);

      const submitBtn = form.querySelector('.form__submit');
      const originalText = submitBtn.innerHTML;

      submitBtn.textContent = 'Sending message...';
      submitBtn.disabled = true;

      // If visitor also drew something on the canvas, attach it as a PNG file!
      if (hasDrawn && doodleFileInput) {
        try {
          const blob = await new Promise((resolve) =>
            canvas.toBlob(resolve, 'image/png')
          );
          if (blob) {
            const cleanName = nameVal.replace(/[^a-zA-Z0-9_-]/g, '_');
            const file = new File([blob], `${cleanName}_doodle.png`, { type: 'image/png' });
            const dt = new DataTransfer();
            dt.items.add(file);
            doodleFileInput.files = dt.files;
          }
        } catch (e) {}
      }

      const subjectInput = form.querySelector('input[name="_subject"]');
      if (subjectInput) {
        subjectInput.value = hasDrawn
          ? `📬 New Portfolio Message + Doodle from ${nameVal}!`
          : `📬 New Portfolio Message from ${nameVal}!`;
      }

      try {
        // Submit form seamlessly via hidden iframe
        form.submit();

        submitBtn.textContent = 'Message Sent! ✓';
        submitBtn.style.background = '#1a7a1a';

        alert(`Thanks for reaching out, ${nameVal}! Your message ${hasDrawn ? 'and doodle have' : 'has'} been sent to Naitik's Gmail. ✉️`);

        setTimeout(() => {
          form.reset();
          if (doodleFileInput) doodleFileInput.value = '';
          if (canvasAuthorInput) canvasAuthorInput.value = '';
          submitBtn.innerHTML = originalText;
          submitBtn.style.background = '';
          submitBtn.disabled = false;
        }, 4500);
      } catch (err) {
        console.error('Error submitting form:', err);
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        alert('Could not send message automatically. Please reach out directly to naiitik1526@gmail.com!');
      }
    });
  }
})();
