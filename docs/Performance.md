# Performance Considerations

## Real‑time Constraints
- **Hand Tracking:** MediaPipe Hands runs at the camera frame rate (≈30 fps). The `REQUIRED_STABLE_FRAMES` buffer ensures stable finger counts, reducing jitter.
- **Audio Synthesis:** Tone.js poly‑synths are triggered instantly on each stable change; no additional buffering is introduced.
- **Rendering:** Video and overlay canvas are drawn with CSS transforms (`-scale-x-100` for mirroring) which are GPU‑accelerated.
- **Recording:** `useRecorder` captures video at 30 fps and mixes the mic audio. The recording loop is throttled using a timestamp check (`frameInterval`).

## Optimizations Implemented
- **Memoization:** `useMemo` caches the chord lists for the selected scale.
- **Stability Buffer:** Limits re‑rendering of chords to changes after a stable frame count.
- **Conditional Init:** Audio engine and MediaPipe model are only initialized when required (e.g., audio volume change, tracking toggle).
- **Canvas Transformations:** `save`/`restore` and context scaling keep drawing operations cheap.

## Potential Improvements
- Lazy‑load heavy libraries (`tone`, `@mediapipe/hands`) only when the user activates tracking or recording.
- Use `OffscreenCanvas` for drawing in a Web Worker to free the main thread (future enhancement).
- Reduce the canvas resolution for lower‑end devices (e.g., switch to 640×480 when performance drops).
- Profile memory usage during long recordings; consider streaming to disk or trimming after a threshold.

## Assumptions
- Users have a reasonably modern browser with hardware acceleration; performance may degrade on older devices.
