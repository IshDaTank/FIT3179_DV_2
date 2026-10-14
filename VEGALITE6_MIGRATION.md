# Vega-Lite 6 migration — FIT3179 A2

Updated: 14 October 2026

## Deployment
Replace the contents of your `FIT3179_A2` repository root with the files in this archive. Keep the `specs/`, `data/`, `css/`, and `js/` directories.

## Dependencies
- Vega 6.4.0
- Vega-Lite 6.5.0
- Vega-Embed 7.3.0
- Twelve independent Vega-Lite JSON specifications using the v6 schema.

All paths are relative to the page. There is no Python requirement.

## Checks performed
- All 12 JSON specifications parse and use the v6 schema.
- All 12 chart IDs match their HTML containers and JSON filenames.
- Referenced local data files exist.
- JavaScript syntax checked with Node.
- All required Vega library script tags use the documented matching major versions.

## Still requiring a browser check
Actual Vega-Lite 6 compilation and visual rendering have not been verified in the execution environment. Inspect the published site and browser console, particularly any chart schema errors or missing external world-atlas basemap requests.

## Push changes
```sh
git add -A
git commit -m "Upgrade all Vega-Lite charts to version 6"
git push origin main
```

GitHub Pages: Settings → Pages → Deploy from branch → main → /(root).
