# Heroes Cursor

A Chrome extension inspired by Heroes of Might and Magic. Pick a custom cursor from the toolbar popup and use it across websites.

## Requirements

- [Node.js](https://nodejs.org/) 18+
- Google Chrome (or another Chromium browser)

## Setup

```bash
git clone https://github.com/stasyago86/heroes-cursor.git
cd heroes-cursor
npm install
npm run build
```

## Load in Chrome

1. Open `chrome://extensions`
2. Enable **Developer mode**
3. Click **Load unpacked**
4. Select the `dist` folder in this project

Click the extension icon in the toolbar to open the popup and choose a cursor.

## Development

Rebuild automatically when files change:

```bash
npm run dev
```

After changes, click **Reload** on the extension card in `chrome://extensions`.

## Project layout

| Path | Purpose |
|------|---------|
| `src/` | Popup UI, content script, cursor options |
| `public/cursors/` | Cursor PNG assets by faction |
| `icons/` | Extension icons (16, 32, 48, 128) |
| `manifest.json` | Extension manifest (copied to `dist` on build) |
| `dist/` | Build output — load this folder in Chrome |

Cursor lists for Knight, Barbarian, Sorceress, and Warlock are generated at build time from PNGs in `public/cursors/`. Popup order is configured in `vite.config.ts` (`*_ORDER` maps).

