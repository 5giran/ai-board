import { Link } from "@tanstack/react-router";

import {
  formatDownloads,
  platformSlug,
  verifiedLabel,
} from "@/lib/extension-format";
import type { ExtensionSummary } from "@/mocks/extensions";

type ExtensionCardProps = {
  extension: ExtensionSummary;
};

export function ExtensionCard({ extension }: ExtensionCardProps) {
  const visibleTags = extension.tags.slice(0, 3);
  const hiddenTagCount = extension.tags.length - visibleTags.length;

  return (
    <Link
      className="xc"
      to="/extensions/$extensionId"
      params={{ extensionId: extension.id }}
      aria-label={`${extension.name} 상세 보기`}
    >
      <div className="xc-top">
        <span className="xc-ico" style={{ background: extension.iconColor }}>
          {extension.iconLabel}
        </span>
        <div className="xc-h">
          <h3>{extension.name}</h3>
          <div className="prov">{extension.handle}</div>
        </div>
        <span className="badge badge-accent match-badge">
          {extension.matchScore}%
        </span>
      </div>

      <p className="xc-desc">{extension.description}</p>

      <div className="xc-tags">
        {visibleTags.map((tag) => (
          <span className="t" key={tag}>
            {tag}
          </span>
        ))}
        {hiddenTagCount > 0 ? <span className="t">+{hiddenTagCount}</span> : null}
      </div>

      <div className="xc-foot">
        <span className="star">
          ★ {extension.rating.toFixed(1)} · {formatDownloads(extension.downloads)}
        </span>
        <span
          className={`badge ${
            extension.isMcpVerified ? "badge-success" : "badge-outline"
          }`}
        >
          {verifiedLabel(extension)}
        </span>
      </div>

      <span className="sr-only">{platformSlug(extension.platform)}</span>
    </Link>
  );
}
