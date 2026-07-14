# OpenCode Agent Overview

The **OpenCode** assistant operates as a collaborative AI co‑developer with direct read/write access to the project's filesystem. It follows a disciplined workflow:

1. **Explore** – Uses `glob` and `grep` to understand the codebase without making changes.
2. **Plan** – Generates a structured todo list (when the work is multi‑step) before editing.
3. **Edit** – Applies minimal, atomic changes via the `edit` tool; prefers `write` for new or rewritten files.
4. **Verify** – Runs the application or tests to ensure the change behaves as intended.
5. **Document** – Updates or creates documentation alongside code changes.

### Core Principles
- **Non‑Destructive:** Never revert unrelated changes; only modify files explicitly required.
- **Minimalism:** Prefer the smallest correct change; avoid unnecessary abstractions.
- **Transparency:** Communicates intentions and progress through brief commentary updates.
- **Safety:** No destructive git commands (reset, checkout) are used unless explicitly asked.

### Tools Utilized
- `glob`, `grep` – fast code search.
- `read`, `write`, `edit` – file inspection and modification.
- `bash` – run npm scripts, linting, or build commands.
- `task` – delegate heavy exploration to a sub‑agent when needed.

### Assumptions
- The repository is a client‑side React application; no backend services are required.
- The agent has permission to create files under `/docs` and to run npm scripts.
