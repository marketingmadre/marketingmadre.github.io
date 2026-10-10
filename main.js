// Edit these two lines with your real details — every page picks them up.
const SITE = {
  email: "marketingmadre01@gmail.com",
  instagram: "imarketingmadre",
};

(function () {
  const root = document.documentElement;

  // language: Spanish by default, remembered between pages
  function setLang(lang) {
    root.lang = lang;
    try { localStorage.setItem("mm-lang", lang); } catch (e) {}
    document.querySelectorAll(".lang-toggle button").forEach((b) => {
      b.setAttribute("aria-pressed", String(b.dataset.set === lang));
    });
  }
  let saved = "es";
  try { saved = localStorage.getItem("mm-lang") || "es"; } catch (e) {}
  setLang(saved);
  document.querySelectorAll(".lang-toggle button").forEach((b) => {
    b.addEventListener("click", () => setLang(b.dataset.set));
  });

  // mobile menu
  const btn = document.querySelector(".menu-btn");
  const links = document.querySelector(".nav-links");
  if (btn && links) {
    btn.addEventListener("click", () => {
      const open = links.classList.toggle("open");
      btn.setAttribute("aria-expanded", String(open));
    });
  }

  // contact links
  document.querySelectorAll("[data-email]").forEach((a) => {
    a.href = "mailto:" + SITE.email;
    if (a.hasAttribute("data-fill")) a.textContent = SITE.email;
  });
  document.querySelectorAll("[data-instagram]").forEach((a) => {
    a.href = "https://instagram.com/" + SITE.instagram;
    a.target = "_blank";
    a.rel = "noopener";
    if (a.hasAttribute("data-fill")) a.textContent = "@" + SITE.instagram;
  });

  // testimonials: click an avatar to show that quote
  document.querySelectorAll("[data-testimonials]").forEach((box) => {
    const avatars = box.querySelectorAll(".t-avatar");
    avatars.forEach((a) => {
      a.setAttribute("aria-pressed", String(a.classList.contains("is-active")));
      if (avatars.length < 2) { a.tabIndex = -1; return; }
      a.addEventListener("click", () => {
        box.querySelectorAll("[data-t]").forEach((el) => {
          const on = el.dataset.t === a.dataset.t;
          el.classList.toggle("is-active", on);
          if (el.classList.contains("t-avatar")) el.setAttribute("aria-pressed", String(on));
          else el.setAttribute("aria-hidden", String(!on));
        });
      });
    });
  });

  // ---------- motion ----------
  const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const canObserve = "IntersectionObserver" in window && !calm;

  // header gets a soft shadow once you scroll
  const header = document.querySelector(".site-header");
  if (header) {
    const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  // headlines arrive word by word
  if (!calm) {
    document.querySelectorAll("main h1").forEach((h) => {
      let i = 0;
      (function split(node) {
        [...node.childNodes].forEach((n) => {
          if (n.nodeType !== 3) return split(n);
          const frag = document.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach((part) => {
            if (!part) return;
            if (/^\s+$/.test(part)) return frag.append(part);
            const w = document.createElement("span");
            w.className = "word";
            w.style.setProperty("--i", i++);
            w.textContent = part;
            frag.append(w);
          });
          n.replaceWith(frag);
        });
      })(h);
    });
  }

  // sections fade up as they scroll into view
  if (canObserve) {
    const sel = ".eyebrow, .rule, h2, .lead, .quote, .sub, .cta-row, .pillar, .tier, .timeline-item, .testimonials, .contact-card, .placeholder, .grid-4 > div";
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        const el = e.target;
        el.classList.add("is-in");
        io.unobserve(el);
        // once it has arrived, hand the element back to its own hover transitions
        setTimeout(() => el.classList.remove("reveal", "is-in"), 1000 + el.style.getPropertyValue("--d") * 90);
      });
    }, { rootMargin: "0px 0px -8% 0px" });
    document.querySelectorAll("main :is(" + sel + ")").forEach((el) => {
      if (el.parentElement.closest(sel)) return; // the outer block animates for it
      const hero = el.closest(".hero");
      const list = el.parentElement.matches(".grid-2, .grid-3, .grid-4, .timeline");
      const d = hero ? [...hero.querySelectorAll(sel)].indexOf(el) * 2 : list ? [...el.parentElement.children].indexOf(el) : 0;
      el.style.setProperty("--d", d);
      el.classList.add("reveal");
      io.observe(el);
    });
  }

  // numbers count up when they come into view
  document.querySelectorAll("[data-count]").forEach((el) => {
    if (!canObserve) return;
    const end = parseFloat(el.dataset.count);
    const decimals = (el.dataset.count.split(".")[1] || "").length;
    const lang = (el.closest("[data-lang]") || root).getAttribute("data-lang") || root.lang;
    const fmt = (v) => v.toLocaleString(lang, { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
    el.textContent = fmt(0);
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      const start = performance.now();
      const tick = (now) => {
        const p = Math.min((now - start) / 1600, 1);
        el.textContent = fmt(end * (1 - Math.pow(1 - p, 3)));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }, { threshold: 1 });
    io.observe(el);
  });

  // the hero arch tilts gently toward the mouse
  const arch = document.querySelector(".hero .arch");
  if (arch && !calm && window.matchMedia("(pointer: fine)").matches) {
    const hero = arch.closest(".hero");
    hero.addEventListener("pointermove", (e) => {
      const r = hero.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      arch.style.transform = `perspective(900px) rotateY(${x * 8}deg) rotateX(${y * -8}deg)`;
    });
    hero.addEventListener("pointerleave", () => (arch.style.transform = ""));
  }

  // footer year
  document.querySelectorAll("[data-year]").forEach((el) => (el.textContent = new Date().getFullYear()));
})();
