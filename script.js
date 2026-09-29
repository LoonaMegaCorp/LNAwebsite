const toggle = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.main-nav');

if (toggle && navigation) {
  toggle.addEventListener('click', () => {
    const isOpen = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!isOpen));
    toggle.setAttribute('aria-label', isOpen ? 'Open navigation' : 'Close navigation');
    navigation.classList.toggle('open', !isOpen);
  });

  navigation.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Open navigation');
      navigation.classList.remove('open');
    });
  });
}

const fleetFilters = document.querySelectorAll('.fleet-filter');
const fleetCards = document.querySelectorAll('.fleet-card');

fleetFilters.forEach((filter) => {
  filter.addEventListener('click', () => {
    const category = filter.dataset.filter;
    fleetFilters.forEach((button) => button.classList.toggle('active', button === filter));
    fleetCards.forEach((card) => {
      const categories = card.dataset.domain.split(' ');
      card.hidden = category !== 'all' && !categories.includes(category);
    });
  });
});
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const scrollProgress = document.createElement('div');
scrollProgress.className = 'scroll-progress';
scrollProgress.setAttribute('aria-hidden', 'true');
document.body.prepend(scrollProgress);

let progressFrame = 0;
const updateScrollProgress = () => {
  if (progressFrame) return;
  progressFrame = window.requestAnimationFrame(() => {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollable > 0 ? window.scrollY / scrollable : 0;
    scrollProgress.style.width = `${Math.min(progress * 100, 100)}%`;
    progressFrame = 0;
  });
};
window.addEventListener('scroll', updateScrollProgress, { passive: true });
window.addEventListener('resize', updateScrollProgress, { passive: true });
updateScrollProgress();

const revealItems = document.querySelectorAll('.section-pad, .feature-band > *, .vehicle-card, .fleet-card, .timeline-item');
if (!reducedMotion && 'IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -28px 0px' });

  revealItems.forEach((item, index) => {
    item.classList.add('reveal-on-scroll');
    if (item.classList.contains('fleet-card')) {
      item.style.setProperty('--reveal-delay', `${(index % 3) * 70}ms`);
    }
    revealObserver.observe(item);
  });
} else {
  revealItems.forEach((item) => item.classList.add('is-visible'));
}

const homeHero = document.querySelector('.home-hero');
if (homeHero && !reducedMotion && window.matchMedia('(pointer: fine)').matches) {
  let pointerFrame = 0;
  homeHero.addEventListener('pointermove', (event) => {
    if (pointerFrame) return;
    pointerFrame = window.requestAnimationFrame(() => {
      const bounds = homeHero.getBoundingClientRect();
      const x = (event.clientX - bounds.left) / bounds.width - 0.5;
      const y = (event.clientY - bounds.top) / bounds.height - 0.5;
      homeHero.style.setProperty('--hero-shift-x', `${x * -8}px`);
      homeHero.style.setProperty('--hero-shift-y', `${y * -5}px`);
      pointerFrame = 0;
    });
  });
}