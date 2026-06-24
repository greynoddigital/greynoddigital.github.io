/* =============================================
   GREYNOD DIGITAL — MAIN.JS v2
   ============================================= */

(function () {
  'use strict';

  /* ---- ANIMATED GRID CANVAS ---- */
  const canvas = document.getElementById('grid-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let W, H, dots = [];

    function resizeCanvas() {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight * 3;
    }

    function buildDots() {
      dots = [];
      const spacing = 48;
      for (let x = 0; x < W; x += spacing) {
        for (let y = 0; y < H; y += spacing) {
          dots.push({ x, y, baseX: x, baseY: y, phase: Math.random() * Math.PI * 2 });
        }
      }
    }

    let frame = 0;
    function drawGrid() {
      ctx.clearRect(0, 0, W, H);
      frame += 0.008;
      dots.forEach(d => {
        const offset = Math.sin(frame + d.phase) * 1.5;
        const x = d.baseX + offset;
        const y = d.baseY + offset;
        const dist = Math.sqrt(Math.pow(x - W / 2, 2) + Math.pow(y - H * 0.15, 2));
        const glow = Math.max(0, 1 - dist / 600);
        const alpha = 0.12 + glow * 0.35;
        ctx.beginPath();
        ctx.arc(x, y, 1, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(124, 77, 255, ${alpha})`;
        ctx.fill();
      });
      requestAnimationFrame(drawGrid);
    }

    resizeCanvas();
    buildDots();
    drawGrid();
    window.addEventListener('resize', () => { resizeCanvas(); buildDots(); });
  }


  /* ---- NAVBAR ---- */
  const navbar = document.getElementById('navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 40);
    }, { passive: true });
  }

  // Mark active nav link based on current page
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });

  // Mobile toggle
  const toggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');
  if (toggle && navLinks) {
    toggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      const spans = toggle.querySelectorAll('span');
      const open = navLinks.classList.contains('open');
      spans[0].style.transform = open ? 'rotate(45deg) translate(5px, 5px)' : '';
      spans[1].style.opacity = open ? '0' : '';
      spans[2].style.transform = open ? 'rotate(-45deg) translate(5px, -5px)' : '';
    });
    navLinks.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        navLinks.classList.remove('open');
        const spans = toggle.querySelectorAll('span');
        spans[0].style.transform = '';
        spans[1].style.opacity = '';
        spans[2].style.transform = '';
      });
    });
  }


  /* ---- SCROLL REVEAL ---- */
  const revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length) {
    const revealObs = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const siblings = Array.from(entry.target.parentElement.querySelectorAll('.reveal'));
          const idx = siblings.indexOf(entry.target);
          setTimeout(() => {
            entry.target.classList.add('visible');
          }, Math.min(idx * 80, 400));
          revealObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(el => revealObs.observe(el));
  }


  /* ---- COUNTER ANIMATION ---- */
  function animateCounter(el) {
    const target = parseInt(el.dataset.target, 10);
    const suffix = el.dataset.suffix || '';
    if (isNaN(target)) return; // skip 24/7 — already static
    const duration = 1800;
    const startTime = performance.now();

    function update(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(eased * target);
      el.textContent = current + suffix;
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  }

  const statNumbers = document.querySelectorAll('.stat-number[data-target]');
  if (statNumbers.length) {
    const counterObs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    statNumbers.forEach(el => counterObs.observe(el));
  }


  /* ---- ACCORDION ---- */
  document.querySelectorAll('.accordion-trigger').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.parentElement;
      const isActive = item.classList.contains('active');
      document.querySelectorAll('.accordion-item.active').forEach(i => i.classList.remove('active'));
      if (!isActive) item.classList.add('active');
    });
  });


  /* ---- PROCESS STEPS ---- */
  document.querySelectorAll('.process-step').forEach(step => {
    step.addEventListener('click', () => {
      document.querySelectorAll('.process-step').forEach(s => s.classList.remove('active'));
      step.classList.add('active');
    });
    step.addEventListener('mouseenter', () => {
      document.querySelectorAll('.process-step').forEach(s => s.classList.remove('active'));
      step.classList.add('active');
    });
  });


  /* ---- MAGNETIC BUTTONS ---- */
  document.querySelectorAll('.magnetic').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const rect = btn.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) * 0.25;
      const dy = (e.clientY - cy) * 0.25;
      btn.style.transform = `translate(${dx}px, ${dy}px)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });


  /* ---- HERO CARDS — MOUSE PARALLAX ---- */
  const heroVisual = document.querySelector('.hero-visual');
  if (heroVisual) {
    document.addEventListener('mousemove', e => {
      const cards = heroVisual.querySelectorAll('.project-card');
      const rx = (e.clientX / window.innerWidth - 0.5) * 2;
      const ry = (e.clientY / window.innerHeight - 0.5) * 2;
      cards.forEach((card, i) => {
        const depth = (i + 1) * 6;
        const baseRotate = ['-6deg', '2deg', '-3deg'][i] || '0deg';
        card.style.transform = `rotate(${baseRotate}) translate(${rx * depth}px, ${ry * depth}px)`;
      });
    });
  }


  /* ---- SMOOTH ACTIVE NAV (homepage sections) ---- */
  const sections = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('.nav-links a');
  if (sections.length && navAnchors.length) {
    const sectionObs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = '#' + entry.target.id;
          navAnchors.forEach(a => {
            a.style.color = a.getAttribute('href') === id ? 'var(--white)' : '';
          });
        }
      });
    }, { threshold: 0.4 });
    sections.forEach(s => sectionObs.observe(s));
  }


  /* ---- CONTACT FORM ---- */
  const form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"]');
      const original = btn.innerHTML;
      btn.disabled = true;
      btn.innerHTML = 'Sending…';

      fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { 'Accept': 'application/json' }
      })
        .then(response => {
          if (response.ok) {
            btn.innerHTML = 'Message Sent ✓';
            btn.style.background = 'linear-gradient(135deg, #22c55e, #16a34a)';
            form.reset();
          } else {
            btn.innerHTML = 'Something went wrong';
            btn.style.background = 'linear-gradient(135deg, #ef4444, #b91c1c)';
          }
        })
        .catch(() => {
          btn.innerHTML = 'Something went wrong';
          btn.style.background = 'linear-gradient(135deg, #ef4444, #b91c1c)';
        })
        .finally(() => {
          setTimeout(() => {
            btn.innerHTML = original;
            btn.style.background = '';
            btn.disabled = false;
          }, 3500);
        });
    });
  }


  /* ---- PORTFOLIO ITEMS — TILT ---- */
  document.querySelectorAll('.portfolio-item, .portfolio-featured-item').forEach(item => {
    item.addEventListener('mousemove', e => {
      const rect = item.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      item.style.transform = `translateY(-8px) rotateX(${-y * 4}deg) rotateY(${x * 4}deg)`;
    });
    item.addEventListener('mouseleave', () => {
      item.style.transform = '';
    });
  });


  /* ---- PRICING CARD GLOW ON HOVER ---- */
  document.querySelectorAll('.pricing-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      card.style.setProperty('--mouse-x', x + '%');
      card.style.setProperty('--mouse-y', y + '%');
    });
  });


  /* ---- SCROLL PROGRESS BAR ---- */
  const progressBar = document.createElement('div');
  progressBar.style.cssText = `
    position: fixed; top: 0; left: 0; height: 2px;
    background: linear-gradient(90deg, #7C4DFF, #A855F7);
    z-index: 200; width: 0%; transition: width 0.1s linear;
    pointer-events: none;
  `;
  document.body.appendChild(progressBar);
  window.addEventListener('scroll', () => {
    const docH = document.documentElement.scrollHeight - window.innerHeight;
    const prog = (window.scrollY / docH) * 100;
    progressBar.style.width = prog + '%';
  }, { passive: true });

})();