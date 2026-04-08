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
