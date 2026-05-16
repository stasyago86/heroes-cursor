import type { StoredCursor } from "./shared/storage";
import { BARBARIAN_CURSOR_SPECS } from "./generated/barbarianCursors";
import { KNIGHT_CURSOR_SPECS } from "./generated/knightCursors";
import { SORCERESS_CURSOR_SPECS } from "./generated/sorceressCursors";
import { WARLOCK_CURSOR_SPECS } from "./generated/warlockCursors";

export type CursorOption = StoredCursor & {
  label: string;
  /** Short hint for the popup list */
  preview: string;
};

/** One section in the popup: optional heading plus its cursor rows. */
export type CursorOptionGroup = {
  id: string;
  /** Shown above the rows; omit so options render without a section title (e.g. built-ins). */
  title?: string;
  options: CursorOption[];
};

type FactionPngSpec = {
  id: string;
  pathFromRoot: string;
  label: string;
  preview: string;
  hotX: number;
  hotY: number;
  order: number;
};

function factionSpecsInOrder<T extends FactionPngSpec>(specs: readonly T[]): T[] {
  return [...specs].sort((a, b) => a.order - b.order);
}

/** Use only the creature name when the spec label is `Faction · Creature`. */
function factionCursorFromSpec(spec: FactionPngSpec, hoverCss?: string): CursorOption {
  const shortLabel = spec.label.includes(" · ")
    ? spec.label.split(" · ").slice(1).join(" · ")
    : spec.label;
  return extensionPngCursor(spec.id, shortLabel, spec.preview, spec.pathFromRoot, spec.hotX, spec.hotY, hoverCss);
}

/** Built-in options (no extension asset URLs). */
const STATIC_CURSOR_OPTIONS: CursorOption[] = [
  { id: "default", label: "Default", preview: "⬚", css: "default" },
];

function extensionPngCursor(
  id: string,
  label: string,
  preview: string,
  /** Path relative to the extension root (e.g. file under `public/` → copied to `dist/`). */
  pathFromRoot: string,
  hotX: number,
  hotY: number,
  hoverCss?: string,
): CursorOption {
  const url = chrome.runtime.getURL(pathFromRoot);
  return {
    id,
    label,
    preview,
    css: `url("${url}") ${hotX} ${hotY}, auto`,
    ...(hoverCss ? { hoverCss } : {}),
  };
}

/** Hotspot matches `generateCursorPackPlugin` (IHDR size → floor(w/2), floor(h*0.1)). */
const BARBARIAN_HOVER_AXE_HOT = { x: 24, y: 4 } as const;

function barbarianHoverAxeCss(): string {
  const url = chrome.runtime.getURL("cursors/artifacts/axe.png");
  return `url("${url}") ${BARBARIAN_HOVER_AXE_HOT.x} ${BARBARIAN_HOVER_AXE_HOT.y}, pointer`;
}

/** Hotspot matches `generateCursorPackPlugin` for `public/cursors/artifacts/sword.png` (48×48). */
const KNIGHT_HOVER_SWORD_HOT = { x: 24, y: 4 } as const;

function knightHoverSwordCss(): string {
  const url = chrome.runtime.getURL("cursors/artifacts/sword.png");
  return `url("${url}") ${KNIGHT_HOVER_SWORD_HOT.x} ${KNIGHT_HOVER_SWORD_HOT.y}, pointer`;
}

/** Hotspot matches `generateCursorPackPlugin` for `public/cursors/artifacts/superior.png` (48×48). */
const SORCERESS_WARLOCK_HOVER_SUPERIOR_HOT = { x: 24, y: 4 } as const;

function sorceressWarlockHoverSuperiorCss(): string {
  const url = chrome.runtime.getURL("cursors/artifacts/superior.png");
  return `url("${url}") ${SORCERESS_WARLOCK_HOVER_SUPERIOR_HOT.x} ${SORCERESS_WARLOCK_HOVER_SUPERIOR_HOT.y}, pointer`;
}

/**
 * Cursor list for the popup: outer array is categories, inner array is options in that category.
 * Order: built-in (no heading), then Warlock, Barbarian, Sorceress, Knight.
 */
export function getCursorOptionGroups(): CursorOptionGroup[] {
  return [
    { id: "built-in", options: STATIC_CURSOR_OPTIONS },
    {
      id: "warlock",
      title: "Warlock",
      options: factionSpecsInOrder(WARLOCK_CURSOR_SPECS).map((spec) =>
        factionCursorFromSpec(spec, sorceressWarlockHoverSuperiorCss()),
      ),
    },
    {
      id: "barbarian",
      title: "Barbarian",
      options: factionSpecsInOrder(BARBARIAN_CURSOR_SPECS).map((spec) =>
        factionCursorFromSpec(spec, barbarianHoverAxeCss()),
      ),
    },
    {
      id: "sorceress",
      title: "Sorceress",
      options: factionSpecsInOrder(SORCERESS_CURSOR_SPECS).map((spec) =>
        factionCursorFromSpec(spec, sorceressWarlockHoverSuperiorCss()),
      ),
    },
    {
      id: "knight",
      title: "Knight",
      options: factionSpecsInOrder(KNIGHT_CURSOR_SPECS).map((spec) =>
        factionCursorFromSpec(spec, knightHoverSwordCss()),
      ),
    },
  ];
}

/**
 * Flattened list (same cursors as {@link getCursorOptionGroups}, in UI order).
 * Includes `chrome-extension://…` URLs for PNGs declared in `manifest.json` under
 * `web_accessible_resources`.
 */
export function getCursorOptions(): CursorOption[] {
  return getCursorOptionGroups().flatMap((g) => g.options);
}