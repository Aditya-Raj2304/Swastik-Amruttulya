/* =============================================
   Swastik AMRUTTULYA - Forms JavaScript
   ============================================= */

document.addEventListener("DOMContentLoaded", () => {
  const startedAt = Date.now();
  const whatsappNumber = "919288307759";

  const validateMobile = (mobile) => {
    const cleaned = mobile.replace(/[\s\-+]/g, "");
    return /^[0-9]{10}$/.test(cleaned) || /^91[0-9]{10}$/.test(cleaned);
  };

  const validateEmail = (email) => {
    if (!email) return true;
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const setFieldState = (field, isValid) => {
    if (!field) return;
    field.setAttribute("aria-invalid", String(!isValid));
  };

  const showFormError = (el, message) => {
    if (!el) return;
    el.textContent = message;
    el.setAttribute("role", "alert");
    el.style.display = "flex";
    window.setTimeout(() => {
      el.style.display = "none";
    }, 5000);
  };

  const showFormSuccess = (el, message) => {
    if (!el) return;
    el.textContent = message;
    el.setAttribute("role", "status");
    el.style.display = "flex";
    window.setTimeout(() => {
      el.style.display = "none";
    }, 6000);
  };

  const setLoading = (button, isLoading, loadingText) => {
    if (!button) return;
    if (isLoading) {
      button.dataset.originalText = button.innerHTML;
      button.innerHTML = `<i class="fas fa-spinner fa-spin"></i> ${loadingText}`;
      button.disabled = true;
      button.style.opacity = "0.82";
    } else {
      button.innerHTML = button.dataset.originalText || button.innerHTML;
      button.disabled = false;
      button.style.opacity = "1";
    }
  };

  const saveFormSubmission = (data) => {
    try {
      const existing = JSON.parse(
        window.localStorage.getItem("swastika_submissions") || "[]",
      );
      existing.push(data);
      window.localStorage.setItem(
        "swastika_submissions",
        JSON.stringify(existing),
      );
    } catch {
      // Local storage is optional; form routing still works without it.
    }
  };

  const openWhatsApp = (message) => {
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank", "noopener");
  };

  const isLikelySpam = (form) => {
    const honeypot = form.querySelector('[name="website"]');
    return Boolean(honeypot?.value) || Date.now() - startedAt < 900;
  };

  const addHoneypot = (form) => {
    if (form.querySelector('[name="website"]')) return;
    const field = document.createElement("input");
    field.type = "text";
    field.name = "website";
    field.tabIndex = -1;
    field.autocomplete = "off";
    field.setAttribute("aria-hidden", "true");
    field.style.cssText =
      "position:absolute;left:0;top:0;width:1px;height:1px;opacity:0;clip:rect(0 0 0 0);clip-path:inset(50%);pointer-events:none;";
    form.appendChild(field);
  };

  const wireContactForm = (form) => {
    addHoneypot(form);

    form.addEventListener("submit", async (event) => {
      event.preventDefault();

      const fields = {
        name: form.querySelector("#full-name"),
        mobile: form.querySelector("#mobile"),
        email: form.querySelector("#email"),
        city: form.querySelector("#city"),
        message: form.querySelector("#message"),
      };
      const submitBtn = form.querySelector('button[type="submit"]');
      const successMsg = document.getElementById("form-success");
      const errorMsg = document.getElementById("form-error");

      const payload = {
        id: Date.now(),
        type: "contact",
        fullName: fields.name?.value.trim() || "",
        mobile: fields.mobile?.value.trim() || "",
        email: fields.email?.value.trim() || "",
        city: fields.city?.value.trim() || "",
        message: fields.message?.value.trim() || "",
        timestamp: new Date().toISOString(),
      };

      const requiredValid =
        payload.fullName && payload.mobile && payload.city && payload.message;
      setFieldState(fields.name, Boolean(payload.fullName));
      setFieldState(fields.mobile, validateMobile(payload.mobile));
      setFieldState(fields.email, validateEmail(payload.email));
      setFieldState(fields.city, Boolean(payload.city));
      setFieldState(fields.message, Boolean(payload.message));

      if (isLikelySpam(form)) {
        showFormError(errorMsg, "Please wait a moment and try again.");
        return;
      }

      if (!requiredValid) {
        showFormError(errorMsg, "Please fill in all required fields.");
        return;
      }

      if (!validateMobile(payload.mobile)) {
        showFormError(errorMsg, "Please enter a valid 10-digit mobile number.");
        return;
      }

      if (!validateEmail(payload.email)) {
        showFormError(errorMsg, "Please enter a valid email address.");
        return;
      }

      setLoading(submitBtn, true, "Sending...");
      openWhatsApp(
        `*New Message - Swastik Amruttulya*\n\n` +
          `*Name:* ${payload.fullName}\n` +
          `*Mobile:* ${payload.mobile}\n` +
          `*City:* ${payload.city}\n` +
          `*Email:* ${payload.email || "N/A"}\n\n` +
          `*Message:*\n${payload.message}`,
      );

      await new Promise((resolve) => window.setTimeout(resolve, 500));
      saveFormSubmission(payload);
      form.reset();
      setLoading(submitBtn, false);
      if (errorMsg) errorMsg.style.display = "none";
      showFormSuccess(
        successMsg,
        "Thank you. Your message is ready on WhatsApp.",
      );
    });
  };

  const wireFranchiseForm = (form) => {
    addHoneypot(form);

    form.addEventListener("submit", async (event) => {
      event.preventDefault();

      const fields = {
        name: form.querySelector("#f-name"),
        mobile: form.querySelector("#f-mobile"),
        email: form.querySelector("#f-email"),
        city: form.querySelector("#f-city"),
        investment: form.querySelector("#f-investment"),
        message: form.querySelector("#f-message"),
      };
      const submitBtn = form.querySelector('button[type="submit"]');
      const successMsg = document.getElementById("franchise-form-success");
      const errorMsg = document.getElementById("franchise-form-error");

      const payload = {
        id: Date.now(),
        type: "franchise",
        fullName: fields.name?.value.trim() || "",
        mobile: fields.mobile?.value.trim() || "",
        email: fields.email?.value.trim() || "",
        city: fields.city?.value.trim() || "",
        investment: fields.investment?.value || "",
        message: fields.message?.value.trim() || "",
        timestamp: new Date().toISOString(),
      };

      setFieldState(fields.name, Boolean(payload.fullName));
      setFieldState(fields.mobile, validateMobile(payload.mobile));
      setFieldState(fields.email, validateEmail(payload.email));
      setFieldState(fields.city, Boolean(payload.city));

      if (isLikelySpam(form)) {
        showFormError(errorMsg, "Please wait a moment and try again.");
        return;
      }

      if (!payload.fullName || !payload.mobile || !payload.city) {
        showFormError(errorMsg, "Please fill in Name, Mobile and City.");
        return;
      }

      if (!validateMobile(payload.mobile)) {
        showFormError(errorMsg, "Please enter a valid 10-digit mobile number.");
        return;
      }

      if (!validateEmail(payload.email)) {
        showFormError(errorMsg, "Please enter a valid email address.");
        return;
      }

      setLoading(submitBtn, true, "Submitting...");
      openWhatsApp(
        `*New Franchise Application - Swastik Amruttulya*\n\n` +
          `*Name:* ${payload.fullName}\n` +
          `*Mobile:* ${payload.mobile}\n` +
          `*Email:* ${payload.email || "N/A"}\n` +
          `*City / Location:* ${payload.city}\n` +
          `*Investment:* ${payload.investment || "N/A"}\n\n` +
          `*Message:*\n${payload.message || "No message"}`,
      );

      await new Promise((resolve) => window.setTimeout(resolve, 500));
      saveFormSubmission(payload);
      form.reset();
      setLoading(submitBtn, false);
      if (errorMsg) errorMsg.style.display = "none";
      showFormSuccess(
        successMsg,
        "Thank you. Your franchise inquiry is ready on WhatsApp.",
      );
    });
  };

  const contactForm = document.getElementById("contact-form");
  if (contactForm) wireContactForm(contactForm);

  const franchiseForm = document.getElementById("franchise-form");
  if (franchiseForm) wireFranchiseForm(franchiseForm);

  document.querySelectorAll('input[type="tel"]').forEach((input) => {
    input.addEventListener("input", () => {
      input.value = input.value.replace(/[^0-9+\-\s]/g, "");
    });
  });

  document
    .querySelectorAll(
      ".form-group input, .form-group textarea, .form-group select",
    )
    .forEach((el) => {
      const group = el.closest(".form-group");
      if (!group) return;

      el.addEventListener("focus", () => group.classList.add("focused"));
      el.addEventListener("blur", () => {
        group.classList.remove("focused");
        group.classList.toggle("filled", Boolean(el.value.trim()));
      });
    });
});
