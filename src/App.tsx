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
