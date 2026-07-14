# Project Rules & Conventions

## General Rules
- All code is written in **JavaScript (ESM)** – no TypeScript in this repo.
- Use **functional React components** with hooks; class components are prohibited.
- Keep state local to the component unless it is truly global (e.g., tracking state lives in `App`).
- Side effects belong in `useEffect` with explicit dependency arrays.
- Do **not** perform DOM manipulation outside of React – the only exception is temporary canvas creation in `useRecorder`.

## Naming Conventions
- Files: `PascalCase` for React components (`ChordRing.jsx`), `camelCase` for hooks (`useHandTracking.js`).
- Functions/variables: `camelCase`.
- Constants (e.g., `AVAILABLE_SCALES`) are `UPPER_SNAKE_CASE`.
- Exported React components default‑exported.

## UI / Styling
- All styling is done with **Tailwind CSS** utility classes.
- Custom CSS resides in `src/index.css` (theme variables, custom components like `.grain-overlay`).
- Do not add external CSS files.

## Dependency Management
- Add runtime dependencies to `dependencies` in `package.json`; dev‑only tools (e.g., `autoprefixer`, `eslint`) belong in `devDependencies`.
- Run `npm install` after any change to `package.json`.

## Accessibility
- Every interactive element must have an `aria-label` and a descriptive `title`.
- Use semantic HTML elements where possible.

## Performance
- Use `requestAnimationFrame` for canvas drawing (as in `useRecorder`).
- Avoid heavy computations inside render; memoize derived data with `useMemo`.

## Assumptions
- The project does not currently enforce linting rules via ESLint; assume that future contributors will follow the above conventions.
