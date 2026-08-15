# Convene — Frontend (event-platform-frontend)

A vanilla JavaScript Single-Page Application for the Convene event
management platform. No frameworks, no build step — just HTML, CSS,
and JS talking to the backend REST API with `fetch()`.

## Setup

This is a static site — it just needs to be served over HTTP (opening
`index.html` directly with `file://` will break `fetch()` calls in some
browsers, so use a simple local server instead):

```bash
npx serve . -l 5500
# or: python3 -m http.server 5500
```

Then open `http://localhost:5500`. Make sure the backend is running on
`http://localhost:5000` first (see `event-platform-backend/README.md`) —
its `CLIENT_ORIGIN` env var should match this frontend's origin
(`http://localhost:5500`) so CORS allows the requests through.

## Project structure

index.html single HTML shell containing all 4 views
css/styles.css all styling (design tokens at the top)
js/
api.js the only file that knows the backend's base URL
ui.js shared toast + confirm-modal helpers
app.js the SPA router (shows/hides views, no reloads)
views/
dashboard.js loads + renders GET /api/dashboard
events.js loads + renders GET /api/events (+ filters, delete)
detail.js loads GET /api/events/:id + attendees, registration
create.js create/edit form, client + server-side validation


## How navigation works

`app.js` keeps exactly one of the four `<section id="view-...">`
elements visible at a time and reflects the current view in the URL
hash (e.g. `#events`, `#detail/64f1a2b3...`). Clicking any element with
`data-nav="..."` calls `navigateTo()`, which toggles visibility and
calls that view's loader function to fetch fresh data from the API./localhost:5500`. Make sure the backend is running on
`http://localhost:5000` first (see `event-platform-backend/README.md`) —
its `CLIENT_ORIGIN` env var should match this frontend's origin
(`http://localhost:5500`) so CORS allows the requests through.

## Project structure
