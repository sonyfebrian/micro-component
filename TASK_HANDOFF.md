# Current Task Handoff

## Current State

The micro-component library has already been created as a private TypeScript
package at `mks-ui/`. It is a proof of concept for `@npm-scope/mks-ui`; the
scope is a placeholder and the package must remain private until publishing is
approved.

## Completed

- Library build and packaging are configured with tsdown for both ESM and CJS
  output, plus declaration files and a restricted publish configuration.
- The initial public components are implemented and exported:
  `ButtonContained`, `ButtonOutlined`, and `TablePaginationActions`.
- Component tests use Vitest, while `type-tests/contracts.tsx` guards the
  public TypeScript contract.
- Distribution checks validate client directives, external dependencies,
  package contents, type resolution, and publishability.
- A packed tarball exists in `artifacts/`; both consumer applications install
  it through a local `file:` dependency.
- Compatibility consumers are present for React 18/Next.js Pages Router
  (`consumers/pages-js/`) and React 19/Next.js App Router
  (`consumers/app-ts/`). A Playwright browser-check utility is available in
  `tools/`.

## Constraints and Decisions

- Use MUI `sx`; do not add global CSS or Tailwind.
- Keep component modules marked with `"use client"`, but do not add that
  directive to barrel files.
- Preserve explicit `.js` source import extensions and `import type` usage.
- Maintain React 18/19 and MUI 5.14+ peer compatibility. See `CLAUDE.md` for
  complete architecture and packaging invariants.

## Unfinished Work

No additional component migration is currently specified. The package remains
a private POC and has not been approved for publication. Current verification
results are not recorded in this handoff, so they should be confirmed before
any release-oriented or compatibility-sensitive change.

## Recommended Next Task

Run the existing validation matrix without changing implementation: execute
`npm run verify` in `mks-ui/`, then validate both consumer applications against
the packed tarball. Record any failures before deciding whether to add another
component or prepare the package for approval.
