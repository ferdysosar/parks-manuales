(function () {
  const menuButton = document.querySelector("[data-menu-toggle]");
  const mainNav = document.querySelector("[data-main-nav]");
  const backTopButton = document.querySelector("[data-back-top]");
  const docNav = document.querySelector("[data-doc-nav]");
  const docSidebar = document.querySelector("[data-doc-sidebar]");
  const docDrawerToggle = document.querySelector("[data-doc-drawer-toggle]");
  const docDrawerClose = document.querySelector("[data-doc-drawer-close]");
  const docDrawerOverlay = document.querySelector("[data-doc-drawer-overlay]");
  const themeToggles = Array.from(document.querySelectorAll("[data-theme-toggle]"));

  if (themeToggles.length > 0) {
    const THEME_KEY = "parks-theme";
    const root = document.documentElement;

    const getStoredTheme = function () {
      try {
        const saved = localStorage.getItem(THEME_KEY);
        return saved === "dark" || saved === "light" ? saved : null;
      } catch (_error) {
        return null;
      }
    };

    const updateThemeControls = function (theme) {
      const isDark = theme === "dark";
      themeToggles.forEach(function (button) {
        button.setAttribute("aria-pressed", String(isDark));
        button.setAttribute("aria-label", isDark ? "Activar modo claro" : "Activar modo oscuro");
        button.title = isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro";
        button.textContent = isDark ? "☀️" : "🌙";
      });
    };

    const applyTheme = function (theme) {
      root.setAttribute("data-theme", theme);
      updateThemeControls(theme);
    };

    const initialTheme = getStoredTheme() || "light";
    applyTheme(initialTheme);

    themeToggles.forEach(function (button) {
      button.addEventListener("click", function () {
        const current = root.getAttribute("data-theme") || "light";
        const next = current === "dark" ? "light" : "dark";
        applyTheme(next);
        try {
          localStorage.setItem(THEME_KEY, next);
        } catch (_error) {}
      });
    });
  }

  if (menuButton && mainNav && !menuButton.hasAttribute("data-doc-drawer-toggle")) {
    menuButton.addEventListener("click", function () {
      const isOpen = mainNav.classList.toggle("is-open");
      menuButton.setAttribute("aria-expanded", String(isOpen));
    });

    mainNav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        mainNav.classList.remove("is-open");
        menuButton.setAttribute("aria-expanded", "false");
      });
    });
  }

  if (mainNav) {
    const navLinks = Array.from(mainNav.querySelectorAll("a[href^='#']"));
    const header = document.querySelector(".site-header");
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let activeTargetId = null;
    let sectionRaf = 0;
    let highlightTimer = null;
    let anchorScrollRaf = 0;

    const getAnchorOffset = function () {
      const headerHeight = header ? Math.round(header.getBoundingClientRect().height) : 72;
      return headerHeight + 16;
    };

    const syncAnchorOffsetVar = function () {
      document.documentElement.style.setProperty("--anchor-offset", getAnchorOffset() + "px");
    };

    const setTopNavActive = function (id) {
      if (!id || id === activeTargetId) return;
      activeTargetId = id;
      navLinks.forEach(function (link) {
        const isActive = link.getAttribute("href") === "#" + id;
        link.classList.toggle("is-active", isActive);
        if (isActive) {
          link.setAttribute("aria-current", "location");
        } else {
          link.removeAttribute("aria-current");
        }
      });
    };

    const highlightAnchorTarget = function (target) {
      if (!target) return;
      target.classList.add("is-anchor-target");
      if (highlightTimer) {
        window.clearTimeout(highlightTimer);
      }
      highlightTimer = window.setTimeout(function () {
        target.classList.remove("is-anchor-target");
      }, 1350);
    };

    const stopAnchorAnimation = function () {
      if (!anchorScrollRaf) return;
      window.cancelAnimationFrame(anchorScrollRaf);
      anchorScrollRaf = 0;
    };

    const easeInOutQuart = function (value) {
      return value < 0.5
        ? 8 * Math.pow(value, 4)
        : 1 - Math.pow(-2 * value + 2, 4) / 2;
    };

    const animateScrollTo = function (targetTop, smooth, done) {
      stopAnchorAnimation();
      const maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
      const finalTop = Math.min(maxScroll, Math.max(0, Math.round(targetTop)));
      const startTop = window.scrollY;
      const distance = finalTop - startTop;

      if (!smooth || prefersReducedMotion.matches || Math.abs(distance) < 8) {
        window.scrollTo({ top: finalTop, behavior: "auto" });
        if (typeof done === "function") done();
        return;
      }

      const duration = Math.min(950, Math.max(480, Math.abs(distance) * 0.8));
      let startTime = 0;

      const step = function (timestamp) {
        if (!startTime) startTime = timestamp;
        const elapsed = timestamp - startTime;
        const progress = Math.min(1, elapsed / duration);
        const eased = easeInOutQuart(progress);
        window.scrollTo({ top: startTop + distance * eased, behavior: "auto" });

        if (progress < 1) {
          anchorScrollRaf = window.requestAnimationFrame(step);
        } else {
          anchorScrollRaf = 0;
          if (typeof done === "function") done();
        }
      };

      anchorScrollRaf = window.requestAnimationFrame(step);
    };

    const scrollToAnchor = function (target, smooth) {
      if (!target) return;
      const top = target.getBoundingClientRect().top + window.scrollY - getAnchorOffset();
      animateScrollTo(Math.max(0, top), smooth, function () {
        highlightAnchorTarget(target);
      });
      if (target.id) {
        setTopNavActive(target.id);
      }
    };

    navLinks.forEach(function (link) {
      const href = link.getAttribute("href");
      if (!href || href.length < 2) return;
      const target = document.querySelector(href);
      if (!target) return;

      link.addEventListener("click", function (event) {
        event.preventDefault();
        if (mainNav.classList.contains("is-open")) {
          mainNav.classList.remove("is-open");
          if (menuButton) menuButton.setAttribute("aria-expanded", "false");
        }
        scrollToAnchor(target, true);
        if (window.location.hash !== href) {
          history.replaceState(null, "", href);
        }
      });
    });

    const anchorSections = navLinks
      .map(function (link) {
        const href = link.getAttribute("href");
        return href && href.startsWith("#") ? document.querySelector(href) : null;
      })
      .filter(Boolean);

    const updateTopNavActiveByScroll = function () {
      sectionRaf = 0;
      if (anchorSections.length === 0) return;
      const probe = window.scrollY + getAnchorOffset() + 8;
      let current = anchorSections[0];
      anchorSections.forEach(function (section) {
        if (section.offsetTop <= probe) current = section;
      });
      if (current && current.id) setTopNavActive(current.id);
    };

    const scheduleTopNavUpdate = function () {
      if (sectionRaf) return;
      sectionRaf = window.requestAnimationFrame(updateTopNavActiveByScroll);
    };

    syncAnchorOffsetVar();
    scheduleTopNavUpdate();

    window.addEventListener("scroll", scheduleTopNavUpdate, { passive: true });
    window.addEventListener("wheel", stopAnchorAnimation, { passive: true });
    window.addEventListener("keydown", function (event) {
      if (
        event.key === "ArrowDown" ||
        event.key === "ArrowUp" ||
        event.key === "PageDown" ||
        event.key === "PageUp" ||
        event.key === "Home" ||
        event.key === "End" ||
        event.key === " "
      ) {
        stopAnchorAnimation();
      }
    });
    window.addEventListener("resize", function () {
      syncAnchorOffsetVar();
      scheduleTopNavUpdate();
    });

    window.addEventListener("load", function () {
      syncAnchorOffsetVar();
      const hash = window.location.hash;
      if (hash && hash.length > 1) {
        const target = document.querySelector(hash);
        if (target) {
          window.requestAnimationFrame(function () {
            scrollToAnchor(target, false);
          });
        }
      }
      scheduleTopNavUpdate();
    });
  }

  const setupPageTransition = function () {
    const body = document.body;
    if (!body) return;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (prefersReducedMotion.matches) {
      body.classList.remove("is-page-entering", "is-page-leaving", "is-page-ready");
      return;
    }

    body.classList.add("page-transition-enabled", "is-page-entering");
    window.requestAnimationFrame(function () {
      window.requestAnimationFrame(function () {
        body.classList.remove("is-page-entering");
        body.classList.add("is-page-ready");
      });
    });

    document.addEventListener("click", function (event) {
      const link = event.target.closest("a[href]");
      if (!link) return;
      if (event.defaultPrevented) return;
      if (link.target && link.target !== "_self") return;
      if (link.hasAttribute("download")) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      const href = link.getAttribute("href");
      if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) return;

      let url;
      try {
        url = new URL(link.href, window.location.href);
      } catch (_error) {
        return;
      }

      if (url.origin !== window.location.origin) return;

      const experimentalPathPattern = /\/experimental\//i;
      if (
        !experimentalPathPattern.test(window.location.pathname) ||
        !experimentalPathPattern.test(url.pathname)
      ) {
        return;
      }

      const isSamePage =
        url.pathname === window.location.pathname &&
        url.search === window.location.search;
      if (isSamePage) return;

      event.preventDefault();
      body.classList.remove("is-page-entering");
      body.classList.add("is-page-leaving");
      window.setTimeout(function () {
        window.location.href = url.href;
      }, 240);
    });
  };

  setupPageTransition();

  const scrollProgress = document.querySelector("[data-scroll-progress]");
  const scrollProgressBar = document.querySelector("[data-scroll-progress-bar]");
  const scrollProgressThumb = document.querySelector("[data-scroll-progress-thumb]");
  if (scrollProgress && scrollProgressBar && scrollProgressThumb) {
    let hideTimer = null;
    let rafId = 0;
    let reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const responsiveScrollQuery = window.matchMedia("(max-width: 980px)");
    let draggingPointerId = null;
    let pendingTap = null;

    const clamp01 = function (value) {
      return Math.min(1, Math.max(0, value));
    };

    const isResponsiveActive = function () {
      return responsiveScrollQuery.matches;
    };

    const isThumbTarget = function (target) {
      return target === scrollProgressThumb || scrollProgressThumb.contains(target);
    };

    const clearPendingTap = function () {
      pendingTap = null;
    };

    const showProgress = function () {
      if (!isResponsiveActive()) return;
      scrollProgress.classList.add("is-visible");
      if (hideTimer) {
        window.clearTimeout(hideTimer);
        hideTimer = null;
      }
    };

    const scheduleHide = function () {
      if (!isResponsiveActive()) return;
      if (draggingPointerId !== null) return;
      if (hideTimer) window.clearTimeout(hideTimer);
      hideTimer = window.setTimeout(function () {
        scrollProgress.classList.remove("is-visible");
      }, 700);
    };

    const scrollToRatio = function (ratio, smooth) {
      const doc = document.documentElement;
      const maxScroll = Math.max(0, doc.scrollHeight - window.innerHeight);
      window.scrollTo({
        top: clamp01(ratio) * maxScroll,
        behavior: smooth && !reducedMotion ? "smooth" : "auto"
      });
    };

    const getRatioFromClientY = function (clientY) {
      const rect = scrollProgress.getBoundingClientRect();
      if (rect.height <= 0) return 0;
      return clamp01((clientY - rect.top) / rect.height);
    };

    const drawScrollProgress = function () {
      rafId = 0;
      if (!isResponsiveActive()) {
        clearPendingTap();
        draggingPointerId = null;
        scrollProgress.classList.remove("is-visible", "is-dragging");
        return;
      }
      const doc = document.documentElement;
      const maxScroll = Math.max(1, doc.scrollHeight - window.innerHeight);
      const progress = clamp01(window.scrollY / maxScroll);
      scrollProgressBar.style.transform = "translateX(-50%) scaleY(" + progress + ")";
      scrollProgressThumb.style.top = progress * 100 + "%";

      showProgress();
      scheduleHide();
    };

    const requestDraw = function () {
      if (rafId) return;
      rafId = window.requestAnimationFrame(drawScrollProgress);
    };

    window.addEventListener("scroll", requestDraw, { passive: true });
    window.addEventListener("resize", requestDraw);
    const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (typeof reducedMotionQuery.addEventListener === "function") {
      reducedMotionQuery.addEventListener("change", function (event) {
        reducedMotion = event.matches;
      });
    }

    if (typeof responsiveScrollQuery.addEventListener === "function") {
      responsiveScrollQuery.addEventListener("change", function (event) {
        if (!event.matches) {
          clearPendingTap();
          draggingPointerId = null;
          scrollProgress.classList.remove("is-visible", "is-dragging");
          if (hideTimer) {
            window.clearTimeout(hideTimer);
            hideTimer = null;
          }
        }
        requestDraw();
      });
    }

    const onPointerMove = function (event) {
      if (draggingPointerId !== null && event.pointerId === draggingPointerId) {
        event.preventDefault();
        const ratio = getRatioFromClientY(event.clientY);
        scrollToRatio(ratio, false);
        requestDraw();
        return;
      }

      if (!pendingTap || event.pointerId !== pendingTap.pointerId) return;
      const movedX = Math.abs(event.clientX - pendingTap.startX);
      const movedY = Math.abs(event.clientY - pendingTap.startY);
      if (movedX > 12 || movedY > 12) {
        clearPendingTap();
      }
    };

    const stopDragging = function (event) {
      if (draggingPointerId !== null && event.pointerId === draggingPointerId) {
        draggingPointerId = null;
        scrollProgress.classList.remove("is-dragging");
        if (typeof scrollProgress.releasePointerCapture === "function") {
          try {
            scrollProgress.releasePointerCapture(event.pointerId);
          } catch (_error) {}
        }
        scheduleHide();
        return;
      }

      if (!pendingTap || event.pointerId !== pendingTap.pointerId) return;
      if (event.type === "pointercancel") {
        clearPendingTap();
        scheduleHide();
        return;
      }
      const elapsed = performance.now() - pendingTap.startTime;
      const movedX = Math.abs(event.clientX - pendingTap.startX);
      const movedY = Math.abs(event.clientY - pendingTap.startY);

      if (elapsed < 350 && movedX < 12 && movedY < 12) {
        const ratio = getRatioFromClientY(event.clientY);
        scrollToRatio(ratio, !reducedMotion);
        requestDraw();
      }

      clearPendingTap();
      scheduleHide();
    };

    scrollProgress.addEventListener("pointerdown", function (event) {
      if (!isResponsiveActive()) return;

      if (isThumbTarget(event.target)) {
        event.preventDefault();
        clearPendingTap();
        draggingPointerId = event.pointerId;
        scrollProgress.classList.add("is-dragging");
        if (typeof scrollProgress.setPointerCapture === "function") {
          try {
            scrollProgress.setPointerCapture(event.pointerId);
          } catch (_error) {}
        }
        showProgress();
        requestDraw();
        return;
      }

      pendingTap = {
        pointerId: event.pointerId,
        startX: event.clientX,
        startY: event.clientY,
        startTime: performance.now()
      };
      showProgress();
    });

    scrollProgress.addEventListener("pointermove", onPointerMove);
    scrollProgress.addEventListener("pointerup", stopDragging);
    scrollProgress.addEventListener("pointercancel", stopDragging);
    scrollProgress.addEventListener("pointerleave", function () {
      clearPendingTap();
      scheduleHide();
    });

    requestDraw();
  }

  if (backTopButton) {
    const toggleBackTop = function () {
      if (window.scrollY > 420) {
        backTopButton.classList.add("is-visible");
      } else {
        backTopButton.classList.remove("is-visible");
      }
    };

    window.addEventListener("scroll", toggleBackTop, { passive: true });
    toggleBackTop();

    backTopButton.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  if (docNav) {
    const links = Array.from(docNav.querySelectorAll("a"));
    const sections = links
      .map(function (link) {
        const id = link.getAttribute("href");
        if (!id || !id.startsWith("#")) return null;
        return document.querySelector(id);
      })
      .filter(Boolean);

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const drawerMedia = window.matchMedia("(max-width: 980px)");
    let activeId = null;
    let lastDrawerTrigger = null;

    const isDrawerMode = function () {
      return drawerMedia.matches;
    };

    const setDrawerOpen = function (open, restoreFocus) {
      if (!docDrawerToggle || !docSidebar || !docDrawerOverlay) return;
      document.body.classList.toggle("doc-drawer-open", open);
      docDrawerToggle.setAttribute("aria-expanded", String(open));
      docDrawerOverlay.hidden = !open;
      if (open) {
        lastDrawerTrigger = document.activeElement;
        if (docDrawerClose) docDrawerClose.focus();
      } else if (restoreFocus && lastDrawerTrigger && typeof lastDrawerTrigger.focus === "function") {
        lastDrawerTrigger.focus();
      }
    };

    const closeDrawer = function (restoreFocus) {
      setDrawerOpen(false, restoreFocus !== false);
    };

    const openDrawer = function () {
      setDrawerOpen(true, true);
    };

    if (docDrawerToggle && docSidebar && docDrawerOverlay) {
      docDrawerToggle.addEventListener("click", function () {
        if (document.body.classList.contains("doc-drawer-open")) {
          closeDrawer();
        } else {
          openDrawer();
        }
      });
    }

    if (docDrawerClose) {
      docDrawerClose.addEventListener("click", function () {
        closeDrawer();
      });
    }

    if (docDrawerOverlay) {
      docDrawerOverlay.addEventListener("click", function () {
        closeDrawer();
      });
    }

    if (typeof drawerMedia.addEventListener === "function") {
      drawerMedia.addEventListener("change", function () {
        closeDrawer();
      });
    }

    const ensureLinkVisible = function (link) {
      const containerRect = docNav.getBoundingClientRect();
      const linkRect = link.getBoundingClientRect();
      const pad = 8;
      const isAbove = linkRect.top < containerRect.top + pad;
      const isBelow = linkRect.bottom > containerRect.bottom - pad;
      if (!isAbove && !isBelow) return;

      link.scrollIntoView({
        block: "nearest",
        inline: "nearest",
        behavior: prefersReducedMotion ? "auto" : "smooth"
      });
    };

    const setActiveLink = function (id) {
      if (!id || id === activeId) return;
      activeId = id;

      links.forEach(function (link) {
        const active = link.getAttribute("href") === "#" + id;
        link.classList.toggle("is-active", active);
        if (active) {
          link.setAttribute("aria-current", "location");
          ensureLinkVisible(link);
        } else {
          link.removeAttribute("aria-current");
        }
      });
    };

    links.forEach(function (link) {
      link.addEventListener("click", function (event) {
        const href = link.getAttribute("href");
        if (!href || !href.startsWith("#")) return;
        const target = document.querySelector(href);
        if (!target) return;
        event.preventDefault();
        target.scrollIntoView({
          behavior: prefersReducedMotion ? "auto" : "smooth",
          block: "start"
        });
        if (isDrawerMode()) {
          closeDrawer(false);
        }
      });
    });

    if (sections.length > 0 && "IntersectionObserver" in window) {
      const visibility = new Map();
      const topOffset = 115;

      const observer = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            visibility.set(entry.target, entry);
          });

          let bestSection = null;
          let bestDistance = Infinity;

          sections.forEach(function (section) {
            const state = visibility.get(section);
            if (!state || !state.isIntersecting) return;
            const distance = Math.abs(state.boundingClientRect.top - topOffset);
            if (distance < bestDistance) {
              bestDistance = distance;
              bestSection = section;
            }
          });

          if (!bestSection) {
            const marker = window.scrollY + topOffset;
            sections.forEach(function (section) {
              if (section.offsetTop <= marker) bestSection = section;
            });
          }

          if (!bestSection) bestSection = sections[0];
          setActiveLink(bestSection.getAttribute("id"));
        },
        {
          rootMargin: "-18% 0px -62% 0px",
          threshold: [0, 0.1, 0.25, 0.5, 0.75, 1]
        }
      );

      sections.forEach(function (section) {
        observer.observe(section);
      });

      setActiveLink(sections[0].getAttribute("id"));
    }

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && document.body.classList.contains("doc-drawer-open")) {
        closeDrawer();
      }
    });
  }

  const revealTargets = Array.from(
    document.querySelectorAll(
      ".content-block, .feature-card, .guide-panel, .usage-card, .roadmap-item, .visual-guide-block, .hero-main, .hero-panel, .powerbi-hero-brand"
    )
  );
  if (revealTargets.length > 0 && "IntersectionObserver" in window) {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      revealTargets.forEach(function (el) {
        el.classList.add("is-visible");
      });
    } else {
      const observer = new IntersectionObserver(
        function (entries, obs) {
          entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;
            entry.target.classList.add("is-visible");
            obs.unobserve(entry.target);
          });
        },
        { rootMargin: "0px 0px -12% 0px", threshold: 0.08 }
      );

      revealTargets.forEach(function (el) {
        el.classList.add("reveal-on-scroll");
        observer.observe(el);
      });
    }
  }

  const filterSimulator = document.querySelector("[data-filter-simulator]");
  if (filterSimulator) {
    const modeSelect = filterSimulator.querySelector("[data-period-mode]");
    const valueInput = filterSimulator.querySelector("[data-period-value]");
    const unitSelect = filterSimulator.querySelector("[data-period-unit]");
    const startInput = filterSimulator.querySelector("[data-date-start]");
    const endInput = filterSimulator.querySelector("[data-date-end]");
    const sliderStart = filterSimulator.querySelector("[data-slider-start]");
    const sliderEnd = filterSimulator.querySelector("[data-slider-end]");
    const sliderRange = filterSimulator.querySelector("[data-slider-range]");
    const periodDisplay = filterSimulator.querySelector("[data-period-display]");
    const calendarBox = filterSimulator.querySelector("[data-filter-calendar]");
    const calendarGrid = filterSimulator.querySelector("[data-cal-grid]");
    const calendarTitle = filterSimulator.querySelector("[data-cal-title]");
    const calPrev = filterSimulator.querySelector("[data-cal-prev]");
    const calNext = filterSimulator.querySelector("[data-cal-next]");

    const dayMs = 24 * 60 * 60 * 1000;
    const minDate = new Date(Date.UTC(2026, 0, 1));
    const maxDate = new Date(Date.UTC(2026, 11, 31));

    const utcDate = function (year, month, day) {
      return new Date(Date.UTC(year, month, day));
    };

    const toUtcDay = function (date) {
      return utcDate(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
    };

    const clampDate = function (date) {
      if (date < minDate) return new Date(minDate.getTime());
      if (date > maxDate) return new Date(maxDate.getTime());
      return date;
    };

    const addDays = function (date, days) {
      return new Date(date.getTime() + days * dayMs);
    };

    const addMonths = function (date, months) {
      return utcDate(date.getUTCFullYear(), date.getUTCMonth() + months, date.getUTCDate());
    };

    const startOfWeekMonday = function (date) {
      const day = (date.getUTCDay() + 6) % 7;
      return addDays(date, -day);
    };

    const endOfWeekMonday = function (date) {
      return addDays(startOfWeekMonday(date), 6);
    };

    const startOfMonth = function (date) {
      return utcDate(date.getUTCFullYear(), date.getUTCMonth(), 1);
    };

    const endOfMonth = function (date) {
      return utcDate(date.getUTCFullYear(), date.getUTCMonth() + 1, 0);
    };

    const startOfYear = function (date) {
      return utcDate(date.getUTCFullYear(), 0, 1);
    };

    const endOfYear = function (date) {
      return utcDate(date.getUTCFullYear(), 11, 31);
    };

    const formatDdMmYyyy = function (date) {
      const dd = String(date.getUTCDate()).padStart(2, "0");
      const mm = String(date.getUTCMonth() + 1).padStart(2, "0");
      const yyyy = date.getUTCFullYear();
      return dd + "/" + mm + "/" + yyyy;
    };

    const parseDdMmYyyy = function (value) {
      const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec((value || "").trim());
      if (!match) return null;
      const day = Number(match[1]);
      const month = Number(match[2]);
      const year = Number(match[3]);
      const candidate = utcDate(year, month - 1, day);
      if (
        candidate.getUTCFullYear() !== year ||
        candidate.getUTCMonth() !== month - 1 ||
        candidate.getUTCDate() !== day
      ) {
        return null;
      }
      return candidate;
    };

    const diffDays = function (from, to) {
      return Math.round((to.getTime() - from.getTime()) / dayMs);
    };

    let baseStart = null;
    let baseEnd = null;
    let subStart = null;
    let subEnd = null;
    let calendarTarget = null;
    let calendarMonth = null;

    const syncSliderRangePaint = function () {
      const a = Number(sliderStart.value);
      const b = Number(sliderEnd.value);
      const low = Math.min(a, b);
      const high = Math.max(a, b);
      const max = Math.max(1, Number(sliderStart.max));
      const leftPct = (low / max) * 100;
      const rightPct = (high / max) * 100;
      sliderRange.style.left = leftPct + "%";
      sliderRange.style.right = 100 - rightPct + "%";
    };

    const syncSliderBounds = function () {
      const max = Math.max(0, diffDays(baseStart, baseEnd));
      sliderStart.min = "0";
      sliderStart.max = String(max);
      sliderEnd.min = "0";
      sliderEnd.max = String(max);
    };

    const syncSubRangeWithinBase = function () {
      if (!subStart || !subEnd) {
        subStart = new Date(baseStart.getTime());
        subEnd = new Date(baseEnd.getTime());
      }
      if (subStart < baseStart) subStart = new Date(baseStart.getTime());
      if (subEnd > baseEnd) subEnd = new Date(baseEnd.getTime());
      if (subStart > subEnd) {
        subStart = new Date(baseStart.getTime());
        subEnd = new Date(baseEnd.getTime());
      }
    };

    const updateUiFromRanges = function () {
      periodDisplay.textContent = formatDdMmYyyy(baseStart) + " - " + formatDdMmYyyy(baseEnd);
      startInput.value = formatDdMmYyyy(subStart);
      endInput.value = formatDdMmYyyy(subEnd);
      sliderStart.value = String(diffDays(baseStart, subStart));
      sliderEnd.value = String(diffDays(baseStart, subEnd));
      syncSliderRangePaint();
    };

    const setBaseRange = function (start, end) {
      let s = clampDate(toUtcDay(start));
      let e = clampDate(toUtcDay(end));
      if (s > e) {
        const tmp = s;
        s = e;
        e = tmp;
      }
      baseStart = s;
      baseEnd = e;
      syncSliderBounds();
      syncSubRangeWithinBase();
      updateUiFromRanges();
      if (!calendarBox.hidden) renderCalendar();
    };

    const computeFromPeriod = function () {
      const mode = modeSelect.value;
      const unit = unitSelect.value;
      const qty = Math.max(1, Number(valueInput.value) || 1);
      valueInput.value = String(qty);

      const today = clampDate(toUtcDay(new Date()));
      let start = today;
      let end = today;

      if (unit === "days") {
        if (mode === "last") {
          start = addDays(today, -(qty - 1));
          end = today;
        } else if (mode === "next") {
          start = addDays(today, 1);
          end = addDays(start, qty - 1);
        } else {
          start = today;
          end = addDays(today, qty - 1);
        }
      } else if (unit === "weeks") {
        const length = qty * 7;
        if (mode === "last") {
          start = addDays(today, -(length - 1));
          end = today;
        } else if (mode === "next") {
          start = addDays(today, 1);
          end = addDays(start, length - 1);
        } else {
          start = today;
          end = addDays(today, length - 1);
        }
      } else if (unit === "weeks-calendar") {
        const thisWeekStart = startOfWeekMonday(today);
        const thisWeekEnd = endOfWeekMonday(today);
        if (mode === "last") {
          end = addDays(thisWeekStart, -1);
          start = addDays(thisWeekStart, -(qty * 7));
        } else if (mode === "next") {
          start = addDays(thisWeekEnd, 1);
          end = addDays(start, qty * 7 - 1);
        } else {
          start = thisWeekStart;
          end = addDays(thisWeekStart, qty * 7 - 1);
        }
      } else if (unit === "months") {
        const length = qty * 30;
        if (mode === "last") {
          start = addDays(today, -(length - 1));
          end = today;
        } else if (mode === "next") {
          start = addDays(today, 1);
          end = addDays(start, length - 1);
        } else {
          start = today;
          end = addDays(today, length - 1);
        }
      } else if (unit === "months-calendar") {
        const monthStart = startOfMonth(today);
        if (mode === "last") {
          const targetStart = startOfMonth(addMonths(monthStart, -qty));
          start = targetStart;
          end = addDays(monthStart, -1);
        } else if (mode === "next") {
          const targetStart = startOfMonth(addMonths(monthStart, 1));
          start = targetStart;
          end = endOfMonth(addMonths(targetStart, qty - 1));
        } else {
          start = monthStart;
          end = endOfMonth(addMonths(monthStart, qty - 1));
        }
      } else if (unit === "years") {
        const length = qty * 365;
        if (mode === "last") {
          start = addDays(today, -(length - 1));
          end = today;
        } else if (mode === "next") {
          start = addDays(today, 1);
          end = addDays(start, length - 1);
        } else {
          start = today;
          end = addDays(today, length - 1);
        }
      } else if (unit === "years-calendar") {
        const yearStart = startOfYear(today);
        if (mode === "last") {
          start = startOfYear(utcDate(today.getUTCFullYear() - qty, 0, 1));
          end = addDays(yearStart, -1);
        } else if (mode === "next") {
          start = startOfYear(utcDate(today.getUTCFullYear() + 1, 0, 1));
          end = endOfYear(utcDate(start.getUTCFullYear() + qty - 1, 0, 1));
        } else {
          start = yearStart;
          end = endOfYear(utcDate(today.getUTCFullYear() + qty - 1, 0, 1));
        }
      }

      setBaseRange(start, end);
    };

    const applyManualInputs = function () {
      const parsedStart = parseDdMmYyyy(startInput.value);
      const parsedEnd = parseDdMmYyyy(endInput.value);
      if (!parsedStart || !parsedEnd) {
        updateUiFromRanges();
        return;
      }
      subStart = clampDate(parsedStart);
      subEnd = clampDate(parsedEnd);
      syncSubRangeWithinBase();
      updateUiFromRanges();
    };

    const applySliderInputs = function (source) {
      let startOffset = Math.max(0, Number(sliderStart.value));
      let endOffset = Math.max(0, Number(sliderEnd.value));

      if (source === "start" && startOffset > endOffset) {
        endOffset = startOffset;
        sliderEnd.value = String(endOffset);
      }
      if (source === "end" && endOffset < startOffset) {
        startOffset = endOffset;
        sliderStart.value = String(startOffset);
      }

      subStart = addDays(baseStart, startOffset);
      subEnd = addDays(baseStart, endOffset);
      syncSubRangeWithinBase();
      updateUiFromRanges();
    };

    const renderCalendar = function () {
      if (!calendarMonth) {
        calendarMonth = utcDate(subStart.getUTCFullYear(), subStart.getUTCMonth(), 1);
      }
      calendarTitle.textContent = calendarMonth.toLocaleString("es-ES", {
        month: "long",
        year: "numeric",
        timeZone: "UTC"
      });

      const monthStart = utcDate(calendarMonth.getUTCFullYear(), calendarMonth.getUTCMonth(), 1);
      const gridStart = startOfWeekMonday(monthStart);
      const todayDate = clampDate(toUtcDay(new Date()));
      calendarGrid.innerHTML = "";

      for (let i = 0; i < 42; i += 1) {
        const date = addDays(gridStart, i);
        const button = document.createElement("button");
        button.type = "button";
        button.textContent = String(date.getUTCDate());
        button.className = "filter-calendar-day";

        if (date.getUTCMonth() !== calendarMonth.getUTCMonth()) {
          button.classList.add("is-outside");
        }
        if (date < baseStart || date > baseEnd) {
          button.disabled = true;
          button.classList.add("is-disabled");
        }
        if (date.getTime() === subStart.getTime() || date.getTime() === subEnd.getTime()) {
          button.classList.add("is-selected");
        }
        if (date > subStart && date < subEnd) {
          button.classList.add("is-in-range");
        }
        if (date.getTime() === todayDate.getTime()) {
          button.classList.add("is-today");
          button.setAttribute("aria-label", "Hoy, " + String(date.getUTCDate()));
        }

        button.addEventListener("click", function () {
          if (button.disabled || !calendarTarget) return;
          if (calendarTarget === startInput) {
            subStart = new Date(date.getTime());
            if (subStart > subEnd) subEnd = new Date(subStart.getTime());
          } else {
            subEnd = new Date(date.getTime());
            if (subEnd < subStart) subStart = new Date(subEnd.getTime());
          }
          syncSubRangeWithinBase();
          updateUiFromRanges();
          hideCalendar();
        });

        calendarGrid.appendChild(button);
      }
    };

    const showCalendarFor = function (targetInput) {
      calendarTarget = targetInput;
      const parsed = parseDdMmYyyy(targetInput.value);
      const reference = parsed || subStart;
      calendarMonth = utcDate(reference.getUTCFullYear(), reference.getUTCMonth(), 1);
      calendarBox.hidden = false;
      renderCalendar();
    };

    const hideCalendar = function () {
      calendarBox.hidden = true;
      calendarTarget = null;
    };

    modeSelect.addEventListener("change", computeFromPeriod);
    unitSelect.addEventListener("change", computeFromPeriod);
    valueInput.addEventListener("input", computeFromPeriod);
    valueInput.addEventListener("change", computeFromPeriod);

    startInput.addEventListener("change", applyManualInputs);
    endInput.addEventListener("change", applyManualInputs);
    startInput.addEventListener("blur", applyManualInputs);
    endInput.addEventListener("blur", applyManualInputs);

    sliderStart.addEventListener("input", function () {
      applySliderInputs("start");
    });
    sliderEnd.addEventListener("input", function () {
      applySliderInputs("end");
    });

    startInput.addEventListener("focus", function () {
      showCalendarFor(startInput);
    });
    endInput.addEventListener("focus", function () {
      showCalendarFor(endInput);
    });
    startInput.addEventListener("click", function () {
      showCalendarFor(startInput);
    });
    endInput.addEventListener("click", function () {
      showCalendarFor(endInput);
    });

    calPrev.addEventListener("click", function () {
      calendarMonth = utcDate(calendarMonth.getUTCFullYear(), calendarMonth.getUTCMonth() - 1, 1);
      renderCalendar();
    });

    calNext.addEventListener("click", function () {
      calendarMonth = utcDate(calendarMonth.getUTCFullYear(), calendarMonth.getUTCMonth() + 1, 1);
      renderCalendar();
    });

    document.addEventListener("pointerdown", function (event) {
      if (calendarBox.hidden) return;
      const target = event.target;
      const clickedDateInput = target === startInput || target === endInput;
      const clickedInsideCalendar = calendarBox.contains(target);
      if (!clickedDateInput && !clickedInsideCalendar) {
        hideCalendar();
      }
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && !calendarBox.hidden) {
        hideCalendar();
      }
    });

    computeFromPeriod();
  }

  const visualSlots = Array.from(document.querySelectorAll("[data-visual-slot]"));
  if (visualSlots.length > 0) {
    const syncSlotState = function (slot) {
      const image = slot.querySelector("img");
      if (!image) return;
      const isLoaded = image.complete && image.naturalWidth > 0 && image.naturalHeight > 0;
      slot.classList.toggle("is-loaded", isLoaded);
    };

    const bindSlot = function (slot) {
      const image = slot.querySelector("img");
      if (!image) return;
      if (image.dataset.visualBound === "true") {
        syncSlotState(slot);
        return;
      }

      const onLoad = function () {
        syncSlotState(slot);
      };

      const onError = function () {
        slot.classList.remove("is-loaded");
      };

      image.addEventListener("load", onLoad);
      image.addEventListener("error", onError);
      image.dataset.visualBound = "true";

      syncSlotState(slot);

      if (typeof image.decode === "function") {
        image.decode().then(onLoad).catch(function () {
          syncSlotState(slot);
        });
      }
    };

    const initVisualSlots = function () {
      visualSlots.forEach(bindSlot);
    };

    initVisualSlots();
    window.addEventListener("load", initVisualSlots);
    window.setTimeout(initVisualSlots, 250);
  }
})();
