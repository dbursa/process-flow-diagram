# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A process flow diagram editor built with SvelteKit and @xyflow/svelte. Single-page app with drag-and-drop canvas, local storage persistence, and JSON import/export. No server-side data — everything persists in the browser's localStorage.

## Commands

```bash
npm run dev              # Start dev server (Vite)
npm run dev -- --open    # Dev server + open browser
npm run build            # Production build
npm run preview          # Preview production build
npm run check            # Type-check with svelte-check
npm run check:watch      # Type-check in watch mode
```

No test runner is configured.

## Architecture

### State Management

Global state lives in a single `DiagramState` class (`src/lib/stores/diagram.svelte.ts`) using **Svelte 5 runes** (`$state`, not legacy `writable`/`readable` stores). Exported as a singleton `diagramState`. The `version` counter signals FlowCanvas to reset when a diagram is loaded/created/imported.

### Component Structure

- `src/routes/+page.svelte` — Wraps everything in `SvelteFlowProvider`
- `src/lib/components/flow/` — Main app components: `FlowCanvas.svelte` (canvas with @xyflow/svelte), `Toolbar.svelte` (top bar), `NodePalette.svelte` (left sidebar), `DiagramList.svelte` (saved diagrams modal)
- `src/lib/components/nodes/` — Custom node renderers: `ProcessNode`, `DecisionNode`, `StartEndNode`, `NoteNode`
- `src/lib/components/ui/` — Reusable primitives (button, card, dialog, input, separator) following shadcn-svelte patterns via `components.json`

### Node Types

Four `NodeKind` values defined in `src/lib/types/diagram.ts`: `process`, `decision`, `startEnd`, `note`. Each maps to a custom Svelte component registered in FlowCanvas's `nodeTypes` object. All editable nodes share a double-click-to-edit pattern with Enter/Escape key handling.

### Persistence

`src/lib/utils/persistence.ts` uses localStorage with `pfd:` prefix:
- `pfd:index` — Array of `DiagramMeta` for listing
- `pfd:diagram:{id}` — Full serialized `Diagram`

### Adding a New Node Type

1. Create `src/lib/components/nodes/YourNode.svelte`
2. Add the kind to `NodeKind` type and both `NODE_KIND_*` maps in `src/lib/types/diagram.ts`
3. Register in FlowCanvas's `nodeTypes`
4. Add to `NodePalette.svelte`'s `nodeKinds` array

## Key Conventions

- **Svelte 5 syntax**: Use `$state`, `$props`, `$bindable` — not Svelte 3/4 stores
- **Styling**: Tailwind CSS v4 utility classes; `cn()` helper from `src/lib/utils/cn.ts` for dynamic class merging
- **IDs**: Generated via `generateId()` in `src/lib/utils/id.ts` (random + timestamp)
- **TypeScript**: Strict mode enabled. Node/Edge types come from `@xyflow/svelte`
- **UI components**: shadcn-svelte style — headless primitives from `bits-ui`, styled with Tailwind
