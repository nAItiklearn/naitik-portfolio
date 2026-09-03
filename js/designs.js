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

  const POSTER_IMAGES = [
    'components/posters/poster1.jpg',   // 0: Default (Dream More)
    'components/posters/poster1.jpg',   // 1: Dream More
    'components/posters/poster2.jpg',   // 2: Safar
    'components/posters/poster3.jpg',   // 3: Bismillah
    'components/posters/poster4.jpg',   // 4: Metamorphosis
    'components/posters/poster5.jpeg',  // 5: Padlock
  ];

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

  function setTileImage(tile, side, imagePath) {
    const face = tile.faces[side];
    const offsetX = -(tile.col * tileSize);
    const offsetY = -(tile.row * tileSize);

    face.style.backgroundImage = `url("${imagePath}")`;
    face.style.backgroundSize = `${previewWidth}px ${previewHeight}px`;
    face.style.backgroundPosition = `${offsetX}px ${offsetY}px`;
  }

  // Initial setup for all tiles
  function initializeTiles() {
    updateTileSizing();
    tiles.forEach((tile) => {
      setTileImage(tile, 'face-front', POSTER_IMAGES[0]);
      setTileImage(tile, 'face-rear', POSTER_IMAGES[0]);
      setTileImage(tile, 'face-right', POSTER_IMAGES[0]);
      setTileImage(tile, 'face-left', POSTER_IMAGES[0]);

      tile.faces['face-top'].style.background = '#222';
      tile.faces['face-bottom'].style.background = '#222';
    });
  }

  initializeTiles();

  // Subtle breathe effect
  function breathe(tileElement) {
    gsap.to(tileElement, {
      z: gsap.utils.random(-25, 25),
      duration: gsap.utils.random(0.8, 1.8),
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
      setTileImage(tile, hiddenFace, POSTER_IMAGES[projectIndex]);
      setTileImage(tile, 'face-right', POSTER_IMAGES[0]);
      setTileImage(tile, 'face-left', POSTER_IMAGES[0]);
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
    link.addEventListener('mouseenter', () => {
      projectLinks.forEach((l) => l.classList.remove('active'));
      link.classList.add('active');

      const projectIndex = parseInt(link.dataset.index);
      clearTimeout(hoverDelay);
      hoverDelay = setTimeout(() => revealProject(projectIndex), 40);
    });
  });

  projectListEl.addEventListener('mouseleave', () => {
    clearTimeout(hoverDelay);
    // Keep active poster or return to first
    hoverDelay = setTimeout(() => {
      projectLinks.forEach((l) => l.classList.remove('active'));
      projectLinks[0]?.classList.add('active');
      revealProject(1);
    }, 150);
  });

  // Re-adjust slice backgrounds on resize
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      updateTileSizing();
      const currentFace = revealCount % 2 === 0 ? 'face-front' : 'face-rear';
      tiles.forEach((tile) => {
        setTileImage(tile, currentFace, POSTER_IMAGES[activeProject]);
      });
    }, 100);
  });
})();
