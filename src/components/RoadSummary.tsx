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
