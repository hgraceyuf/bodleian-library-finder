const currentTimeEl = document.querySelector("#current-time");
const currentDateEl = document.querySelector("#current-date");
const openCountEl = document.querySelector("#open-count");
const nextChangeEl = document.querySelector("#next-change");
const listEl = document.querySelector("#libraries-list");
const searchInput = document.querySelector("#search-input");
const openOnlyToggle = document.querySelector("#open-only-toggle");
const libraryData = window.libraryData;

const dayNames = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday"
];

const prettyDayNames = {
  sunday: "Sunday",
  monday: "Monday",
  tuesday: "Tuesday",
  wednesday: "Wednesday",
  thursday: "Thursday",
  friday: "Friday",
  saturday: "Saturday"
};

let showOpenOnly = false;

function parseTimeString(value) {
  const [hours, minutes] = value.split(":").map(Number);
  return hours * 60 + minutes;
}

function formatTime(value) {
  const [hours, minutes] = value.split(":").map(Number);
  return new Intl.DateTimeFormat(undefined, {
    hour: "numeric",
    minute: "2-digit"
  }).format(new Date(2024, 0, 1, hours, minutes));
}

function formatRange(range) {
  const [start, end] = range.split("-");
  return `${formatTime(start)} to ${formatTime(end)}`;
}

function getCurrentDayKey(date) {
  return dayNames[date.getDay()];
}

function getMinutesNow(date) {
  return date.getHours() * 60 + date.getMinutes();
}

function evaluateLibrary(library, now) {
  const dayKey = getCurrentDayKey(now);
  const ranges = library.schedule[dayKey] ?? [];
  const currentMinutes = getMinutesNow(now);

  let isOpen = false;
  let closesAt = null;
  let opensAt = null;

  for (const range of ranges) {
    const [start, end] = range.split("-");
    const startMinutes = parseTimeString(start);
    const endMinutes = parseTimeString(end);

    if (currentMinutes >= startMinutes && currentMinutes < endMinutes) {
      isOpen = true;
      closesAt = end;
      break;
    }

    if (currentMinutes < startMinutes && !opensAt) {
      opensAt = start;
    }
  }

  return {
    ...library,
    dayKey,
    ranges,
    isOpen,
    closesAt,
    opensAt
  };
}

function renderSummary(libraries) {
  const openLibraries = libraries.filter((library) => library.isOpen);
  openCountEl.textContent = `${openLibraries.length} ${openLibraries.length === 1 ? "library" : "libraries"}`;

  if (openLibraries.length > 0) {
    const earliestClose = openLibraries
      .map((library) => library.closesAt)
      .filter(Boolean)
      .sort()[0];

    nextChangeEl.textContent = earliestClose
      ? `Next closing time: ${formatTime(earliestClose)}`
      : "Open now";
    return;
  }

  const nextOpening = libraries
    .map((library) => library.opensAt)
    .filter(Boolean)
    .sort()[0];

  nextChangeEl.textContent = nextOpening
    ? `Next opening time: ${formatTime(nextOpening)}`
    : "No more openings today";
}

function renderLibraries() {
  const now = new Date();
  const evaluated = libraryData.libraries.map((library) =>
    evaluateLibrary(library, now)
  );
  const searchTerm = searchInput.value.trim().toLowerCase();

  renderSummary(evaluated);

  const filtered = evaluated.filter((library) => {
    const matchesSearch =
      !searchTerm ||
      library.name.toLowerCase().includes(searchTerm) ||
      library.address.toLowerCase().includes(searchTerm);

    const matchesOpen = !showOpenOnly || library.isOpen;
    return matchesSearch && matchesOpen;
  });

  if (filtered.length === 0) {
    listEl.innerHTML =
      '<div class="empty-state">No libraries match your current filter.</div>';
    return;
  }

  listEl.innerHTML = filtered
    .map((library) => {
      const todayHours =
        library.ranges.length > 0
          ? library.ranges.map(formatRange).join(" • ")
          : "Closed all day";

      const statusText = library.isOpen
        ? `Open until ${formatTime(library.closesAt)}`
        : library.opensAt
          ? `Closed now, opens at ${formatTime(library.opensAt)}`
          : "Closed for the rest of today";

      return `
        <article class="library-card">
          <div class="card-header">
            <div>
              <h3>${library.name}</h3>
              <p class="muted">${library.address}</p>
            </div>
            <span class="status-pill ${library.isOpen ? "open" : "closed"}">
              ${library.isOpen ? "Open" : "Closed"}
            </span>
          </div>
          <p class="today-hours">${prettyDayNames[library.dayKey]}: ${todayHours}</p>
          <p class="schedule-line">${statusText}</p>
        </article>
      `;
    })
    .join("");
}

function renderClock() {
  const now = new Date();

  currentTimeEl.textContent = new Intl.DateTimeFormat(undefined, {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit"
  }).format(now);

  currentDateEl.textContent = new Intl.DateTimeFormat(undefined, {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric"
  }).format(now);

  renderLibraries();
}

searchInput.addEventListener("input", renderLibraries);

openOnlyToggle.addEventListener("click", () => {
  showOpenOnly = !showOpenOnly;
  openOnlyToggle.classList.toggle("is-active", showOpenOnly);
  openOnlyToggle.textContent = showOpenOnly ? "Showing open only" : "Show open only";
  renderLibraries();
});

if ("serviceWorker" in navigator && window.location.protocol !== "file:") {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./service-worker.js").catch(() => {
      // Ignore failures for simple local usage.
    });
  });
}

renderClock();
setInterval(renderClock, 1000);
