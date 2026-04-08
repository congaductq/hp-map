import type { RingRoad, Selection } from "../types";
import ringRoadsData from "../data/ringRoads.json";

interface Props {
  onSelect: (s: Selection) => void;
}

const statusLabels: Record<string, string> = {
  completed: "Completed",
  in_progress: "In Progress",
  planned: "Planned",
  under_construction: "Under Construction",
};

export function RoadSummary({ onSelect }: Props) {
  const all = ringRoadsData as RingRoad[];
  const roads = all.filter((r) => r.category === "ring_road");
  const railways = all.filter((r) => r.category === "railway");

  return (
    <>
      <div className="info-panel-header">
        <h2>Hai Phong Connect X</h2>
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

      {railways.length > 0 && (
        <>
          <div
            className="info-panel-header"
            style={{ borderTop: "1px solid #e5e7eb", marginTop: 12, paddingTop: 12 }}
          >
            <h2>Railway Lines</h2>
          </div>
          {railways.map((rail) => (
            <div
              key={rail.id}
              className="road-summary-item"
              onClick={() => onSelect({ type: "road", roadId: rail.id })}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                <div
                  style={{
                    width: 12,
                    height: 12,
                    borderRadius: 2,
                    background: rail.color,
                  }}
                />
                <h3>{rail.nameVi}</h3>
              </div>
              <p>
                <span className={`status-badge ${rail.status}`}>
                  {statusLabels[rail.status]}
                </span>
                <span style={{ marginLeft: 8, color: "#888", fontSize: 12 }}>
                  {rail.length}
                </span>
              </p>
            </div>
          ))}
        </>
      )}
    </>
  );
}
