# Haiphong Ring Road Map Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build an interactive Google Maps web app that displays Haiphong's 3 ring roads with a details panel.

**Architecture:** Static React SPA. Google Map on the left (70%), info panel on the right (30%). Ring road data and marker data live in JSON files. State managed via React useState — selected road/marker drives panel content.

**Tech Stack:** Vite, React, TypeScript, @vis.gl/react-google-maps

---

## File Structure

| File | Responsibility |
|------|---------------|
| `src/types.ts` | TypeScript interfaces for RingRoad, Marker, LatLng |
| `src/data/ringRoads.json` | Ring road metadata + coordinate arrays |
| `src/data/markers.json` | Marker data (initially empty array) |
| `src/App.tsx` | Root layout: 70/30 flex container, selection state |
| `src/App.css` | Global styles, layout, panel styling |
| `src/components/MapView.tsx` | Google Map, polylines, markers, click handlers |
| `src/components/Legend.tsx` | Map legend overlay |
| `src/components/InfoPanel.tsx` | Right panel: routes between summary/detail/marker views |
| `src/components/RoadSummary.tsx` | Default panel: list of all roads |
| `src/components/RoadDetail.tsx` | Panel: single road detail view |
| `src/components/MarkerDetail.tsx` | Panel: single marker detail view |
| `.env` | Google Maps API key (gitignored) |
| `.env.example` | Template for API key |

---

### Task 1: Project Scaffold

**Files:**
- Create: `package.json`, `tsconfig.json`, `vite.config.ts`, `index.html`, `.gitignore`, `.env`, `.env.example`, `src/main.tsx`

- [ ] **Step 1: Scaffold Vite + React + TypeScript project**

```bash
cd /Users/ken/Documents/hp-map
npm create vite@latest . -- --template react-ts
```

If prompted about existing files (docs/), select "Ignore existing files" or equivalent.

- [ ] **Step 2: Install Google Maps dependency**

```bash
npm install @vis.gl/react-google-maps
```

- [ ] **Step 3: Create .env and .env.example**

`.env`:
```
VITE_GOOGLE_MAPS_API_KEY=<user's actual API key>
```

`.env.example`:
```
VITE_GOOGLE_MAPS_API_KEY=your_api_key_here
```

- [ ] **Step 4: Update .gitignore to include .env**

Add to `.gitignore` (Vite template may already have it, but verify):
```
.env
.env.local
.superpowers/
```

- [ ] **Step 5: Verify dev server starts**

```bash
npm run dev
```

Expected: Vite dev server starts, shows default React page at http://localhost:5173

- [ ] **Step 6: Clean up default Vite files**

Delete `src/App.css` contents (we'll rewrite), delete `src/assets/` folder, clear `src/App.tsx` to a minimal placeholder:

```tsx
function App() {
  return <div>Haiphong Ring Road Map</div>;
}

export default App;
```

- [ ] **Step 7: Commit**

```bash
git init
git add -A
git commit -m "chore: scaffold Vite + React + TypeScript project"
```

---

### Task 2: Types and Data Files

**Files:**
- Create: `src/types.ts`, `src/data/ringRoads.json`, `src/data/markers.json`

- [ ] **Step 1: Create TypeScript interfaces**

`src/types.ts`:
```typescript
export interface LatLng {
  lat: number;
  lng: number;
}

export interface RingRoad {
  id: string;
  name: string;
  nameVi: string;
  status: "completed" | "in_progress" | "planned";
  color: string;
  strokeWeight: number;
  strokePattern: "solid" | "dashed" | "dotted";
  length: string;
  districts: string[];
  keyStreets: string[];
  description: string;
  coordinates: LatLng[];
}

export interface MarkerData {
  id: string;
  name: string;
  position: LatLng;
  fields: Record<string, string>;
}

export type Selection =
  | { type: "none" }
  | { type: "road"; roadId: string }
  | { type: "marker"; markerId: string };
```

- [ ] **Step 2: Create markers.json**

`src/data/markers.json`:
```json
[]
```

- [ ] **Step 3: Research and create ringRoads.json with approximate coordinates**

`src/data/ringRoads.json`:

This is the most labor-intensive step. Research the approximate routes for each ring road using known street names and create coordinate arrays. Each ring road needs 20-40 coordinate points tracing its path.

The JSON structure for each road follows the `RingRoad` interface. The coordinates should trace the actual road paths through the districts listed in the spec. Use Google Maps to identify the lat/lng of key intersections along each route.

Key research points:
- **Vanh Dai 1:** Trace Nguyen Van Linh → Nguyen Binh Khiem → Lach Tray → Tran Nguyen Han and connecting streets forming the inner loop through Hong Bang, Le Chan, Ngo Quyen
- **Vanh Dai 2:** Trace the suburban ring through Hai An, Duong Kinh, Kien An, An Duong, connecting to QL5/QL10
- **Vanh Dai 3:** Trace the outer ring through Thuy Nguyen, An Duong, An Lao, Kien Thuy, Do Son

Each road entry:
```json
{
  "id": "vd1",
  "name": "Vanh Dai 1",
  "nameVi": "Vành Đai 1",
  "status": "completed",
  "color": "#22c55e",
  "strokeWeight": 4,
  "strokePattern": "solid",
  "length": "~30 km",
  "districts": ["Hong Bang", "Le Chan", "Ngo Quyen"],
  "keyStreets": ["Nguyen Van Linh", "Nguyen Binh Khiem", "Lach Tray", "Tran Nguyen Han"],
  "description": "Innermost ring through the historic urban core of Hai Phong. Functions as an urban arterial loop through the Hong Bang, Le Chan, and Ngo Quyen districts.",
  "coordinates": [
    { "lat": 20.8565, "lng": 106.6684 },
    ...
  ]
}
```

Repeat for vd2 (status: "in_progress", color: "#f59e0b", strokePattern: "dashed") and vd3 (status: "planned", color: "#94a3b8", strokePattern: "dotted", strokeWeight: 3).

- [ ] **Step 4: Commit**

```bash
git add src/types.ts src/data/ringRoads.json src/data/markers.json
git commit -m "feat: add TypeScript types and ring road data"
```

---

### Task 3: App Layout and Global Styles

**Files:**
- Modify: `src/App.tsx`
- Modify: `src/App.css`
- Modify: `src/index.css`

- [ ] **Step 1: Write global styles**

`src/index.css`:
```css
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body, #root {
  height: 100%;
  width: 100%;
  overflow: hidden;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}
```

- [ ] **Step 2: Write App.css**

`src/App.css`:
```css
.app {
  display: flex;
  height: 100vh;
  width: 100vw;
}

.map-container {
  flex: 7;
  position: relative;
}

.info-panel {
  flex: 3;
  background: #fafafa;
  border-left: 1px solid #e0e0e0;
  overflow-y: auto;
}

.info-panel-header {
  padding: 16px;
  border-bottom: 1px solid #e0e0e0;
}

.info-panel-header h2 {
  font-size: 16px;
  color: #333;
  margin: 0;
}

.info-panel-header p {
  font-size: 12px;
  color: #888;
  margin-top: 4px;
}

.status-badge {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.status-badge.completed {
  background: #dcfce7;
  color: #16a34a;
}

.status-badge.in_progress {
  background: #fef3c7;
  color: #d97706;
}

.status-badge.planned {
  background: #f1f5f9;
  color: #64748b;
}

.back-button {
  background: none;
  border: none;
  color: #3b82f6;
  cursor: pointer;
  font-size: 13px;
  padding: 0;
  margin-bottom: 12px;
}

.back-button:hover {
  text-decoration: underline;
}

.road-summary-item {
  padding: 16px;
  border-bottom: 1px solid #e0e0e0;
  cursor: pointer;
  transition: background 0.15s;
}

.road-summary-item:hover {
  background: #f0f0f0;
}

.road-summary-item h3 {
  font-size: 14px;
  color: #333;
  margin: 0 0 4px 0;
}

.road-summary-item p {
  font-size: 12px;
  color: #666;
  margin: 0;
}

.detail-section {
  padding: 16px;
  border-bottom: 1px solid #e0e0e0;
}

.detail-section h3 {
  font-size: 16px;
  color: #333;
  margin: 0 0 8px 0;
}

.detail-section p {
  font-size: 13px;
  color: #666;
  line-height: 1.6;
  margin: 0;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  padding: 4px 0;
}

.detail-row .label {
  color: #888;
}

.detail-row .value {
  color: #333;
  font-weight: 500;
  text-align: right;
}

.street-list {
  list-style: none;
  padding: 0;
  margin: 8px 0 0 0;
}

.street-list li {
  font-size: 12px;
  color: #555;
  padding: 2px 0;
}

.street-list li::before {
  content: "•";
  color: #ccc;
  margin-right: 6px;
}

.marker-fields {
  margin-top: 8px;
}

.marker-field {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  padding: 6px 0;
  border-bottom: 1px solid #f0f0f0;
}

.marker-field .field-key {
  color: #888;
}

.marker-field .field-value {
  color: #333;
  font-weight: 500;
}
```

- [ ] **Step 3: Write App.tsx with selection state**

`src/App.tsx`:
```tsx
import { useState } from "react";
import { APIProvider } from "@vis.gl/react-google-maps";
import { MapView } from "./components/MapView";
import { InfoPanel } from "./components/InfoPanel";
import type { Selection } from "./types";
import "./App.css";

const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string;

function App() {
  const [selection, setSelection] = useState<Selection>({ type: "none" });

  return (
    <APIProvider apiKey={API_KEY}>
      <div className="app">
        <div className="map-container">
          <MapView selection={selection} onSelect={setSelection} />
        </div>
        <div className="info-panel">
          <InfoPanel selection={selection} onSelect={setSelection} />
        </div>
      </div>
    </APIProvider>
  );
}

export default App;
```

- [ ] **Step 4: Create placeholder components so the app compiles**

`src/components/MapView.tsx`:
```tsx
import type { Selection } from "../types";

interface Props {
  selection: Selection;
  onSelect: (s: Selection) => void;
}

export function MapView({ selection, onSelect }: Props) {
  return <div>Map placeholder</div>;
}
```

`src/components/InfoPanel.tsx`:
```tsx
import type { Selection } from "../types";

interface Props {
  selection: Selection;
  onSelect: (s: Selection) => void;
}

export function InfoPanel({ selection, onSelect }: Props) {
  return (
    <div className="info-panel-header">
      <h2>Ring Road Details</h2>
      <p>Click a road or marker on the map</p>
    </div>
  );
}
```

- [ ] **Step 5: Verify app compiles and shows layout**

```bash
npm run dev
```

Expected: Two-column layout visible — left side shows "Map placeholder", right side shows panel header.

- [ ] **Step 6: Commit**

```bash
git add src/App.tsx src/App.css src/index.css src/components/MapView.tsx src/components/InfoPanel.tsx
git commit -m "feat: add app layout with 70/30 split and selection state"
```

---

### Task 4: Map with Ring Road Polylines

**Files:**
- Modify: `src/components/MapView.tsx`
- Create: `src/components/Legend.tsx`

- [ ] **Step 1: Implement MapView with polylines**

`src/components/MapView.tsx`:
```tsx
import { Map, useMap } from "@vis.gl/react-google-maps";
import { useEffect, useRef } from "react";
import type { Selection, RingRoad } from "../types";
import { Legend } from "./Legend";
import ringRoadsData from "../data/ringRoads.json";

const HP_CENTER = { lat: 20.8449, lng: 106.6881 };
const DEFAULT_ZOOM = 12;

interface Props {
  selection: Selection;
  onSelect: (s: Selection) => void;
}

function getStrokePattern(
  pattern: string,
  maps: typeof google.maps
): google.maps.IconSequence[] | undefined {
  if (pattern === "dashed") {
    return [
      {
        icon: { path: "M 0,-1 0,1", strokeOpacity: 1, scale: 3 },
        offset: "0",
        repeat: "16px",
      },
    ];
  }
  if (pattern === "dotted") {
    return [
      {
        icon: {
          path: maps.SymbolPath.CIRCLE,
          fillOpacity: 1,
          strokeOpacity: 0,
          scale: 2,
        },
        offset: "0",
        repeat: "12px",
      },
    ];
  }
  return undefined;
}

export function MapView({ selection, onSelect }: Props) {
  const map = useMap();
  const polylinesRef = useRef<google.maps.Polyline[]>([]);

  useEffect(() => {
    if (!map) return;

    // Clean up old polylines
    polylinesRef.current.forEach((p) => p.setMap(null));
    polylinesRef.current = [];

    const maps = google.maps;
    const roads = ringRoadsData as RingRoad[];

    roads.forEach((road) => {
      const isSelected =
        selection.type === "road" && selection.roadId === road.id;
      const icons = getStrokePattern(road.strokePattern, maps);
      const baseOpacity = road.strokePattern === "solid" ? 1 : 0;

      const polyline = new maps.Polyline({
        path: road.coordinates,
        strokeColor: road.color,
        strokeOpacity: baseOpacity,
        strokeWeight: isSelected ? road.strokeWeight + 2 : road.strokeWeight,
        map,
        zIndex: isSelected ? 10 : 1,
        ...(icons ? { icons } : {}),
      });

      polyline.addListener("click", () => {
        onSelect({ type: "road", roadId: road.id });
      });

      polyline.addListener("mouseover", () => {
        polyline.setOptions({
          strokeWeight: (isSelected ? road.strokeWeight + 2 : road.strokeWeight) + 1,
        });
      });

      polyline.addListener("mouseout", () => {
        polyline.setOptions({
          strokeWeight: isSelected ? road.strokeWeight + 2 : road.strokeWeight,
        });
      });

      polylinesRef.current.push(polyline);
    });

    return () => {
      polylinesRef.current.forEach((p) => p.setMap(null));
      polylinesRef.current = [];
    };
  }, [map, selection]);

  const handleMapClick = () => {
    onSelect({ type: "none" });
  };

  return (
    <>
      <Map
        defaultCenter={HP_CENTER}
        defaultZoom={DEFAULT_ZOOM}
        gestureHandling="greedy"
        disableDefaultUI={false}
        mapId="haiphong-ring-road-map"
        onClick={handleMapClick}
        style={{ width: "100%", height: "100%" }}
      />
      <Legend />
    </>
  );
}
```

- [ ] **Step 2: Create Legend component**

`src/components/Legend.tsx`:
```tsx
export function Legend() {
  return (
    <div
      style={{
        position: "absolute",
        bottom: 24,
        left: 12,
        background: "white",
        padding: "10px 14px",
        borderRadius: 6,
        boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
        fontSize: 12,
        zIndex: 1,
      }}
    >
      <div style={{ fontWeight: 600, marginBottom: 6, color: "#333" }}>
        Ring Roads
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
        <div style={{ width: 24, height: 3, background: "#22c55e" }} />
        <span style={{ color: "#555" }}>Completed</span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
        <div
          style={{
            width: 24,
            height: 3,
            backgroundImage:
              "repeating-linear-gradient(90deg, #f59e0b 0, #f59e0b 6px, transparent 6px, transparent 10px)",
          }}
        />
        <span style={{ color: "#555" }}>In Progress</span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div
          style={{
            width: 24,
            height: 3,
            backgroundImage:
              "repeating-linear-gradient(90deg, #94a3b8 0, #94a3b8 3px, transparent 3px, transparent 7px)",
          }}
        />
        <span style={{ color: "#555" }}>Planned</span>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Verify map renders with polylines and legend**

```bash
npm run dev
```

Expected: Google Map centered on Hai Phong with 3 colored ring road lines. Legend in bottom-left. Clicking a polyline should log to console (panel update in next task).

- [ ] **Step 4: Commit**

```bash
git add src/components/MapView.tsx src/components/Legend.tsx
git commit -m "feat: add Google Map with ring road polylines and legend"
```

---

### Task 5: Info Panel — Road Summary and Detail Views

**Files:**
- Modify: `src/components/InfoPanel.tsx`
- Create: `src/components/RoadSummary.tsx`
- Create: `src/components/RoadDetail.tsx`

- [ ] **Step 1: Create RoadSummary component**

`src/components/RoadSummary.tsx`:
```tsx
import type { RingRoad, Selection } from "../types";
import ringRoadsData from "../data/ringRoads.json";

interface Props {
  onSelect: (s: Selection) => void;
}

const statusLabels: Record<string, string> = {
  completed: "Completed",
  in_progress: "In Progress",
  planned: "Planned",
};

export function RoadSummary({ onSelect }: Props) {
  const roads = ringRoadsData as RingRoad[];

  return (
    <>
      <div className="info-panel-header">
        <h2>Hai Phong Ring Roads</h2>
        <p>Click a road to view details</p>
      </div>
      {roads.map((road) => (
        <div
          key={road.id}
          className="road-summary-item"
          onClick={() => onSelect({ type: "road", roadId: road.id })}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
            <div
              style={{
                width: 12,
                height: 12,
                borderRadius: "50%",
                background: road.color,
              }}
            />
            <h3>{road.nameVi}</h3>
          </div>
          <p>
            <span className={`status-badge ${road.status}`}>
              {statusLabels[road.status]}
            </span>
            <span style={{ marginLeft: 8, color: "#888", fontSize: 12 }}>
              {road.length}
            </span>
          </p>
        </div>
      ))}
    </>
  );
}
```

- [ ] **Step 2: Create RoadDetail component**

`src/components/RoadDetail.tsx`:
```tsx
import type { RingRoad, Selection } from "../types";
import ringRoadsData from "../data/ringRoads.json";

interface Props {
  roadId: string;
  onSelect: (s: Selection) => void;
}

const statusLabels: Record<string, string> = {
  completed: "Completed",
  in_progress: "In Progress",
  planned: "Planned",
};

export function RoadDetail({ roadId, onSelect }: Props) {
  const roads = ringRoadsData as RingRoad[];
  const road = roads.find((r) => r.id === roadId);

  if (!road) return null;

  return (
    <>
      <div className="detail-section">
        <button className="back-button" onClick={() => onSelect({ type: "none" })}>
          ← Back to all roads
        </button>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
          <div
            style={{
              width: 16,
              height: 16,
              borderRadius: "50%",
              background: road.color,
            }}
          />
          <h3 style={{ margin: 0 }}>{road.nameVi}</h3>
        </div>
        <span className={`status-badge ${road.status}`}>
          {statusLabels[road.status]}
        </span>
      </div>

      <div className="detail-section">
        <div className="detail-row">
          <span className="label">Length</span>
          <span className="value">{road.length}</span>
        </div>
        <div className="detail-row">
          <span className="label">Districts</span>
          <span className="value">{road.districts.join(", ")}</span>
        </div>
      </div>

      <div className="detail-section">
        <p>{road.description}</p>
      </div>

      <div className="detail-section">
        <h3>Key Streets</h3>
        <ul className="street-list">
          {road.keyStreets.map((street) => (
            <li key={street}>{street}</li>
          ))}
        </ul>
      </div>
    </>
  );
}
```

- [ ] **Step 3: Update InfoPanel to route between views**

`src/components/InfoPanel.tsx`:
```tsx
import type { Selection } from "../types";
import { RoadSummary } from "./RoadSummary";
import { RoadDetail } from "./RoadDetail";
import { MarkerDetail } from "./MarkerDetail";

interface Props {
  selection: Selection;
  onSelect: (s: Selection) => void;
}

export function InfoPanel({ selection, onSelect }: Props) {
  switch (selection.type) {
    case "road":
      return <RoadDetail roadId={selection.roadId} onSelect={onSelect} />;
    case "marker":
      return <MarkerDetail markerId={selection.markerId} onSelect={onSelect} />;
    default:
      return <RoadSummary onSelect={onSelect} />;
  }
}
```

- [ ] **Step 4: Create MarkerDetail placeholder**

`src/components/MarkerDetail.tsx`:
```tsx
import type { MarkerData, Selection } from "../types";
import markersData from "../data/markers.json";

interface Props {
  markerId: string;
  onSelect: (s: Selection) => void;
}

export function MarkerDetail({ markerId, onSelect }: Props) {
  const markers = markersData as MarkerData[];
  const marker = markers.find((m) => m.id === markerId);

  if (!marker) return null;

  return (
    <>
      <div className="detail-section">
        <button className="back-button" onClick={() => onSelect({ type: "none" })}>
          ← Back to all roads
        </button>
        <h3>{marker.name}</h3>
      </div>

      <div className="detail-section">
        <div className="marker-fields">
          {Object.entries(marker.fields).map(([key, value]) => (
            <div key={key} className="marker-field">
              <span className="field-key">{key}</span>
              <span className="field-value">{value}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
```

- [ ] **Step 5: Verify panel navigation works**

```bash
npm run dev
```

Expected: Right panel shows summary of 3 roads. Clicking a road in the panel switches to detail view. Clicking a polyline on the map also shows detail view. "Back" button returns to summary.

- [ ] **Step 6: Commit**

```bash
git add src/components/InfoPanel.tsx src/components/RoadSummary.tsx src/components/RoadDetail.tsx src/components/MarkerDetail.tsx
git commit -m "feat: add info panel with road summary and detail views"
```

---

### Task 6: Markers on Map

**Files:**
- Modify: `src/components/MapView.tsx`

- [ ] **Step 1: Add marker rendering to MapView**

Add to `MapView.tsx` — import markers data and add `AdvancedMarker` components. Add these imports at the top:

```tsx
import { Map, useMap, AdvancedMarker } from "@vis.gl/react-google-maps";
import type { Selection, RingRoad, MarkerData } from "../types";
import markersData from "../data/markers.json";
```

Add marker rendering inside the `<>` fragment, after `<Map>` and before `<Legend />`:

```tsx
{(markersData as MarkerData[]).map((marker) => (
  <AdvancedMarker
    key={marker.id}
    position={marker.position}
    onClick={() => onSelect({ type: "marker", markerId: marker.id })}
  />
))}
```

- [ ] **Step 2: Verify markers render (if any exist in markers.json)**

Since markers.json is initially empty, add a test marker temporarily to verify:

```json
[
  {
    "id": "test-1",
    "name": "Test Marker",
    "position": { "lat": 20.8449, "lng": 106.6881 },
    "fields": { "Type": "Test", "Note": "This is a test marker" }
  }
]
```

Check that the marker appears on the map and clicking it shows details in the panel. Then revert markers.json to `[]`.

- [ ] **Step 3: Commit**

```bash
git add src/components/MapView.tsx
git commit -m "feat: add marker rendering from markers.json"
```

---

### Task 7: Final Polish and Verify

**Files:**
- Possibly minor tweaks to any component

- [ ] **Step 1: End-to-end verification**

```bash
npm run dev
```

Verify all interactions:
1. Map loads centered on Hai Phong with 3 ring roads visible
2. Legend shows in bottom-left
3. Right panel shows road summary by default
4. Clicking a polyline highlights it and shows detail in panel
5. Clicking "Back" returns to summary
6. Clicking a road name in summary shows detail and highlights on map
7. Clicking empty map area deselects
8. Hover on polylines shows weight increase

- [ ] **Step 2: Run type check**

```bash
npx tsc --noEmit
```

Expected: No errors.

- [ ] **Step 3: Build for production**

```bash
npm run build
```

Expected: Build succeeds, output in `dist/`.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: complete Haiphong ring road map app"
```
