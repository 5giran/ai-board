type SuggestChipsProps = {
  suggestions: string[];
  selectedSuggestion?: string;
  onSelect: (suggestion: string) => void;
};

export function SuggestChips({
  suggestions,
  selectedSuggestion,
  onSelect,
}: SuggestChipsProps) {
  return (
    <div className="suggest" aria-label="추천 검색어">
      {suggestions.map((suggestion) => (
        <button
          key={suggestion}
          className={`s${selectedSuggestion === suggestion ? " selected-chip" : ""}`}
          type="button"
          aria-pressed={selectedSuggestion === suggestion}
          onClick={() => onSelect(suggestion)}
        >
          <b>#</b>
          {suggestion}
        </button>
      ))}
    </div>
  );
}
