/**
 * Must stay aligned with `src/shared/storage.ts` (content script cannot import shared
 * chunks without breaking the extension bundle layout).
 */
const CURSOR_STORAGE_KEY = "heroesCursor:v1";

type StoredCursor = {
  id: string;
  css: string;
  hoverCss?: string;
};

/** Elements that usually show a pointer hand; Barbarian presets use `hoverCss` here only. */
const INTERACTIVE_HOVER_CURSOR_SELECTORS = [
  "a[href]:hover",
  "button:not(:disabled):hover",
  '[role="button"]:not([aria-disabled="true"]):hover',
  '[role="link"]:hover',
  'input[type="button"]:not(:disabled):hover',
  'input[type="submit"]:not(:disabled):hover',
  'input[type="reset"]:not(:disabled):hover',
  'input[type="image"]:not(:disabled):hover',
  "select:hover",
  "summary:hover",
  "textarea:hover",
  "input[type=\"checkbox\"]:hover",
  "input[type=\"radio\"]:hover",
  "input[type=\"file\"]:hover",
  "input[type=\"range\"]:hover",
  "input[type=\"color\"]:hover",
].join(",\n");

const STYLE_ID = "heroes-cursor-injected-style";

function removeStyle(): void {
  document.getElementById(STYLE_ID)?.remove();
}

function applyCursor(css: string, hoverCss?: string): void {
  let el = document.getElementById(STYLE_ID) as HTMLStyleElement | null;
  if (!el) {
    el = document.createElement("style");
    el.id = STYLE_ID;
    (document.head ?? document.documentElement).appendChild(el);
  }
  const base = `html, html *, html *::before, html *::after { cursor: ${css} !important; }`;
  const hover =
    hoverCss == null
      ? ""
      : `${INTERACTIVE_HOVER_CURSOR_SELECTORS} { cursor: ${hoverCss} !important; }`;
  el.textContent = base + hover;
}

function readAndApply(result: { [key: string]: unknown }): void {
  const raw = result[CURSOR_STORAGE_KEY] as StoredCursor | undefined;
  if (raw?.css) applyCursor(raw.css, raw.hoverCss);
  else removeStyle();
}

void chrome.storage.local.get(CURSOR_STORAGE_KEY, readAndApply);

chrome.storage.onChanged.addListener((changes, area) => {
  if (area !== "local") return;
  const ch = changes[CURSOR_STORAGE_KEY];
  if (!ch) return;
  const nv = ch.newValue as StoredCursor | undefined;
  if (nv?.css) applyCursor(nv.css, nv.hoverCss);
  else removeStyle();
});
