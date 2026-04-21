(function () {
  const menuButton = document.querySelector("[data-menu-toggle]");
  const mainNav = document.querySelector("[data-main-nav]");
  const backTopButton = document.querySelector("[data-back-top]");
  const docNav = document.querySelector("[data-doc-nav]");

  if (menuButton && mainNav) {
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
    let activeId = null;

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

    document.addEventListener("click", function (event) {
      if (calendarBox.hidden) return;
      if (!filterSimulator.contains(event.target)) {
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
