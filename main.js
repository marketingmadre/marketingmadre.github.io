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

  // footer year
  document.querySelectorAll("[data-year]").forEach((el) => (el.textContent = new Date().getFullYear()));
})();
