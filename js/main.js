(function () {
  "use strict";

  document.documentElement.classList.add("js");

  var SITE = {
    email: "contact@atoutservices29.fr",
    phoneDisplay: "06 67 96 78 81",
    phoneTel: "+33667967881",
    whatsapp: "33667967881"
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

  // ---- MAKIETA B: motion layer ----

  var header = document.querySelector(".site-header");
  var fixedCta = document.querySelector("[data-fixed-cta]");

  function onScrollB() {
    if (header) header.classList.toggle("is-stuck", window.scrollY > 12);
    if (fixedCta) fixedCta.classList.toggle("is-visible", window.scrollY > 300);
  }
  window.addEventListener("scroll", onScrollB, { passive: true });
  onScrollB();

  var words = document.querySelectorAll(".word");
  words.forEach(function (w, i) {
    setTimeout(function () { w.classList.add("in"); }, 90 + i * 70);
  });

  var rvNodes = document.querySelectorAll(".rv");
  if (rvNodes.length) {
    if (reduceMotion || !("IntersectionObserver" in window)) {
      rvNodes.forEach(function (n) { n.classList.add("in"); });
    } else {
      var rvObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("in");
          rvObserver.unobserve(entry.target);
        });
      }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
      rvNodes.forEach(function (n) { rvObserver.observe(n); });
    }
  }

  var stackCards = document.querySelectorAll(".stack-card");
  if (!reduceMotion && stackCards.length && window.matchMedia("(min-width: 621px)").matches) {
    var stackTicking = false;
    window.addEventListener("scroll", function () {
      if (stackTicking) return;
      stackTicking = true;
      window.requestAnimationFrame(function () {
        var y = Math.min(window.scrollY, 700);
        var k = y / 700;
        var depth = [0, 110, 190];
        stackCards.forEach(function (c, i) {
          c.style.transform = "translate3d(0," + (k * depth[i]) + "px,0) scale(" + (1 - k * 0.07) + ") rotate(" + (k * (i % 2 ? 2.4 : -2.4)) + "deg)";
          c.style.opacity = String(1 - Math.max(0, k - 0.72) / 0.28);
        });
        stackTicking = false;
      });
    }, { passive: true });
  }

  if (!reduceMotion && window.matchMedia("(hover:hover)").matches) {
    var glowTargets = document.querySelectorAll(".tile, .card, .step");
    glowTargets.forEach(function (c) {
      c.addEventListener("pointermove", function (e) {
        var r = c.getBoundingClientRect();
        c.style.setProperty("--mx", ((e.clientX - r.left) / r.width * 100) + "%");
        c.style.setProperty("--my", ((e.clientY - r.top) / r.height * 100) + "%");
      });
    });
    var tiltTargets = document.querySelectorAll("#svc .tile");
    tiltTargets.forEach(function (c) {
      c.addEventListener("pointermove", function (e) {
        var r = c.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width - 0.5;
        var y = (e.clientY - r.top) / r.height - 0.5;
        c.style.transform = "translateY(-7px) perspective(760px) rotateX(" + (-y * 5) + "deg) rotateY(" + (x * 6) + "deg)";
      });
      c.addEventListener("pointerleave", function () { c.style.transform = ""; });
    });
  }

  // ---- koniec motion layer ----

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

    var status = form.querySelector("[data-form-status]");
    var submit = form.querySelector("[type=submit]");

    function fail(text) {
      if (status) {
        status.hidden = false;
        status.textContent = text;
        status.className = "form-error";
      }
      return false;
    }

    form.addEventListener("submit", function (event) {
      event.preventDefault();

      var name = form.querySelector("#name");
      var phone = form.querySelector("#phone");
      var service = form.querySelector("#service");
      var cp = form.querySelector("#cp");
      var message = form.querySelector("#message");
      var honeypot = form.querySelector("[name='botcheck']");

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

      if (status) status.hidden = true;
      if (submit) submit.disabled = true;

      fetch(form.getAttribute("action"), {
        method: "POST",
        body: new FormData(form),
        headers: { "Accept": "application/json" }
      })
        .then(function (response) {
          return response.json().catch(function () { return {}; }).then(function (body) {
            return { ok: response.ok, body: body };
          });
        })
        .then(function (result) {
          if (submit) submit.disabled = false;
          if (result.ok && result.body.ok) {
            window.location.href = "merci.html";
          } else {
            fail(result.body.error || "L'envoi a échoué. Appelez-nous au " + SITE.phoneDisplay + ".");
          }
        })
        .catch(function () {
          if (submit) submit.disabled = false;
          fail("Connexion impossible. Appelez-nous au " + SITE.phoneDisplay + ".");
        });
    });
  }
})();
