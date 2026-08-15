async function loadEvents(filters = {}) {
  const el = document.getElementById("events-list");
  el.innerHTML = `<p class="loading">Loading events…</p>`;

  try {
    const events = await api.getEvents(filters);

    if (events.length === 0) {
      el.innerHTML = `<p class="empty-state">No events match your filters.</p>`;
      return;
    }

    el.innerHTML = events.map(eventCardHtml).join("");

    el.querySelectorAll(".event-card").forEach((card) => {
      card.addEventListener("click", (e) => {
        if (e.target.closest("[data-action]")) return;
        navigateTo("detail", { id: card.dataset.id });
      });
    });

    el.querySelectorAll('[data-action="edit"]').forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        navigateTo("create", { id: btn.dataset.id });
      });
    });

    el.querySelectorAll('[data-action="delete"]').forEach((btn) => {
      btn.addEventListener("click", async (e) => {
        e.stopPropagation();
        const confirmed = await ui.confirm(
          "Delete this event? This also removes all its registrations."
        );
        if (!confirmed) return;

        try {
          await api.deleteEvent(btn.dataset.id);
          ui.toast("Event deleted", "success");
          loadEvents(getActiveFilters());
        } catch (err) {
          ui.toast(err.message, "error");
        }
      });
    });
  } catch (err) {
    el.innerHTML = `<p class="loading">Couldn't load events.</p>`;
    ui.toast(err.message, "error");
  }
}

function eventCardHtml(evt) {
  const date = new Date(evt.date);
  const dateStr = date.toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
  return `
    <article class="event-card" data-id="${evt._id}">
      <span class="event-card__category">${escapeHtml(evt.category)}</span>
      <h3>${escapeHtml(evt.title)}</h3>
      <div class="event-card__meta">
        <span>${escapeHtml(evt.location)}</span>
        <span>${dateStr}</span>
        <span>Capacity: ${evt.capacity}</span>
      </div>
      <div class="event-card__reg">${evt.registrationsCount} registered</div>
      <div class="event-card__actions">
        <button class="btn btn--ghost btn--small" data-action="edit" data-id="${evt._id}">Edit</button>
        <button class="btn btn--danger btn--small" data-action="delete" data-id="${evt._id}">Delete</button>
      </div>
    </article>
  `;
}

function getActiveFilters() {
  const form = document.getElementById("filters");
  const data = new FormData(form);
  return Object.fromEntries(data.entries());
}

function initFiltersForm() {
  const form = document.getElementById("filters");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    loadEvents(getActiveFilters());
  });

  document.getElementById("clear-filters").addEventListener("click", () => {
    form.reset();
    loadEvents();
  });
}