# Memory & Resource Usage

## Runtime Memory
- **Tone.js** poly‑synths allocate a modest amount of Web Audio nodes (roughly 10‑15 KB per voice). With three instruments each supporting up to 6 simultaneous notes, memory consumption stays under 1 MB.
- **MediaPipe Hands** loads a model (~1 MB) into memory and maintains a small state buffer.
- **Recording buffers** store video frames (1280×720 at 30 fps) and audio chunks. For a typical 2‑minute session the memory footprint is ~150 MB, which is acceptable on modern browsers.

## Recommendations
- Release the `MediaPipe` model only when tracking is enabled.
- Call `Tone.dispose()` on component unmount (handled in `useAudioEngine`).
- Limit `REQUIRED_STABLE_FRAMES` to 3 to keep the finger‑count buffer small.

## Assumptions
- Users will typically record short performances (<5 min). Long recordings may trigger browser memory pressure; the app currently does not provide streaming or chunked download options.
