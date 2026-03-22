const revealItems = document.querySelectorAll(".reveal");
const sectionTargets = document.querySelectorAll("main > section[id]");
const stateLinks = document.querySelectorAll(".site-nav a, .brand");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const revealObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.18,
  }
);

revealItems.forEach((item, index) => {
  item.style.transitionDelay = `${index * 70}ms`;
  revealObserver.observe(item);
});

const navObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      }

      const sectionId = entry.target.id;
      stateLinks.forEach((link) => {
        link.classList.toggle("active", link.getAttribute("href") === `#${sectionId}`);
      });
    });
  },
  {
    threshold: 0.45,
  }
);

sectionTargets.forEach((section) => {
  navObserver.observe(section);
});

const visual = document.querySelector(".hero-visual");
const card = document.querySelector(".dashboard-card");

if (visual && card && !reducedMotion) {
  visual.addEventListener("mousemove", (event) => {
    const rect = visual.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;

    card.style.transform = `rotateX(${y * -8}deg) rotateY(${x * 10}deg) translateY(-6px)`;
  });

  visual.addEventListener("mouseleave", () => {
    card.style.transform = "";
  });
}
