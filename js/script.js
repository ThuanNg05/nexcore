/**
 * script.js — NexCore Release Site
 * Vanilla JS enhancements: nav scroll, version injection,
 * smooth scroll, copy checksum, reveal animations.
 */

/* ═══════════════════════════════════════════
   1. RELEASE DATA
   ▸ Edit this object when releasing a new version.
   ▸ All dynamic content across the page pulls from here.
═══════════════════════════════════════════ */
const RELEASE = {
  version:     "v1.2.0",
  date:        "March 1, 2026",
  dateShort:   "March 2026",
  checksum:    "a3f2c1d9e8b74f5c2a6d3e9f1b0c8d7e4a2f5c1d9e8b74f6e2a1d0c9b3f5e7a",
};

/* ═══════════════════════════════════════════
   2. INJECT RELEASE DATA
   ▸ Populates all version/date elements on load.
═══════════════════════════════════════════ */
function injectReleaseData() {
  const map = {
    "hero-version":  RELEASE.version,
    "hero-date":     `Updated: ${RELEASE.dateShort}`,
    "dl-version":    RELEASE.version,
    "dl-date":       RELEASE.date,
    "checksum-hash": RELEASE.checksum,
    "footer-year":   new Date().getFullYear(),
  };

  for (const [id, value] of Object.entries(map)) {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
  }

  // Also update hero download button label
  const heroBtn = document.getElementById("hero-download-btn");
  if (heroBtn) {
    // Replace text node (keep the SVG icon intact)
    const textNode = [...heroBtn.childNodes].find(n => n.nodeType === 3 && n.textContent.trim());
    if (textNode) textNode.textContent = ` Download ${RELEASE.version}`;
  }
}

/* ═══════════════════════════════════════════
   3. STICKY NAV — scroll-aware style
═══════════════════════════════════════════ */
function initNav() {
  const nav = document.getElementById("nav");
  if (!nav) return;

  const handler = () => {
    if (window.scrollY > 20) {
      nav.classList.add("nav--scrolled");
    } else {
      nav.classList.remove("nav--scrolled");
    }
  };

  window.addEventListener("scroll", handler, { passive: true });
  handler(); // Run once on load
}

/* ═══════════════════════════════════════════
   4. SMOOTH SCROLL HELPERS
═══════════════════════════════════════════ */
/**
 * Scroll smoothly to the download section.
 * Called by the Hero CTA button.
 */
function scrollToDownload() {
  const target = document.getElementById("download");
  if (!target) return;
  target.scrollIntoView({ behavior: "smooth", block: "start" });
}

/**
 * Generic smooth-scroll for nav links.
 * Intercepts anchor href="#section-id" clicks.
 */
function initSmoothScrollLinks() {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener("click", e => {
      const id = link.getAttribute("href").slice(1);
      const target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
}

/* ═══════════════════════════════════════════
   5. COPY CHECKSUM
═══════════════════════════════════════════ */
function copyChecksum() {
  const hash = RELEASE.checksum;

  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(hash)
      .then(() => showToast("Checksum copied!"))
      .catch(() => fallbackCopy(hash));
  } else {
    fallbackCopy(hash);
  }
}

function fallbackCopy(text) {
  const ta = document.createElement("textarea");
  ta.value = text;
  ta.style.cssText = "position:fixed;opacity:0;top:0;left:0";
  document.body.appendChild(ta);
  ta.focus();
  ta.select();
  try {
    document.execCommand("copy");
    showToast("Checksum copied!");
  } catch {
    showToast("Copy failed — select manually.");
  }
  document.body.removeChild(ta);
}

/* ═══════════════════════════════════════════
   6. TOAST NOTIFICATION
═══════════════════════════════════════════ */
let toastTimer = null;

function showToast(message) {
  // Reuse existing toast or create new one
  let toast = document.getElementById("toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "toast";
    toast.className = "toast";
    document.body.appendChild(toast);
  }

  toast.textContent = message;
  toast.classList.add("toast--show");

  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.remove("toast--show");
  }, 2500);
}

/* ═══════════════════════════════════════════
   7. SCROLL-REVEAL (Intersection Observer)
   ▸ Fades in feature cards and sections as
     they enter the viewport.
═══════════════════════════════════════════ */
function initScrollReveal() {
  // Only if browser supports IntersectionObserver
  if (!("IntersectionObserver" in window)) return;

  const style = document.createElement("style");
  style.textContent = `
    .reveal {
      opacity: 0;
      transform: translateY(24px);
      transition: opacity 0.6s cubic-bezier(0.16,1,0.3,1),
                  transform 0.6s cubic-bezier(0.16,1,0.3,1);
    }
    .reveal.revealed {
      opacity: 1;
      transform: translateY(0);
    }
  `;
  document.head.appendChild(style);

  // Target elements to animate
  const targets = document.querySelectorAll(
    ".feature-card, .download__panel, .about__card, .contact-link, .section-header"
  );

  targets.forEach((el, i) => {
    el.classList.add("reveal");
    // Stagger feature cards
    if (el.classList.contains("feature-card")) {
      el.style.transitionDelay = `${i * 0.08}s`;
    }
  });

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("revealed");
          observer.unobserve(entry.target); // Animate once
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );

  targets.forEach(el => observer.observe(el));
}

/* ═══════════════════════════════════════════
   8. DOWNLOAD BUTTON — OS DETECTION
   ▸ Highlights the button matching the user's OS.
═══════════════════════════════════════════ */
function highlightOsButton() {
  const ua = navigator.userAgent.toLowerCase();
  let detectedOs = null;

  if (ua.includes("win"))   detectedOs = "windows";
  else if (ua.includes("mac")) detectedOs = "macos";
  else if (ua.includes("linux")) detectedOs = "linux";

  if (!detectedOs) return;

  const btn = document.querySelector(`.btn--download[data-os="${detectedOs}"]`);
  if (!btn) return;

  // Visual highlight: accent border + label
  btn.style.borderColor = "var(--accent)";
  btn.style.color = "var(--accent)";
  btn.style.background = "var(--accent-dim)";

  // Append a small "Recommended" chip
  const chip = document.createElement("span");
  chip.textContent = "Recommended";
  chip.style.cssText = `
    margin-left: auto;
    font-size: 0.65rem;
    background: var(--accent-dim);
    color: var(--accent);
    padding: 0.15rem 0.4rem;
    border-radius: 4px;
    font-family: var(--font-mono, monospace);
    letter-spacing: 0.04em;
    text-transform: uppercase;
    pointer-events: none;
  `;
  btn.appendChild(chip);
}

/* ═══════════════════════════════════════════
   9. INIT — DOMContentLoaded
═══════════════════════════════════════════ */
document.addEventListener("DOMContentLoaded", () => {
  injectReleaseData();
  initNav();
  initSmoothScrollLinks();
  initScrollReveal();
  highlightOsButton();
});

// Expose scrollToDownload globally (called from HTML onclick)
window.scrollToDownload = scrollToDownload;
window.copyChecksum     = copyChecksum;
