/* The SmokeHouse — progressive enhancement. No dependencies. */
(function () {
  "use strict";
  document.documentElement.classList.add("js");
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // --- Mobile nav toggle ---------------------------------------------------
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("primary-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.getAttribute("data-open") === "true";
      nav.setAttribute("data-open", String(!open));
      toggle.setAttribute("aria-expanded", String(!open));
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.getAttribute("data-open") === "true") {
        nav.setAttribute("data-open", "false");
        toggle.setAttribute("aria-expanded", "false");
        toggle.focus();
      }
    });
  }

  // --- Current page in nav -------------------------------------------------
  var here = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll("#primary-nav a").forEach(function (a) {
    if (a.getAttribute("href") === here) a.setAttribute("aria-current", "page");
  });

  // --- Overlay header: transparent over the hero, paper once past it -------
  var header = document.querySelector(".site-header--overlay");
  var hero = document.querySelector(".cinema");
  if (header && hero) {
    // Sentinel + IntersectionObserver: the bar goes solid as soon as the top
    // of the page scrolls away. More reliable than scroll events (which
    // throttle in background tabs) and costs nothing per-frame.
    var sentinel = document.createElement("div");
    sentinel.setAttribute("aria-hidden", "true");
    sentinel.style.cssText = "position:absolute;top:0;left:0;width:1px;height:64px;pointer-events:none;";
    document.body.prepend(sentinel);
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (entries) {
        header.classList.toggle("is-scrolled", !entries[0].isIntersecting);
      }).observe(sentinel);
    } else {
      var setHeaderState = function () {
        header.classList.toggle("is-scrolled", window.scrollY > 48);
      };
      window.addEventListener("scroll", setHeaderState, { passive: true });
      setHeaderState();
    }
  }

  // --- Scroll reveals ------------------------------------------------------
  var revealEls = document.querySelectorAll("[data-reveal]");
  if (revealEls.length) {
    if (reduceMotion || !("IntersectionObserver" in window)) {
      revealEls.forEach(function (el) { el.classList.add("in"); });
    } else {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            io.unobserve(entry.target);
          }
        });
      }, { rootMargin: "0px 0px -12% 0px", threshold: 0.05 });
      revealEls.forEach(function (el) { io.observe(el); });
    }
  }

  // --- Parallax ------------------------------------------------------------
  // [data-parallax="0.15"] drifts at 15% of scroll speed while its section
  // is on screen. Kept subtle on purpose; disabled under reduced motion.
  var pEls = Array.prototype.slice.call(document.querySelectorAll("[data-parallax]"));
  if (pEls.length && !reduceMotion) {
    var pTick = false;
    var applyParallax = function () {
      var vh = window.innerHeight;
      pEls.forEach(function (el) {
        var rect = el.getBoundingClientRect();
        if (rect.bottom < -100 || rect.top > vh + 100) return;
        var speed = parseFloat(el.getAttribute("data-parallax")) || 0.12;
        var center = rect.top + rect.height / 2 - vh / 2;
        el.style.transform = "translate3d(0," + (-center * speed).toFixed(1) + "px,0)";
      });
    };
    window.addEventListener("scroll", function () {
      if (!pTick) {
        pTick = true;
        requestAnimationFrame(function () { applyParallax(); pTick = false; });
      }
    }, { passive: true });
    applyParallax();
  }
})();
