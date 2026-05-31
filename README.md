# Simplicity Air – Stock Control PWA

## Files
- `index.html` — The complete app (all-in-one HTML/CSS/JS)
- `manifest.json` — PWA manifest for home screen install
- `sw.js` — Service worker for offline support
- `google-apps-script.js` — Paste into Google Apps Script for write operations
- `icon-192.png` / `icon-512.png` — Add your own app icons

## Hosting (Free – GitHub Pages)

1. Create a free account at github.com
2. New repository → name it `simplicity-air-stock`
3. Upload all files from this folder
4. Settings → Pages → Source: main branch → Save
5. Your app URL: `https://[yourusername].github.io/simplicity-air-stock/`

## Setup Sequence

1. Host the app (above)
2. Import Rev3 spreadsheet to Google Sheets
3. Enable Google Sheets API → get API Key → paste in app Settings
4. Deploy Google Apps Script → paste Script URL in app Settings
5. Get ServiceM8 API key → paste in app Settings
6. Open app URL in Safari (iPhone) → Share → Add to Home Screen
7. Done — distribute URL to all technicians

## iPhone Install
Safari → open app URL → tap Share icon (□↑) → Add to Home Screen → Add

## Android Install
Chrome → open app URL → tap ⋮ menu → Add to Home Screen → Install
