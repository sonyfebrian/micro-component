// Packs the package (dry run), then fails on any file outside the allowlist,
// on secret-like content, internal URLs, auth code or MKS business terms.
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));

const ALLOWED_FILES = [
  /^package\.json$/,
  /^README\.md$/,
  /^CHANGELOG\.md$/,
  /^dist\/[\w/.-]+\.(js|cjs|d\.ts|d\.cts)$/,
];

const FORBIDDEN_CONTENT = [
  ["env file reference", /(^|[^\w])\.env(\.|\b)/],
  ["process.env access", /process\.env/],
  ["Next.js public env var", /NEXT_PUBLIC_/],
  ["npm token", /npm_[A-Za-z0-9]{36}/],
  ["GitHub token", /gh[pousr]_[A-Za-z0-9]{36}/],
  ["AWS access key", /AKIA[0-9A-Z]{16}/],
  ["private key", /-----BEGIN [A-Z ]*PRIVATE KEY-----/],
  ["literal auth token", /_authToken\s*=\s*(?!\$\{)\S+/],
  ["secret assignment", /\b(secret|password|passwd|api[_-]?key|private[_-]?key)\s*[:=]/i],
  ["bearer token", /\bBearer\s+[A-Za-z0-9._-]{10,}/],
  ["internal host", /(bri\.co\.id|brispot|bitbucket\.|nexus)/i],
  ["auth or session code", /(document\.cookie|localStorage|sessionStorage|X-Signature|crypto-js|aesDecryption|getSecuredCookie|Authorization)/],
  ["MKS business term", /\b(notaris|mitra|pengajuan|debitur|rekening|nasabah|kredit|uker|kerjasama|prakarsa)\b/i],
  ["non-allowlisted URL", /https?:\/\/(?!(www\.)?(npmjs\.com|docs\.npmjs\.com|registry\.npmjs\.org|mui\.com|react\.dev|nextjs\.org)\b)[^\s)"'`]+/],
];

const output = execFileSync("npm", ["pack", "--dry-run", "--json", "--ignore-scripts"], { cwd: root, encoding: "utf8" });
const [result] = JSON.parse(output);
const files = result.files.map((file) => file.path).sort();

const errors = [];
for (const file of files) {
  if (!ALLOWED_FILES.some((pattern) => pattern.test(file))) errors.push(`unexpected file in tarball: ${file}`);
  const content = readFileSync(join(root, file), "utf8");
  for (const [label, pattern] of FORBIDDEN_CONTENT) {
    const match = pattern.exec(content);
    if (match) errors.push(`${file}: ${label} ("${match[0].slice(0, 40)}")`);
  }
}
for (const required of ["package.json", "README.md", "dist/index.js", "dist/index.cjs", "dist/index.d.ts", "dist/index.d.cts"]) {
  if (!files.includes(required)) errors.push(`required file missing from tarball: ${required}`);
}

console.log(`check-pack: ${result.filename}, ${files.length} files, ${result.size} bytes packed, ${result.unpackedSize} bytes unpacked`);
for (const file of files) console.log(`  ${file}`);
if (errors.length > 0) {
  console.error(`check-pack: FAILED\n  ${errors.join("\n  ")}`);
  process.exit(1);
}
console.log("check-pack: OK (allowlist and content scan passed)");
