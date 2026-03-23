/* =========================================================
   Noreen Barrera — Portfolio Site (vanilla JS)
   - Mobile nav toggle
   - Active nav link
   - Smooth scrolling (anchors)
   - Scroll-to-top button
   - Reveal-on-scroll animations
   ========================================================= */

function getPathFileName() {
  const path = window.location.pathname;
  const file = path.split("/").pop() || "index.html";
  return file;
}

const THEME_KEY = "portfolio_theme";

function getPreferredTheme() {
  const stored = localStorage.getItem(THEME_KEY);
  if (stored === "light" || stored === "dark") return stored;
  const prefersLight = window.matchMedia?.("(prefers-color-scheme: light)")?.matches;
  return prefersLight ? "light" : "dark";
}

function applyTheme(theme) {
  const root = document.documentElement;
  const isLight = theme === "light";
  root.classList.toggle("theme-light", isLight);
  localStorage.setItem(THEME_KEY, theme);

  const btn = document.querySelector("[data-theme-toggle]");
  if (btn) {
    btn.setAttribute("aria-pressed", String(isLight));
    btn.setAttribute("aria-label", isLight ? "Switch to dark mode" : "Switch to light mode");
  }
}

function setupThemeToggle() {
  applyTheme(getPreferredTheme());

  const btn = document.querySelector("[data-theme-toggle]");
  if (!btn) return;

  btn.addEventListener("click", () => {
    const isLight = document.documentElement.classList.contains("theme-light");
    applyTheme(isLight ? "dark" : "light");
  });
}

function setActiveNavLink() {
  const current = getPathFileName();
  const links = document.querySelectorAll("[data-nav] a[href]");

  links.forEach((a) => {
    const href = a.getAttribute("href");
    if (!href || href.startsWith("#")) return;

    const file = href.split("/").pop();
    const isActive = file === current || (current === "" && file === "index.html");
    if (isActive) a.setAttribute("aria-current", "page");
    else a.removeAttribute("aria-current");
  });
}

function setupMobileNav() {
  const header = document.querySelector("[data-header]");
  const toggle = document.querySelector("[data-nav-toggle]");
  const nav = document.querySelector("[data-nav]");

  if (!header || !toggle || !nav) return;

  const closeNav = () => {
    header.classList.remove("nav-open");
    toggle.setAttribute("aria-expanded", "false");
  };

  const openNav = () => {
    header.classList.add("nav-open");
    toggle.setAttribute("aria-expanded", "true");
  };

  toggle.addEventListener("click", () => {
    const isOpen = header.classList.contains("nav-open");
    if (isOpen) closeNav();
    else openNav();
  });

  // Close on link click (mobile) or outside click
  nav.addEventListener("click", (e) => {
    const target = e.target;
    if (!(target instanceof Element)) return;
    const link = target.closest("a");
    if (link) closeNav();
  });

  document.addEventListener("click", (e) => {
    const target = e.target;
    if (!(target instanceof Element)) return;
    if (header.contains(target)) return;
    closeNav();
  });

  // Close on Escape
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeNav();
  });

  // Close if switching to desktop width
  window.addEventListener("resize", () => {
    if (window.innerWidth > 860) closeNav();
  });
}

function setupSmoothScrolling() {
  document.addEventListener("click", (e) => {
    const target = e.target;
    if (!(target instanceof Element)) return;

    const a = target.closest("a[href^='#']");
    if (!a) return;

    const href = a.getAttribute("href") || "";
    const id = href.slice(1);
    if (!id) return;

    const el = document.getElementById(id);
    if (!el) return;

    e.preventDefault();

    const headerH = document.querySelector("[data-header]")?.getBoundingClientRect().height ?? 0;
    const top = el.getBoundingClientRect().top + window.scrollY - headerH - 12;

    window.scrollTo({ top, behavior: "smooth" });
  });
}

function setupScrollToTop() {
  const btn = document.querySelector("[data-to-top]");
  if (!btn) return;

  const toggle = () => {
    const show = window.scrollY > 500;
    btn.classList.toggle("is-visible", show);
  };

  toggle();
  window.addEventListener("scroll", toggle, { passive: true });

  btn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

function setupRevealOnScroll() {
  const items = document.querySelectorAll(".reveal");
  if (items.length === 0) return;

  const prefersReducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
  if (prefersReducedMotion) {
    items.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  items.forEach((el) => io.observe(el));
}

document.addEventListener("DOMContentLoaded", () => {
  setupThemeToggle();
  setActiveNavLink();
  setupMobileNav();
  setupSmoothScrolling();
  setupScrollToTop();
  setupRevealOnScroll();
});

