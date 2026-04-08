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
