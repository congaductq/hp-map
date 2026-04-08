# Haiphong Ring Road Map — Design Spec

## Purpose

An interactive web map that visualizes the ring road system of Hai Phong, Vietnam. Users can see which roads are completed, under construction, or planned, and click on roads or markers to view detailed information in a side panel.

## Tech Stack

- **Vite + React + TypeScript** — fast dev server, modern tooling
- **@vis.gl/react-google-maps** — React bindings for Google Maps JavaScript API
- **No backend** — static app, all data in JSON files
- **Google Maps API key** via environment variable `VITE_GOOGLE_MAPS_API_KEY`

## Layout

Full-viewport, two-column layout with no scrolling on the outer frame.

| Section | Width | Content |
|---------|-------|---------|
| Left | 70% | Google Map |
| Right | 30% | Info panel |

No header, no footer. The map and panel fill the entire browser window.

## Map

### Center & Zoom
- Center: Hai Phong city center (~20.8449, 106.6881)
- Default zoom: 12 (shows all 3 ring roads)
- Map style: clean/light (default Google Maps roadmap)

### Ring Roads

Three ring roads rendered as Google Maps Polylines, each with distinct styling:

#### Vanh Dai 1 (Ring Road 1)
- **Status:** Completed
- **Color:** Green (#22c55e)
- **Line style:** Solid, 4px weight
- **Length:** ~30 km
- **Districts:** Hong Bang, Le Chan, Ngo Quyen
- **Key streets:** Nguyen Van Linh, Nguyen Binh Khiem, Lach Tray, Tran Nguyen Han
- **Description:** Innermost ring through the historic urban core of Hai Phong. Functions as an urban arterial loop.

#### Vanh Dai 2 (Ring Road 2)
- **Status:** Partially completed / Under construction
- **Color:** Orange (#f59e0b)
- **Line style:** Dashed, 4px weight
- **Length:** ~40-45 km
- **Districts:** Hai An, Duong Kinh, Kien An, An Duong
- **Key streets:** Connects to QL5/QL5B, overlaps with National Highway 10
- **Description:** Passes through suburban fringe and newer development areas. Multiple segments built or upgraded since 2015, with remaining gaps under construction.

#### Vanh Dai 3 (Ring Road 3)
- **Status:** Mostly planned / Partially under construction
- **Color:** Grey (#94a3b8)
- **Line style:** Dotted, 3px weight
- **Length:** ~55-60 km
- **Districts:** Thuy Nguyen, An Duong, An Lao, Kien Thuy, Do Son
- **Key streets:** Connects to Hanoi-Hai Phong Expressway, Tan Vu-Lach Huyen corridor, QL10
- **Description:** Outermost ring designed as a bypass for through-traffic, especially trucks to/from Hai Phong port and Lach Huyen deep-water port.

### Polyline Interaction
- Hovering a polyline increases its weight slightly (visual feedback)
- Clicking a polyline selects it: increases weight, shows road details in the right panel
- Clicking elsewhere on the map deselects

### Legend
A small overlay in the bottom-left corner of the map showing:
- Green solid line = Completed
- Orange dashed line = In Progress
- Grey dotted line = Planned

### Markers
- Rendered from `src/data/markers.json`
- Clicking a marker shows its details in the right panel
- Marker data structure is extensible (arbitrary key-value fields)
- Initially empty — user will populate later

## Right Panel

### Default State
Shows a summary list of all 3 ring roads with name, status badge, and length. Acts as a table of contents — clicking a road in the list selects it on the map and scrolls to its details.

### Road Detail View
Shown when a polyline is clicked on the map or a road is selected from the summary list:
- **Status badge** — colored pill matching the road color (green/orange/grey)
- **Road name** — e.g., "Vanh Dai 1"
- **Stats** — length, districts
- **Description** — paragraph about the road
- **Key streets** — list of street names
- Back button to return to default summary view

### Marker Detail View
Shown when a marker is clicked on the map:
- **Marker name**
- **Custom fields** — rendered from the marker's JSON data (key-value pairs)
- Back button to return to default summary view

### Panel Styling
- White background (#fafafa)
- Left border separator (1px solid #e0e0e0)
- Scrollable if content overflows vertically
- Clean typography, subtle section dividers

## Data Files

### `src/data/ringRoads.json`
```json
[
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
    "description": "Innermost ring through the historic urban core...",
    "coordinates": [
      { "lat": 20.xxx, "lng": 106.xxx },
      ...
    ]
  },
  ...
]
```

### `src/data/markers.json`
```json
[
  {
    "id": "marker-1",
    "name": "Example Marker",
    "position": { "lat": 20.xxx, "lng": 106.xxx },
    "fields": {
      "Type": "Intersection",
      "Status": "Under construction",
      "Note": "Expected completion 2026"
    }
  }
]
```

Initially an empty array `[]`. User adds markers later.

## Project Structure

```
hp-map/
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── .env                          # VITE_GOOGLE_MAPS_API_KEY=<actual key> (gitignored)
├── .env.example                  # VITE_GOOGLE_MAPS_API_KEY=your_api_key_here (committed)
├── .gitignore
├── src/
│   ├── main.tsx
│   ├── App.tsx                   # Layout: map + panel
│   ├── App.css                   # Global styles
│   ├── components/
│   │   ├── MapView.tsx           # Google Map with polylines, markers, legend
│   │   ├── InfoPanel.tsx         # Right panel container
│   │   ├── RoadSummary.tsx       # Default view: list of all roads
│   │   ├── RoadDetail.tsx        # Detail view for a selected road
│   │   ├── MarkerDetail.tsx      # Detail view for a selected marker
│   │   └── Legend.tsx            # Map legend overlay
│   ├── data/
│   │   ├── ringRoads.json        # Ring road definitions + coordinates
│   │   └── markers.json          # Marker data (initially empty)
│   └── types.ts                  # TypeScript interfaces
└── docs/
    └── superpowers/
        └── specs/
            └── 2026-04-08-haiphong-ring-road-map-design.md
```

## Ring Road Coordinates

Coordinates will be researched and approximated based on known street names, district boundaries, and available mapping data. They will be stored as arrays of lat/lng points forming each ring road's path. The coordinates don't need to be meter-accurate — they should follow the general route closely enough to be recognizable on a Google Map.
