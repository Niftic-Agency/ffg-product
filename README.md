# Factory for Good

A faithful implementation of the Factory for Good design prototypes
(exported from Claude Design) as a real Vite + React app. The surfaces are
wired together with routing, split across an authenticated and an
unauthenticated layout:

| Route                     | Surface           | What it is |
|---------------------------|-------------------|------------|
| `/dashboard`              | Dashboard         | The "control room": hero, transfer status, impact chart, allocation treemap, updates. A floating Tweaks panel switches the donation-status phase (preview / in-progress / allocated). |
| `/organizations/:name?`   | Organization      | Org directory (sort / filter / paginate); `:name` deep-links to one organization's detail (KPIs, accordions, intervention charts). |
| `/onboarding`             | Onboarding        | Landing → 6-step questionnaire → submitted. A single-file state machine. |
| `/home`                   | Home              | Unauthenticated landing surface. |
| `/dashboard-unauth`       | DashboardUnauth   | Unauthenticated dashboard variant. |
| `/organizations-unauth`   | OrganizationsUnauth | Unauthenticated organizations variant. |

`/` redirects to `/dashboard`, and any unknown path falls through to it. A
`Splash` overlay renders ahead of the router on the first load of a session.
The mesh gradient morphs between surfaces on navigation (see below).

## Run

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build → dist/
```

## Structure

- `src/surfaces/` — the top-level surface shells (`Dashboard`, `DashboardUnauth`, `Home`, `Onboarding`, `Organization`, `OrganizationsUnauth`, `Splash`).
- `src/components/{dashboard,onboarding,organization,shared,ui}/` — ported components, grouped by surface (icons, data, atoms, panels, sections, …); `ui/` holds the vendored shadcn instance.
- `src/layouts/` — `AuthLayout` and `UnauthLayout` keep the top nav mounted across child navigations; `RouteFade` handles the transition.
- `src/topnav-auth.jsx`, `src/topnav-unauth.jsx`, `src/tweaks-panel.jsx` — shared chrome.
- `src/lib/mesh-gradient.js` — the WebGL Coons-patch mesh background renderer; `MeshBackground.jsx` mounts it once at the app root. `src/lib/gradient/GradientRouteSync.jsx` (+ `controller.js`) morphs the mesh on navigation, driven by the per-surface configs in `src/lib/gradients/`. See [src/lib/gradients/README.md](src/lib/gradients/README.md) for how to import a gradient, set it to morph, and link a pulse to an action.
- `public/styles.css` — the design system's single stylesheet (CSS-variable tokens, PP Fragment fonts).
- `public/assets/` — fonts, logo, avatar.

The prototype's design medium was HTML/CSS/JS. The component JSX was ported into
ES modules and recomposed; `public/styles.css` and the mesh gradient are carried
over verbatim so the visual output matches the source pixel-for-pixel.

## shadcn components

This repo carries a themed [shadcn](https://ui.shadcn.com) instance that mirrors the
separately-maintained component library
[Niftic-Agency/ffg-components](https://github.com/Niftic-Agency/ffg-components)
(its `base-nova` / Base UI style, FFG theme tokens, and PP Fragment fonts).

- `components.json` — shadcn config. The `@ffg` registry namespace points at
  `https://factory-for-goodcomponents.vercel.app/r/{name}.json`. That endpoint is
  now live, so the CLI consumes the library directly:

  ```bash
  npx shadcn@latest add @ffg/button       # add a single component + deps
  npx shadcn@latest add @ffg/button badge  # add several at once
  ```

  Components land in `src/components/ui/` per the `aliases` above, and any external
  npm packages they declare are installed automatically.
- `src/index.css` — Tailwind v4 + the FFG theme tokens. **Generated** from the
  library's `app/globals.css` by `npm run ui:import -- --theme`; don't hand-edit.
  Imported once in `src/main.jsx`. Tailwind's global *preflight* reset is
  intentionally omitted so it coexists with `public/styles.css` without
  regressing the existing surfaces.
- `src/components/ui/*` — vendored themed components (`.tsx`, compiled by Vite/esbuild).
- `src/lib/utils.js` — `cn()` helper.

### Importing components (fallback)

Prefer the `@ffg` registry above. The `ui:import` bridge predates it and remains for
offline work or pulling source the registry doesn't expose. It pulls real source from
the library's GitHub repo (requires the `gh` CLI authenticated with read access):

```bash
npm run ui:import -- --list          # browse the catalogue
npm run ui:import -- button badge    # import specific components + internal deps
npm run ui:import -- --all           # import everything
npm run ui:import -- --theme         # re-sync src/index.css from the library theme
```

Component imports write to `src/components/ui/` and print any external npm packages
to install. `--theme` regenerates `src/index.css` from the library's `app/globals.css`
(applying the no-preflight / no-global-base departures and wiring the local fonts).
