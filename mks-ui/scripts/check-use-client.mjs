// Fails unless every source module that starts with "use client" still starts
// with it in both built formats, and no other built module gained the directive.
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const srcDir = join(root, "src");
const distDir = join(root, "dist");
const DIRECTIVE = /^\s*(["'])use client\1;?/;

function walk(dir) {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    return statSync(path).isDirectory() ? walk(path) : [path];
  });
}

const sources = walk(srcDir).filter(
  (file) => /\.tsx?$/.test(file) && !/\.test\.tsx?$/.test(file) && !file.includes(`${join("src", "test-utils")}`),
);
const clientSources = sources.filter((file) => DIRECTIVE.test(readFileSync(file, "utf8")));

const errors = [];
if (clientSources.length === 0) errors.push("no client source modules found; check is misconfigured");

const expectedClientOutputs = new Set();
for (const source of clientSources) {
  const base = relative(srcDir, source).replace(/\.tsx?$/, "");
  for (const ext of [".js", ".cjs"]) {
    const output = join(distDir, base + ext);
    expectedClientOutputs.add(output);
    if (!existsSync(output)) {
      errors.push(`missing build output ${relative(root, output)}`);
    } else if (!DIRECTIVE.test(readFileSync(output, "utf8"))) {
      errors.push(`"use client" is not the first statement of ${relative(root, output)}`);
    }
  }
}

for (const output of walk(distDir).filter((file) => /\.c?js$/.test(file))) {
  if (!expectedClientOutputs.has(output) && DIRECTIVE.test(readFileSync(output, "utf8"))) {
    errors.push(`unexpected "use client" in ${relative(root, output)}`);
  }
}

if (errors.length > 0) {
  console.error(`check-use-client: FAILED\n  ${errors.join("\n  ")}`);
  process.exit(1);
}
console.log(`check-use-client: OK (${expectedClientOutputs.size} client outputs keep the directive)`);
for (const output of [...expectedClientOutputs].sort()) console.log(`  ${relative(root, output)}`);
