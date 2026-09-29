(function () {
  "use strict";

  var SITE = {
    email: "contact@atoutservices29.fr",
    phoneDisplay: "",
    phoneTel: "",
    whatsapp: ""
  };

  var nav = document.querySelector("[data-nav]");
  var toggle = document.querySelector("[data-nav-toggle]");
  var year = document.querySelector("[data-year]");

  if (year) {
    year.textContent = String(new Date().getFullYear());
  }

  function setNav(open) {
    if (!nav || !toggle) return;
    nav.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    document.body.classList.toggle("nav-open", open);
  }

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      setNav(!nav.classList.contains("is-open"));
    });
    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        setNav(false);
      });
    });
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") setNav(false);
    });
  }

  var hasPhone = Boolean(SITE.phoneTel);
  document.querySelectorAll("[data-phone-wrap]").forEach(function (el) {
    el.hidden = !hasPhone;
  });
  document.querySelectorAll("[data-phone-href]").forEach(function (el) {
    if (hasPhone) el.setAttribute("href", "tel:" + SITE.phoneTel);
  });
  document.querySelectorAll("[data-phone-label]").forEach(function (el) {
    if (hasPhone) el.textContent = SITE.phoneDisplay;
  });
  document.querySelectorAll("[data-whatsapp]").forEach(function (el) {
    if (SITE.whatsapp) {
      el.hidden = false;
      el.setAttribute("href", "https://wa.me/" + SITE.whatsapp);
    } else {
      el.hidden = true;
    }
  });
  document.querySelectorAll("[data-email-href]").forEach(function (el) {
    el.setAttribute("href", "mailto:" + SITE.email);
  });
  document.querySelectorAll("[data-email-label]").forEach(function (el) {
    el.textContent = SITE.email;
  });

  var form = document.querySelector("[data-contact-form]");
  if (form) {
    form.addEventListener("submit", function (event) {
      var name = form.querySelector("#name");
      var phone = form.querySelector("#phone");
      var service = form.querySelector("#service");
      var cp = form.querySelector("#cp");
      var message = form.querySelector("#message");
      var errorBox = form.querySelector("[data-form-error]");
      var honeypot = form.querySelector("[name='botcheck']");
      var keyField = form.querySelector("[name='access_key']");

      function fail(text) {
        event.preventDefault();
        if (errorBox) {
          errorBox.hidden = false;
          errorBox.textContent = text;
        }
        return false;
      }

      if (honeypot && honeypot.value) return fail("Une erreur est survenue.");
      if (!name || name.value.trim().length < 2) return fail("Indiquez votre nom.");
      if (!phone || phone.value.replace(/\D/g, "").length < 10) {
        return fail("Indiquez un numéro de téléphone valide.");
      }
      if (!service || !service.value) return fail("Choisissez une prestation.");
      if (!cp || !/^\d{5}$/.test(cp.value.trim())) {
        return fail("Indiquez un code postal à 5 chiffres.");
      }
      if (!message || message.value.trim().length < 10) {
        return fail("Décrivez votre besoin en quelques phrases.");
      }

      var key = keyField ? keyField.value : "";
      if (!key || key.indexOf("REPLACE") === 0) {
        event.preventDefault();
        window.location.href = "merci.html";
      }
    });
  }
})();
