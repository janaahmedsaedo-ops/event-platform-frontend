const views = ["dashboard", "events", "detail", "create"];

const loaders = {
  dashboard: () => loadDashboard(),
  events: () => loadEvents(),
  detail: (params) => loadDetail(params.id),
  create: (params) => loadCreateForm(params.id || null),
};

function navigateTo(viewName, params = {}) {
  if (!views.includes(viewName)) viewName = "dashboard";

  views.forEach((v) => {
    document
      .getElementById(`view-${v}`)
      .classList.toggle("view--hidden", v !== viewName);
  });

  document.querySelectorAll(".nav__link").forEach((link) => {
    link.classList.toggle("is-active", link.dataset.nav === viewName);
  });

  const hash = params.id ? `#${viewName}/${params.id}` : `#${viewName}`;
  if (location.hash !== hash) history.pushState(null, "", hash);

  loaders[viewName](params);
}

function routeFromHash() {
  const [, viewName, id] = location.hash.match(/^#?([^/]*)\/?(.*)$/) || [];
  navigateTo(viewName || "dashboard", id ? { id } : {});
}

function initRouter() {
  document.querySelectorAll("[data-nav]").forEach((btn) => {
    btn.addEventListener("click", () => navigateTo(btn.dataset.nav));
  });

  window.addEventListener("popstate", routeFromHash);
}

document.addEventListener("DOMContentLoaded", () => {
  initRouter();
  initFiltersForm();
  initEventForm();
  routeFromHash();
});