# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A proof of concept for extracting reusable MUI components from the `mks_webapp` app into a private npm package (`@npm-scope/mks-ui`). `@npm-scope` is a placeholder scope. The package stays `"private": true` until publishing is approved.

The repo has three parts:

- `mks-ui/`: the library itself (TypeScript, built with tsdown, tested with Vitest). This is where most changes happen. See `mks-ui/README.md` for the public API and the props contract.
- `consumers/`: two Next.js apps that install the **packed tarball** to show the package works in real consumer setups:
  - `pages-js/`: Pages Router, plain JS, React 18.2, Jest (CommonJS, like mks_webapp). `.npmrc` sets `engine-strict=true` with `node ^18` and `pnpm ^8`, so it must run under Node 18 and pnpm 8.
  - `app-ts/`: App Router, TypeScript, React 19, MUI's App Router cache provider. Its theme deliberately differs from MKS (green primary, Verdana) so you can see when a component falls back to the consumer theme.
- `tools/browser-check.mjs`: a Playwright (system Chrome) script that loads a running consumer page and checks hydration, computed styles including `:hover`, console errors and pagination.

## Commands

Library (`cd mks-ui`, Node 24 per `.node-version`, npm):

```bash
npm install
npm run verify        # full gate: clean, typecheck, lint, test, build, check:dist, publint, attw, check:pack
npm test              # vitest run
npx vitest run src/components/button/ButtonContained.test.tsx   # single file
npx vitest run -t "name of test"                                # single test by name
npm run typecheck     # also compiles type-tests/contracts.tsx
npm run build && npm run check:dist
npm pack              # produces npm-scope-mks-ui-<version>.tgz
```

Consumers (pnpm) install the library from `artifacts/npm-scope-mks-ui-0.1.0.tgz` through a `file:` dependency. After a library change: run `npm pack` in `mks-ui/`, copy the tarball into `artifacts/`, then reinstall in each consumer (pnpm caches `file:` tarballs, so force a reinstall).

```bash
cd consumers/pages-js && pnpm test            # Jest; resolves the CJS build
cd consumers/pages-js && pnpm dev             # port 3101
cd consumers/app-ts && pnpm typecheck
cd consumers/app-ts && pnpm dev               # port 3201
cd consumers/app-ts && node scripts/autocomplete.mjs   # TS language-service check of editor completions
cd tools && node browser-check.mjs <url> <theme-primary-rgb> <font-substring>
```

## Library architecture and invariants

- **Output:** tsdown builds both ESM and CJS with `unbundle: true`, so each source module becomes its own file in `dist/`. Source imports use explicit `.js` extensions because of `NodeNext` and `verbatimModuleSyntax`. Type-only imports must use `import type`; lint enforces this.
- **`"use client"`:** every component module starts with the directive so App Router Server Components can import the components directly. `scripts/check-use-client.mjs` fails the build if the directive is lost in either format, or if it appears on a module that does not have it in source (for example the `index` barrels or `buttonStyles`). Do not add it to barrels.
- **Externals:** `dist` may import only relative files and the peer dependencies (`react`, `react-dom`, `@mui/material`, `@types/react`). `scripts/check-externals.mjs` also scans for inlined MUI or Emotion code and caps the total dist JS at 40 KB. A new runtime import must be a peer dependency.
- **Tarball audit:** `scripts/check-pack.mjs` allows only `package.json`, `README.md`, `CHANGELOG.md` and `dist/**` in the tarball, and fails on secrets, `process.env`, internal hosts (bri.co.id, bitbucket, etc.), auth or cookie code, non-allowlisted URLs, and **MKS business terms** (nasabah, kredit, debitur, …). README and CHANGELOG are scanned too, so keep domain vocabulary and internal URLs out of them.
- **Styling:** components use MUI `sx` only, with no Tailwind or global CSS. Brand colors and shadows are hardcoded in `components/button/buttonStyles.ts` (copied from mks_webapp, internal, not exported) so the look does not depend on the consumer theme. The one exception: with `colorType` omitted, the color falls back to the consumer theme's primary, and the font family always comes from the consumer theme. `composeSx` appends the consumer's `sx` (object, function or array) after the base styles so consumer styles always win.
- **Component contracts:** buttons forward refs to `<button>`, accept all MUI `Button` props except `variant`, and add `colorType`. `TablePaginationActions` uses MUI's standard `onPageChange(event, page)` with a zero-based page. This intentionally differs from the legacy mks_webapp one-argument callback. Aria labels are Indonesian.
- **Type contract tests:** `type-tests/contracts.tsx` is never executed. `tsc --noEmit` checks it, and every `@ts-expect-error` line must still error. Update it when the public types change.
- **Testing styles in jsdom:** jsdom cannot evaluate `:hover`, `:active` or `:disabled`, so tests use `src/test-utils/css.ts` (`effectiveStyles(el, ":hover")`) to resolve Emotion's generated rules. Real browser behavior is checked by `tools/browser-check.mjs`.
- **Compatibility:** the peer range is React 18.2+ or 19 and MUI 5.14+. Keep both consumers passing, since together they cover React 18 with CJS and Jest, and React 19 with the App Router.
