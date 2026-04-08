export interface LatLng {
  lat: number;
  lng: number;
}

export interface RingRoad {
  id: string;
  category: "ring_road" | "railway";
  name: string;
  nameVi: string;
  status: "completed" | "in_progress" | "planned" | "under_construction";
  color: string;
  strokeWeight: number;
  strokePattern: "solid" | "dashed" | "dotted" | "dash_dot";
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
