# Design System Rules — steamsys-pug

Rules for translating Figma designs into this codebase via the Figma MCP.
Read this document before generating any code from Figma frames or nodes.

This is **not** a React/Vue/Tailwind project. It is a static site pipeline:
**Pug 3 → HTML**, **SCSS (modern `@use`) → CSS**, plain **ES5 JS concatenated to one file**, built by **Gulp 5 (ESM)**. There is no bundler, no transpiler, no component runtime. All patterns below reflect that.

---

## 1. Token Definitions

### Where tokens live

- **Source of truth:** `src/scss/base/_var.scss` — SCSS variables (colors, breakpoints, base font size, helper functions).
- **Runtime mirror:** `src/scss/base/_base.scss` — each SCSS color is re-exposed as a CSS custom property on `:root` (e.g. `--accent1: #{$accent1}`). Font family is also exposed: `--font-family: 'Inter'`.
- **No JSON tokens, no Style Dictionary, no design-token transformer.** Do not introduce one. Add tokens by editing both files.

### Format

```scss
// src/scss/base/_var.scss
$baseFs: 16;

@function remy($pxsize) { @return ($pxsize / $baseFs) * 1rem; }
@function size($pxsize) { @return calc(($pxsize/17))*1vw; }

$md: 744px;
$tablet: 1024px;
$laptop: 1200px;
$desktop: 1440px;

$black:      #000000;
$white:      #FFFFFF;
$accent1:    #0044BB;
$accent2:    #08428C;
$accent3:    #79B0E3;
$accent4:    #5F97CC;
$error:      #BB0000;
$primary:    #031D2A;
$primary1:   #243A45;
$secondary:  #7C8A93;
$secondary1: #A4AEB4;
$secondary2: #DEE2E4;
$secondary3: #F8F9F9;
```

```scss
// src/scss/base/_base.scss (excerpt)
:root {
  --black: #{$black};
  --white: #{$white};
  --accent1: #{$accent1};
  --accent2: #{$accent2};
  --accent3: #{$accent3};
  --accent4: #{$accent4};
  --error: #{$error};
  --primary: #{$primary1};   // NOTE: --primary maps to $primary1, not $primary
  --primary1: #{$primary1};
  --secondary: #{$secondary};
  --secondary1: #{$secondary1};
  --secondary2: #{$secondary2};
  --secondary3: #{$secondary3};
  --font-family: 'Inter';
}
```

### Rules for Figma → tokens

1. **Match by hex, not by Figma style name.** When a Figma fill has a hex that already exists in `_var.scss`, reuse the variable; do not invent a new one.
2. **Adding a new color:** add it to `_var.scss` **AND** mirror it on `:root` in `_base.scss`. Follow the existing name pattern (`$accent5`, `$secondary4`, etc.).
3. **In component SCSS prefer `var(--accent1)`** over `$accent1` when the value is consumed at runtime (allows theming). Use the SCSS `$var` form only when a Sass computation needs it (`darken()`, math in `remy()`, media query breakpoints).
4. **Breakpoints:** always reference `$md` / `$tablet` / `$laptop` / `$desktop`. Never hardcode `744px` etc. Desktop-first: use `@media (max-width: ...)` for narrower screens (see docs page and `.start-page` in `_ui-navigation.scss`).
5. **Typography sizing:** wrap px values in `remy(16)` for rem output, or `size(16)` for vw output. Do not emit raw `rem` calculations.

### Not yet defined

Spacing, radii, shadows, z-index, and typography ramps are **not** tokenized. If a Figma design specifies them:
- Ask (or infer) whether the value should be promoted to a token in `_var.scss`, or inlined in the component partial.
- Default rule: **if it appears more than twice across sections, tokenize it.** Otherwise inline.

---

## 2. Component Library

### Where "components" live

There are no runtime components. There are **Pug partials** and **SCSS partials**, paired by convention.

- `src/pug/pages/**/*.pug` → public site (`extends ../layouts/layout.pug`).
- `src/pug/ui/**/*.pug` → internal UI kit / component catalog (`extends ../layouts/layout-ui.pug`).
- `src/pug/sections/_*.pug` → shared cross-page sections (`_header.pug`, `_footer.pug`) included via `include ../sections/_footer.pug`.
- `src/pug/layouts/_mixins-links.pug` → shared mixins hub. Currently near-empty; **this is the place to add reusable mixins** (buttons, links, icon+text patterns) as they emerge from Figma.

### Naming conventions

- Pug partials: leading underscore for includes (`_header.pug`, `_footer.pug`, `_mixins-links.pug`). Full-page templates: no underscore (`home.pug`, `docs.pug`, `colors.pug`, `typography.pug`).
- SCSS partials: leading underscore (`_var.scss`, `_base.scss`, `_global.scss`, `_typography.scss`, `_buttons.scss`, `_form.scss`, `_grids.scss`, `_ui-navigation.scss`).
- **All redesign CSS classes are prefixed `ss-`** — mandatory, no exceptions. Kebab-case, BEM-lite inside the namespace: block `.ss-btn`, element `.ss-btn__icon`, modifier `.ss-btn--primary`. Full rationale in §10 and `REDESIGN_RULES.md`.
- Legacy site classes use `sts-` prefix or no prefix at all — **never override, never reuse for new code**.

### Documentation / Storybook

The **UI kit itself is the docs**: pages under `src/pug/ui/` render into `build/ui/*.html`. Existing catalog pages:

| Page                            | Purpose                     |
| ------------------------------- | --------------------------- |
| `src/pug/ui/docs.pug`           | Project overview, breakpoints |
| `src/pug/ui/colors.pug`         | Color swatch grid           |
| `src/pug/ui/typography.pug`     | Typography scale (stub)     |
| `src/pug/ui/ui-navigation.pug`  | Sidebar index of the UI kit |

### Adding a new component from Figma

1. **Structure** → new Pug partial under `src/pug/sections/_<name>.pug` (or extend an existing section if it belongs there).
2. **Styles** → new SCSS partial `src/scss/blocks/_<name>.scss` (create the `blocks/` folder — the current `_ui-navigation.scss` is under `ui/`, follow the same pattern for UI-only styles vs public-site blocks).
3. **Register the SCSS partial** in `src/scss/main.scss` with `@use "blocks/<name>";`. Many partials in `main.scss` are commented out intentionally; **uncomment them or add new ones** as features are enabled — do not assume anything is already active besides what is currently uncommented (`base/_var`, `base/_base`, `base/_typography`, `ui/_ui-navigation`).
4. **UI-kit demo page** → drop a page under `src/pug/ui/<name>.pug` demonstrating states, and add a `<li><a href="<name>.html">…</a></li>` entry inside the sidebar `ul` in `src/pug/ui/ui-navigation.pug`, otherwise the demo is unreachable.
5. **Public-site usage** → include the partial in the appropriate page: `include ../sections/_<name>.pug`.

Because Pug watchers rebuild **both** pipelines on any `.pug` change (see `gulpfile.mjs` `watch()`), partials are safe to share between `pages/` and `ui/` outputs.

---

## 3. Frameworks & Libraries

### UI framework

**None.** Do not add React, Vue, Svelte, Web Components, or JSX. Output must be:
- Pug template markup for structure.
- SCSS partials for styles.
- Plain ES (no transpile — `src/js/*.js` files are concatenated by `gulp-concat` into `build/js/main.js` with **no bundler and no Babel**). Write code that runs directly in modern browsers (ES2020+ is fine; do not use `import`/`export` inside `src/js/**` — those files must be script-safe when concatenated).

### Styling stack

- **Dart Sass** via `gulp-sass` — modern `@use` syntax (no `@import`).
- `base/_var` is loaded with `as *` in `main.scss` so `$accent1`, `$primary`, `$md`, `remy()`, `size()` etc. are globally available in every partial that itself does `@use '_var' as *;` (existing partials do this — follow the pattern).
- **PostCSS Autoprefixer** and **`gulp-group-css-media-queries`** run after Sass. Media queries in output are automatically grouped, so write them inline near the rule they modify.
- No CSS-in-JS, no Tailwind, no utility framework. Text utilities live in `src/scss/base/_global.scss` (see §10 for the full list). Two image-fit helpers (`.ss-img-cover`, `.ss-img-contain`) live in `_base.scss` inside `.ss-wrapper`. The previous unprefixed utility set (`.d-flex`, `.container`, `.lock`, `.page-content`, `.flex-*`, `.icon-txt`, etc.) was deleted during the redesign refactor — do not re-introduce them; write prefixed replacements as needed.

### Third-party vendor libraries

- `src/libs/swiper/` — Swiper.js (carousels).
- `src/libs/fancybox/` — Fancybox (modals / lightbox).

Copied verbatim to `build/libs/` by the `copyLibs` task. Reference them from Pug with `<link>` / `<script>` tags pointing at `./libs/<name>/…` (public) or `../../libs/<name>/…` (UI kit) — mirror the relative-path convention already used for `main.css` / `main.js` in the two layouts.

### Build

- **Gulp 5 (ESM)** — `gulpfile.mjs`, `"type": "module"` in `package.json`.
- Commands: `npm start` (build + BrowserSync + watch) · `npm run build` (clean + one-shot build to `./build`). Individual tasks: `npx gulp <taskName>` (e.g. `npx gulp pugUi`, `npx gulp styles`).
- **No test runner, linter, or type-checker is configured.** Do not invent commands for these; do not add configs unless the user asks.

---

## 4. Asset Management

### Directory layout

```
src/
  img/          → build/img/    (SVG copied; JPG/PNG converted to WebP; others min+copied)
  fonts/        → build/fonts/  (TTF → WOFF2; ready WOFF/WOFF2 copied verbatim)
  libs/         → build/libs/   (binary-safe verbatim copy)
  video/        → build/video/  (optional; task no-ops if directory absent)
```

### Optimization

- **JPG / PNG are converted to WebP** by `imgWebp` (`gulp-webp` after `gulp-imagemin`). **The originals are not copied.** Therefore all references in Pug and SCSS **must** use the `.webp` extension, even though the source file is `.jpg` / `.png`:
  ```pug
  img(src='./img/hero.webp' alt='')          //- source file may be hero.jpg
  ```
  ```scss
  background-image: url('../img/hero.webp'); // source file may be hero.png
  ```
- **SVG is copied verbatim** by `imgCopySvg` — do not expect optimization or symbol extraction on standalone SVG files.
- Fallback JPG/PNG for older browsers is **not** currently emitted. If a Figma asset needs a `<picture>` element with WebP + fallback, that has to be added deliberately.

### CDN

None. All assets are served from `./` relative to the built HTML.

### Downloading Figma assets

When exporting from Figma:
- **Raster (JPG/PNG):** save to `src/img/<name>.<ext>`; reference in code as `./img/<name>.webp`.
- **SVG (non-icon):** save to `src/img/<name>.svg`; reference in code as `./img/<name>.svg`.
- **Icons:** see §5 — do not save each as a standalone SVG.

---

## 5. Icon System

### Current implementation: single inline SVG sprite

`src/img/sprite.svg` is a hand-authored SVG file containing one `<symbol id="svg-<name>" viewBox="…">` per icon:

```svg
<svg style="width:0; height:0; visibility: hidden;" xmlns="http://www.w3.org/2000/svg">
  <symbol id="svg-cross" viewBox="0 0 26 26">
    <path d="…" fill="currentColor" />
  </symbol>
  <symbol id="svg-gerb" viewBox="0 0 25 24">…</symbol>
</svg>
```

### Naming convention

- Symbol IDs are prefixed **`svg-`**: `svg-cross`, `svg-gerb`, …
- Fill is `currentColor` for icons meant to inherit text color; other icons keep their design fill (e.g. brand marks).

### Usage in Pug

The sprite must be included once per page (usually via a partial referenced in the layout — currently not wired; add it if you introduce icons). Then reference symbols with `<use>`:

```pug
svg.icon(width='26' height='26' aria-hidden='true')
  use(xlink:href='#svg-cross')
```

Size and color the icon via a CSS class (`width`, `height`, `color`). Because fills are `currentColor`, `color: var(--accent1);` changes the icon color.

### Adding an icon from Figma

1. Export the icon as SVG from Figma with a **square viewBox** (e.g. `0 0 24 24`).
2. Optimize (strip metadata, hard-code fills to `currentColor` if it should inherit text color).
3. Paste as a new `<symbol id="svg-<name>" viewBox="…">…</symbol>` block into `src/img/sprite.svg`.
4. Reference via `<use xlink:href='#svg-<name>' />`.
5. **Do not** save one SVG file per icon in `src/img/` — that clutters the folder and skips the sprite. If a truly one-off decorative SVG is needed (not an icon), it can live standalone.

Note: `gulp-svg-sprite` / `gulp-svgstore` are installed in `devDependencies` but the current gulpfile does **not** wire them into a task. The sprite is authored manually. Do not enable an auto-sprite task unless the user explicitly asks — it would require refactoring the referencing convention.

---

## 6. Styling Approach

### Methodology

- **All redesign classes are prefixed `ss-`** (see §10). BEM-lite naming inside the namespace: block `.ss-btn`, element `.ss-btn__icon`, modifier `.ss-btn--primary` (or a second class if that reads better).
- **Nesting** is used moderately (`gulp-sass` + Dart Sass). Follow existing depth (2–3 levels max, don't chain long selectors).
- One partial per component/block under `src/scss/blocks/_<name>.scss` (create the folder when needed); register in `main.scss` via `@use "blocks/<name>";`.

### Global styles

`src/scss/base/_base.scss` sets:
- `@font-face` for all four Inter weights (400/500/600/700, all WOFF2) — **at document root** (font registration only, no side-effects).
- `:root` custom properties (see §1) — **at document root** (inherited everywhere via `var(--…)`).
- Element resets (`h1–h4`, `p`, `a`, `img`, `input`, `button`, `textarea`, `::placeholder`, `*` box-sizing, etc.) — **wrapped in `.ss-wrapper`**, so they don't leak into the legacy site.
- `font-family: var(--font-family)` (Inter) — on `.ss-wrapper`, to override the legacy `body { font-family: Montserrat }`.

`src/scss/base/_global.scss` provides text utilities (`.ss-txt-*`) at document root — namespaced, no wrapper needed. Full list in §10.

`src/scss/base/_typography.scss` provides the typography scale (`.ss-h1`–`h6`, `.ss-reg/medi/semi-XX`) at document root — same reasoning. Full list in §10.

### Responsive design

**Desktop-first**, per `src/pug/ui/docs.pug`:

> Breakpoints: 375–744px, 745–1023px, 1024–1199px, 1200–1439px, 1440–1919px, 1920+.

Media query rules:
- Use SCSS breakpoint vars: `$md` (744) · `$tablet` (1024) · `$laptop` (1200) · `$desktop` (1440).
- Because the approach is desktop-first, the default declarations target desktop; use `@media (max-width: $tablet - 1)` etc. to narrow.
- One exception convention already in the codebase: `@media (min-width: $md)` is used inside `.xs-flex-column` in `_base.scss` when writing mobile-first for a specific utility — that is deliberate; don't refactor it away when editing surrounding rules.
- Rely on `gulp-group-css-media-queries` to collapse duplicates — write media queries inline near the rule, not at the bottom of the file.

### Typography

- Font family: **Inter** — declared globally via `@font-face` in `_base.scss` (400/500/600/700, `src/fonts/Inter-*.woff2`), applied via `font-family: var(--font-family)` on `.ss-wrapper` (to override the legacy site's Montserrat inheritance).
- Base size inside `.ss-wrapper`: `16px`.
- The scale is fully implemented in `src/scss/base/_typography.scss` — see §10 for the class list. Values are in raw `px`; do not switch to `remy()` without an explicit request (the whole scale would need to be converted uniformly).
- The UI-kit demo lives at `src/pug/ui/typography.pug` and renders every class from the scale.

---

## 7. Project Structure

```
steamsys-pug/
├── gulpfile.mjs                # Gulp 5 ESM pipeline (single file, all tasks named exports)
├── package.json                # "type": "module"; no test/lint/typecheck scripts
├── CLAUDE.md                   # Existing project instructions (read first)
├── REDESIGN_RULES.md           # Source of truth for redesign isolation + naming (ss- prefix, .ss-wrapper)
├── design-system-rules.md      # THIS FILE — Figma MCP integration rules
├── src/
│   ├── fonts/                  # Inter-Regular/-Medium/-SemiBold/-Bold .woff2
│   ├── img/
│   │   └── sprite.svg          # Manual SVG sprite (see §5)
│   ├── js/
│   │   └── main.js             # Empty entry; add sibling .js files to append
│   ├── libs/
│   │   ├── fancybox/           # Vendor: modal/lightbox
│   │   └── swiper/             # Vendor: carousel
│   ├── pug/
│   │   ├── layouts/
│   │   │   ├── layout.pug       # Public site — asset paths ./css/main.css, ./js/main.js
│   │   │   ├── layout-ui.pug    # UI-kit  — asset paths ../../css/main.css, adds body.body-dashboard + sidebar
│   │   │   └── _mixins-links.pug # Shared mixins hub (currently near-empty; extend here)
│   │   ├── pages/               # → build/*.html  (extends layout.pug)
│   │   │   ├── index.pug        # Landing page (links to ./ui/docs.html and ./home.html)
│   │   │   └── home.pug
│   │   ├── sections/            # Cross-page partials
│   │   │   ├── _header.pug
│   │   │   └── _footer.pug
│   │   └── ui/                  # → build/ui/*.html  (extends layout-ui.pug)
│   │       ├── ui-navigation.pug # Sidebar index — MUST update <ul> when adding UI pages
│   │       ├── docs.pug
│   │       ├── colors.pug
│   │       └── typography.pug   # Demo of every .ss-h* / .ss-reg-* / .ss-medi-* / .ss-semi-* class
│   └── scss/
│       ├── main.scss            # Single entry — register partials via @use
│       └── base/
│           ├── _var.scss        # Design tokens (SCSS vars + helpers)
│           ├── _base.scss       # @font-face + :root at root; element resets inside .ss-wrapper
│           ├── _global.scss     # Text utilities (.ss-txt-*), root-scoped
│           ├── _typography.scss # .ss-h1..ss-h6 + .ss-reg/medi/semi-XX, root-scoped
│           ├── _buttons.scss    # (stub — will hold .ss-btn variants)
│           ├── _form.scss       # (stub — will hold .ss-input, .ss-select, .ss-checkbox, .ss-radio, .ss-switch)
│           └── _grids.scss      # (stub)
│       └── ui/
│           └── _ui-navigation.scss  # Styles for the .body-dashboard UI-kit shell
└── build/                       # Generated — do not edit or commit
```

### Two-pipeline mental model

`src/pug/pages/**/*.pug` and `src/pug/ui/**/*.pug` are **separate sites that share partials**. Every `.pug` change rebuilds both (see `gulp.watch(paths.pugAll, gulp.parallel(pugPages, pugUi))` in `gulpfile.mjs`) — do not narrow the watcher.

### Feature/section organization

- Public-site page content: one file per page under `src/pug/pages/`, composed of `include ../sections/_<name>.pug` blocks.
- UI kit demonstrations: one file per catalog entry under `src/pug/ui/`, plus a matching `<li>` in `ui-navigation.pug`.
- Cross-cutting styles: base globals in `src/scss/base/`; block/component styles should go under a new `src/scss/blocks/` (create as needed) and be registered in `main.scss`.

---

## 8. Language & authoring conventions

- **Comments in `gulpfile.mjs` and UI/Pug content strings are in Russian.** Preserve the language when editing surrounding text; do not translate to English unless asked. New comments should follow the surrounding-file convention.
- **Do not create documentation files (`*.md`) unless explicitly requested.** This file is the exception — it is the Figma design-system-rules doc requested by the user.

---

## 9. Figma MCP workflow checklist

When translating a Figma frame into this codebase:

1. **Identify tokens.** Match every fill/stroke color to `_var.scss`. Unknown colors → add to `_var.scss` **and** `_base.scss` `:root`. Prefer `var(--…)` at the call site.
2. **Identify typography.** Map every text style to a class from `_typography.scss` (`.ss-h1`–`h6` or `.ss-<reg|medi|semi>-<size>`). Do not set raw `font-size` / `font-weight` in component styles unless the design uses a value outside the scale.
3. **Identify text utilities.** Alignment / color / uppercase / underline / truncation → use `.ss-txt-*` from `_global.scss` (see §10) instead of writing one-off CSS.
4. **Choose the layout.** Public marketing/product page → `src/pug/pages/<name>.pug` extending `layout.pug`. Component/kit demo → `src/pug/ui/<name>.pug` extending `layout-ui.pug`, and add the sidebar link.
5. **Wrap in `.ss-wrapper`.** All redesign markup lives inside `.ss-wrapper` (opens either at the page level or high in the layout). Without it, element resets and Inter font do not apply — text will render in the legacy Montserrat.
6. **Structure with Pug.** Reuse existing sections (`_header`, `_footer`) via `include ../sections/…`. Extract new repeated blocks into `_<name>.pug` partials.
7. **Style with SCSS partial.** Create `src/scss/blocks/_<name>.scss`, `@use '../base/_var' as *;` at top for tokens/helpers, register in `main.scss`. Block class starts with `ss-` — see §10.
8. **Assets.** Export raster to `src/img/` (reference as `.webp`), icons into `src/img/sprite.svg` as `<symbol id="svg-…">`, standalone SVGs to `src/img/`.
9. **Responsive.** Desktop-first CSS; narrow with `@media (max-width: $tablet - 1)` etc.
10. **JS.** Only if interactivity is needed. Add a new file under `src/js/`, write script-safe code (no ES modules), it will be concatenated into `build/js/main.js`.
11. **Verify.** `npm start` — BrowserSync opens the browser. Confirm both the public route and (if applicable) the UI-kit route render, and that the redesign preview is visibly inside its `.ss-wrapper` (Inter font, correct resets).

### Anti-patterns (do not do)

- Do not introduce React, Vue, JSX, Tailwind, or any bundler.
- Do not use `@import` in SCSS (use `@use`).
- Do not reference JPG/PNG extensions in HTML/CSS — the build converts them to WebP.
- Do not save one SVG file per icon; extend the sprite instead.
- Do not narrow the Pug watcher — layout/partial edits legitimately affect both pipelines.
- Do not add `.md`, `.env`, config files, tests, or lint configs unless explicitly asked.
- Do not translate Russian comments to English.
- Do not edit anything under `build/` — it is regenerated.
- Do not create classes without the `ss-` prefix for redesign code — see §10.
- Do not put element-tag selectors (`h1`, `p`, `a`, `button`, `input`, `img`, …) at SCSS root — they must be nested inside `.ss-wrapper` to avoid overriding the legacy site.

---

## 10. Redesign isolation & naming (canonical)

This is a **staged redesign**: new markup is deployed onto the still-running legacy site at [steamsys.ru](https://www.steamsys.ru/) piece by piece. Everything below is enforced by `REDESIGN_RULES.md` (root of repo) — read it before starting any new component. Summary:

### Two zones in the CSS

| Zone | What goes here | Selector shape |
|---|---|---|
| **Root (global)** | Prefixed classes only: `.ss-*` utilities, `.ss-h1`–`h6`, `.ss-reg/medi/semi-XX`, `.ss-<block>` component classes. `@font-face`, `:root { --… }`. | `.ss-...` — no bare tag selectors |
| **Inside `.ss-wrapper`** | Element-tag resets (`h1–h4`, `p`, `a`, `img`, `button`, `input`, `textarea`, `::placeholder`, etc.). Font-family override (Inter, to beat the legacy `body { font-family: Montserrat }`). | `.ss-wrapper` + descendants |

Rule of thumb: **if the selector could match a legacy element accidentally, it must be inside `.ss-wrapper`.** Prefixed classes are already namespaced and don't need the wrapper.

### The `.ss-` prefix

**Every new class for the redesign starts with `ss-`.** No exceptions — even one-off utilities and demo-only classes. Reason: the legacy site uses class names without the `ss-` prefix (some use `sts-`), and the redesign will be deployed onto pages that still contain legacy markup. `ss-` is the guaranteed collision-free namespace.

Do not use `sts-*` — that prefix belongs to legacy code. Do not touch or override it.

### Where to put new styles

| File | Purpose | Scope |
|---|---|---|
| `src/scss/base/_var.scss` | SCSS design tokens (colors, breakpoints, helpers). | — (variables only) |
| `src/scss/base/_base.scss` | `@font-face`, `:root` custom properties, element resets. | Resets are wrapped in `.ss-wrapper`. Only `@font-face` and `:root` are at document root. |
| `src/scss/base/_global.scss` | Text utility classes (`.ss-txt-*`). | Root (no `.ss-wrapper` — classes are already namespaced). |
| `src/scss/base/_typography.scss` | Typography scale (`.ss-h1`–`h6`, `.ss-reg/medi/semi-XX`). | Root (namespaced). |
| `src/scss/blocks/_<block>.scss` (new folder, create when needed) | Component styles (`.ss-btn`, `.ss-input`, `.ss-tag`, `.ss-tab`, …). | Root (namespaced). |

### Typography classes (final set)

**Headings** — all SemiBold (600), letter-spacing 0. **Adaptive `font-size` via CSS `clamp()`** — fluid interpolation between the mobile value (at viewport ≤ 744 px) and the desktop value (at viewport ≥ 1920 px). Outside this range `clamp()` holds the corresponding endpoint.

| Class | mobile (≤744) | desktop (≥1920) | line-height |
|---|---|---|---|
| `.ss-h1` | 32 px | 62 px | 1.25 |
| `.ss-h2` | 28 px | 50 px | 1.25 |
| `.ss-h3` | 28 px | 46 px | 1.25 |
| `.ss-h4` | 24 px | 40 px | 1.25 |
| `.ss-h5` | 22 px | 32 px | 1.3 |
| `.ss-h6` | 20 px | 28 px | 1.3 |

Line-height stays fixed (does not scale) — `1.25` for `H1–H4`, `1.3` for `H5–H6`. Body classes (`.ss-reg/medi/semi-XX`) are **not** adaptive: the number in the class name is the literal font-size in px. If a component needs a different body size at a breakpoint, override in the component partial via `@media`.

**Body** — `.ss-<weight>-<size>` where `weight ∈ {reg, medi, semi}` = `{400, 500, 600}` and `size ∈ {12, 14, 16, 18, 20, 22, 24, 28}`. `line-height`: 1.3 for size ≥ 22, 1.4 for size ≤ 20. Total 24 classes (`.ss-reg-12` … `.ss-semi-28`). One class fully describes the style — do not compose with a weight-modifier class.

Sample usage:

```pug
h1.ss-h1 Заголовок раздела
p.ss-medi-24 Крупный подзаголовок
p.ss-reg-16 Основной текст абзаца
p.ss-semi-14.ss-txt-secondary Мелкая подпись
```

### Text utility classes (`_global.scss`)

- **Alignment** (with `!important`): `.ss-txt-left`, `.ss-txt-center`, `.ss-txt-right`
- **Case / wrap** (no `!important`): `.ss-txt-upper`, `.ss-txt-nowrap`
- **Decoration** (no `!important`): `.ss-txt-underline`
- **Color** (with `!important`): `.ss-txt-white`, `.ss-txt-black`, `.ss-txt-primary`, `.ss-txt-primary1`, `.ss-txt-secondary`, `.ss-txt-secondary1`, `.ss-txt-accent1`, `.ss-txt-accent2`, `.ss-txt-accent3`, `.ss-txt-accent4`, `.ss-txt-error`
- **Truncation** (no `!important`): `.ss-txt-truncate` (ellipsis on one line), `.ss-txt-clamp-2`, `.ss-txt-clamp-3` (webkit line-clamp)

`!important` policy: colors and alignment must beat any component-level style; everything else uses normal specificity.

### Where the wrapper goes in Pug

- **Public pages** (`src/pug/pages/**`) — wrap the redesign content in `.ss-wrapper` at the top of the page's content block, or open it in the layout when the whole page is redesign-only.
- **UI-kit demo pages** (`src/pug/ui/**`) — each preview section is wrapped in `.ss-wrapper`, so the demo renders under the same isolation rules as production.
- **CSS custom properties on `:root`** work everywhere (they are inherited by definition) — `var(--accent1)` inside a component doesn't need `.ss-wrapper`.
- **Font family (Inter)** is applied on `.ss-wrapper` — text outside the wrapper will render in whatever font the surrounding context (legacy `body { font-family: Montserrat }`) provides. Any preview or demo of redesign text **must** live inside `.ss-wrapper`.
