export type SortValue = "match" | "popular" | "recent" | "bookmarked";

const sortOptions: Array<{ label: string; value: SortValue }> = [
  { label: "추천", value: "match" },
  { label: "인기", value: "popular" },
  { label: "최신", value: "recent" },
  { label: "북마크", value: "bookmarked" },
];

type SortSegmentProps = {
  value: SortValue;
  onChange: (value: SortValue) => void;
};

export function SortSegment({ value, onChange }: SortSegmentProps) {
  return (
    <div className="seg" role="group" aria-label="정렬 방식">
      {sortOptions.map((option) => (
        <button
          key={option.value}
          className={value === option.value ? "on" : undefined}
          type="button"
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
