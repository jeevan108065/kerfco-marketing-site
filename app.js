// ===== Mobile nav toggle =====
// ===== Analytics event tracking (GA4) =====
// Safe no-op if gtag isn't loaded (e.g. ad blockers or before ID is set).
function track(eventName, params) {
  try {
    if (typeof window.gtag === "function") {
      window.gtag("event", eventName, params || {});
    }
  } catch (e) {}
}

// Auto-track clicks on WhatsApp and phone links anywhere on the page
(function () {
  document.addEventListener("click", function (e) {
    const link = e.target.closest("a[href]");
    if (!link) return;
    const href = link.getAttribute("href") || "";
    if (href.indexOf("wa.me") !== -1 || href.indexOf("api.whatsapp") !== -1) {
      track("whatsapp_click", { link_url: href, location: link.textContent.trim().slice(0, 40) });
    } else if (href.indexOf("tel:") === 0) {
      track("call_click", { link_url: href });
    } else if (href.indexOf("instagram.com") !== -1) {
      track("instagram_click", { link_url: href });
    } else if (href.indexOf("behance.net") !== -1) {
      track("behance_click", { link_url: href });
    } else if (href.indexOf("maps.app.goo.gl") !== -1 || href.indexOf("google.com/maps") !== -1) {
      track("map_click", { link_url: href });
    }
  });
})();

// ===== Preloader + hero entrance =====
(function () {
  const pre = document.getElementById("preloader");
  function reveal() {
    document.body.classList.add("ready");
    if (pre) {
      // brief minimum display so it doesn't flash
      setTimeout(function () { pre.classList.add("done"); }, 350);
    }
  }
  if (document.readyState === "complete") {
    reveal();
  } else {
    window.addEventListener("load", reveal);
    // safety fallback if load is slow/blocked
    setTimeout(reveal, 2500);
  }
})();

// ===== Count-up stats =====
(function () {
  const nums = document.querySelectorAll("[data-count]");
  if (!nums.length) return;

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function run(el) {
    const target = parseFloat(el.getAttribute("data-count")) || 0;
    const suffix = el.getAttribute("data-suffix") || "";
    if (reduce) { el.textContent = target + suffix; return; }
    const dur = 1400;
    const start = performance.now();
    function step(now) {
      const p = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
      el.textContent = Math.round(target * eased) + suffix;
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  if (!("IntersectionObserver" in window)) {
    nums.forEach(run);
    return;
  }
  const io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        run(entry.target);
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  nums.forEach(function (n) { io.observe(n); });
})();

// ===== Before / After slider =====
(function () {
  const ba = document.getElementById("beforeAfter");
  if (!ba) return;
  let dragging = false;
  let current = 50;
  let tweenId = null;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Set the split position instantly.
  function set(pct) {
    pct = Math.max(0, Math.min(100, pct));
    current = pct;
    ba.style.setProperty("--pos", pct + "%");
    ba.setAttribute("aria-valuenow", Math.round(pct));
  }

  // Smoothly animate to a target with requestAnimationFrame (no CSS transition).
  function tween(target) {
    if (reduce) { set(target); return; }
    if (tweenId) cancelAnimationFrame(tweenId);
    const start = current;
    const startT = performance.now();
    const dur = 380;
    function step(now) {
      const p = Math.min((now - startT) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
      set(start + (target - start) * eased);
      if (p < 1) tweenId = requestAnimationFrame(step);
      else tweenId = null;
    }
    tweenId = requestAnimationFrame(step);
  }

  function posFromX(clientX) {
    const rect = ba.getBoundingClientRect();
    return ((clientX - rect.left) / rect.width) * 100;
  }

  ba.addEventListener("pointerdown", function (e) {
    dragging = true;
    if (tweenId) { cancelAnimationFrame(tweenId); tweenId = null; }
    ba.setPointerCapture(e.pointerId);
    set(posFromX(e.clientX));
  });
  ba.addEventListener("pointermove", function (e) {
    if (dragging) set(posFromX(e.clientX));
  });
  ba.addEventListener("pointerup", function () { dragging = false; });
  ba.addEventListener("pointercancel", function () { dragging = false; });

  ba.addEventListener("keydown", function (e) {
    if (e.key === "ArrowLeft") { tween(current - 6); e.preventDefault(); }
    else if (e.key === "ArrowRight") { tween(current + 6); e.preventDefault(); }
    else if (e.key === "Home") { tween(0); e.preventDefault(); }
    else if (e.key === "End") { tween(100); e.preventDefault(); }
  });

  // Gentle intro sweep the first time it scrolls into view.
  if (!reduce && "IntersectionObserver" in window) {
    const io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          tween(36);
          setTimeout(function () { tween(64); }, 520);
          setTimeout(function () { tween(50); }, 1080);
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });
    io.observe(ba);
  }
})();

// ===== Mobile nav toggle =====
(function () {
  const toggle = document.getElementById("navToggle");
  const menu = document.getElementById("navRight");
  if (toggle && menu) {
    toggle.addEventListener("click", function () {
      const open = menu.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(open));
    });
    // Close menu when a nav link is clicked
    menu.querySelectorAll(".nav-links a").forEach(function (a) {
      a.addEventListener("click", function () {
        menu.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }
})();

// ===== Logo / title click -> smooth scroll to very top =====
(function () {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  document.addEventListener("click", function (e) {
    const brand = e.target.closest(".brand");
    if (!brand) return;
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
  });
  // Make the footer brand look clickable (header brand is already an <a>).
  document.querySelectorAll("footer .brand").forEach(function (el) {
    el.style.cursor = "pointer";
    el.setAttribute("role", "button");
    el.setAttribute("tabindex", "0");
    el.setAttribute("aria-label", "Back to top");
    el.addEventListener("keydown", function (ev) {
      if (ev.key === "Enter" || ev.key === " ") {
        ev.preventDefault();
        window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
      }
    });
  });
})();

// ===== Current year in footer =====
(function () {
  const y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();
})();

// ===== Scroll reveal =====
(function () {
  const targets = document.querySelectorAll(
    ".card, .material, .steps li, .tile, .section-head, .contact-card, .quote, .faq-item"
  );
  targets.forEach(function (el) {
    el.classList.add("reveal");
  });

  if (!("IntersectionObserver" in window)) {
    targets.forEach(function (el) {
      el.classList.add("in");
    });
    return;
  }

  const io = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  targets.forEach(function (el) {
    io.observe(el);
  });
})();

// ===== Category lightbox (multi-image gallery) =====
(function () {
  const lb = document.getElementById("lightbox");
  if (!lb) {
    console.warn("[lightbox] #lightbox element not found");
    return;
  }

  const img = document.getElementById("lbImg");
  let fallback = document.getElementById("lbFallback");
  const mediaEl = document.querySelector(".lightbox-media");
  const titleEl = document.getElementById("lbTitle");
  const descEl = document.getElementById("lbDesc");
  const cta = document.getElementById("lbCta");
  const closeBtn = document.getElementById("lbClose");
  const prevBtn = document.getElementById("lbPrev");
  const nextBtn = document.getElementById("lbNext");
  const counter = document.getElementById("lbCounter");
  const dotsWrap = document.getElementById("lbDots");
  const PHONE = "919652301635";
  let lastFocused = null;
  let images = [];
  let index = 0;
  let currentTitle = "";
  let imgReq = 0;

  function decodeEntities(s) {
    const t = document.createElement("textarea");
    t.innerHTML = s;
    return t.value;
  }

  function show(i) {
    if (!images.length) return;
    index = (i + images.length) % images.length;
    const multi = images.length > 1;

    // image + graceful fallback (removed from DOM when the image loads).
    if (img) {
      const src = images[index];
      const reqId = ++imgReq; // guard against out-of-order loads
      img.alt = currentTitle + " — image " + (index + 1);

      // Image loaded successfully: show it and DELETE the fallback from the DOM.
      function reveal() {
        if (reqId !== imgReq) return;
        img.style.display = "";
        if (fallback && fallback.parentNode) {
          fallback.parentNode.removeChild(fallback);
          fallback = null;
        }
      }
      // Image failed: hide it and (re)insert the fallback element with a message.
      function fail() {
        if (reqId !== imgReq) return;
        img.style.display = "none";
        if (!fallback) {
          fallback = document.createElement("div");
          fallback.className = "lightbox-fallback";
          fallback.id = "lbFallback";
          fallback.innerHTML = "<span>Photo coming soon</span>";
        }
        if (mediaEl && !fallback.parentNode) {
          mediaEl.appendChild(fallback);
        }
        fallback.removeAttribute("hidden");
      }

      img.style.display = "";
      img.onload = reveal;
      img.onerror = fail;
      img.src = src;

      // Verify actual pixels loaded — handles cached images and file:// quirks.
      function verify() {
        if (reqId !== imgReq) return;
        if (img.complete) {
          if (img.naturalWidth > 0) reveal();
          else fail();
        } else {
          setTimeout(verify, 120);
        }
      }
      setTimeout(verify, 60);
    }

    // nav controls only when >1 image
    [prevBtn, nextBtn, counter].forEach(function (el) {
      if (!el) return;
      if (multi) el.removeAttribute("hidden");
      else el.setAttribute("hidden", "");
    });
    if (counter) counter.textContent = (index + 1) + " / " + images.length;

    // dots
    if (dotsWrap) {
      if (multi) {
        dotsWrap.removeAttribute("hidden");
        dotsWrap.querySelectorAll(".lb-dot").forEach(function (d, di) {
          d.classList.toggle("active", di === index);
        });
      } else {
        dotsWrap.setAttribute("hidden", "");
      }
    }
  }

  function buildDots() {
    if (!dotsWrap) return;
    dotsWrap.innerHTML = "";
    images.forEach(function (_, di) {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "lb-dot";
      b.setAttribute("aria-label", "Go to image " + (di + 1));
      b.addEventListener("click", function () { show(di); });
      dotsWrap.appendChild(b);
    });
  }

  function next() { show(index + 1); }
  function prev() { show(index - 1); }

  function openLightbox(tile) {
    currentTitle = decodeEntities(tile.getAttribute("data-title") || "");
    const desc = tile.getAttribute("data-desc") || "";

    // Prefer data-gallery (comma list); fall back to single data-img
    const gallery = tile.getAttribute("data-gallery");
    if (gallery) {
      images = gallery.split(",").map(function (s) { return s.trim(); }).filter(Boolean);
    } else {
      images = [tile.getAttribute("data-img") || ""];
    }

    if (titleEl) titleEl.textContent = currentTitle;
    if (descEl) descEl.textContent = desc;
    if (cta) {
      cta.href =
        "https://wa.me/" + PHONE + "?text=" +
        encodeURIComponent("Hi Kerfco, I'm interested in: " + currentTitle);
    }

    buildDots();

    // Make the lightbox visible FIRST, then load the image. Setting an <img>
    // src while its container is display:none can defer load/events in some
    // browsers, which previously left the fallback showing.
    lastFocused = document.activeElement;
    lb.removeAttribute("hidden");
    void lb.offsetWidth;
    lb.classList.add("open");
    document.body.style.overflow = "hidden";

    show(0);

    if (closeBtn) closeBtn.focus();
  }

  function closeLightbox() {
    lb.classList.remove("open");
    document.body.style.overflow = "";
    window.setTimeout(function () {
      if (!lb.classList.contains("open")) lb.setAttribute("hidden", "");
    }, 350);
    if (lastFocused && lastFocused.focus) lastFocused.focus();
  }

  // Open on tile click; close on close-button / backdrop
  document.addEventListener("click", function (e) {
    const tile = e.target.closest(".tile");
    if (tile) {
      e.preventDefault();
      openLightbox(tile);
      return;
    }
    if (e.target.closest("#lbClose") || e.target.closest("[data-close]")) {
      closeLightbox();
    }
  });

  if (prevBtn) prevBtn.addEventListener("click", prev);
  if (nextBtn) nextBtn.addEventListener("click", next);

  document.addEventListener("keydown", function (e) {
    if (!lb.classList.contains("open")) return;
    if (e.key === "Escape") closeLightbox();
    else if (e.key === "ArrowRight") next();
    else if (e.key === "ArrowLeft") prev();
  });

  // Touch swipe on the media area
  const media = lb.querySelector(".lightbox-media");
  if (media) {
    let startX = 0, startY = 0, tracking = false;
    media.addEventListener("touchstart", function (e) {
      const t = e.changedTouches[0];
      startX = t.clientX; startY = t.clientY; tracking = true;
    }, { passive: true });
    media.addEventListener("touchend", function (e) {
      if (!tracking) return;
      tracking = false;
      const t = e.changedTouches[0];
      const dx = t.clientX - startX;
      const dy = t.clientY - startY;
      if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)) {
        if (dx < 0) next(); else prev();
      }
    }, { passive: true });
  }
})();

// ===== Sticky header: hide on scroll down, reveal on scroll up =====
(function () {
  const header = document.querySelector(".site-header");
  if (!header) return;
  let last = window.scrollY;
  let ticking = false;

  function update() {
    const y = window.scrollY;
    header.classList.toggle("scrolled", y > 20);
    if (y > last && y > 140) {
      header.classList.add("hide");
    } else {
      header.classList.remove("hide");
    }
    last = y;
    ticking = false;
  }

  window.addEventListener(
    "scroll",
    function () {
      if (!ticking) {
        window.requestAnimationFrame(update);
        ticking = true;
      }
    },
    { passive: true }
  );
})();

// ===== Enquiry form -> WhatsApp =====
(function () {
  const form = document.getElementById("enquiryForm");
  if (!form) return;

  const PHONE = "919652301635"; // country code + number, no + or spaces

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    const name = (document.getElementById("fName").value || "").trim();
    const service = document.getElementById("fService").value;
    const details = (document.getElementById("fDetails").value || "").trim();

    let msg = "Hello Kerfco TimberTech CNC,%0A%0A";
    if (name) msg += "Name: " + encodeURIComponent(name) + "%0A";
    msg += "Interested in: " + encodeURIComponent(service) + "%0A";
    if (details) msg += "Details: " + encodeURIComponent(details) + "%0A";
    msg += "%0APlease share requirements and a quote.";

    track("generate_lead", { method: "enquiry_form", service: service });

    const url = "https://wa.me/" + PHONE + "?text=" + msg;
    window.open(url, "_blank", "noopener");
  });
})();
