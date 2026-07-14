# UI/UX Design Specification

## Layout
- **Full‑screen canvas** (`PerformanceCanvas`) occupies the majority of the viewport, centered and responsive via Tailwind utility classes.
- **BottomDock** is a fixed, centered horizontal bar at the bottom of the screen; it expands horizontally to reveal settings when the gear icon is toggled.
- **Chord Rings** for major and minor chords are displayed in two vertical columns on the left/right side of the main canvas.
- **Help Modal** overlays the UI with a semi‑transparent dark background and can be closed via the X button.

## Visual Theme
- Dark, glass‑morphic aesthetic with custom CSS variables:
  - `--color-app-bg` (`#0a0807`)
  - `--color-app-glow` (`#221a14`)
- Accent color is amber (`#f5a00b`) used for active states, borders, and sliders.
- Use of `lucide-react` icons for visual cues.

## Interaction Flow
1. On first visit the **InstructionsModal** appears.
2. User clicks the **tracking button** (radio icon) to enable hand tracking.
3. Hand gestures map to chords; the **Engine** indicator shows `TRK [count]` when active.
4. Users can change **scale**, **instrument**, **transpose**, and **volume** via the expanded settings panel.
5. Press the **record button** (red circle) to start/stop recording; a file is downloaded automatically.

## Responsiveness
- Layout uses Tailwind’s responsive utilities (`md:` prefixes) to adapt column counts and spacing.
- The bottom dock scales its padding and icon sizes for mobile vs desktop.
- Canvas maintains a 16:9 aspect ratio via `aspect-video` class.

## Accessibility Considerations
- All buttons have `aria-label` and `title` attributes.
- The scale and instrument selectors are native `<select>` elements for keyboard navigation.
- Color contrast meets WCAG AA for text; interactive elements have focus outlines via the default browser styles.

## Assumptions
- The UI design is intentionally minimal; any future theming will follow the same dark‑amber palette unless otherwise specified.
