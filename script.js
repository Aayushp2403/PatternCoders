const revealItems = document.querySelectorAll(".reveal");

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.18,
  }
);

revealItems.forEach((item, index) => {
  item.style.transitionDelay = `${index * 90}ms`;
  revealObserver.observe(item);
});

const visual = document.querySelector(".hero-visual");
const card = document.querySelector(".dashboard-card");

if (visual && card && window.matchMedia("(prefers-reduced-motion: no-preference)").matches) {
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
