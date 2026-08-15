let currentEventId = null;

async function loadDetail(eventId) {
  currentEventId = eventId;
  const el = document.getElementById("detail-content");
  el.innerHTML = `<p class="loading">Loading event…</p>`;

  try {
    const [event, attendees] = await Promise.all([
      api.getEvent(eventId),
      api.getAttendees(eventId),
    ]);

    renderDetail(event, attendees);
  } catch (err) {
    el.innerHTML = `<p class="loading">Couldn't load this event.</p>`;
    ui.toast(err.message, "error");
  }
}

function renderDetail(event, attendees) {
  const el = document.getElementById("detail-content");
  const remaining = event.capacity - event.registrationsCount;
  const isFull = remaining <= 0;
  const dateStr = new Date(event.date).toLocaleString(undefined, {
    dateStyle: "full",
    timeStyle: "short",
  });

  el.innerHTML = `
    <div class="detail-card">
      <span class="event-card__category">${escapeHtml(event.category)}</span>
      <h1>${escapeHtml(event.title)}</h1>
      <p>${escapeHtml(event.description || "")}</p>
      <div class="detail-card__meta">
        <div><span>Location</span>${escapeHtml(event.location)}</div>
        <div><span>Date &amp; time</span>${dateStr}</div>
        <div><span>Capacity</span>${event.capacity}</div>
        <div><span>Spots remaining</span>
          <span class="spots-remaining ${isFull ? "is-full" : ""}">
            ${isFull ? "Full" : remaining}
          </span>
        </div>
      </div>
    </div>

    <div class="detail-card">
      <h2>Attendees (${attendees.length})</h2>
      <ul class="attendees-list" id="attendees-list">
        ${
          attendees.length === 0
            ? `<li>No one has registered yet.</li>`
            : attendees
                .map(
                  (a) => `
              <li>
                <span>${escapeHtml(a.name)} — ${escapeHtml(a.email)}</span>
                <button class="btn btn--ghost btn--small" data-action="cancel-reg" data-reg-id="${a._id}">
                  Cancel
                </button>
              </li>`
                )
                .join("")
        }
      </ul>
    </div>

    <div class="detail-card">
      <h2>Register</h2>
      ${
        isFull
          ? `<p class="empty-state">This event is at full capacity — registration is closed.</p>`
          : `
        <form id="register-form" class="event-form" style="grid-template-columns:1fr 1fr;box-shadow:none;border:none;padding:0;background:transparent;">
          <label class="field">
            <span>Name</span>
            <input type="text" name="name" required />
            <small class="field__error" data-error-for="name"></small>
          </label>
          <label class="field">
            <span>Email</span>
            <input type="email" name="email" required />
            <small class="field__error" data-error-for="email"></small>
          </label>
          <div class="field--full form-actions">
            <button type="submit" class="btn btn--primary">Register</button>
          </div>
        </form>`
      }
    </div>
  `;

  const form = document.getElementById("register-form");
  if (form) {
    form.addEventListener("submit", handleRegisterSubmit);
  }

  el.querySelectorAll('[data-action="cancel-reg"]').forEach((btn) => {
    btn.addEventListener("click", async () => {
      const confirmed = await ui.confirm("Cancel this registration?");
      if (!confirmed) return;
      try {
        await api.cancelRegistration(currentEventId, btn.dataset.regId);
        ui.toast("Registration cancelled", "success");
        loadDetail(currentEventId);
      } catch (err) {
        ui.toast(err.message, "error");
      }
    });
  });
}

async function handleRegisterSubmit(e) {
  e.preventDefault();
  const form = e.target;
  const payload = Object.fromEntries(new FormData(form).entries());

  try {
    await api.register(currentEventId, payload);
    ui.toast("You're registered!", "success");
    loadDetail(currentEventId);
  } catch (err) {
    ui.toast(err.message, "error");
  }
}