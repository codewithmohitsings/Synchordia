# Coding Standards

## Language & Tooling
- JavaScript (ECMAScript 2023) with **ES modules** (`type: "module"` in `package.json`).
- Build with **Vite** (`npm run dev`).
- Linting is not currently configured; adopt **ESLint** with the `eslint:recommended` and `plugin:react/recommended` presets in future.

## File & Directory Structure
- `src/` – all source code.
  - `components/` – pure UI components, default‑exported, filename PascalCase.
  - `hooks/` – custom React hooks prefixed with `use`.
  - `utils/` – pure functions, no side effects (e.g., `music.js`).
  - `index.css` – Tailwind imports and custom utilities.
- `public/` – static assets (favicon, etc.).
- `docs/` – project documentation (this folder).

## Code Style
- **Indentation:** 2 spaces.
- **Quotes:** Single quotes for strings, double quotes only where HTML attributes require it.
- **Semicolons:** Enabled (consistent with existing code).
- **Imports:** Alphabetical order, grouped by external vs internal.
- **React:** Use functional components, Hooks for state/effects, `useMemo`/`useCallback` where appropriate.
- **Tailwind:** Prefer utility‑first classes; avoid custom CSS except for reusable components defined in `index.css`.

## State Management
- Local component state via `useState`.
- Prop drilling is acceptable for this small app; no external state library is used.

## Error Handling
- UI‑level errors are logged to console and optionally shown via `alert` (e.g., in `useRecorder`).
- Network‑related errors are not applicable (no API calls).

## Testing Guidelines
- Write unit tests for pure functions (`music.js`).
- Use **React Testing Library** for component rendering and interaction.
- Aim for >80 % coverage on core logic.

## Assumptions
- The project currently lacks a linting configuration; future contributors should add one following the style guide above.
