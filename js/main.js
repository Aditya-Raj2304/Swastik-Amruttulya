/* =============================================
   SWASTIKA AMRUTTULYA - Main JavaScript
   ============================================= */

document.addEventListener("DOMContentLoaded", () => {
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  if (window.AOS) {
    AOS.init({
      duration: prefersReducedMotion ? 0 : 700,
      easing: "ease-out-cubic",
      once: true,
      offset: 60,
      delay: 0,
      disable: prefersReducedMotion,
    });
  }

  // ---- Page loading / skeleton state ----
  const finishLoading = () => {
    document.body.classList.remove("site-loading");
    document.body.classList.add("site-loaded");
  };

  if (document.readyState === "complete") {
    window.setTimeout(finishLoading, 120);
  } else {
    window.addEventListener(
      "load",
      () => window.setTimeout(finishLoading, 120),
      {
        once: true,
      },
    );
    window.setTimeout(finishLoading, 2400);
  }

  // ---- Image loading hints ----
  document.querySelectorAll("img").forEach((img, index) => {
    if (!img.hasAttribute("decoding")) img.setAttribute("decoding", "async");
    if (index === 0 || img.classList.contains("hero-img")) {
      img.setAttribute("loading", "eager");
      img.setAttribute("fetchpriority", "high");
    } else if (!img.hasAttribute("loading")) {
      img.setAttribute("loading", "eager");
    }
  });

  // ---- Scroll progress bar ----
  let progressBar = document.querySelector(".scroll-progress");
  if (!progressBar) {
    progressBar = document.createElement("div");
    progressBar.className = "scroll-progress";
    document.body.prepend(progressBar);
  }

  const navbar = document.getElementById("navbar");
  const scrollTopBtn = document.getElementById("scroll-top");
  const heroBg = document.querySelector(".hero-bg");
  let ticking = false;

  const updateOnScroll = () => {
    const scrollY = window.scrollY || document.documentElement.scrollTop;

    if (navbar) {
      navbar.classList.toggle("scrolled", scrollY > 60);
    }

    if (scrollTopBtn) {
      scrollTopBtn.classList.toggle("visible", scrollY > 400);
    }

    const totalHeight =
      document.documentElement.scrollHeight - window.innerHeight;
    progressBar.style.width =
      totalHeight > 0
        ? `${Math.min((scrollY / totalHeight) * 100, 100)}%`
        : "0%";

    if (heroBg && !prefersReducedMotion && scrollY < window.innerHeight) {
      heroBg.style.setProperty("--hero-parallax", `${scrollY * 0.3}px`);
    }

    ticking = false;
  };

  const requestScrollUpdate = () => {
    if (!ticking) {
      window.requestAnimationFrame(updateOnScroll);
      ticking = true;
    }
  };

  updateOnScroll();
  window.addEventListener("scroll", requestScrollUpdate, { passive: true });

  if (scrollTopBtn) {
    scrollTopBtn.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: prefersReducedMotion ? "auto" : "smooth",
      });
    });
  }

  // ---- Mobile navigation ----
  const hamburger = document.getElementById("hamburger");
  const navLinks = document.getElementById("nav-links");
  const navOverlay = document.getElementById("nav-overlay");

  const setMenuOpen = (open) => {
    if (!hamburger || !navLinks || !navOverlay) return;
    hamburger.classList.toggle("active", open);
    hamburger.setAttribute("aria-expanded", String(open));
    navLinks.classList.toggle("open", open);
    navOverlay.classList.toggle("active", open);
    document.body.classList.toggle("menu-open", open);
  };

  if (hamburger && navLinks && navOverlay) {
    hamburger.setAttribute("aria-expanded", "false");
    hamburger.addEventListener("click", () => {
      setMenuOpen(!hamburger.classList.contains("active"));
    });
    navOverlay.addEventListener("click", () => setMenuOpen(false));
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") setMenuOpen(false);
    });
    window.addEventListener("resize", () => {
      if (window.innerWidth > 1023) setMenuOpen(false);
    });
  }

  document.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", () => setMenuOpen(false));
  });

  // ---- Smooth scroll for same-page anchor links ----
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (event) => {
      const href = anchor.getAttribute("href");
      if (!href || href === "#") return;
      const target = document.querySelector(href);
      if (!target) return;

      event.preventDefault();
      const targetPosition =
        target.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({
        top: targetPosition,
        behavior: prefersReducedMotion ? "auto" : "smooth",
      });
    });
  });

  // ---- Tea leaves floating animation ----
  const leavesContainer = document.getElementById("tea-leaves");
  const leafSymbols = ["🍃", "🌿", "☕", "🍂"];

  if (leavesContainer && !prefersReducedMotion) {
    const createLeaf = () => {
      const leaf = document.createElement("div");
      leaf.className = "tea-leaf";
      leaf.textContent =
        leafSymbols[Math.floor(Math.random() * leafSymbols.length)];
      leaf.style.left = `${Math.random() * 100}%`;
      leaf.style.animationDuration = `${8 + Math.random() * 12}s`;
      leaf.style.animationDelay = `${Math.random() * 5}s`;
      leaf.style.fontSize = `${0.8 + Math.random() * 1.2}rem`;
      leavesContainer.appendChild(leaf);
      window.setTimeout(() => leaf.remove(), 20000);
    };

    window.setInterval(createLeaf, 3000);
    for (let i = 0; i < 4; i += 1) {
      window.setTimeout(createLeaf, i * 700);
    }
  }

  // ---- Lightbox gallery ----
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightbox-img");
  const lightboxClose = document.getElementById("lightbox-close");
  const lightboxPrev = document.getElementById("lightbox-prev");
  const lightboxNext = document.getElementById("lightbox-next");
  const galleryImages = [];
  let currentImgIndex = 0;

  const showImageAt = (index) => {
    if (!lightboxImg || galleryImages.length === 0) return;
    currentImgIndex = (index + galleryImages.length) % galleryImages.length;
    const img = galleryImages[currentImgIndex];
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
  };

  const openLightbox = (index) => {
    if (!lightbox || !lightboxImg || galleryImages.length === 0) return;
    showImageAt(index);
    lightbox.classList.add("active");
    document.body.classList.add("lightbox-open");
  };

  const closeLightbox = () => {
    if (!lightbox) return;
    lightbox.classList.remove("active");
    document.body.classList.remove("lightbox-open");
  };

  document.querySelectorAll(".gallery-item").forEach((item, index) => {
    const img = item.querySelector("img");
    if (!img) return;
    galleryImages.push({
      src: img.currentSrc || img.src,
      alt: img.alt || "Gallery image",
    });
    item.setAttribute("role", "button");
    item.setAttribute("tabindex", "0");
    item.addEventListener("click", () => openLightbox(index));
    item.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openLightbox(index);
      }
    });
  });

  lightboxClose?.addEventListener("click", closeLightbox);
  lightboxNext?.addEventListener("click", () =>
    showImageAt(currentImgIndex + 1),
  );
  lightboxPrev?.addEventListener("click", () =>
    showImageAt(currentImgIndex - 1),
  );

  lightbox?.addEventListener("click", (event) => {
    if (event.target === lightbox) closeLightbox();
  });

  document.addEventListener("keydown", (event) => {
    if (!lightbox?.classList.contains("active")) return;
    if (event.key === "Escape") closeLightbox();
    if (event.key === "ArrowRight") showImageAt(currentImgIndex + 1);
    if (event.key === "ArrowLeft") showImageAt(currentImgIndex - 1);
  });

  // ---- Counter animation ----
  const animateCounter = (el, target, duration = 1500) => {
    if (prefersReducedMotion) {
      el.textContent = `${target}${el.dataset.suffix || ""}`;
      return;
    }

    let start = 0;
    const step = (timestamp) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = `${Math.floor(eased * target)}${el.dataset.suffix || ""}`;
      if (progress < 1) window.requestAnimationFrame(step);
    };
    window.requestAnimationFrame(step);
  };

  if ("IntersectionObserver" in window) {
    const statObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target;
          const value = parseInt(el.dataset.value || el.textContent, 10);
          if (!Number.isNaN(value)) animateCounter(el, value);
          statObserver.unobserve(el);
        });
      },
      { threshold: 0.5 },
    );

    document.querySelectorAll(".stat-number, .fstat-number").forEach((el) => {
      const text = el.textContent.trim();
      const match = text.match(/[\d.]+/);
      if (!match) return;
      el.dataset.value = match[0];
      el.dataset.suffix = text.replace(match[0], "").trim();
      statObserver.observe(el);
    });
    fetch("version.json")
      .then((res) => res.json())
      .then((data) => {
        const v = data.version;
        document.querySelector("link[href='css/style.css']").href =
          `css/style.css?v=${v}`;
      });
  }

  // ---- Cookie notice ----
  /* const storageKey = "swastika_cookie_choice";
  const getCookieChoice = () => {
    try {
      return window.localStorage.getItem(storageKey);
    } catch {
      return null;
    }
  };

  const setCookieChoice = (value) => {
    try {
      window.localStorage.setItem(storageKey, value);
    } catch {
      // Storage may be disabled; the site still works without persistence.
    }
  };

  if (!getCookieChoice()) {
    const notice = document.createElement("div");
    notice.className = "cookie-notice";
    notice.setAttribute("role", "dialog");
    notice.setAttribute("aria-live", "polite");
    notice.innerHTML = `
      <p>
        We use essential cookies and local storage to keep forms, preferences,
        and browsing experience smooth. Read our
        <a href="privacy-policy.html">Privacy Policy</a>.
      </p>
      <div class="cookie-actions">
        <button class="btn btn-primary" type="button" data-cookie-choice="accepted">Accept</button>
        <button class="btn btn-outline" type="button" data-cookie-choice="declined">Decline</button>
      </div>
    `;
    document.body.appendChild(notice);
    window.requestAnimationFrame(() => notice.classList.add("visible"));

    notice.querySelectorAll("[data-cookie-choice]").forEach((button) => {
      button.addEventListener("click", () => {
        setCookieChoice(button.dataset.cookieChoice);
        notice.classList.remove("visible");
        window.setTimeout(() => notice.remove(), 250);
      }); 
    });
  } */
});
