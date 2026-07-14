# Accessibility Assessment

## Existing Accessibility Features
- All interactive buttons include `aria-label` and `title` attributes (e.g., start/stop tracking, record, settings, help).
- Native `<select>` elements are used for scale and instrument selection, providing keyboard navigation out‑of‑the‑box.
- The help modal uses a semantic `<button>` for closing and is rendered conditionally; focus is not explicitly trapped but the overlay covers the entire viewport.
- Color contrast: text uses neutral shades on a dark background; accent amber meets WCAG AA contrast for most states.

## Gaps & Recommendations
| Issue | Recommendation |
|-------|----------------|
| **Focus Management** | When the `InstructionsModal` opens, move focus to the close button. Return focus to the previously focused element when closing.
| **Keyboard Navigation** | Ensure the bottom dock’s buttons are reachable via `Tab` order and have a visible focus ring (Tailwind `focus:outline-none focus:ring-2 focus:ring-amber-500`).
| **Screen Reader Labels** | Verify that the `<select>` elements have associated `<label>` elements or `aria-label` (they currently have `aria-label`). Add `aria-describedby` for additional context if needed.
| **Reduced Motion** | Provide an option to disable the amber glow animation for users who prefer reduced motion (use `prefers-reduced-motion` media query).
| **Video Captioning** | Recordings currently have no subtitles; consider adding an optional caption track for accessibility.
| **Landmark Roles** | Add `role="region"` with `aria-label` to major UI sections (e.g., the canvas area) to improve navigation.

## Testing Approach
- Run **axe-core** automated accessibility audit on the built site.
- Conduct manual keyboard‑only navigation testing.
- Verify color contrast with a contrast checker tool.
- Test screen reader (NVDA/VoiceOver) reading of the modal and controls.

## Assumptions
- The app is intended for use in browsers that support the required ARIA attributes and media APIs.
