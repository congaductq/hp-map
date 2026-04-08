import { Map, useMap, AdvancedMarker } from "@vis.gl/react-google-maps";
import { useEffect, useRef } from "react";
import type { Selection, RingRoad, MarkerData } from "../types";
import { Legend } from "./Legend";
import ringRoadsData from "../data/ringRoads.json";
import markersData from "../data/markers.json";

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
  if (pattern === "dash_dot") {
    return [
      {
        icon: { path: "M 0,-1 0,1", strokeOpacity: 1, scale: 3 },
        offset: "0",
        repeat: "24px",
      },
      {
        icon: {
          path: maps.SymbolPath.CIRCLE,
          fillOpacity: 1,
          strokeOpacity: 0,
          scale: 2,
        },
        offset: "16px",
        repeat: "24px",
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
      {(markersData as MarkerData[]).map((marker) => (
        <AdvancedMarker
          key={marker.id}
          position={marker.position}
          onClick={() => onSelect({ type: "marker", markerId: marker.id })}
        />
      ))}
      <Legend />
    </>
  );
}
