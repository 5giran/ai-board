import { ExtensionCard } from "@/components/extension/ExtensionCard";
import type { ExtensionSummary } from "@/mocks/extensions";

type ExtensionGridProps = {
  extensions: ExtensionSummary[];
};

export function ExtensionGrid({ extensions }: ExtensionGridProps) {
  return (
    <section aria-label="카드 검색 결과">
      <div className="grid">
        {extensions.map((extension) => (
          <ExtensionCard extension={extension} key={extension.id} />
        ))}
      </div>
    </section>
  );
}
