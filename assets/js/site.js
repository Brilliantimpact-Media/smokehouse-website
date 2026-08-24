/* The SmokeHouse — minimal progressive enhancement. No dependencies. */
(function () {
  "use strict";

  // Mobile nav toggle
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("primary-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.getAttribute("data-open") === "true";
      nav.setAttribute("data-open", String(!open));
      toggle.setAttribute("aria-expanded", String(!open));
    });
    // Close on escape, and when a link is followed
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.getAttribute("data-open") === "true") {
        nav.setAttribute("data-open", "false");
        toggle.setAttribute("aria-expanded", "false");
        toggle.focus();
      }
    });
  }

  // Mark the current page in the nav without hardcoding it per-file
  var here = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll("#primary-nav a").forEach(function (a) {
    var target = a.getAttribute("href");
    if (target === here) a.setAttribute("aria-current", "page");
  });
})();
