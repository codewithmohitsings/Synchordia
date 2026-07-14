# Product Requirements Document (PRD)

## Overview
**Synchordia** is a browser‑based, hands‑free musical instrument that maps real‑time hand gestures captured via webcam to polyphonic chords. Users can play, transpose, and record performances directly in the browser without installing any software.

## Target Audience
- Musicians and creators looking for a novel, low‑barrier way to compose or improvise.
- Artists who want to integrate gesture‑controlled sound into live performances or installations.
- Educators teaching music theory or human‑computer interaction.

## Core Functional Requirements
| # | Requirement | Description |
|---|-------------|-------------|
| 1 | Hand Gesture Detection | Detect up to two hands using MediaPipe Hands, compute the number of raised fingers (0‑6) with a stable frame buffer of 3 frames. |
| 2 | Scale Selection | Users can select any of the 12 major scales (C, C#, …, B). |
| 3 | Chord Mapping | Map finger count to predefined major/minor chords for the selected scale. |
| 4 | Audio Synthesis | Generate polyphonic audio using Tone.js with three built‑in instruments: Ambient Pad, Analog Strings, Harmonium. |
| 5 | Real‑time Playback | Play the appropriate chord as soon as the hand gesture is stable, with zero‑latency routing. |
| 6 | Transposition | Allow transposition of the active chord by ±12 semitones via UI controls. |
| 7 | Recording | Capture both the webcam video (with visual overlays) and the mixed audio to a downloadable WebM/MP4 file. |
| 8 | Permissions Workflow | Prompt for camera and microphone permissions on first load; persist a “visited” flag in localStorage to hide the help modal on subsequent visits. |
| 9 | UI Controls | Responsive bottom dock providing tracking toggle, recording button, scale/instrument selectors, volume slider, and help modal. |

## Non‑Functional Requirements
- **Performance:** Must run at 30 fps video capture and audio synthesis on typical consumer laptops.
- **Responsiveness:** UI adapts to desktop and mobile viewports.
- **Accessibility:** All interactive elements have ARIA labels and are keyboard‑focusable.
- **Compatibility:** Works in modern browsers that support `MediaDevices.getUserMedia`, `MediaRecorder`, and Web Audio API.
- **Security & Privacy:** No data is sent to a server; all processing is client‑side. Only localStorage is used for a flag.

## Assumptions
- Users have a webcam and microphone.
- The browser supports ES modules (used by Vite). 
- The Harmonium instrument currently has a known issue (see README) – assumed to be fixed later.

## Milestones
1. **Prototype** – Basic hand tracking → chord playback.
2. **Feature Completion** – Add scale selection, transposition, recording, UI polish.
3. **Testing & QA** – Unit / integration tests, performance profiling.
4. **Release** – Deploy via static hosting (e.g., Vercel, Netlify).
