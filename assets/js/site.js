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

  // --- Headline entrance ---------------------------------------------------
  // Words rise out of clipped line boxes, one after another — letterpress
  // being pulled. Word-level so it survives any line wrap.
  var heroH1 = document.querySelector(".cinema h1");
  if (heroH1 && !reduceMotion) {
    var words = heroH1.textContent.trim().split(/\s+/);
    heroH1.textContent = "";
    words.forEach(function (word, i) {
      var w = document.createElement("span");
      w.className = "w";
      var wi = document.createElement("span");
      wi.className = "wi";
      wi.textContent = word;
      wi.style.setProperty("--wd", (i * 0.09) + "s");
      w.appendChild(wi);
      heroH1.appendChild(w);
      if (i < words.length - 1) heroH1.appendChild(document.createTextNode(" "));
    });
    heroH1.classList.add("type-in");
    requestAnimationFrame(function () {
      requestAnimationFrame(function () { heroH1.classList.add("go"); });
    });
    // fallback: if rAF never fires (hidden tab), show the headline anyway
    setTimeout(function () { heroH1.classList.add("go"); }, 1200);
  }

  // --- Hero smoke + embers -------------------------------------------------
  // Canvas particle plume rising off the steak, with a few drifting embers.
  // Pre-warmed so it is already there on load. Position and sway are
  // closed-form functions of a particle's age; the only integrated state is
  // the cursor-push offset, which decays back to zero.
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

      var makeSprite = function (size, stops) {
        var c = document.createElement("canvas");
        c.width = c.height = size;
        var g = c.getContext("2d");
        var grad = g.createRadialGradient(size/2, size/2, 0, size/2, size/2, size/2);
        stops.forEach(function (st) { grad.addColorStop(st[0], st[1]); });
        g.fillStyle = grad;
        g.fillRect(0, 0, size, size);
        return c;
      };
      var smokeSprite = makeSprite(160, [
        [0, "rgba(252,249,243,.60)"], [.45, "rgba(252,249,243,.24)"], [1, "rgba(252,249,243,0)"]
      ]);
      var emberSprite = makeSprite(32, [
        [0, "rgba(255,214,160,.95)"], [.3, "rgba(255,158,74,.55)"], [1, "rgba(255,110,40,0)"]
      ]);

      var TAU = Math.PI * 2;

      // cursor push — smoke swerves away from the pointer
      var mouse = { x: 0, y: 0, on: false };
      heroEl.addEventListener("mousemove", function (e) {
        var r = heroEl.getBoundingClientRect();
        mouse.x = e.clientX - r.left;
        mouse.y = e.clientY - r.top;
        mouse.on = true;
      });
      heroEl.addEventListener("mouseleave", function () { mouse.on = false; });

      var push = function (p, x, y, dt, strength) {
        if (mouse.on) {
          var dx = x - mouse.x, dy = y - mouse.y;
          var d = Math.sqrt(dx * dx + dy * dy) || 1;
          var R = 180;
          if (d < R) {
            var f = (1 - d / R) * strength * dt;
            p.ox += (dx / d) * f;
            p.oy += (dy / d) * f * 0.6;      // push sideways more than up/down
          }
        }
        var decay = Math.max(0, 1 - 2.2 * dt); // ease back to the natural path
        p.ox *= decay; p.oy *= decay;
      };

      var SMOKE_N = 26, smoke = [];
      var spawnSmoke = function (p, warm) {
        p.x0 = (0.58 + Math.random() * 0.30) * W;   // over the sliced steak
        p.y0 = H * (0.34 + Math.random() * 0.28);   // emit at steak height
        p.life = 9 + Math.random() * 6;
        p.age = warm ? Math.random() * p.life : 0;
        p.rise = H * (0.34 + Math.random() * 0.16);
        p.r0 = 20 + Math.random() * 30;
        p.grow = 6 + Math.random() * 8;
        p.swayA = 18 + Math.random() * 38;
        p.swayF = 0.22 + Math.random() * 0.33;
        p.phase = Math.random() * TAU;
        p.drift = -(5 + Math.random() * 12);
        p.peak = 0.22 + Math.random() * 0.16;
        p.ox = 0; p.oy = 0;
      };
      for (var i = 0; i < SMOKE_N; i++) { smoke[i] = {}; spawnSmoke(smoke[i], true); }

      // embers: few, small, quick, flickering warm
      var EMBER_N = 9, embers = [];
      var spawnEmber = function (p, warm) {
        p.x0 = (0.60 + Math.random() * 0.26) * W;
        p.y0 = H * (0.40 + Math.random() * 0.26);
        p.life = 3.2 + Math.random() * 3.4;
        p.age = warm ? Math.random() * p.life : 0;
        p.rise = H * (0.30 + Math.random() * 0.18);
        p.r = 2 + Math.random() * 3;
        p.swayA = 10 + Math.random() * 26;
        p.swayF = 0.5 + Math.random() * 0.7;
        p.phase = Math.random() * TAU;
        p.drift = -(8 + Math.random() * 14);
        p.flickF = 6 + Math.random() * 7;
        p.peak = 0.5 + Math.random() * 0.35;
        p.ox = 0; p.oy = 0;
      };
      for (var j = 0; j < EMBER_N; j++) { embers[j] = {}; spawnEmber(embers[j], true); }

      var draw = function (dt) {
        ctx.clearRect(0, 0, W, H);
        ctx.globalCompositeOperation = "lighter";
        var i, p, t, x, y, r, env;
        for (i = 0; i < smoke.length; i++) {
          p = smoke[i];
          p.age += dt;
          if (p.age >= p.life) spawnSmoke(p, false);
          t = p.age / p.life;
          x = p.x0 + p.drift * p.age +
              Math.sin(p.phase + p.age * p.swayF * TAU) * p.swayA * (0.3 + t);
          y = p.y0 - t * p.rise;
          push(p, x, y, dt, 320);
          x += p.ox; y += p.oy;
          r = p.r0 + p.grow * p.age;
          env = t < 0.22 ? t / 0.22 : (1 - t) / 0.78;
          ctx.globalAlpha = p.peak * env;
          ctx.drawImage(smokeSprite, x - r, y - r, r * 2, r * 2);
        }
        for (i = 0; i < embers.length; i++) {
          p = embers[i];
          p.age += dt;
          if (p.age >= p.life) spawnEmber(p, false);
          t = p.age / p.life;
          x = p.x0 + p.drift * p.age +
              Math.sin(p.phase + p.age * p.swayF * TAU) * p.swayA * t;
          y = p.y0 - t * p.rise;
          push(p, x, y, dt, 420);              // embers scatter a little faster
          x += p.ox; y += p.oy;
          r = p.r * (1 - t * 0.4);
          env = t < 0.15 ? t / 0.15 : (1 - t) / 0.85;
          var flick = 0.65 + 0.35 * Math.sin(p.phase + p.age * p.flickF);
          ctx.globalAlpha = p.peak * env * flick;
          ctx.drawImage(emberSprite, x - r * 2, y - r * 2, r * 4, r * 4);
        }
        ctx.globalAlpha = 1;
      };

      draw(0); // first frame synchronously

      var onScreen = true;
      if ("IntersectionObserver" in window) {
        new IntersectionObserver(function (entries) {
          onScreen = entries[0].isIntersecting;
        }).observe(heroEl);
      }
      var last = null;
      var frame = function (now) {
        if (last === null) last = now;
        var dt = Math.min((now - last) / 1000, 0.05);
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
