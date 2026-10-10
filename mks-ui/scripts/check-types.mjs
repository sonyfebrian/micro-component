// Runs attw with an isolated npm cache. This keeps verification independent
// from a developer's global npm-cache ownership and configuration.
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const executable = process.platform === "win32" ? "attw.cmd" : "attw";
const attw = join(root, "node_modules", ".bin", executable);
const npmCache = mkdtempSync(join(tmpdir(), "mks-ui-npm-cache-"));
const env = { ...process.env, npm_config_cache: npmCache };

// npm publish --dry-run propagates this flag to lifecycle scripts. attw needs
// its nested npm pack command to create a tarball that it can inspect.
delete env.npm_config_dry_run;

try {
  const result = spawnSync(attw, ["--pack", "."], {
    cwd: root,
    env,
    stdio: "inherit",
  });
  if (result.error) throw result.error;
  if (result.status !== 0) process.exitCode = result.status ?? 1;
} finally {
  rmSync(npmCache, { recursive: true, force: true });
}
