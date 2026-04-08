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
