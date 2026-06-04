/* Superpowers Wiki — shared behavior. Vanilla JS, no dependencies. */
(function () {
  "use strict";

  /* ---- mobile nav toggle ---- */
  var menuBtn = document.querySelector(".menu-btn");
  var nav = document.querySelector(".nav");
  if (menuBtn && nav) {
    menuBtn.addEventListener("click", function () {
      nav.classList.toggle("open");
    });
    nav.addEventListener("click", function (e) {
      if (e.target.tagName === "A") nav.classList.remove("open");
    });
  }

  /* ---- mark active top-nav item by filename ---- */
  (function () {
    var here = location.pathname.split("/").pop() || "index.html";
    document.querySelectorAll(".nav a").forEach(function (a) {
      var href = (a.getAttribute("href") || "").split("/").pop();
      if (href === here) a.classList.add("active");
    });
  })();

  /* ---- copy-to-clipboard buttons ---- */
  document.querySelectorAll(".copy-btn").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var pre = btn.closest(".code-head") ? btn.closest(".code-head").nextElementSibling : null;
      if (!pre) {
        var wrap = btn.closest("pre") || (btn.parentElement && btn.parentElement.querySelector("pre"));
        pre = wrap;
      }
      var code = pre ? pre.querySelector("code") || pre : null;
      if (!code) return;
      var text = code.innerText;
      navigator.clipboard && navigator.clipboard.writeText(text).then(function () {
        var old = btn.textContent;
        btn.textContent = "copied";
        setTimeout(function () { btn.textContent = old; }, 1400);
      });
    });
  });

  /* ---- scrollspy: highlight TOC entry for the section in view ---- */
  var tocLinks = Array.prototype.slice.call(document.querySelectorAll(".toc a[href^='#']"));
  if (tocLinks.length) {
    var targets = tocLinks
      .map(function (a) {
        var id = a.getAttribute("href").slice(1);
        var el = document.getElementById(id);
        return el ? { a: a, el: el } : null;
      })
      .filter(Boolean);

    var spy = function () {
      // Use viewport-relative position (robust regardless of offsetParent).
      var current = targets[0];
      for (var i = 0; i < targets.length; i++) {
        if (targets[i].el.getBoundingClientRect().top <= 150) current = targets[i];
      }
      // At the very bottom, always highlight the last section.
      if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 4) {
        current = targets[targets.length - 1];
      }
      tocLinks.forEach(function (a) { a.classList.remove("active"); });
      if (current) current.a.classList.add("active");
    };
    var ticking = false;
    window.addEventListener("scroll", function () {
      if (!ticking) {
        window.requestAnimationFrame(function () { spy(); ticking = false; });
        ticking = true;
      }
    }, { passive: true });
    window.addEventListener("load", spy);
    window.addEventListener("resize", spy);
    spy();
  }

  /* ---- reveal on scroll ---- */
  var reveals = document.querySelectorAll(".reveal");
  if (reveals.length && "IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
      });
    }, { threshold: 0.08, rootMargin: "0px 0px -40px 0px" });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("in"); });
  }

  /* ---- heading anchor links ---- */
  document.querySelectorAll(".content h2[id], .content h3[id]").forEach(function (h) {
    var a = document.createElement("a");
    a.className = "anchor";
    a.href = "#" + h.id;
    a.textContent = "#";
    a.setAttribute("aria-label", "Link to this section");
    h.appendChild(a);
  });
})();
