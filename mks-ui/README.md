# @npm-scope/mks-ui

Reusable MUI components extracted from mks_webapp. **Proof of concept.**

> `@npm-scope` is a placeholder. Replace it with the approved npm scope before
> the first publish. The package is marked `"private": true` so it cannot be
> published by accident; remove that flag only when publishing is approved.

## Components

| Component | Purpose |
|---|---|
| `ButtonContained` | Filled MUI `Button` with MKS brand colors |
| `ButtonOutlined` | Outlined MUI `Button` with MKS brand colors |
| `TablePaginationActions` | Previous/next actions for MUI `TablePagination` |

## Install

Peer dependencies: `react` and `react-dom` 18.2+ or 19, `@mui/material` 5.14+, and
the Emotion packages that MUI requires.

```bash
pnpm add @npm-scope/mks-ui @mui/material @emotion/react @emotion/styled
```

A private package needs a read-only npm token in the consumer's `.npmrc`:

```text
@npm-scope:registry=https://registry.npmjs.org/
//registry.npmjs.org/:_authToken=${NPM_TOKEN}
```

## Usage

```jsx
import { ButtonContained, ButtonOutlined, TablePaginationActions } from "@npm-scope/mks-ui";
import { TablePagination } from "@mui/material";

<ButtonContained colorType="primary" onClick={save}>Simpan</ButtonContained>
<ButtonOutlined colorType="danger" startIcon={<DeleteIcon />}>Hapus</ButtonOutlined>

<TablePagination
  component="div"
  count={total}
  page={pageIndex}
  rowsPerPage={limit}
  onPageChange={(event, nextPageIndex) => setPageIndex(nextPageIndex)}
  ActionsComponent={TablePaginationActions}
/>
```

### Button props

Both buttons accept every MUI `Button` prop except `variant`, plus:

| Prop | `ButtonContained` | `ButtonOutlined` |
|---|---|---|
| `colorType` | `"primary" \| "secondary"` | `"primary" \| "secondary" \| "default" \| "danger"` |

When `colorType` is omitted, the colors fall back to the MUI theme's primary
color. `sx` accepts objects, functions and arrays, and always overrides the
package's base styles. Refs are forwarded to the `<button>` element.

### Pagination callback

`TablePaginationActions` follows MUI's standard contract:
`onPageChange(event, page)`, where `page` is zero-based. Aria labels are fixed
in Indonesian ("Halaman Sebelumnya" / "Halaman Berikutnya").

The legacy mks_webapp component called `onPageChange(page)` with one argument.
Code written for that contract needs an adapter when it adopts this package.

## Styling

- No Tailwind or global CSS is required. Styles are applied with MUI `sx`.
- Brand colors, radius, weight, disabled styles, hover and active colors, and
  the button shadows are built in, so the look does not depend on the
  mks_webapp theme.
- The font family still comes from the consumer's MUI theme.

## Next.js

- **Pages Router:** works without extra configuration.
- **App Router:** the component modules are marked `"use client"`, so they can
  be imported directly from Server Components. Use MUI's App Router cache
  provider in the consumer for server-rendered styles.

## Development

Requires Node 24 (see `.node-version`). Consumers can run on Node 18 or later.

```bash
npm install
npm run verify   # clean, typecheck, lint, test, build, dist checks, publint, attw, pack audit
npm pack         # creates the tarball for local consumer testing
```
