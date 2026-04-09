const header = document.querySelector(".site-header");
const menuToggle = document.getElementById("menuToggle");
const siteMenu = document.getElementById("siteMenu");
const navLinks = [...document.querySelectorAll(".site-nav a[href^='#']")];
const anchorLinks = [...document.querySelectorAll("a[href^='#']")];
const sections = [...document.querySelectorAll("main section[id]")];
const revealItems = document.querySelectorAll(".reveal");
const heroPanel = document.querySelector(".hero-panel");

if ("scrollRestoration" in history) {
  history.scrollRestoration = "manual";
}

if (!window.location.hash) {
  window.scrollTo({ top: 0, left: 0, behavior: "auto" });
}

function updateHeaderState() {
  header.classList.toggle("scrolled", window.scrollY > 14);
}

function closeMenu() {
  menuToggle.setAttribute("aria-expanded", "false");
  siteMenu.classList.remove("is-open");
}

function toggleMenu() {
  const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isExpanded));
  siteMenu.classList.toggle("is-open", !isExpanded);
}

function scrollToAnchor(event) {
  const href = event.currentTarget.getAttribute("href");
  if (!href || href === "#") {
    return;
  }

  const target = document.querySelector(href);
  if (!target) {
    return;
  }

  event.preventDefault();

  if (href === "#top") {
    window.scrollTo({ top: 0, behavior: "smooth" });
    return;
  }

  const headerOffset = header ? header.offsetHeight + 18 : 0;
  const top = target.getBoundingClientRect().top + window.scrollY - headerOffset;
  window.scrollTo({ top, behavior: "smooth" });
}

function updateActiveSection() {
  const checkpoint = window.scrollY + 140;

  sections.forEach((section) => {
    const isActive =
      checkpoint >= section.offsetTop &&
      checkpoint < section.offsetTop + section.offsetHeight;

    navLinks.forEach((link) => {
      link.classList.toggle("is-active", link.getAttribute("href") === `#${section.id}` && isActive);
    });
  });
}

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.14,
  }
);

revealItems.forEach((item) => revealObserver.observe(item));

if (heroPanel) {
  heroPanel.addEventListener("pointermove", (event) => {
    const rect = heroPanel.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;
    const rotateY = (x - 0.5) * 8;
    const rotateX = (0.5 - y) * 8;

    heroPanel.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  });

  heroPanel.addEventListener("pointerleave", () => {
    heroPanel.style.transform = "rotateX(0deg) rotateY(0deg)";
  });
}

menuToggle?.addEventListener("click", toggleMenu);
navLinks.forEach((link) => link.addEventListener("click", closeMenu));
anchorLinks.forEach((link) => link.addEventListener("click", scrollToAnchor));
window.addEventListener("scroll", updateHeaderState, { passive: true });
window.addEventListener("scroll", updateActiveSection, { passive: true });

updateHeaderState();
updateActiveSection();
