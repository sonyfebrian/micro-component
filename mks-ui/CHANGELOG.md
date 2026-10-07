# Changelog

## 0.1.0 (unreleased)

- Initial proof of concept: `ButtonContained`, `ButtonOutlined` and
  `TablePaginationActions`, converted from mks_webapp to TypeScript.
- `TablePaginationActions` uses MUI's standard `onPageChange(event, page)` contract.
- Peer range covers React 18.2+ and React 19, after both were tested in
  Next.js consumer apps (Pages Router on React 18.2, App Router on React 19).
