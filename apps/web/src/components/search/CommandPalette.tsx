import { X } from "lucide-react";
import { useState, type KeyboardEvent } from "react";

type CommandPaletteProps = {
  value: string;
  placeholder: string;
  buttonLabel: string;
  hint: string;
  accentHint?: string;
  kbd: [string, string];
  inputId: string;
  inputLabel: string;
  isActive?: boolean;
  isSubmitDisabled?: boolean;
  onClear?: () => void;
  selectedSuggestion?: string;
  onValueChange: (value: string) => void;
  onSubmit?: () => void;
};

export function CommandPalette({
  value,
  placeholder,
  buttonLabel,
  hint,
  accentHint,
  kbd,
  inputId,
  inputLabel,
  isActive = false,
  isSubmitDisabled = false,
  onClear,
  selectedSuggestion,
  onValueChange,
  onSubmit,
}: CommandPaletteProps) {
  const [isFocused, setIsFocused] = useState(false);

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && !isSubmitDisabled) {
      onSubmit?.();
    }
  };

  return (
    <div
      className={`cmd${isActive || isFocused ? " is-active" : ""}`}
      data-selected-suggestion={selectedSuggestion || undefined}
    >
      <div className="cmd-top">
        <span className="cmd-chev mono" aria-hidden="true">
          ›_
        </span>
        <label className="sr-only" htmlFor={inputId}>
          {inputLabel}
        </label>
        <input
          id={inputId}
          value={value}
          placeholder={placeholder}
          onChange={(event) => onValueChange(event.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={() => setIsFocused(false)}
          onFocus={() => setIsFocused(true)}
        />
        {value && onClear ? (
          <button
            className="cmd-clear"
            type="button"
            aria-label="입력 지우기"
            onClick={onClear}
          >
            <X size={14} aria-hidden="true" />
          </button>
        ) : null}
        <button
          className="btn btn-accent btn-sm"
          type="button"
          disabled={isSubmitDisabled}
          onClick={onSubmit}
        >
          {buttonLabel}
        </button>
      </div>
      <div className="cmd-foot">
        <span className="cmd-hint">
          {hint}
          {accentHint ? <b>{accentHint}</b> : null}
        </span>
        <span className="spacer" />
        <span className="cmd-hint" aria-label={`${kbd[0]} ${kbd[1]} shortcut`}>
          <span className="kbd">{kbd[0]}</span>
          <span className="kbd">{kbd[1]}</span>
        </span>
      </div>
    </div>
  );
}
