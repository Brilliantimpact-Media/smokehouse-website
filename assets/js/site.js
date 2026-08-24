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
      var EMBER_N = 12, embers = [];
      var spawnEmber = function (p, warm) {
        p.x0 = (0.60 + Math.random() * 0.26) * W;
        p.y0 = H * (0.40 + Math.random() * 0.26);
        p.life = 2.6 + Math.random() * 3.2;
        p.age = warm ? Math.random() * p.life : 0;
        p.rise = H * (0.30 + Math.random() * 0.20);
        p.r = 0.8 + Math.random() * 1.3;            // tiny, sharp core
        p.swayA = 10 + Math.random() * 26;
        p.swayF = 0.5 + Math.random() * 0.7;
        p.turbF = 2.2 + Math.random() * 2.6;        // high-freq tumble
        p.turbA = 2 + Math.random() * 4;
        p.phase = Math.random() * TAU;
        p.drift = -(8 + Math.random() * 16);
        p.peak = 0.75 + Math.random() * 0.25;
        p.fl = 0.8;                                  // smoothed crackle level
        p.lx = null; p.ly = null;                    // last pos, for the streak
        p.ox = 0; p.oy = 0;
      };
      for (var j = 0; j < EMBER_N; j++) { embers[j] = {}; spawnEmber(embers[j], true); }

      // white-hot at birth, orange mid-flight, dull red as it dies
      var emberColor = function (t) {
        var a = [255, 235, 185], b = [255, 150, 60], c = [205, 70, 30], u;
        if (t < 0.35) { u = t / 0.35;       return [a[0]+(b[0]-a[0])*u, a[1]+(b[1]-a[1])*u, a[2]+(b[2]-a[2])*u]; }
        u = (t - 0.35) / 0.65;              return [b[0]+(c[0]-b[0])*u, b[1]+(c[1]-b[1])*u, b[2]+(c[2]-b[2])*u];
      };

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
              Math.sin(p.phase + p.age * p.swayF * TAU) * p.swayA * t +
              Math.sin(p.phase * 3 + p.age * p.turbF * TAU) * p.turbA;  // tumble
          y = p.y0 - t * p.rise +
              Math.cos(p.phase * 2 + p.age * p.turbF * TAU) * p.turbA * 0.6;
          push(p, x, y, dt, 420);              // embers scatter a little faster
          x += p.ox; y += p.oy;

          // crackle: smoothed random level with dropouts and the odd pop
          var target = 0.55 + Math.random() * 0.45;
          if (Math.random() < 0.07) target = 0.05;   // wink out
          if (Math.random() < 0.025) target = 1.7;   // pop
          p.fl += (target - p.fl) * Math.min(1, 14 * dt);

          env = t < 0.12 ? t / 0.12 : (1 - t) / 0.88;
          var alpha = Math.min(1, p.peak * env * p.fl);
          if (alpha < 0.02) { p.lx = x; p.ly = y; continue; }
          var col = emberColor(t);
          r = p.r * (1 - t * 0.35);

          // streak: short trail from where it just was
          if (p.lx !== null) {
            var sdx = x - p.lx, sdy = y - p.ly;
            var sd = Math.sqrt(sdx * sdx + sdy * sdy);
            if (sd > 0.5 && sd < 24) {
              ctx.strokeStyle = "rgba(" + (col[0]|0) + "," + (col[1]|0) + "," + (col[2]|0) + "," + (alpha * 0.55).toFixed(3) + ")";
              ctx.lineWidth = r;
              ctx.lineCap = "round";
              ctx.beginPath();
              ctx.moveTo(p.lx, p.ly);
              ctx.lineTo(x, y);
              ctx.stroke();
            }
          }
          p.lx = x; p.ly = y;

          // sharp head: bright core with a faint halo
          ctx.globalAlpha = alpha * 0.35;
          ctx.drawImage(emberSprite, x - r * 3, y - r * 3, r * 6, r * 6);
          ctx.globalAlpha = alpha;
          ctx.fillStyle = "rgba(" + (col[0]|0) + "," + (col[1]|0) + "," + (col[2]|0) + ",1)";
          ctx.beginPath();
          ctx.arc(x, y, r, 0, TAU);
          ctx.fill();
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
