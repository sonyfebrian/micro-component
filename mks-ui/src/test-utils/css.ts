/**
 * Test helpers for Emotion-generated CSS. jsdom cannot evaluate :hover, :active
 * or :disabled, so tests resolve the generated rules the way a browser would:
 * every rule for the element's class with the given selector suffix, in source
 * order, where the last declaration of a property wins.
 */

function emotionClassNames(element: Element): string[] {
  return Array.from(element.classList).filter((name) => name.startsWith("css-"));
}

function allCss(): string {
  return Array.from(document.querySelectorAll("style"))
    .map((style) => style.textContent ?? "")
    .join("\n");
}

function withoutMediaBlocks(css: string): string {
  return css.replace(/@media[^{]*\{(?:[^{}]*\{[^{}]*\})*\s*\}/g, "");
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** Resolved declarations for `.<emotion-class><suffix>`, e.g. suffix ":hover". */
export function effectiveStyles(element: Element, suffix = ""): Record<string, string> {
  const css = withoutMediaBlocks(allCss());
  const declarations: Record<string, string> = {};

  for (const name of emotionClassNames(element)) {
    const selector = escapeRegExp(`.${name}${suffix}`);
    const pattern = new RegExp(`${selector}\\s*\\{([^}]*)\\}`, "g");
    for (const match of css.matchAll(pattern)) {
      for (const declaration of (match[1] ?? "").split(";")) {
        const index = declaration.indexOf(":");
        if (index > 0) {
          declarations[declaration.slice(0, index).trim()] = declaration.slice(index + 1).trim();
        }
      }
    }
  }
  return declarations;
}

/** All Emotion CSS text that mentions the element's classes, including @media blocks. */
export function cssRulesFor(element: Element): string {
  const css = allCss();
  return emotionClassNames(element)
    .flatMap((name) => css.split("}").filter((chunk) => chunk.includes(`.${name}`)))
    .join("}\n");
}

/** Emotion drops the space after commas; normalize expected values the same way. */
export function css(value: string): string {
  return value.replace(/,\s+/g, ",");
}
