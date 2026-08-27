# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project documentation — read these first

Before making any changes, get up to speed on project state via these tracked files:

- **`REDESIGN_RULES.md`** — stable reference: project conventions, naming rules, and API documentation for all completed components (Buttons, Links, Cards, Grid, typography, utilities). This is the single source of truth for how things are built and named.
- **`TASKS.md`** — active work: current tasks and design discussions with the designer. Short-lived — when a task ships, its final API moves to RULES and the working notes here are cleaned up.
- **`build/ui/docs.html`** (source: `src/pug/ui/docs.pug`) — team-facing onboarding for backend/Bitrix developers and SEO. Includes a catalog of live `/ui/*.html` component examples.
- **`git log --oneline`** — commit history with descriptive messages. Fastest way to see what's been done recently.

## Working across multiple machines

All meaningful project context lives in the repo (files above + git history). Any Claude session on any machine can get fully in context by reading these files and scanning `git log`.

Local Claude memory files at `~/.claude/projects/…/memory/` are **not** synced via git and do **not** need to be. The repo is the single source of truth. On a fresh machine, start by reading `REDESIGN_RULES.md` and `TASKS.md`, then run `git log --oneline -30` — that's all it takes.

## Commands

- `npm start` — clean, build, launch BrowserSync (serves `./build`, auto-opens browser) and watch every source type.
- `npm run build` — clean + one-shot build to `./build` (no server, no watch).
- To run individual Gulp tasks: `npx gulp <taskName>` (e.g. `npx gulp styles`, `npx gulp pugUi`, `npx gulp fontsTtf2woff2`). All tasks are named exports in `gulpfile.mjs`.

There is no test runner, linter, or type-checker configured — do not invent commands for these.

## Architecture

Gulp 5 (ESM) pipeline that compiles a Pug/SCSS/JS static site into `./build`. Everything is driven by `gulpfile.mjs`; there is no framework layer.

### Two parallel Pug pipelines

Pug is split into two distinct outputs — treat them as separate sites that share partials:

- `src/pug/pages/**/*.pug` → `build/*.html` — the public site. Uses `layouts/layout.pug` (asset paths like `./css/main.css`, `./js/main.js`).
- `src/pug/ui/**/*.pug` → `build/ui/*.html` — the internal UI kit / component catalog. Uses `layouts/layout-ui.pug` (asset paths like `../../css/main.css`, adds `body.body-dashboard` and injects `ui/ui-navigation.pug` as a sidebar).

`src/pug/ui/ui-navigation.pug` is the sidebar index of the UI kit — when you add/remove a UI page, update its `<ul>` so the new page is reachable. The root landing page `src/pug/pages/index.pug` also links into `./ui/docs.html`.

The watcher rebuilds **both** pipelines on any `.pug` change (layout/partial edits can affect either output), so don't scope watchers narrowly when adding partials.

### SCSS

Single entry `src/scss/main.scss` compiles to `build/css/main.css` with sourcemaps, autoprefixer, and grouped media queries. Uses modern `@use` syntax — `base/_var` is loaded with `as *` so its variables (`$accent1`, `$primary`, `$md`, `$tablet`, `remy()`, `size()`, etc.) are globally available in other partials without re-importing.

Many partials in `main.scss` are commented out intentionally; uncomment as features are enabled rather than assuming they're active.

### Fonts (non-obvious behavior)

`fontsTtf2woff2` skips any `.ttf` when a same-named `.woff2` already exists next to it (see `skipTtfWithExistingWoff2` in gulpfile). If you drop a preconverted `Inter-Bold.woff2` next to `Inter-Bold.ttf`, the WOFF2 wins and the TTF is not reconverted. Ready-made `.woff`/`.woff2` are copied via a separate `fontsCopy` task.

### Images

`imgWebp` converts JPG/PNG → WebP (originals are not copied). SVGs are copied verbatim. Everything else in `src/img/` is min+copied. Because JPG/PNG become `.webp`, references in Pug/SCSS must use the `.webp` extension.

### Other assets

- `src/js/**/*.js` — concatenated (no bundler, no transpile) into `build/js/main.js`. `main.js` is currently empty; adding new files just appends them.
- `src/libs/**/*` — copied verbatim to `build/libs/` (binary-safe via `encoding: false`).
- `src/video/` — optional; the `copyVideo` task no-ops if the directory doesn't exist.

### Gulp 5 gotcha

Binary sources (`.ttf`, images, libs, video) are read with `encoding: false`. JS is text and must NOT set this flag (it's piped through `concat`). Follow the existing pattern when adding new tasks.

### Language note

Comments in `gulpfile.mjs` and UI/Pug content strings are in Russian. Preserve the existing language when editing surrounding text — don't translate to English unless asked.
