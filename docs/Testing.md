# Testing Strategy

## Unit Tests
- **utils/music.js** – test `getChordsForScale`, `transposeNotes`, and `AVAILABLE_SCALES`.
- Use **Jest** with `@testing-library/react` for pure function validation.

## Hook Tests
- **useHandTracking** – mock MediaPipe Hands and verify that stable finger counts update state.
- **useAudioEngine** – mock Tone.js objects; ensure `playChord`, `stopAll`, and `changeInstrument` manipulate internal refs correctly.
- **useRecorder** – mock `MediaRecorder` and canvas capture; verify that a blob is created on stop.

## Component Tests
- Render `App` with React Testing Library and simulate user interactions:
  - Click tracking toggle → verify hand tracking state changes.
  - Change scale/instrument → ensure UI reflects selection.
  - Press record button → ensure `isRecording` toggles.
- Snapshot tests for static UI components (`ChordRing`, `BottomDock`).

## End‑to‑End Tests
- Use **Playwright** or **Cypress** to run the full application in a headless Chromium instance.
- Scenarios:
  1. Grant camera/mic permissions (mocked), enable tracking, simulate fingerprint count via injected MediaPipe results, verify chord playback.
  2. Record a short session, then assert that a download link appears with a valid blob URL.
  3. Resize viewport to mobile dimensions and verify layout adapts.

## CI Integration
- Add a GitHub Actions workflow that runs `npm test` on each pull request.
- Include a lint step once ESLint is configured.

## Assumptions
- The project currently has no test framework set up; adding Jest and Playwright is a future task.
