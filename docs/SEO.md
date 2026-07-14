# SEO Guidelines

## Current State
- `index.html` defines a minimal `<title>` (`Synchordia`) and includes a favicon.
- No meta description, Open Graph tags, or structured data are present.

## Recommendations
1. **Meta Description** – Add a concise description (150‑160 characters) summarizing the app.
   ```html
   <meta name="description" content="Play polyphonic chords with hand gestures in your browser. No installation required – just webcam and microphone.">
   ```
2. **Open Graph / Twitter Cards** – Provide social preview when sharing.
   ```html
   <meta property="og:title" content="Synchordia – Hand‑Gesture Musical Instrument" />
   <meta property="og:description" content="Hands‑free web instrument that turns gestures into music." />
   <meta property="og:image" content="/og-image.png" />
   <meta property="og:url" content="https://your-site.com/" />
   <meta name="twitter:card" content="summary_large_image" />
   ```
3. **Canonical URL** – Prevent duplicate indexing.
   ```html
   <link rel="canonical" href="https://your-site.com/" />
   ```
4. **Performance‑Related SEO** – Ensure the app loads quickly:
   - Use Vite’s production build (`npm run build`).
   - Enable gzip/brotli compression on the static host.
   - Keep the bundle size under 200 KB gzipped.

## Implementation Steps
- Update `index.html` with the above tags.
- Generate an appropriate Open Graph image (e.g., screenshot of the UI).
- Deploy to a static hosting provider that supports HTTPS.

## Assumptions
- The project will be hosted on a public domain; placeholder URLs should be replaced accordingly.
