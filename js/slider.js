/* =============================================
   AMRUTTULYA – Slider JavaScript (Swiper.js)
   ============================================= */

document.addEventListener("DOMContentLoaded", () => {
  if (!window.Swiper) return;

  // ---- Testimonials Swiper ----
  const testimonialEl = document.querySelector(".testimonialSwiper");
  if (testimonialEl) {
    new Swiper(".testimonialSwiper", {
      loop: true,
      slidesPerView: 1,
      spaceBetween: 24,
      speed: 600,
      autoplay: {
        delay: 4000,
        disableOnInteraction: false,
        pauseOnMouseEnter: true,
      },
      pagination: {
        el: ".swiper-pagination",
        clickable: true,
      },
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
      breakpoints: {
        640: {
          slidesPerView: 1,
          spaceBetween: 20,
        },
        768: {
          slidesPerView: 2,
          spaceBetween: 24,
        },
        1024: {
          slidesPerView: 3,
          spaceBetween: 28,
        },
      },
      effect: "slide",
    });
  }

  // ---- Menu Swiper (for menu.html) ----
  const menuSwiper = document.querySelector(".menuSwiper");
  if (menuSwiper) {
    new Swiper(".menuSwiper", {
      loop: true,
      slidesPerView: 1,
      spaceBetween: 20,
      autoplay: {
        delay: 3500,
        disableOnInteraction: false,
      },
      pagination: {
        el: ".menu-swiper-pagination",
        clickable: true,
      },
      breakpoints: {
        640: { slidesPerView: 2 },
        900: { slidesPerView: 3 },
      },
    });
  }

  // ---- Gallery Swiper (for gallery.html) ----
  const gallerySwiper = document.querySelector(".gallerySwiper");
  if (gallerySwiper) {
    new Swiper(".gallerySwiper", {
      loop: true,
      slidesPerView: 1,
      spaceBetween: 16,
      speed: 500,
      autoplay: {
        delay: 3000,
        disableOnInteraction: false,
      },
      pagination: {
        el: ".gallery-swiper-pagination",
        clickable: true,
      },
      navigation: {
        nextEl: ".gallery-next",
        prevEl: ".gallery-prev",
      },
      breakpoints: {
        640: { slidesPerView: 2 },
        1024: { slidesPerView: 3 },
      },
    });
  }
});
