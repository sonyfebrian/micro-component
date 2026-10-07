// Loads a consumer page in system Chrome and checks hydration, console errors,
// real computed styles (including :hover) and pagination behaviour.
// Usage: node browser-check.mjs <url> <theme-primary-rgb> <font-substring>
import { chromium } from "playwright-core";

const [url, themeRgb, fontHint] = process.argv.slice(2);
const results = [];
const check = (name, ok, detail = "") => results.push({ name, ok: Boolean(ok), detail });

const browser = await chromium.launch({ channel: "chrome", headless: true });
const page = await browser.newPage();
const consoleProblems = [];
page.on("console", (msg) => {
  if (["error", "warning"].includes(msg.type())) consoleProblems.push(`${msg.type()}: ${msg.text()}`);
});
page.on("pageerror", (error) => consoleProblems.push(`pageerror: ${error.message}`));
const failedRequests = [];
page.on("response", (response) => {
  if (response.status() >= 400) failedRequests.push(`${response.status()} ${new URL(response.url()).pathname}`);
});
// MUI animates background-color and box-shadow (~250ms); read styles after it settles.
const settle = () => page.waitForTimeout(450);

await page.goto(url, { waitUntil: "networkidle" });

const style = (testId, props) =>
  page.getByTestId(testId).evaluate((el, keys) => {
    const cs = getComputedStyle(el);
    return Object.fromEntries(keys.map((k) => [k, cs[k]]));
  }, props);

// Interactivity proves hydration completed.
await page.getByTestId("contained-primary").click();
const clicks = await page.getByTestId("clicks").textContent();
check("hydrated: onClick works", clicks?.includes("clicks: 1"), clicks ?? "");

const base = await style("contained-primary", ["backgroundColor", "color", "textTransform", "boxShadow", "borderRadius", "fontWeight", "fontFamily"]);
await page.mouse.move(0, 0);
await page.evaluate(() => document.activeElement instanceof HTMLElement && document.activeElement.blur());
await settle();
const rest = await style("contained-primary", ["backgroundColor", "boxShadow"]);
check("contained primary background", rest.backgroundColor === "rgb(0, 82, 156)", rest.backgroundColor);
check("contained text white", base.color === "rgb(255, 255, 255)", base.color);
check("textTransform none", base.textTransform === "none", base.textTransform);
check("resting boxShadow none", rest.boxShadow === "none", rest.boxShadow);
check("border radius 7px", base.borderRadius === "7px", base.borderRadius);
check("font weight 500", base.fontWeight === "500", base.fontWeight);
check("font family from consumer theme", base.fontFamily.includes(fontHint), base.fontFamily);

const secondary = await style("contained-secondary", ["backgroundColor"]);
check("contained secondary background", secondary.backgroundColor === "rgb(237, 110, 18)", secondary.backgroundColor);
const themed = await style("contained-theme", ["backgroundColor"]);
check("no colorType uses consumer theme primary (shared MUI context)", themed.backgroundColor === themeRgb, themed.backgroundColor);
const disabled = await style("contained-disabled", ["backgroundColor", "color"]);
check("disabled styling", disabled.backgroundColor === "rgba(0, 0, 0, 0.12)" && disabled.color === "rgba(0, 0, 0, 0.26)", JSON.stringify(disabled));

await page.getByTestId("contained-primary").hover();
await settle();
const containedHover = await style("contained-primary", ["backgroundColor", "boxShadow"]);
check("contained hover darkens", containedHover.backgroundColor === "rgb(0, 73, 140)", containedHover.backgroundColor);
check("contained hover uses MKS shadow", containedHover.boxShadow.includes("rgba(0, 0, 0, 0.31)"), containedHover.boxShadow);

for (const [testId, rgb] of [
  ["outlined-primary", "rgb(0, 82, 156)"],
  ["outlined-secondary", "rgb(237, 110, 18)"],
  ["outlined-default", "rgb(189, 189, 189)"],
  ["outlined-danger", "rgb(214, 71, 72)"],
  ["outlined-theme", themeRgb],
]) {
  await page.mouse.move(0, 0);
  await settle();
  const idle = await style(testId, ["color", "borderTopColor"]);
  await page.getByTestId(testId).hover();
  await settle();
  const hover = await style(testId, ["color", "backgroundColor"]);
  // Without colorType the original used MUI's default outlined border: primary at 50% alpha.
  const expectedBorder = testId === "outlined-theme" ? rgb.replace("rgb(", "rgba(").replace(")", ", 0.5)") : rgb;
  check(`${testId} idle text and border`, idle.color === rgb && idle.borderTopColor === expectedBorder, JSON.stringify(idle));
  check(`${testId} hover readable (white on fill)`, hover.color === "rgb(255, 255, 255)" && hover.backgroundColor === rgb, JSON.stringify(hover));
}

const next = page.getByRole("button", { name: "Halaman Berikutnya" });
const previous = page.getByRole("button", { name: "Halaman Sebelumnya" });
check("previous disabled on first page", await previous.isDisabled());
await next.click();
await next.click();
check("next twice -> page index 2", (await page.getByTestId("page").textContent())?.includes("page index: 2"));
check("callback received (event, page)", (await page.getByTestId("last-call").textContent())?.includes("click:2"));
await next.click();
await next.click();
check("next disabled on last page", await next.isDisabled());
await previous.click();
check("previous -> page index 3", (await page.getByTestId("page").textContent())?.includes("page index: 3"));

const tailwind = await page.evaluate(() => ({
  cursorPointerClasses: document.querySelectorAll(".cursor-pointer").length,
  stylesheetsMentioningTailwind: Array.from(document.styleSheets).filter((s) => (s.href ?? "").includes("tailwind")).length,
}));
check("no Tailwind classes or stylesheets", tailwind.cursorPointerClasses === 0 && tailwind.stylesheetsMentioningTailwind === 0, JSON.stringify(tailwind));
const unexpectedFailures = failedRequests.filter((entry) => !entry.endsWith("/favicon.ico"));
const realConsoleProblems = consoleProblems.filter(
  (text) => !(text.startsWith("error: Failed to load resource") && unexpectedFailures.length === 0),
);
check("no failed requests except favicon", unexpectedFailures.length === 0, failedRequests.join(", "));
check("no console errors, warnings or hydration errors", realConsoleProblems.length === 0, realConsoleProblems.join(" | "));
console.log(`failed requests: ${failedRequests.join(", ") || "none"}`);

await browser.close();
const failed = results.filter((r) => !r.ok);
for (const r of results) console.log(`${r.ok ? "PASS" : "FAIL"}  ${r.name}${r.ok ? "" : `  -> ${r.detail}`}`);
console.log(`${results.length - failed.length}/${results.length} browser checks passed for ${url}`);
process.exit(failed.length ? 1 : 0);
