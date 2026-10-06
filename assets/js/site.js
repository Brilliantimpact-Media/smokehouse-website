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
  var startEntrance = function () {};
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
    var entranceStarted = false;
    startEntrance = function () {
      if (entranceStarted) return;
      entranceStarted = true;
      requestAnimationFrame(function () {
        requestAnimationFrame(function () { heroH1.classList.add("go"); });
      });
    };
    // hard fallback: never leave the headline hidden
    setTimeout(function () { heroH1.classList.add("go"); }, 4000);
  }

  // --- Hero smoke + embers -------------------------------------------------
  // Canvas particle plume rising off the steak, with a few drifting embers.
  // Pre-warmed so it is already there on load. Position and sway are
  // closed-form functions of a particle's age; the only integrated state is
  // the cursor-push offset, which decays back to zero.
  var smokeCanvas = document.querySelector(".cinema__smoke-canvas");
  var smokeStarted = false;
  var startSmoke = function () {
    if (smokeStarted || !smokeCanvas || reduceMotion || !smokeCanvas.getContext) return;
    smokeStarted = true;
    smokeCanvas.classList.add("on");
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

      var SMOKE_N = 10, smoke = [];
      var spawnSmoke = function (p, warm) {
        p.x0 = (0.58 + Math.random() * 0.30) * W;   // over the sliced steak
        p.y0 = H * (0.34 + Math.random() * 0.28);   // emit at steak height
        p.life = 26 + Math.random() * 14;
        p.age = warm ? Math.random() * p.life : 0;
        p.rise = H * (0.34 + Math.random() * 0.16);
        p.r0 = 20 + Math.random() * 30;
        p.grow = 6 + Math.random() * 8;
        p.swayA = 18 + Math.random() * 38;
        p.swayF = 0.22 + Math.random() * 0.33;
        p.phase = Math.random() * TAU;
        p.drift = -(5 + Math.random() * 12);
        p.peak = 0.16 + Math.random() * 0.12;
        p.ox = 0; p.oy = 0;
      };
      for (var i = 0; i < SMOKE_N; i++) { smoke[i] = {}; spawnSmoke(smoke[i], true); }

      // embers: few, small, quick, flickering warm
      var EMBER_N = 7, embers = [];
      var spawnEmber = function (p, warm) {
        p.x0 = (0.60 + Math.random() * 0.26) * W;
        p.y0 = H * (0.40 + Math.random() * 0.26);
        p.life = 7 + Math.random() * 5;
        // negative age = dormant; the ember waits its turn so sparks come
        // and go instead of streaming constantly
        p.age = warm ? Math.random() * (p.life + 9) - 9 : -(1.5 + Math.random() * 7);
        p.rise = H * (0.15 + Math.random() * 0.12);
        p.r = 0.8 + Math.random() * 1.3;            // tiny, sharp core
        p.swayA = 10 + Math.random() * 26;
        p.swayF = 0.5 + Math.random() * 0.7;
        p.turbF = 0.9 + Math.random() * 1.1;        // high-freq tumble
        p.turbA = 2 + Math.random() * 4;
        p.phase = Math.random() * TAU;
        p.drift = -(2.5 + Math.random() * 6);
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
          if (p.age < 0) { p.lx = null; p.ly = null; continue; }  // dormant
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
  };

  startEntrance();
  startSmoke();

  // --- Smoke video: fade in, and only play while the hero is on screen -----
  var smokeVideo = document.querySelector(".cinema__smoke-video");
  if (smokeVideo && !reduceMotion) {
    smokeVideo.playbackRate = 0.275;  // real smoke, slowed way down
    var wake = function () {
      smokeVideo.classList.add("on");
      smokeVideo.play().catch(function () {});
    };
    if (smokeVideo.readyState >= 2) wake();
    else smokeVideo.addEventListener("canplay", wake, { once: true });
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (entries) {
        if (entries[0].isIntersecting) smokeVideo.play().catch(function () {});
        else smokeVideo.pause();
      }).observe(smokeVideo);
    }
  } else if (smokeVideo) {
    smokeVideo.removeAttribute("autoplay");
    smokeVideo.pause();
  }


  // --- Processing-forms dropdown (click to open on touch) ------------------
  (function () {
    var g = document.querySelector(".nav__group");
    if (!g) return;
    var btn = g.querySelector(".nav__toggle"), menu = g.querySelector(".nav__menu");
    if (!btn || !menu) return;
    var set = function (open) {
      btn.setAttribute("aria-expanded", String(open));
      menu.setAttribute("data-open", String(open));
    };
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      set(btn.getAttribute("aria-expanded") !== "true");
    });
    document.addEventListener("click", function (e) { if (!g.contains(e.target)) set(false); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") set(false); });
  })();

  // --- Sample cut sheet lightbox ------------------------------------------
  (function () {
    var open = document.querySelector("[data-sheet-open]");
    var dlg = document.getElementById("sheetModal");
    if (!open || !dlg) return;
    open.addEventListener("click", function () { dlg.showModal(); });
    var close = dlg.querySelector("[data-sheet-close]");
    if (close) close.addEventListener("click", function () { dlg.close(); });
    dlg.addEventListener("click", function (e) { if (e.target === dlg) dlg.close(); });
  })();

  // --- Review carousel -----------------------------------------------------
  // Two labels per view above 860px, one below. Native scroll-snap does the
  // swiping; the buttons and dots drive the same scroll position.
  (function () {
    var track = document.getElementById("rcarTrack");
    var dots  = document.getElementById("rcarDots");
    if (!track || !dots) return;
    var btns = [].slice.call(document.querySelectorAll(".rcar__btn"));

    var pages   = function () { return Math.max(1, Math.round(track.scrollWidth / track.clientWidth)); };
    var current = function () { return Math.round(track.scrollLeft / track.clientWidth); };

    var sync = function () {
      var i = current(), n = pages();
      [].forEach.call(dots.children, function (d, k) {
        d.setAttribute("aria-current", String(k === i));
      });
      btns.forEach(function (b) {
        var dir = parseInt(b.getAttribute("data-dir"), 10);
        b.disabled = (dir < 0 && i <= 0) || (dir > 0 && i >= n - 1);
      });
    };
    var buildDots = function () {
      var n = pages();
      dots.innerHTML = "";
      for (var i = 0; i < n; i++) {
        var d = document.createElement("button");
        d.type = "button";
        d.className = "rcar__dot";
        d.setAttribute("aria-label", "Reviews, page " + (i + 1) + " of " + n);
        (function (idx) {
          d.addEventListener("click", function () {
            track.scrollTo({ left: idx * track.clientWidth });
          });
        })(i);
        dots.appendChild(d);
      }
      sync();
    };

    btns.forEach(function (b) {
      b.addEventListener("click", function () {
        track.scrollBy({ left: parseInt(b.getAttribute("data-dir"), 10) * track.clientWidth });
      });
    });
    track.addEventListener("keydown", function (e) {
      if (e.key === "ArrowRight") { e.preventDefault(); track.scrollBy({ left:  track.clientWidth }); }
      if (e.key === "ArrowLeft")  { e.preventDefault(); track.scrollBy({ left: -track.clientWidth }); }
    });
    var t;
    track.addEventListener("scroll", function () {
      clearTimeout(t); t = setTimeout(sync, 90);
    }, { passive: true });
    window.addEventListener("resize", buildDots);
    buildDots();
  })();

  // --- Cut charts (custom-processing): beef and hog -----------------------
  (function () {
    var charts = document.querySelectorAll(".cut-chart");
    if (!charts.length) return;
    var BEEF = {
      chuck:     { name: "Chuck",      becomes: "Chuck roasts, chuck steaks, stew meat, and the best ground beef on the animal.", sheet: "Roast size, how many roasts, and how much goes to grind." },
      rib:       { name: "Rib",        becomes: "Ribeyes, prime rib, and back ribs.", sheet: "Ribeye thickness, bone-in or boneless, and whether a standing rib roast comes out whole." },
      shortloin: { name: "Short Loin", becomes: "T-bones, porterhouse, strip steaks, and the tenderloin.", sheet: "T-bones as they are, or strips with the tenderloin pulled whole." },
      sirloin:   { name: "Sirloin",    becomes: "Sirloin steaks, tri-tip, and sirloin tip roasts.", sheet: "Steak thickness and how many to a package." },
      round:     { name: "Round",      becomes: "Round steaks and roasts, cube steak, jerky meat, and lean grind.", sheet: "Steaks, roasts, jerky, or grind. The round is the most flexible call on the sheet." },
      brisket:   { name: "Brisket",    becomes: "The brisket, flat and point.", sheet: "Whole, split, or ground. Smokers ask for it whole." },
      plate:     { name: "Plate",      becomes: "Short ribs, skirt steak, and grind.", sheet: "Short ribs kept or ground, and whether the skirt comes out separate." },
      flank:     { name: "Flank",      becomes: "Flank steak and stir-fry strips.", sheet: "Kept as a steak or sent to grind." },
      shank:     { name: "Shank",      becomes: "Soup bones and osso buco, the start of the best broth you\u2019ll make.", sheet: "Soup bones kept or passed. Keep them." }
    };
    var HOG = {"shoulder": {"name": "Shoulder", "becomes": "Pork steaks, shoulder roasts, porketta, and the best sausage meat on the hog.", "sheet": "Roasts, steaks, or ground for brats and sausage. Most people split it."}, "picnic": {"name": "Picnic", "becomes": "Picnic roasts and smoked picnics, or straight to grind.", "sheet": "Fresh or smoked, roast or ground."}, "rib": {"name": "Rib", "becomes": "Back ribs and rib chops.", "sheet": "Ribs kept whole, or chops cut to your thickness."}, "loin": {"name": "Loin", "becomes": "Pork chops, loin roasts, and the tenderloin.", "sheet": "Chop thickness, how many to a package, and whether the tenderloin comes out whole."}, "belly": {"name": "Belly", "becomes": "Bacon, side pork, pork belly chunks, and seasoned belly.", "sheet": "Smoked and sliced for bacon, thick or regular, or left fresh as side pork."}, "ham": {"name": "Ham", "becomes": "Smoked hams, ham steaks, and fresh ham roasts. Their most decorated product.", "sheet": "Whole or half, bone-in or boneless, fresh or smoked."}, "head": {"name": "Head", "becomes": "Jowl, and trim that goes to sausage.", "sheet": "Kept or passed. Most pass it; ask if you want the jowl."}, "hockfront": {"name": "Hock", "becomes": "Smoked hocks for beans, soup and greens.", "sheet": "Kept or passed. Keep them."}, "hockrear": {"name": "Hock", "becomes": "Smoked hocks for beans, soup and greens.", "sheet": "Kept or passed. Keep them."}};
    var DATA = { beef: BEEF, hog: HOG };
    var FIRST = { beef: "rib", hog: "loin" };

    charts.forEach(function (chart) {
      var species = chart.getAttribute("data-species") || "beef";
      var copy = DATA[species];
      // match the panel by species, not by DOM proximity: the chart sits inside
      // a wrapper, so walking up from it finds the wrong element
      var panel = document.querySelector('.cut-info[data-for="' + species + '"]')
               || document.querySelector(".cut-info");
      if (!panel) return;
      var nameEl = panel.querySelector("[data-cut-name]"),
          becEl  = panel.querySelector("[data-cut-becomes]"),
          shEl   = panel.querySelector("[data-cut-sheet]");
      var hi = {};
      chart.querySelectorAll("[data-cut-img]").forEach(function (im) {
        hi[im.getAttribute("data-cut-img")] = im;
      });
      var regions = chart.querySelectorAll(".cut");
      var activate = function (key, el) {
        var d = copy[key];
        if (!d) return;
        nameEl.textContent = d.name;
        becEl.textContent = d.becomes;
        shEl.textContent = d.sheet;
        regions.forEach(function (r) { r.classList.toggle("active", r === el); });
        Object.keys(hi).forEach(function (k) { hi[k].classList.toggle("on", k === key); });
      };
      regions.forEach(function (r) {
        var key = r.getAttribute("data-cut");
        var go = function () { activate(key, r); };
        r.addEventListener("mouseenter", go);
        r.addEventListener("focus", go);
        r.addEventListener("click", go);
        r.addEventListener("keydown", function (e) {
          if (e.key === "Enter" || e.key === " ") { e.preventDefault(); go(); }
        });
      });
      var def = chart.querySelector('[data-cut="' + FIRST[species] + '"]');
      if (def) activate(FIRST[species], def);
    });

    // Beef / Hog tabs, only shown below 900px
    document.querySelectorAll(".ccx__tab").forEach(function (tab) {
      tab.addEventListener("click", function () {
        var want = tab.getAttribute("data-species");
        document.querySelectorAll(".ccx__tab").forEach(function (t) {
          t.setAttribute("aria-selected", String(t === tab));
        });
        document.querySelectorAll(".ccx__col").forEach(function (c) {
          c.setAttribute("data-on", String(c.getAttribute("data-species") === want));
        });
      });
    });
  })();

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


  // --- products: category signs + full-catalogue popup ----------------------
  var signgrid = document.getElementById("signgrid");
  var pmodal = document.getElementById("pmodal");
  if (signgrid && pmodal) {
    var GLYPH = {
      "Beef": "beef.png", "Pork": "pork.png", "Sausage": "sausage.png",
      "Venison": "venison.png", "Lamb": "lamb.png", "Poultry": "poultry.svg",
      "Woodville Deli": "deli.svg", "Misc.": "misc.svg"
    };
    // categories we process but do not sell over the counter
    var NOTE = { "Venison": "Processing only, not available for sale in store" };
    var SHOT = {
      "Beef": "beef", "Pork": "pork", "Sausage": "sausage", "Venison": "venison",
      "Lamb": "lamb", "Poultry": "poultry", "Woodville Deli": "deli", "Misc.": "misc"
    };
    var lastFocus = null;

    // url() written into a custom property resolves against the stylesheet that
    // consumes it, which is assets/css/site.css, not the page. Setting the image
    // longhands inline keeps every path relative to the document instead.
    var setMask = function (el, path) {
      el.style.webkitMaskImage = 'url("' + path + '")';
      el.style.maskImage = 'url("' + path + '")';
    };

    var openCat = function (cat) {
      document.getElementById("pmodalTitle").textContent = cat.name;
      document.getElementById("pmodalSub").textContent = cat.count + " items";
      var noteEl = document.getElementById("pmodalNote");
      if (noteEl) {
        noteEl.textContent = NOTE[cat.name] || "";
        noteEl.hidden = !NOTE[cat.name];
      }
      var pg = document.getElementById("pmodalGlyph");
      setMask(pg, "assets/img/cat/" + GLYPH[cat.name]);
      var body = document.getElementById("pmodalBody");
      body.innerHTML = "";
      cat.groups.forEach(function (g) {
        var sec = document.createElement("div");
        sec.className = "pgroup";
        if (g.name) {
          var h = document.createElement("h3");
          h.innerHTML = '<i></i><span></span><i></i>';
          h.querySelector("span").textContent = g.name;
          sec.appendChild(h);
        }
        var ul = document.createElement("ul");
        g.items.forEach(function (it) {
          var li = document.createElement("li"), label = it, flags = [];
          if (/-?\s*Award Winning!?/i.test(label)) {
            flags.push(["award", "Award Winning!"]);
            label = label.replace(/\s*-?\s*Award Winning!?/ig, "");
          }
          if (/\(Woodville [Ll]ocation [Oo]nly\)/.test(label)) {
            flags.push(["wood", "Woodville only"]);
            label = label.replace(/\s*\(Woodville [Ll]ocation [Oo]nly\)/g, "");
          }
          var chev = document.createElement("span");
          chev.className = "pchev";
          chev.setAttribute("aria-hidden", "true");
          li.appendChild(chev);
          var sp = document.createElement("span");
          sp.textContent = label.trim();
          li.appendChild(sp);
          flags.forEach(function (f) {
            var b = document.createElement("span");
            b.className = "pflag pflag--" + f[0];
            b.textContent = f[1];
            li.appendChild(b);
          });
          ul.appendChild(li);
        });
        sec.appendChild(ul);
        body.appendChild(sec);
      });
      body.scrollTop = 0;
      lastFocus = document.activeElement;
      pmodal.showModal();
    };

    document.getElementById("pmodalClose").addEventListener("click", function () { pmodal.close(); });
    pmodal.addEventListener("click", function (e) { if (e.target === pmodal) pmodal.close(); });
    pmodal.addEventListener("close", function () { if (lastFocus) lastFocus.focus(); });

    fetch("assets/data/catalog.json").then(function (r) { return r.json(); }).then(function (cats) {
      cats = cats.slice().sort(function (a, b) {
        return (a.name === "Misc.") - (b.name === "Misc.");   // catch-all goes last
      });
      cats.forEach(function (cat) {
        var b = document.createElement("button");
        b.type = "button";
        b.className = "sign";
        b.setAttribute("aria-label", "View " + cat.name + " products, " + cat.count + " items");
  
        b.innerHTML =
          '<span class="sign__bg"></span><span class="sign__vig"></span><span class="sign__grain"></span>' +
          '<span class="sign__inner">' +
            '<span class="sign__seal"><span class="sign__glyph"></span></span>' +
            '<span class="sign__title">' + cat.name + '</span>' +
            '<span class="sign__count" aria-hidden="true">' + cat.count + ' items</span>' +
          (NOTE[cat.name] ? '<span class="sign__note">' + NOTE[cat.name] + '</span>' : '') +
            '<span class="sign__btn">View Products</span>' +
          '</span>';
        b.querySelector(".sign__bg").style.backgroundImage =
        'url("assets/img/cat/photo/' + (SHOT[cat.name] || "wood") + '.webp")';
      setMask(b.querySelector(".sign__glyph"), "assets/img/cat/" + GLYPH[cat.name]);
      b.addEventListener("click", function () { openCat(cat); });
        signgrid.appendChild(b);
      });
    });
  }
})();

/* JOTFORM EMBED HEIGHT
   A JotForm embed posts its own content height to the parent as
   "setHeight:<px>:<formID>". Without reading it the iframe keeps its CSS height
   and the bottom of the form is simply unreachable. Handling the message here
   rather than loading JotForm's embed script keeps a third-party script off the
   page. The frame is capped in CSS, so a long form scrolls in its own box. */
(function () {
  var frames = document.querySelectorAll('iframe[src*="form.jotform.com"]');
  if (!frames.length) return;
  window.addEventListener("message", function (e) {
    if (!/^https:\/\/([a-z0-9-]+\.)?jotform\.com$/.test(e.origin)) return;
    if (typeof e.data !== "string") return;
    var m = /^setHeight:(\d+)(?::(\d+))?/.exec(e.data);
    if (!m) return;
    for (var i = 0; i < frames.length; i++) {
      if (!m[2] || frames[i].src.indexOf(m[2]) > -1) {
        frames[i].style.height = m[1] + "px";
      }
    }
  });
})();
