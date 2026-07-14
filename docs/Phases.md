# Development Phases

## Phase 1 – Proof of Concept
- Implement MediaPipe hand tracking.
- Map finger count to a static chord (e.g., C major).
- Basic Tone.js playback.
- Manual testing in Chrome.

## Phase 2 – Feature Completion
- Add full scale selection (`AVAILABLE_SCALES`).
- Implement `utils/music` for chord generation and transposition.
- Build UI components (`ChordRing`, `BottomDock`, `PerformanceCanvas`).
- Add recording pipeline (`useRecorder`).
- Persist “first‑visit” flag.

## Phase 3 – polish & Accessibility
- Refine responsive layout for mobile devices.
- Ensure all controls have ARIA labels and keyboard navigation.
- Conduct accessibility audit (color contrast, focus order).

## Phase 4 – Performance Optimization
- Profile hand‑tracking latency and audio latency.
- Optimize canvas draw loop and MediaRecorder buffer handling.
- Add lazy loading for heavy libraries (Tone.js) if needed.

## Phase 5 – Testing & CI
- Write unit tests for `music.js` and hooks.
- Add component tests (React Testing Library).
- Set up end‑to‑end tests (Playwright) for recording workflow.
- Integrate linting and format checks into CI.

## Phase 6 – Release & Documentation
- Publish static build to a CDN.
- Write user‑facing docs (README, help modal content).
- Prepare changelog and version bump.

## Assumptions
- The repository will remain a client‑only SPA; no server‑side features are planned at this time.
