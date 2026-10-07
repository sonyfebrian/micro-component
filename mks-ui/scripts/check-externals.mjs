// Fails if the build output imports anything other than relative files and the
// package's peer dependencies, or if peer dependency code was inlined.
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const distDir = join(root, "dist");
const pkg = JSON.parse(readFileSync(join(root, "package.json"), "utf8"));
const peers = Object.keys(pkg.peerDependencies ?? {});
const MAX_DIST_JS_BYTES = 40_000;

function walk(dir) {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    return statSync(path).isDirectory() ? walk(path) : [path];
  });
}

const SPECIFIER = /(?:\bfrom\s*|\bimport\s*\(?\s*|\brequire\s*\(\s*)(["'])([^"']+)\1/g;
const INLINED_MARKERS = ["MuiButtonBase", "createStyled", "@emotion/", "react-dom", "__SECRET_INTERNALS", "TouchRipple"];

const errors = [];
const seenBare = new Set();
let jsBytes = 0;

for (const file of walk(distDir)) {
  if (!/\.(c?js|d\.c?ts)$/.test(file)) continue;
  const code = readFileSync(file, "utf8");
  const isJs = /\.c?js$/.test(file);
  if (isJs) jsBytes += Buffer.byteLength(code);

  for (const match of code.matchAll(SPECIFIER)) {
    const specifier = match[2];
    if (specifier.startsWith(".")) {
      const target = resolve(dirname(file), specifier);
      const candidates = isJs
        ? [target]
        : [target.replace(/\.js$/, ".d.ts").replace(/\.cjs$/, ".d.cts")];
      if (!candidates.some((candidate) => existsSync(candidate))) {
        errors.push(`${relative(root, file)} imports missing file ${specifier}`);
      }
      continue;
    }
    seenBare.add(specifier);
    const allowed = peers.some((peer) => specifier === peer || specifier.startsWith(`${peer}/`));
    if (!allowed) errors.push(`${relative(root, file)} imports non-peer module "${specifier}"`);
  }

  if (isJs) {
    for (const marker of INLINED_MARKERS) {
      if (code.includes(marker)) errors.push(`${relative(root, file)} contains "${marker}"; a dependency may be bundled`);
    }
  }
}

if (jsBytes > MAX_DIST_JS_BYTES) errors.push(`dist JS is ${jsBytes} bytes, above ${MAX_DIST_JS_BYTES}; a dependency may be bundled`);

if (errors.length > 0) {
  console.error(`check-externals: FAILED\n  ${errors.join("\n  ")}`);
  process.exit(1);
}
console.log(`check-externals: OK (${jsBytes} bytes of JS, external imports: ${[...seenBare].sort().join(", ")})`);
