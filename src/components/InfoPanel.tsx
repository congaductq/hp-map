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
