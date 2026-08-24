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

  // --- Hero smoke ----------------------------------------------------------
  // Canvas particle plume rising off the steak. Pre-warmed so the smoke is
  // already there on load. Position and sway are closed-form functions of a
  // particle's age, so there is no integration to drift or explode.
  var smokeCanvas = document.querySelector(".cinema__smoke-canvas");
  if (smokeCanvas && !reduceMotion && smokeCanvas.getContext) {
    (function () {
      var ctx = smokeCanvas.getContext("2d");
      var heroEl = smokeCanvas.closest(".cinema");
      var DPR = Math.min(window.devicePixelRatio || 1, 2);
      var W = 0, H = 0;
      var resize = function () {
        W = heroEl.clientWidth; H = heroEl.clientHeight;
        smokeCanvas.width = Math.round(W * DPR);
        smokeCanvas.height = Math.round(H * DPR);
        ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      };
      resize();
      window.addEventListener("resize", resize);

      // one soft round sprite, stamped for every particle
      var sprite = document.createElement("canvas");
      sprite.width = sprite.height = 160;
      var sctx = sprite.getContext("2d");
      var grad = sctx.createRadialGradient(80, 80, 0, 80, 80, 80);
      grad.addColorStop(0, "rgba(252,249,243,.60)");
      grad.addColorStop(.45, "rgba(252,249,243,.24)");
      grad.addColorStop(1, "rgba(252,249,243,0)");
      sctx.fillStyle = grad;
      sctx.fillRect(0, 0, 160, 160);

      var TAU = Math.PI * 2;
      var COUNT = 26;
      var parts = [];
      var spawn = function (p, warm) {
        p.x0 = (0.60 + Math.random() * 0.28) * W;   // rises off the steak, right side
        p.y0 = H * (0.70 + Math.random() * 0.22);
        p.life = 9 + Math.random() * 6;             // seconds
        p.age = warm ? Math.random() * p.life : 0;
        p.rise = H * (0.5 + Math.random() * 0.2);   // total climb over a life
        p.r0 = 20 + Math.random() * 30;
        p.grow = 6 + Math.random() * 8;             // px/s
        p.swayA = 18 + Math.random() * 38;
        p.swayF = 0.22 + Math.random() * 0.33;
        p.phase = Math.random() * TAU;
        p.drift = -(5 + Math.random() * 12);        // gentle wind to the left
        p.peak = 0.22 + Math.random() * 0.16;
      };
      for (var i = 0; i < COUNT; i++) { parts[i] = {}; spawn(parts[i], true); }

      var draw = function (dt) {
        ctx.clearRect(0, 0, W, H);
        ctx.globalCompositeOperation = "lighter";
        for (var i = 0; i < parts.length; i++) {
          var p = parts[i];
          p.age += dt;
          if (p.age >= p.life) spawn(p, false);
          var t = p.age / p.life;
          var x = p.x0 + p.drift * p.age +
                  Math.sin(p.phase + p.age * p.swayF * TAU) * p.swayA * (0.3 + t);
          var y = p.y0 - t * p.rise;
          var r = p.r0 + p.grow * p.age;
          var env = t < 0.22 ? t / 0.22 : (1 - t) / 0.78;   // ramp up, long fade
          ctx.globalAlpha = p.peak * env;
          ctx.drawImage(sprite, x - r, y - r, r * 2, r * 2);
        }
        ctx.globalAlpha = 1;
      };

      draw(0); // first frame synchronously — smoke visible before rAF ticks

      var onScreen = true;
      if ("IntersectionObserver" in window) {
        new IntersectionObserver(function (entries) {
          onScreen = entries[0].isIntersecting;
        }).observe(heroEl);
      }
      var last = null;
      var frame = function (now) {
        if (last === null) last = now;
        var dt = Math.min((now - last) / 1000, 0.05); // clamp tab-throttle jumps
        last = now;
        if (onScreen) draw(dt);
        requestAnimationFrame(frame);
      };
      requestAnimationFrame(frame);
    })();
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
