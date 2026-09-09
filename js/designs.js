/* ====================================================
   DESIGNS.JS — Codegrid Mosaic Flip 3D Hover Effect
   12x9 tile grid of 3D cubes flipping to reveal posters
   ==================================================== */

(() => {
  const previewEl = document.querySelector('.project-preview');
  const projectListEl = document.querySelector('.project-list');
  if (!previewEl || !projectListEl) return;

  const TILES_X = 12;
  const TILES_Y = 9;

  const TILE_FACES = [
    'face-front',
    'face-rear',
    'face-right',
    'face-left',
    'face-top',
    'face-bottom',
  ];

  // Poster dataset with precise aspect ratios and vertical focal points
  // to avoid squashing/distortion and ensure crystal-clear rendering
  const POSTER_DATA = [
    { src: 'components/posters/poster1.jpg', aspect: 422 / 592, focusY: 0.4 },   // 0: Default
    { src: 'components/posters/poster1.jpg', aspect: 422 / 592, focusY: 0.4 },   // 1: Dream More
    { src: 'components/posters/poster2.jpg', aspect: 736 / 520, focusY: 0.5 },   // 2: Safar
    { src: 'components/posters/poster3.jpg', aspect: 736 / 1041, focusY: 0.45 }, // 3: Bismillah
    { src: 'components/posters/poster4.jpg', aspect: 736 / 1041, focusY: 0.45 }, // 4: Metamorphosis
    { src: 'components/posters/poster5.jpeg', aspect: 943 / 954, focusY: 0.5 },  // 5: Padlock
    { src: 'components/posters/poster6.png', aspect: 1.0, focusY: 0.7 },        // 6: Identity
    { src: 'components/posters/poster7.png', aspect: 1.0, focusY: 0.75 },       // 7: Platform
  ];

  // Preload and decode images for zero-lag flips and instant sharpness
  POSTER_DATA.forEach((poster) => {
    const img = new Image();
    img.src = poster.src;
    img.onload = () => {
      if (img.naturalWidth && img.naturalHeight) {
        poster.aspect = img.naturalWidth / img.naturalHeight;
      }
    };
    if (img.decode) {
      img.decode().catch(() => {});
    }
  });

  let tileSize = parseFloat(getComputedStyle(previewEl).getPropertyValue('--tile-size')) || 60;
  let previewWidth = TILES_X * tileSize;
  let previewHeight = TILES_Y * tileSize;

  const tiles = [];

  // Generate 12x9 grid of 3D tiles
  for (let row = 0; row < TILES_Y; row++) {
    for (let col = 0; col < TILES_X; col++) {
      const tile = document.createElement('div');
      tile.className = 'tile';

      const faces = {};

      TILE_FACES.forEach((side) => {
        const face = document.createElement('div');
        face.className = `tile-face ${side}`;
        tile.appendChild(face);
        faces[side] = face;
      });

      previewEl.appendChild(tile);
      tiles.push({ element: tile, faces, row, col });
    }
  }

  function updateTileSizing() {
    tileSize = parseFloat(getComputedStyle(previewEl).getPropertyValue('--tile-size')) || 60;
    previewWidth = TILES_X * tileSize;
    previewHeight = TILES_Y * tileSize;
  }

  /**
   * Calculates aspect-ratio preserving cover dimensions and offsets.
   * This guarantees images are NEVER squashed or stretched unevenly,
   * eliminating distortion and interpolation blurriness completely.
   */
  function getCoverSizing(poster) {
    const stageAspect = previewWidth / previewHeight;
    const aspect = poster.aspect || 1.0;
    const focusY = poster.focusY !== undefined ? poster.focusY : 0.5;
    const focusX = poster.focusX !== undefined ? poster.focusX : 0.5;

    let bgWidth, bgHeight, shiftX, shiftY;

    if (aspect >= stageAspect) {
      // Wider than stage: fit height, overflow width
      bgHeight = previewHeight;
      bgWidth = previewHeight * aspect;
      shiftX = (previewWidth - bgWidth) * focusX;
      shiftY = 0;
    } else {
      // Taller than stage (square or portrait): fit width, overflow height
      bgWidth = previewWidth;
      bgHeight = previewWidth / aspect;
      shiftX = 0;
      shiftY = (previewHeight - bgHeight) * focusY;
    }

    return {
      bgWidth: Math.round(bgWidth),
      bgHeight: Math.round(bgHeight),
      shiftX: Math.round(shiftX),
      shiftY: Math.round(shiftY),
    };
  }

  function setTileImage(tile, side, posterIndex) {
    const poster = POSTER_DATA[posterIndex] || POSTER_DATA[0];
    const face = tile.faces[side];
    const sizing = getCoverSizing(poster);

    const offsetX = sizing.shiftX - (tile.col * tileSize);
    const offsetY = sizing.shiftY - (tile.row * tileSize);

    face.style.backgroundImage = `url("${poster.src}")`;
    face.style.backgroundSize = `${sizing.bgWidth}px ${sizing.bgHeight}px`;
    face.style.backgroundPosition = `${offsetX}px ${offsetY}px`;
  }

  // Initial setup for all tiles
  function initializeTiles() {
    updateTileSizing();
    tiles.forEach((tile) => {
      setTileImage(tile, 'face-front', 1);
      setTileImage(tile, 'face-rear', 1);
      setTileImage(tile, 'face-right', 1);
      setTileImage(tile, 'face-left', 1);

      tile.faces['face-top'].style.background = '#181818';
      tile.faces['face-bottom'].style.background = '#181818';
    });
  }

  initializeTiles();

  // Subtle organic 3D breathing wave
  function breathe(tileElement) {
    gsap.to(tileElement, {
      z: gsap.utils.random(-20, 20),
      duration: gsap.utils.random(1.0, 2.0),
      ease: 'sine.inOut',
      onComplete: () => breathe(tileElement),
    });
  }

  tiles.forEach((tile, i) => {
    gsap.delayedCall(i * 0.012, () => breathe(tile.element));
  });

  let activeProject = 1;
  let revealCount = 0;
  let isRevealing = false;
  let nextProject = null;
  let hoverDelay = null;

  function getHiddenFace() {
    return revealCount % 2 === 0 ? 'face-rear' : 'face-front';
  }

  function revealProject(projectIndex) {
    if (projectIndex === activeProject && !isRevealing) return;

    if (isRevealing) {
      nextProject = projectIndex;
      return;
    }

    if (projectIndex === activeProject) return;

    isRevealing = true;
    nextProject = null;

    updateTileSizing();
    const hiddenFace = getHiddenFace();

    tiles.forEach((tile) => {
      setTileImage(tile, hiddenFace, projectIndex);
      setTileImage(tile, 'face-right', projectIndex);
      setTileImage(tile, 'face-left', projectIndex);
    });

    revealCount++;
    activeProject = projectIndex;

    gsap.to('.tile', {
      rotateY: revealCount * 180,
      duration: 0.55,
      ease: 'power3.inOut',
      stagger: {
        each: 0.04,
        from: 'center',
        grid: [TILES_Y, TILES_X],
      },
      onComplete: () => {
        isRevealing = false;
        if (nextProject !== null && nextProject !== activeProject) {
          revealProject(nextProject);
        }
      },
    });
  }

  const projectLinks = projectListEl.querySelectorAll('a');

  projectLinks.forEach((link) => {
    // Hover event (Desktop)
    link.addEventListener('mouseenter', () => {
      projectLinks.forEach((l) => l.classList.remove('active'));
      link.classList.add('active');

      const projectIndex = parseInt(link.dataset.index, 10);
      clearTimeout(hoverDelay);
      hoverDelay = setTimeout(() => revealProject(projectIndex), 40);
    });

    // Click / Touch event (Mobile & Tablet)
    link.addEventListener('click', (e) => {
      e.preventDefault();
      projectLinks.forEach((l) => l.classList.remove('active'));
      link.classList.add('active');

      const projectIndex = parseInt(link.dataset.index, 10);
      revealProject(projectIndex);
    });
  });

  projectListEl.addEventListener('mouseleave', () => {
    clearTimeout(hoverDelay);
    hoverDelay = setTimeout(() => {
      projectLinks.forEach((l) => l.classList.remove('active'));
      projectLinks[0]?.classList.add('active');
      revealProject(1);
    }, 200);
  });

  // Re-adjust slice backgrounds on resize
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      updateTileSizing();
      const currentFace = revealCount % 2 === 0 ? 'face-front' : 'face-rear';
      tiles.forEach((tile) => {
        setTileImage(tile, currentFace, activeProject);
      });
    }, 100);
  });
})();
