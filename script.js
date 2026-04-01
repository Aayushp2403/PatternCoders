const revealItems = document.querySelectorAll(".reveal");
const sectionTargets = document.querySelectorAll("main > section[id]");
const stateLinks = document.querySelectorAll(".site-nav a, .brand");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ── Scroll-triggered reveal ── */
const revealObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);

revealItems.forEach((item, index) => {
  item.style.transitionDelay = `${index * 70}ms`;
  revealObserver.observe(item);
});

/* ── Active nav link tracking ── */
const navObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const sectionId = entry.target.id;
      stateLinks.forEach((link) => {
        link.classList.toggle("active", link.getAttribute("href") === `#${sectionId}`);
      });
    });
  },
  { threshold: 0.45 }
);

sectionTargets.forEach((section) => {
  navObserver.observe(section);
});

if (reducedMotion) {
  // Skip all animated effects
} else {
  /* ── 3D tilt on hero dashboard card ── */
  const visual = document.querySelector(".hero-visual");
  const heroCard = document.querySelector(".dashboard-card");

  if (visual && heroCard) {
    visual.addEventListener("mousemove", (event) => {
      const rect = visual.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      heroCard.style.transform = `perspective(800px) rotateX(${y * -12}deg) rotateY(${x * 14}deg) translateZ(10px)`;
    });

    visual.addEventListener("mouseleave", () => {
      heroCard.style.transform = "";
    });
  }

  /* ── 3D tilt on all interactive cards ── */
  const tiltCards = document.querySelectorAll(".service-card, .founder-card, .project-card");

  tiltCards.forEach((card) => {
    card.addEventListener("mousemove", (event) => {
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `perspective(600px) rotateX(${y * -6}deg) rotateY(${x * 8}deg) translateZ(8px) scale(1.02)`;
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = "";
    });
  });

  /* ── Magnetic buttons ── */
  const buttons = document.querySelectorAll(".button");

  buttons.forEach((btn) => {
    btn.addEventListener("mousemove", (event) => {
      const rect = btn.getBoundingClientRect();
      const x = event.clientX - rect.left - rect.width / 2;
      const y = event.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * 0.15}px, ${y * 0.25}px) scale(1.04)`;
    });

    btn.addEventListener("mouseleave", () => {
      btn.style.transform = "";
    });
  });

  /* ── Parallax on scroll for orbs ── */
  const orbs = document.querySelectorAll(".orb");
  const speeds = [0.04, -0.03, 0.05];

  let ticking = false;
  window.addEventListener("scroll", () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const scrollY = window.scrollY;
      orbs.forEach((orb, i) => {
        const speed = speeds[i] || 0.03;
        orb.style.transform = `translate3d(0, ${scrollY * speed}px, 0)`;
      });
      ticking = false;
    });
  });

  /* ── Floating particles ── */
  const canvas = document.createElement("canvas");
  canvas.id = "particles-canvas";
  document.body.prepend(canvas);
  const ctx = canvas.getContext("2d");

  let particles = [];
  const PARTICLE_COUNT = 50;

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function initParticles() {
    particles = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 1.5 + 0.5,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        opacity: Math.random() * 0.5 + 0.1,
      });
    }
  }

  function drawParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0) p.x = canvas.width;
      if (p.x > canvas.width) p.x = 0;
      if (p.y < 0) p.y = canvas.height;
      if (p.y > canvas.height) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(128, 255, 207, ${p.opacity})`;
      ctx.fill();
    });

    // Draw connections between nearby particles
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(128, 255, 207, ${0.06 * (1 - dist / 120)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(drawParticles);
  }

  resizeCanvas();
  initParticles();
  drawParticles();
  window.addEventListener("resize", () => {
    resizeCanvas();
    initParticles();
  });

  /* ── Smooth header parallax (slight shrink on scroll) ── */
  const header = document.querySelector(".site-header");
  if (header) {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 60) {
        header.style.backdropFilter = "blur(24px)";
        header.style.background = "rgba(6, 9, 20, 0.75)";
      } else {
        header.style.backdropFilter = "blur(18px)";
        header.style.background = "rgba(6, 9, 20, 0.5)";
      }
    });
  }

  /* ── Typewriter effect on hero eyebrow ── */
  const eyebrow = document.querySelector(".hero-copy .eyebrow");
  if (eyebrow) {
    const text = eyebrow.textContent;
    eyebrow.textContent = "";
    eyebrow.style.borderRight = "2px solid var(--accent)";
    let charIndex = 0;

    function typeChar() {
      if (charIndex < text.length) {
        eyebrow.textContent += text[charIndex];
        charIndex++;
        setTimeout(typeChar, 50 + Math.random() * 30);
      } else {
        setTimeout(() => {
          eyebrow.style.borderRight = "none";
        }, 600);
      }
    }

    // Start after a brief delay
    setTimeout(typeChar, 400);
  }
}
