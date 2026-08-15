async function loadDashboard() {
  const el = document.getElementById("dashboard-content");
  el.innerHTML = `<p class="loading">Loading stats…</p>`;

  try {
    const stats = await api.getDashboard();

    el.innerHTML = `
      <div class="stat-badge">
        <div class="stat-badge__label">Total events</div>
        <div class="stat-badge__value">${stats.totalEvents}</div>
      </div>
      <div class="stat-badge">
        <div class="stat-badge__label">Upcoming events</div>
        <div class="stat-badge__value">${stats.upcomingEvents}</div>
      </div>
      <div class="stat-badge">
        <div class="stat-badge__label">Total registrations</div>
        <div class="stat-badge__value">${stats.totalRegistrations}</div>
      </div>
      <div class="stat-badge">
        <div class="stat-badge__label">Most popular event</div>
        <div class="stat-badge__value" style="font-size:1.3rem">
          ${stats.mostPopularEvent ? escapeHtml(stats.mostPopularEvent.title) : "—"}
        </div>
        <div class="stat-badge__sub">
          ${stats.mostPopularEvent ? `${stats.mostPopularEvent.registrationsCount} registrations` : "No events yet"}
        </div>
      </div>
    `;
  } catch (err) {
    el.innerHTML = `<p class="loading">Couldn't load stats.</p>`;
    ui.toast(err.message, "error");
  }
}

function escapeHtml(str = "") {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}