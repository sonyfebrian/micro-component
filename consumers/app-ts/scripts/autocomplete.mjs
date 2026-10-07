// Asks the TypeScript language service (what editors use) for completions and
// diagnostics against the installed package types. The probe file is written
// to disk for the duration of the check and removed afterwards.
import ts from "typescript";
import { rmSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const { config } = ts.readConfigFile(resolve(root, "tsconfig.json"), ts.sys.readFile);
const parsed = ts.parseJsonConfigFileContent(config, ts.sys, root);
parsed.options.incremental = false; // Next sets this; invalid for an in-process language service.

const probePath = resolve(root, "type-tests", "__probe.tsx");
const probe = [
  'import { ButtonContained, ButtonOutlined } from "@npm-scope/mks-ui";',
  'export const a = <ButtonOutlined colorType="" />;',
  "export const b = <ButtonContained  />;",
  'export const c = <ButtonContained colorType="purple" />;',
  "",
].join("\n");
writeFileSync(probePath, probe);

try {
  const host = {
    getScriptFileNames: () => [...new Set([...parsed.fileNames, probePath])],
    getScriptVersion: () => "1",
    getScriptSnapshot: (file) => (ts.sys.fileExists(file) ? ts.ScriptSnapshot.fromString(ts.sys.readFile(file)) : undefined),
    getCurrentDirectory: () => root,
    getCompilationSettings: () => parsed.options,
    getDefaultLibFileName: (options) => ts.getDefaultLibFilePath(options),
    fileExists: ts.sys.fileExists,
    readFile: ts.sys.readFile,
    readDirectory: ts.sys.readDirectory,
    directoryExists: ts.sys.directoryExists,
    getDirectories: ts.sys.getDirectories,
    realpath: ts.sys.realpath, // editors resolve pnpm symlinks; without this, peer types are not found
  };
  const service = ts.createLanguageService(host, ts.createDocumentRegistry());

  const quote = probe.indexOf('colorType=""') + 'colorType="'.length;
  const values = service.getCompletionsAtPosition(probePath, quote, { triggerCharacter: '"' })?.entries ?? [];
  console.log("colorType completions for ButtonOutlined:", values.map((e) => e.name).sort().join(", ") || "(none)");

  const propSpot = probe.indexOf("<ButtonContained  />") + "<ButtonContained ".length;
  const props = (service.getCompletionsAtPosition(probePath, propSpot, {})?.entries ?? []).map((e) => e.name);
  console.log("prop completions:", ["colorType", "startIcon", "sx", "disabled", "onClick", "className", "ref"].map((n) => `${n}=${props.includes(n)}`).join(" "));
  console.log("variant offered:", props.includes("variant"));

  const info = service.getQuickInfoAtPosition(probePath, probe.indexOf("ButtonContained,") + 2);
  console.log("hover type of ButtonContained:", ts.displayPartsToString(info?.displayParts ?? []).slice(0, 140));

  console.log("diagnostics:");
  for (const d of service.getSemanticDiagnostics(probePath)) {
    const { line } = ts.getLineAndCharacterOfPosition(d.file, d.start ?? 0);
    console.log(`  line ${line + 1}: ${ts.flattenDiagnosticMessageText(d.messageText, "\n").split("\n")[0]}`);
  }
} finally {
  rmSync(probePath, { force: true });
}
