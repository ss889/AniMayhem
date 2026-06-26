# Anime Trivia Hub

Static Vite + React single-page app for anime trivia game modes.

## Scope

- No backend, API routes, database, auth, OAuth, or live MAL calls.
- Static JSON data is imported from `src/data`.
- Navigation is in-page React state only, with no router or URL-per-mode.
- v1 game modes: series comparator and image guess.
- MAL/Jikan data is a prebuilt content source, not its own mode.
- Deferred: MAL-personalized trivia, character comparator, live MAL OAuth, daily puzzle mode, light mode.

## Design

Light mode only. Colors and fonts are defined as CSS custom properties in `src/styles/tokens.css`.
