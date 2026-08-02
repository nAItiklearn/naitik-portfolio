/* ====================================================
   MAIN.JS — Shared initialization
   Single Lenis instance, GSAP register, nav logic
   ==================================================== */

// ─── GSAP + Lenis shared setup ───
gsap.registerPlugin(ScrollTrigger);

const lenis = new Lenis({
  duration: 1.15,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smoothWheel: true,
});

lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => lenis.raf(time * 1000));
gsap.ticker.lagSmoothing(0);
window.addEventListener('resize', () => ScrollTrigger.refresh());

// ─── Expose lenis globally for section scripts ───
window._lenis = lenis;

// ─── Scroll reveal (IntersectionObserver) ───
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ─── Skill tags stagger observer ───
const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const tags = entry.target.querySelectorAll('.skill-tag');
      tags.forEach((tag, i) => {
        setTimeout(() => tag.classList.add('is-visible'), i * 60);
      });
      skillObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.2 });

document.querySelectorAll('.skills__category').forEach(el => skillObserver.observe(el));

// ─── Nav ───
const nav = document.getElementById('nav');
const hamburger = document.getElementById('nav-hamburger');
const mobileNav = document.getElementById('nav-mobile');
const mobileClose = document.getElementById('nav-mobile-close');

if (hamburger) {
  hamburger.addEventListener('click', () => {
    mobileNav.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  });
}
if (mobileClose) {
  mobileClose.addEventListener('click', () => {
    mobileNav.classList.remove('is-open');
    document.body.style.overflow = '';
  });
}

// Close mobile nav on link click
document.querySelectorAll('.nav__mobile-link').forEach(link => {
  link.addEventListener('click', () => {
    mobileNav.classList.remove('is-open');
    document.body.style.overflow = '';
  });
});

// Nav background on scroll
lenis.on('scroll', ({ scroll }) => {
  if (scroll > 80) {
    nav.style.background = 'rgba(10,10,10,0.95)';
  } else {
    nav.style.background = 'rgba(10,10,10,0.7)';
  }
});
