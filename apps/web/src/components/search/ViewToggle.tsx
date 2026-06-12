import { LayoutGrid, List } from "lucide-react";

export type ViewMode = "grid" | "list";

type ViewToggleProps = {
  viewMode: ViewMode;
  onChange: (viewMode: ViewMode) => void;
};

export function ViewToggle({ viewMode, onChange }: ViewToggleProps) {
  return (
    <div className="vtoggle" role="group" aria-label="보기 방식">
      <button
        className={viewMode === "grid" ? "on" : undefined}
        type="button"
        title="카드 보기"
        onClick={() => onChange("grid")}
      >
        <LayoutGrid aria-hidden="true" />
        카드
      </button>
      <button
        className={viewMode === "list" ? "on" : undefined}
        type="button"
        title="목록 보기"
        onClick={() => onChange("list")}
      >
        <List aria-hidden="true" />
        목록
      </button>
    </div>
  );
}
