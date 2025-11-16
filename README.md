# ARMETA Digital Inspector — Frontend

Full-featured frontend for the ARMETA Digital Inspector demo: upload PDFs/images, call backend analytics, and interactively review results with export options.

## Tech Stack

- React 18 + TypeScript — UI and typing.
- Vite 5 — fast dev server and build tooling.
- Tailwind CSS — utility-first styling.

## Features

- Upload multiple files (PDF/PNG/JPG) via file picker and drag-and-drop.
- Batch send to the backend with progress bar and resilience to partial failures.
- Results viewer:
  - page list with thumbnails and current page selection;
  - object highlighting on the image with background dimming;
  - modal Zoom with pan (mouse/touch), mouse wheel and ±/Reset buttons;
  - object list of the current page with class, confidence, and bbox.
- Data export:
  - `Download JSON` — sanitize JSON by removing `image_base64` (convenient for sharing/storage);
  - `Export CSV` — export objects of the current page to CSV (openable in Excel);
  - in multi-file view — combined exports: `selected_annotations_batch.json`, `masked_annotations_batch.json`, and `annotations_batch.json` (selected + masked).

## Backend Integration

- Backend base URL is set by `VITE_BACKEND_URL` (defaults to `http://localhost:8000`).
- Main endpoints:
  - `POST /api/analyze` — analyze one or multiple files;
  - `POST /api/analyze/annotated` — analyze with additional annotation.
- Response format is described by types in `src/types.ts`.

## Project Structure (Frontend)

- `src/App.tsx` — page composition and demo section.
- `src/api.ts` — backend call functions (`analyze*`).
- `src/types.ts` — types `Detection`, `PageResult`, `FileAnalysisResult`.
- `src/components/UploadSection.tsx` — file upload and batch send.
- `src/components/MultiFileResultsViewer.tsx` — analyzed files list and global exports.
- `src/components/ResultsViewer.tsx` — page viewer, objects, zoom, JSON/CSV export.
- Other components — landing layout: Navbar, Hero, Section*, Footer.
- Styles: `src/index.css`, Tailwind config via dependencies in `package.json` and `postcss`/`tailwindcss`.

## Requirements

- Node.js ≥ 18 (LTS recommended).
- npm ≥ 9 (or pnpm/yarn if you prefer — instructions below use npm).

## Setup

1. Navigate to the frontend folder:
   - `cd frontend`
2. Install dependencies:
   - `npm install`
3. Create `.env` next to `package.json` and set backend address if it is not `localhost:8000`:
   - `VITE_BACKEND_URL=http://localhost:8000`

## Development

- Start the dev server:
  - `npm run dev`
- Open in a browser:
  - `http://localhost:5173/`

Tips:
- If port `5173` is busy, you can choose another: `npm run dev -- --port 5174`.
- If you see network/response errors, make sure the backend is reachable at `VITE_BACKEND_URL` and allows CORS.

## Build & Preview

- Build production bundle:
  - `npm run build` (artifacts will be in `dist/`).
- Local preview of the built app:
  - `npm run preview` → open `http://localhost:5173/`.

## Usage (quick)

1. Go to “Demo / Upload & Analyze” (`#demo`).
2. Add files (PDF/PNG/JPG) by drag-and-drop or `Choose Files` button.
3. Click `Analyze` — batch analysis starts with progress.
4. After results arrive:
   - select a file (if multiple);
   - select a page;
   - click the image to open Zoom, use mouse wheel to scale and drag to pan;
   - click an object card to toggle focus overlay;
   - export results: `Download JSON` (without `image_base64`) and `Export CSV`.

## Export Formats

### JSON (sanitized)
- Structure: `{ file_name, pages: [{ page_index, width, height, objects }, ...] }` — without `image_base64`.
- File name: `<original>-analysis.json`.

### CSV (current page)
- Columns: `file_name, page, class, confidence, bbox_x, bbox_y, bbox_w, bbox_h, area, page_width, page_height`.
- `bbox_*` and `area` are rounded to integers; `confidence` up to 4 decimals.
- CSV reflects “visible” objects on the page (objects of class `signauth` are not included; you can include them if needed).
- File name: `<original>-page-<N>-objects.csv`.

### Batch exports (multi-file mode)
- `selected_annotations_batch.json` — merged “raw” annotations of all files.
- `masked_annotations_batch.json` — same annotations but classes are masked into standard label_*.
- `annotations_batch.json` — object with `{ selected, masked }`.

## Common Issues

- No backend connection / CORS:
  - check `VITE_BACKEND_URL` in `.env` and availability of `/api/analyze`, `/api/analyze/annotated`;
  - allow CORS on the backend (e.g., for FastAPI/Starlette — `CORSMiddleware`).
- Timeout when analyzing many files:
  - `analyzeAnnotatedMultiple` uses ~120s timeout; reduce batch size or file sizes.
- Vite port conflict:
  - `npm run dev -- --port <free_port>`.
- Images/thumbnails not shown:
  - ensure the backend returns `image_base64` in pages; the frontend displays them correctly but does not include them in JSON export.

## Code Principles

- Simple, readable components without complex state logic.
- Lazy image loading, minimized re-renders (`memo`/`useMemo`).
- Tailwind-first styling, no custom SCSS builds.

## License

ARMETA Project. All rights reserved.
