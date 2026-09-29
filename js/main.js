(function () {
  "use strict";

  document.documentElement.classList.add("js");

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

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var video = document.querySelector("[data-hero-video]");
  var pauseBtn = document.querySelector("[data-hero-pause]");
  if (video && reduceMotion) {
    video.removeAttribute("autoplay");
    video.pause();
  }
  if (video && pauseBtn) {
    pauseBtn.addEventListener("click", function () {
      if (video.paused) {
        video.play();
        pauseBtn.textContent = "Pause";
        pauseBtn.setAttribute("aria-pressed", "false");
      } else {
        video.pause();
        pauseBtn.textContent = "Lecture";
        pauseBtn.setAttribute("aria-pressed", "true");
      }
    });
  }

  var revealNodes = document.querySelectorAll(".reveal");
  if (revealNodes.length && "IntersectionObserver" in window && !reduceMotion) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-in");
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.15 });
    revealNodes.forEach(function (node) { observer.observe(node); });
  } else {
    revealNodes.forEach(function (node) { node.classList.add("is-in"); });
  }

  var form = document.querySelector("[data-contact-form]");
  if (form) {
    var params = new URLSearchParams(window.location.search);
    var asked = params.get("service");
    var serviceField = form.querySelector("#service");
    if (asked && serviceField) {
      Array.prototype.forEach.call(serviceField.options, function (option) {
        if (option.value === asked || option.text === asked) serviceField.value = option.value;
      });
    }
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
