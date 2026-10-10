# @mks-ui/core

Reusable Material UI components for React applications.

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
pnpm add @mks-ui/core @mui/material @emotion/react @emotion/styled
```

## Usage

```jsx
import { ButtonContained, ButtonOutlined, TablePaginationActions } from "@mks-ui/core";
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

Earlier integrations that use a one-argument `onPageChange(page)` callback
need an adapter when adopting this package.

## Styling

- No Tailwind or global CSS is required. Styles are applied with MUI `sx`.
- Brand colors, radius, weight, disabled styles, hover and active colors, and
  button shadows are built in, so the look does not depend on a specific app
  theme.
- The font family still comes from the consumer's MUI theme.

## Next.js

- **Pages Router:** works without extra configuration.
- **App Router:** the component modules are marked `"use client"`, so they can
  be imported directly from Server Components. Use MUI's App Router cache
  provider in the consumer for server-rendered styles.

## Storybook

Explore the components, switch the preview between light and dark themes, and
adjust button props with Controls:

```bash
npm run storybook
```

Create a static Storybook site with `npm run build-storybook`.

## Development

Requires Node 24.14.1 (see `.node-version`). Consumers can run on Node 18 or later.

```bash
npm install
npm run verify   # clean, typecheck, lint, test, build, dist checks, publint, attw, pack audit
npm pack         # creates the tarball for local consumer testing
```
