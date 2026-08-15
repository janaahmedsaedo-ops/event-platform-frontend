let editingEventId = null;

async function loadCreateForm(eventId = null) {
  editingEventId = eventId;
  const form = document.getElementById("event-form");
  form.reset();
  clearFieldErrors(form);

  const eyebrow = document.getElementById("create-eyebrow");
  const title = document.getElementById("create-title");

  if (eventId) {
    eyebrow.textContent = "Edit";
    title.textContent = "Edit event";
    try {
      const event = await api.getEvent(eventId);
      form.elements["id"].value = event._id;
      form.elements["title"].value = event.title;
      form.elements["category"].value = event.category;
      form.elements["location"].value = event.location;
      form.elements["date"].value = new Date(event.date)
        .toISOString()
        .slice(0, 16);
      form.elements["capacity"].value = event.capacity;
      form.elements["description"].value = event.description || "";
    } catch (err) {
      ui.toast(err.message, "error");
      navigateTo("events");
    }
  } else {
    eyebrow.textContent = "New";
    title.textContent = "Create event";
  }
}

function validateForm(data) {
  const errors = {};
  if (!data.title.trim()) errors.title = "Title is required";
  if (!data.category.trim()) errors.category = "Category is required";
  if (!data.location.trim()) errors.location = "Location is required";
  if (!data.date) errors.date = "Date & time is required";
  if (!data.capacity || Number(data.capacity) <= 0) {
    errors.capacity = "Capacity must be greater than 0";
  }
  return errors;
}

function clearFieldErrors(form) {
  form.querySelectorAll(".field__error").forEach((el) => (el.textContent = ""));
  form.querySelectorAll(".field.has-error").forEach((el) => el.classList.remove("has-error"));
}

function showFieldErrors(form, errors) {
  Object.entries(errors).forEach(([field, message]) => {
    const errEl = form.querySelector(`[data-error-for="${field}"]`);
    if (errEl) {
      errEl.textContent = message;
      errEl.closest(".field").classList.add("has-error");
    }
  });
}

function initEventForm() {
  const form = document.getElementById("event-form");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    clearFieldErrors(form);

    const data = Object.fromEntries(new FormData(form).entries());

    const clientErrors = validateForm(data);
    if (Object.keys(clientErrors).length > 0) {
      showFieldErrors(form, clientErrors);
      return;
    }

    const payload = {
      title: data.title.trim(),
      category: data.category.trim(),
      location: data.location.trim(),
      date: data.date,
      capacity: Number(data.capacity),
      description: data.description.trim(),
    };

    try {
      if (editingEventId) {
        await api.updateEvent(editingEventId, payload);
        ui.toast("Event updated", "success");
      } else {
        await api.createEvent(payload);
        ui.toast("Event created", "success");
      }
      navigateTo("events");
    } catch (err) {
      if (err.fieldErrors) {
        const mapped = Object.fromEntries(
          err.fieldErrors.map((fe) => [fe.field, fe.message])
        );
        showFieldErrors(form, mapped);
      } else {
        ui.toast(err.message, "error");
      }
    }
  });
}