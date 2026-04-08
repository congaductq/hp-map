import type { Selection } from "../types";

interface Props {
  selection: Selection;
  onSelect: (s: Selection) => void;
}

export function MapView({ selection, onSelect }: Props) {
  return <div>Map placeholder</div>;
}
