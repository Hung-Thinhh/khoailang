// ===== DOM READY =====
document.addEventListener('DOMContentLoaded', () => {
  initHeader();
  initMobileMenu();
  initCountdown();
  initFloatingEmojis();
  initGardenCanvas();
  initScrollReveal();
});

// ===== HEADER SCROLL EFFECT =====
function initHeader() {
  const header = document.getElementById('header');
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const currentScroll = window.scrollY;
    if (currentScroll > 30) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    lastScroll = currentScroll;
  }, { passive: true });
}

// ===== MOBILE MENU =====
function initMobileMenu() {
  const btn = document.getElementById('mobileMenuBtn');
  const nav = document.getElementById('nav');

  if (!btn || !nav) return;

  btn.addEventListener('click', () => {
    nav.classList.toggle('active');
    btn.textContent = nav.classList.contains('active') ? '✕' : '☰';
  });

  // Close menu on link click
  nav.querySelectorAll('.nav-link, .nav-cta').forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('active');
      btn.textContent = '☰';
    });
  });
}

// ===== COUNTDOWN TIMER =====
function initCountdown() {
  const hoursEl = document.getElementById('cd-hours');
  const minutesEl = document.getElementById('cd-minutes');
  const secondsEl = document.getElementById('cd-seconds');

  if (!hoursEl || !minutesEl || !secondsEl) return;

  // Set countdown to end of today
  function getTimeRemaining() {
    const now = new Date();
    const endOfDay = new Date(now);
    endOfDay.setHours(23, 59, 59, 999);
    const diff = endOfDay - now;

    return {
      hours: Math.floor(diff / (1000 * 60 * 60)),
      minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
      seconds: Math.floor((diff % (1000 * 60)) / 1000)
    };
  }

  function updateCountdown() {
    const time = getTimeRemaining();
    hoursEl.textContent = String(time.hours).padStart(2, '0');
    minutesEl.textContent = String(time.minutes).padStart(2, '0');
    secondsEl.textContent = String(time.seconds).padStart(2, '0');
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);
}

// ===== FLOATING EMOJIS =====
function initFloatingEmojis() {
  const container = document.getElementById('floatingEmojis');
  if (!container) return;

  const emojis = ['🥔', '🌿', '🌱', '🍠', '🌾', '☘️', '🍃', '💧', '🌻', '🐛'];

  function createEmoji() {
    const el = document.createElement('span');
    el.className = 'floating-emoji';
    el.textContent = emojis[Math.floor(Math.random() * emojis.length)];

    const x = Math.random() * 100;
    const size = 1.2 + Math.random() * 1.5;
    const duration = 6 + Math.random() * 8;
    const delay = Math.random() * 2;

    el.style.left = x + '%';
    el.style.fontSize = size + 'rem';
    el.style.animationDuration = duration + 's';
    el.style.animationDelay = delay + 's';

    container.appendChild(el);

    // Remove after animation
    setTimeout(() => {
      if (el.parentNode) el.parentNode.removeChild(el);
    }, (duration + delay) * 1000);
  }

  // Create initial batch
  for (let i = 0; i < 8; i++) {
    setTimeout(createEmoji, i * 400);
  }

  // Keep creating
  setInterval(createEmoji, 2000);
}

// ===== GARDEN CANVAS =====
function initGardenCanvas() {
  const canvas = document.getElementById('gardenCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height;
  let plants = [];
  let particles = [];
  let clouds = [];
  let butterflies = [];

  function resize() {
    const rect = canvas.parentElement.getBoundingClientRect();
    width = canvas.width = rect.width;
    height = canvas.height = 300;
  }

  resize();
  window.addEventListener('resize', resize);

  // Initialize clouds
  for (let i = 0; i < 4; i++) {
    clouds.push({
      x: Math.random() * width,
      y: 20 + Math.random() * 50,
      size: 30 + Math.random() * 40,
      speed: 0.2 + Math.random() * 0.3,
      opacity: 0.15 + Math.random() * 0.15
    });
  }

  // Initialize butterflies
  for (let i = 0; i < 3; i++) {
    butterflies.push({
      x: Math.random() * width,
      y: 40 + Math.random() * 120,
      vx: (Math.random() - 0.5) * 1.5,
      vy: (Math.random() - 0.5) * 0.8,
      wingPhase: Math.random() * Math.PI * 2,
      size: 6 + Math.random() * 4,
      color: ['#f59e0b', '#ec4899', '#8b5cf6', '#06b6d4'][Math.floor(Math.random() * 4)]
    });
  }

  // Initial plants (pre-populated garden)
  const initialPlants = [
    { x: 0.1, stage: 4 }, { x: 0.2, stage: 3 }, { x: 0.3, stage: 5 },
    { x: 0.45, stage: 2 }, { x: 0.55, stage: 4 }, { x: 0.65, stage: 3 },
    { x: 0.75, stage: 5 }, { x: 0.85, stage: 4 }, { x: 0.92, stage: 2 }
  ];

  initialPlants.forEach(p => {
    plants.push({
      x: p.x * width,
      y: height - 30,
      stage: p.stage,
      maxStage: 5,
      growTimer: 0,
      swayPhase: Math.random() * Math.PI * 2,
      type: Math.floor(Math.random() * 3) // 0: khoai lang, 1: cà chua, 2: hoa
    });
  });

  // Click to plant
  canvas.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = height - 30;

    plants.push({
      x: x,
      y: y,
      stage: 0,
      maxStage: 5,
      growTimer: 0,
      swayPhase: Math.random() * Math.PI * 2,
      type: Math.floor(Math.random() * 3)
    });

    // Sparkle particles
    for (let i = 0; i < 12; i++) {
      particles.push({
        x: x,
        y: y - 20,
        vx: (Math.random() - 0.5) * 4,
        vy: -Math.random() * 3 - 1,
        life: 1,
        decay: 0.015 + Math.random() * 0.015,
        size: 2 + Math.random() * 3,
        color: ['#22c55e', '#f59e0b', '#86efac', '#fbbf24'][Math.floor(Math.random() * 4)]
      });
    }
  });

  function drawCloud(cloud) {
    ctx.save();
    ctx.globalAlpha = cloud.opacity;
    ctx.fillStyle = '#ffffff';
    const s = cloud.size;
    ctx.beginPath();
    ctx.arc(cloud.x, cloud.y, s * 0.5, 0, Math.PI * 2);
    ctx.arc(cloud.x + s * 0.4, cloud.y - s * 0.15, s * 0.35, 0, Math.PI * 2);
    ctx.arc(cloud.x - s * 0.35, cloud.y - s * 0.1, s * 0.3, 0, Math.PI * 2);
    ctx.arc(cloud.x + s * 0.2, cloud.y + s * 0.1, s * 0.25, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  function drawButterfly(b, time) {
    ctx.save();
    ctx.translate(b.x, b.y);

    const wingAngle = Math.sin(time * 8 + b.wingPhase) * 0.6;
    ctx.fillStyle = b.color;

    // Left wing
    ctx.save();
    ctx.scale(Math.cos(wingAngle), 1);
    ctx.beginPath();
    ctx.ellipse(-b.size * 0.5, 0, b.size, b.size * 0.6, -0.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Right wing
    ctx.save();
    ctx.scale(Math.cos(-wingAngle), 1);
    ctx.beginPath();
    ctx.ellipse(b.size * 0.5, 0, b.size, b.size * 0.6, 0.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Body
    ctx.fillStyle = '#1a1a1a';
    ctx.beginPath();
    ctx.ellipse(0, 0, 1.5, b.size * 0.5, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  function drawPlant(plant, time) {
    const sway = Math.sin(time * 1.5 + plant.swayPhase) * 3;
    const stage = plant.stage;
    const x = plant.x + sway;
    const y = plant.y;

    if (stage === 0) {
      // Seed
      ctx.fillStyle = '#8B6914';
      ctx.beginPath();
      ctx.ellipse(x, y - 4, 4, 3, 0, 0, Math.PI * 2);
      ctx.fill();
      return;
    }

    // Stem
    const stemHeight = 15 + stage * 18;
    ctx.strokeStyle = '#2d8a3e';
    ctx.lineWidth = 2 + stage * 0.5;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.quadraticCurveTo(x + sway * 0.5, y - stemHeight * 0.5, x + sway, y - stemHeight);
    ctx.stroke();

    if (stage >= 2) {
      // Leaves
      const leafPositions = [
        { h: 0.3, side: -1 },
        { h: 0.5, side: 1 },
        { h: 0.7, side: -1 }
      ];

      leafPositions.forEach((lp, i) => {
        if (i >= stage - 1) return;
        const ly = y - stemHeight * lp.h;
        const lx = x + sway * lp.h;
        const leafSize = 8 + stage * 2;

        ctx.save();
        ctx.translate(lx, ly);
        ctx.rotate(lp.side * 0.4 + Math.sin(time * 2 + i) * 0.1);

        // Heart-shaped leaf (khoai lang style)
        ctx.fillStyle = stage >= 4 ? '#16a34a' : '#22c55e';
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo(
          lp.side * leafSize, -leafSize * 0.5,
          lp.side * leafSize * 1.2, leafSize * 0.3,
          0, leafSize * 0.8
        );
        ctx.bezierCurveTo(
          -lp.side * leafSize * 0.3, leafSize * 0.3,
          -lp.side * leafSize * 0.1, -leafSize * 0.2,
          0, 0
        );
        ctx.fill();
        ctx.restore();
      });
    }

    if (stage >= 4) {
      // Flower or fruit at top
      const topX = x + sway;
      const topY = y - stemHeight;

      if (plant.type === 0) {
        // Khoai lang - purple flower
        ctx.fillStyle = '#a855f7';
        for (let p = 0; p < 5; p++) {
          const angle = (p / 5) * Math.PI * 2 + time * 0.5;
          ctx.beginPath();
          ctx.ellipse(
            topX + Math.cos(angle) * 5,
            topY + Math.sin(angle) * 5,
            4, 3, angle, 0, Math.PI * 2
          );
          ctx.fill();
        }
        ctx.fillStyle = '#fbbf24';
        ctx.beginPath();
        ctx.arc(topX, topY, 3, 0, Math.PI * 2);
        ctx.fill();
      } else if (plant.type === 1) {
        // Tomato-like fruit
        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.arc(topX, topY, 6 + Math.sin(time * 2) * 0.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#22c55e';
        ctx.beginPath();
        ctx.moveTo(topX - 4, topY - 5);
        ctx.lineTo(topX, topY - 8);
        ctx.lineTo(topX + 4, topY - 5);
        ctx.fill();
      } else {
        // Sunflower
        ctx.fillStyle = '#fbbf24';
        for (let p = 0; p < 8; p++) {
          const angle = (p / 8) * Math.PI * 2 + time * 0.3;
          ctx.beginPath();
          ctx.ellipse(
            topX + Math.cos(angle) * 7,
            topY + Math.sin(angle) * 7,
            5, 3, angle, 0, Math.PI * 2
          );
          ctx.fill();
        }
        ctx.fillStyle = '#92400e';
        ctx.beginPath();
        ctx.arc(topX, topY, 5, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    if (stage >= 5) {
      // Underground khoai lang visible
      ctx.fillStyle = '#d97706';
      ctx.globalAlpha = 0.7;
      ctx.beginPath();
      ctx.ellipse(x - 8, y + 12, 12, 7, -0.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(x + 10, y + 10, 10, 6, 0.3, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
    }
  }

  function drawGround() {
    // Soil
    const soilGradient = ctx.createLinearGradient(0, height - 40, 0, height);
    soilGradient.addColorStop(0, '#8B6914');
    soilGradient.addColorStop(0.3, '#6d4c1a');
    soilGradient.addColorStop(1, '#4a3310');
    ctx.fillStyle = soilGradient;
    ctx.beginPath();
    ctx.moveTo(0, height - 30);
    // Wavy ground line
    for (let i = 0; i <= width; i += 20) {
      ctx.lineTo(i, height - 30 + Math.sin(i * 0.03) * 4);
    }
    ctx.lineTo(width, height);
    ctx.lineTo(0, height);
    ctx.closePath();
    ctx.fill();

    // Grass on top of soil
    ctx.strokeStyle = '#4ade80';
    ctx.lineWidth = 1.5;
    for (let i = 0; i < width; i += 12) {
      const gh = 6 + Math.random() * 6;
      ctx.beginPath();
      ctx.moveTo(i, height - 30 + Math.sin(i * 0.03) * 4);
      ctx.lineTo(i + (Math.random() - 0.5) * 4, height - 30 - gh + Math.sin(i * 0.03) * 4);
      ctx.stroke();
    }
  }

  function drawSky() {
    const skyGradient = ctx.createLinearGradient(0, 0, 0, height - 40);
    skyGradient.addColorStop(0, '#87CEEB');
    skyGradient.addColorStop(0.5, '#B0E0E6');
    skyGradient.addColorStop(1, '#c5e8b0');
    ctx.fillStyle = skyGradient;
    ctx.fillRect(0, 0, width, height - 30);

    // Sun
    ctx.save();
    ctx.globalAlpha = 0.9;
    const sunGlow = ctx.createRadialGradient(width - 60, 50, 5, width - 60, 50, 60);
    sunGlow.addColorStop(0, '#fef08a');
    sunGlow.addColorStop(0.4, '#fde047');
    sunGlow.addColorStop(1, 'transparent');
    ctx.fillStyle = sunGlow;
    ctx.fillRect(width - 120, 0, 120, 110);

    ctx.fillStyle = '#fde047';
    ctx.beginPath();
    ctx.arc(width - 60, 50, 22, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  let startTime = performance.now();

  function animate(now) {
    const time = (now - startTime) / 1000;

    ctx.clearRect(0, 0, width, height);

    // Draw sky
    drawSky();

    // Draw clouds
    clouds.forEach(cloud => {
      cloud.x += cloud.speed;
      if (cloud.x > width + cloud.size) cloud.x = -cloud.size * 2;
      drawCloud(cloud);
    });

    // Draw butterflies
    butterflies.forEach(b => {
      b.x += b.vx;
      b.y += b.vy + Math.sin(time * 2) * 0.3;
      if (b.x > width + 20) b.x = -20;
      if (b.x < -20) b.x = width + 20;
      if (b.y < 20 || b.y > height - 60) b.vy *= -1;
      drawButterfly(b, time);
    });

    // Draw ground
    drawGround();

    // Grow plants
    plants.forEach(plant => {
      plant.growTimer += 0.016;
      if (plant.growTimer > 1 && plant.stage < plant.maxStage) {
        plant.stage++;
        plant.growTimer = 0;
      }
      drawPlant(plant, time);
    });

    // Draw particles
    particles = particles.filter(p => p.life > 0);
    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.05; // gravity
      p.life -= p.decay;

      ctx.save();
      ctx.globalAlpha = p.life;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });

    requestAnimationFrame(animate);
  }

  requestAnimationFrame(animate);
}

// ===== SCROLL REVEAL =====
function initScrollReveal() {
  const elements = document.querySelectorAll('.reveal');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        // Stagger animation
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, index * 100);
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -40px 0px'
  });

  elements.forEach(el => observer.observe(el));
}
