# Memory & Resource Usage

## Runtime Memory
- **Tone.js** poly‑synths allocate a modest amount of Web Audio nodes (roughly 10‑15 KB per voice). With three instruments each supporting up to 6 simultaneous notes, memory consumption stays under 1 MB.
- **MediaPipe Hands** loads a model (~1 MB) into memory and maintains a small state buffer.
- **Recording buffers** store video frames (1280×720 at 30 fps) and audio chunks. For a typical 2‑minute session the memory footprint is ~150 MB, which is acceptable on modern browsers.

## Recommendations
- Release the `MediaPipe` model only when tracking is enabled.
- Call `Tone.dispose()` on component unmount (handled in `useAudioEngine`).
- Limit `REQUIRED_STABLE_FRAMES` to 3 to keep the finger‑count buffer small.

## SEO Metadata Overhead
- Added `<meta>` tags (description, Open Graph, Twitter Cards) and a `<link rel="canonical">` to `index.html` (2026‑07‑14). These are inline HTML strings totalling approximately 1 KB and have negligible impact on runtime memory.

## Accessibility Improvements Overhead
- Added `role="dialog"`, `aria-modal="true"`, `aria-labelledby`, focus management (`useRef`, `useEffect`) to `InstructionsModal` (2026‑07‑14).
- Added `focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:outline-none` to all interactive buttons in `BottomDock`.
- Added `role="region"` with `aria-label` to `PerformanceCanvas` and `BottomDock`.
- Added `role="banner"` to the header in `App.jsx`.
- All changes are attribute-only additions; no runtime logic, rendering, or memory impact beyond a few bytes of className strings.

## Performance Optimizations Overhead
- **App.jsx** — Replaced `Array.find()` chord lookup with a `Map.get()` for O(1) lookup per frame (2026‑07‑14). The Map instance is memoized in the `useMemo` block and adds ~50 bytes per scale.
- **useHandTracking** — Cached canvas 2D context in a ref to avoid repeated `getContext('2d')` calls; grouped `fillStyle`/`strokeStyle` assignment outside per‑landmark loops; batched all hand‑landmark drawing into a single `beginPath()`/`fill()` path per hand to reduce draw calls (2026‑07‑14).
- **useAudioEngine** — Cached `Tone.now()` to a local variable before `triggerRelease`/`triggerAttack` calls in `playChord` and `changeInstrument` to avoid redundant scheduler calls (2026‑07‑14).
- All changes are algorithmic/ref optimizations with zero UI impact and negligible memory overhead (~100 bytes total).

## Assumptions
- Users will typically record short performances (<5 min). Long recordings may trigger browser memory pressure; the app currently does not provide streaming or chunked download options.
