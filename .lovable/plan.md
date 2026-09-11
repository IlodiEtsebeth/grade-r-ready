# Install button redesign + logo throughout the app

## What changes

1. **Install app button redesign** — restyle the "Add Grade R Ready to your phone" card and its "Show me how" button on the dashboard so it feels more polished and inviting, while staying in the frosted sunlit calm style (warm gold, soft surfaces). Rounded shape, friendlier emphasis, subtle touch feedback. Behaviour stays the same (expand instructions, dismiss).

2. **Your logo throughout the app** — once you attach your logo file:
   - Show it in the header at the top of every app screen (Home, Checklist, Activities, Progress, Report) next to the "Grade R Ready" name.
   - Replace the gold "R" block on the welcome screen with your logo.
   - Use it as the app icon (home-screen icon and browser tab icon), so it also appears when the app is installed.

## What I need from you

- Your logo file, attached in chat. A PNG with a transparent background is ideal; a JPG or SVG also works.

## Technical details

- Edit `src/components/install-app-card.tsx` for the button/card restyle.
- Add the logo to `src/components/app-shell.tsx` header and `src/routes/index.tsx` landing header.
- Add derived icons to `public/` (favicon, apple-touch-icon, manifest icons) and update `src/routes/__root.tsx` links plus `public/manifest.json`.
