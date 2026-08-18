/* ====================================================
   WORK.JS
   Adapted from moviesposter-animation component
   Three.js letter paths + dot grid + horizontal cards
   Letters changed to N·A·I·T·I·K (6 letters, 6 rows)
   ==================================================== */

(() => {
  const workSection = document.querySelector('.work-pin');
  if (!workSection) return;

  const cardsContainer = document.querySelector('.work-cards');
  // Cards start at +windowWidth (off right edge) and travel left by 400vw
  const cardStartX = window.innerWidth;
  const cardTravelX = window.innerWidth * 4;
  let currentXPosition = cardStartX;
  let targetXPosition  = cardStartX;

  const lerp = (start, end, t) => start + (end - start) * t;

  // ─── Grid Canvas (dot grid) ───
  const gridCanvas = document.createElement('canvas');
  gridCanvas.id = 'grid-canvas';
  workSection.appendChild(gridCanvas);
  const gridCtx = gridCanvas.getContext('2d');

  const resizeGridCanvas = () => {
    const dpr = window.devicePixelRatio || 1;
    gridCanvas.width  = window.innerWidth * dpr;
    gridCanvas.height = window.innerHeight * dpr;
    gridCanvas.style.width  = `${window.innerWidth}px`;
    gridCanvas.style.height = `${window.innerHeight}px`;
    gridCtx.scale(dpr, dpr);
  };
  resizeGridCanvas();

  const drawGrid = (scrollProgress = 0) => {
    gridCtx.fillStyle = '#000';
    gridCtx.fillRect(0, 0, gridCanvas.width, gridCanvas.height);
    gridCtx.fillStyle = '#f40c3f';
    const [dotSize, spacing] = [1.2, 30];
    const rows = Math.ceil(window.innerHeight / spacing) + 1;
    const cols = Math.ceil(window.innerWidth  / spacing) + 15;
    const offset = (scrollProgress * spacing * 10) % spacing;
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        gridCtx.beginPath();
        gridCtx.arc(x * spacing - offset, y * spacing, dotSize, 0, Math.PI * 2);
        gridCtx.fill();
      }
    }
  };

  // ─── Three.js Letters (N·A·I·T·I·K) ───
  const lettersScene    = new THREE.Scene();
  const lettersCamera   = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
  lettersCamera.position.z = 20;

  const lettersRenderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  lettersRenderer.setSize(window.innerWidth, window.innerHeight);
  lettersRenderer.setClearColor(0, 0);
  lettersRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  lettersRenderer.domElement.id = 'letters-canvas';
  workSection.appendChild(lettersRenderer.domElement);

  // 6 paths for N·A·I·T·I·K (evenly spaced vertically)
  const createPath = (yPos, amplitude) => {
    const points = [];
    for (let i = 0; i <= 20; i++) {
      const t = i / 20;
      points.push(new THREE.Vector3(
        -25 + 50 * t,
        yPos + Math.sin(t * Math.PI) * -amplitude,
        (1 - Math.pow(Math.abs(t - 0.5) * 2, 2)) * -5,
      ));
    }
    const curve = new THREE.CatmullRomCurve3(points);
    const line = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints(curve.getPoints(100)),
      new THREE.LineBasicMaterial({ color: 0, linewidth: 1 })
    );
    line.curve = curve;
    return line;
  };

  // 6 rows — one per letter of NAITIK
  const paths = [
    createPath(12,  2.0),
    createPath( 7,  1.2),
    createPath( 2,  0.5),
    createPath(-3, -0.5),
    createPath(-8, -1.2),
    createPath(-13,-2.0),
  ];
  paths.forEach(p => lettersScene.add(p));

  // DOM letter elements
  const textContainer = document.querySelector('.work-pin__text');
  const letterPositions = new Map();
  const LETTERS = ['N', 'A', 'I', 'T', 'I', 'K'];
  const speedMultipliers = [0.8, 1.0, 0.7, 0.9, 0.75, 0.85];

  paths.forEach((path, i) => {
    path.letterElements = Array.from({ length: 12 }, () => {
      const el = document.createElement('div');
      el.className = 'work-letter';
      el.textContent = LETTERS[i];
      textContainer.appendChild(el);
      letterPositions.set(el, {
        current: { x: 0, y: 0 },
        target:  { x: 0, y: 0 },
      });
      return el;
    });
  });

  // Update 3D → 2D projected positions
  const updateTargetPositions = (scrollProgress = 0) => {
    paths.forEach((path, lineIndex) => {
      path.letterElements.forEach((element, i) => {
        const point = path.curve.getPoint(
          (i / 11 + scrollProgress * speedMultipliers[lineIndex]) % 1
        );
        const vector = point.clone().project(lettersCamera);
        const positions = letterPositions.get(element);
        positions.target = {
          x: (-vector.x * 0.5 + 0.5) * window.innerWidth,
          y: (-vector.y * 0.5 + 0.5) * window.innerHeight,
        };
      });
    });
  };

  // Lerp letter positions (smooth chase)
  const updateLetterPositions = () => {
    letterPositions.forEach((positions, element) => {
      const distX = positions.target.x - positions.current.x;
      if (Math.abs(distX) > window.innerWidth * 0.7) {
        positions.current.x = positions.target.x;
        positions.current.y = positions.target.y;
      } else {
        positions.current.x = lerp(positions.current.x, positions.target.x, 0.07);
        positions.current.y = lerp(positions.current.y, positions.target.y, 0.07);
      }
      element.style.transform = `translate(-50%, -50%) translate3d(${positions.current.x}px,${positions.current.y}px,0)`;
    });
  };

  // Horizontal card lerp
  const updateCardsPosition = () => {
    currentXPosition = lerp(currentXPosition, targetXPosition, 0.07);
    gsap.set(cardsContainer, { x: currentXPosition });
  };

  // RAF loop
  const animate = () => {
    updateLetterPositions();
    updateCardsPosition();
    lettersRenderer.render(lettersScene, lettersCamera);
    requestAnimationFrame(animate);
  };

  // ScrollTrigger — pin work section for 600%
  ScrollTrigger.create({
    trigger: '.work-pin',
    start: 'top top',
    end: '+=600%',
    pin: true,
    pinSpacing: true,
    scrub: 1,
    onUpdate: (self) => {
      // Drive cards from cardStartX → cardStartX - cardTravelX
      targetXPosition = cardStartX - self.progress * cardTravelX;
      updateTargetPositions(self.progress);
      drawGrid(self.progress);
    },
  });

  // Init
  drawGrid(0);
  gsap.set(cardsContainer, { x: cardStartX });
  animate();
  updateTargetPositions(0);

  // Resize
  window.addEventListener('resize', () => {
    resizeGridCanvas();
    const progress = ScrollTrigger.getAll().find(t => t.vars.trigger === '.work-pin')?.progress || 0;
    drawGrid(progress);
    lettersCamera.aspect = window.innerWidth / window.innerHeight;
    lettersCamera.updateProjectionMatrix();
    lettersRenderer.setSize(window.innerWidth, window.innerHeight);
    updateTargetPositions(progress);
  });
})();
 
 
 
 
 
 
 
 
 
 
 
 
 
