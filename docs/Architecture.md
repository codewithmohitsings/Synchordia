# Architecture Overview

## High‑Level Diagram
```
Browser (React SPA)
│
├─ UI Layer (React components, Tailwind CSS)
│   ├─ BottomDock
│   ├─ PerformanceCanvas
│   ├─ ChordRing
│   └─ InstructionsModal
│
├─ Hook Layer
│   ├─ useHandTracking  ← MediaPipe Hands + Camera API
│   ├─ useAudioEngine   ← Tone.js synths, limiter, volume control
│   └─ useRecorder      ← MediaRecorder, canvas capture, mic mixing
│
├─ Core Logic
│   └─ utils/music.js (scale/chord generation, transposition)
│
└─ Browser APIs
    ├─ navigator.mediaDevices.getUserMedia (camera & mic)
    ├─ MediaRecorder (recording)
    └─ Web Audio API (Tone.js wraps this)
```

## Component Interaction
- **App.jsx** composes the UI, holds global state (tracking, selected scale, transposition, help modal) and orchestrates hooks.
- **useHandTracking** continuously feeds `activeFingerCount` to `App`. The hook draws hand landmarks onto a hidden canvas for visual feedback.
- **useAudioEngine** lazily initialises Tone.js when audio is required. It receives the chord notes from `App` and triggers attack/release on the currently active instrument.
- **useRecorder** combines the video stream, hand‑overlay canvas, and mixed audio into a single MediaStream, then records it with `MediaRecorder`.
- **PerformanceCanvas** displays the live video feed and the overlay canvas.
- **BottomDock** provides user controls that mutate the state passed down from `App`.

## Data Flow
1. User toggles **tracking** → `useHandTracking` starts MediaPipe hands.
2. Each stable frame produces a finger count → `App` selects a chord from `utils/music` based on the current scale.
3. `App` calls `playChord` from `useAudioEngine` with transposed notes.
4. When **record** is activated, `useRecorder` captures the combined video+audio stream.

## Runtime Environment
- **Client‑side only** – No backend services required.
- Built with **Vite** (React 19, ES modules).
- Dependencies: `@mediapipe/hands`, `tone`, `@tonaljs/tonal`, `lucide-react`, `tailwindcss`, `motion`.

## Assumptions
- All heavy processing (hand detection, audio synthesis) runs acceptably in the browser.
- The browser can allocate enough memory for Tone.js poly‑synths and the recording buffers.
