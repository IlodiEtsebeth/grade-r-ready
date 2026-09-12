# Piece of Play logo throughout the app

Your logo is received and will work. It's a wide-ish square mark with the sun graphic and "PIECE OF PLAY" wordmark on a white background.

## What changes

1. **Prepare the logo** — remove the white background so it sits cleanly on the app's frosted surfaces. Create:
   - A transparent full logo (sun + wordmark) for the welcome screen and header.
   - A small square mark for the app header at the top of every screen (Home, Checklist, Activities, Progress, Report) next to the app name.
   - Favicon, Apple touch icon, and home-screen icons (192, 512, maskable) derived from the logo so the installed app uses your branding.

2. **Welcome screen** — replace the gold "R" block with your logo.

3. **App screens** — show the logo mark in the header area of the app.

4. **App icon** — update favicon, apple-touch-icon, and manifest icons.

## Technical details

- Use `imagegen--edit_image` with transparent_background to produce the transparent logo PNG; store via lovable-assets pointer for in-app use.
- Header logo in `src/components/app-shell.tsx`; welcome screen in `src/routes/index.tsx`.
- Favicon: real file at `public/favicon.png` (resized square via ImageMagick), update `head().links` in `src/routes/__root.tsx`, remove `public/favicon.ico`.
- Regenerate `public/icon-192.png`, `public/icon-512.png`, `public/icon-maskable-512.png`, `public/apple-touch-icon.png` from the logo.
