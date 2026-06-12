import type { Platform } from "@/mocks/extensions";

export type PlatformFilterValue = "All" | Platform;

const platformFilters: PlatformFilterValue[] = [
  "All",
  "Chrome",
  "Obsidian",
  "VS Code",
  "Raycast",
  "Notion",
];

type PlatformFilterProps = {
  selectedPlatform: PlatformFilterValue;
  onPlatformChange: (platform: PlatformFilterValue) => void;
};

export function PlatformFilter({
  selectedPlatform,
  onPlatformChange,
}: PlatformFilterProps) {
  return (
    <div className="plat" role="group" aria-label="플랫폼 필터">
      {platformFilters.map((platform) => (
        <button
          key={platform}
          className={selectedPlatform === platform ? "on" : undefined}
          type="button"
          onClick={() => onPlatformChange(platform)}
        >
          {platformLabel(platform)}
        </button>
      ))}
    </div>
  );
}

function platformLabel(platform: PlatformFilterValue) {
  if (platform === "All") {
    return "all";
  }

  return platform === "VS Code" ? "vscode" : platform.toLowerCase();
}
