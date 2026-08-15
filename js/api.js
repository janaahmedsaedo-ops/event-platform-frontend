const API_BASE = "http://localhost:5000/api";

async function request(path, options = {}) {
  let response;
  try {
    response = await fetch(`${API_BASE}${path}`, {
      headers: { "Content-Type": "application/json" },
      ...options,
    });
  } catch (networkErr) {
    throw new Error("Could not reach the server. Is the API running?");
  }

  const body = await response.json().catch(() => ({}));

  if (!response.ok || body.success === false) {
    const err = new Error(body.message || `Request failed (${response.status})`);
    err.status = response.status;
    err.fieldErrors = body.errors || null;
    throw err;
  }

  return body.data;
}

const api = {
  getDashboard: () => request("/dashboard"),

  getEvents: (params = {}) => {
    const query = new URLSearchParams(
      Object.entries(params).filter(([, v]) => v)
    ).toString();
    return request(`/events${query ? `?${query}` : ""}`);
  },
  getEvent: (id) => request(`/events/${id}`),
  createEvent: (payload) =>
    request("/events", { method: "POST", body: JSON.stringify(payload) }),
  updateEvent: (id, payload) =>
    request(`/events/${id}`, { method: "PUT", body: JSON.stringify(payload) }),
  deleteEvent: (id) => request(`/events/${id}`, { method: "DELETE" }),

  getAttendees: (eventId) => request(`/events/${eventId}/attendees`),
  register: (eventId, payload) =>
    request(`/events/${eventId}/register`, {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  cancelRegistration: (eventId, registrationId) =>
    request(`/events/${eventId}/registrations/${registrationId}`, {
      method: "DELETE",
    }),
};