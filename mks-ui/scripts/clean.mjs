import { readdirSync, rmSync } from "node:fs";

rmSync(new URL("../dist", import.meta.url), { recursive: true, force: true });
for (const name of readdirSync(new URL("..", import.meta.url))) {
  if (name.endsWith(".tgz")) rmSync(new URL(`../${name}`, import.meta.url));
}
console.log("clean: removed dist/ and *.tgz");
