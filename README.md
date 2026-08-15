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
