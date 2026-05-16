/**
 * Storage key for the active cursor preset.
 * Keep in sync with `src/content/index.ts` (the content script avoids importing this file
 * so Rollup does not emit a shared chunk that Chrome content scripts cannot load).
 */
export const CURSOR_STORAGE_KEY = "heroesCursor:v1";

export type StoredCursor = {
  id: string;
  /** Full CSS cursor value, e.g. `pointer` or `url(...) 8 8, auto`. */
  css: string;
  /** Optional second cursor for interactive elements while hovered (e.g. Barbarian + axe). */
  hoverCss?: string;
};
