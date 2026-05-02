# AI Agent Instructions for CSE340 Project

## Build Commands
- Install dependencies: `pnpm install`
- Start development server: `pnpm run dev`
- Start production server: `pnpm start`

## Architecture
- Framework: Express.js with EJS templating and express-ejs-layouts.
- Database: PostgreSQL with pg library.
- Structure: MVC pattern - Models for DB queries, Controllers for logic, Routes for endpoints, Views for EJS templates, Utilities for helpers.

## Conventions
- CSS: Use `rem` units for responsive design; prefer shorthand padding syntax (e.g., `padding: 0 3rem;` for top/bottom 0, sides 3rem); avoid mixing `px` and `rem`; global reset with `box-sizing: border-box`.
- Code: Async/await for DB operations; camelCase for JS files, kebab-case for CSS.

## Potential Pitfalls
- Database: Requires PostgreSQL instance; run SQL scripts in `database/` manually; ensure `.env` has correct DATABASE_URL.
- Environment: Missing `.env` file causes startup failures; includes secrets like SESSION_SECRET.
- No tests: Manual testing only; consider adding Jest for automated tests.

## Key Files
- `server.js`: App entry point with middleware and routes.
- `models/inventory-model.js`: DB queries for inventory.
- `controllers/invController.js`: Inventory route logic.
- `views/`: EJS templates.
- `utilities/index.js`: Helper functions.

For detailed setup, see [README.md](README.md).