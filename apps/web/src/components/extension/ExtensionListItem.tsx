import { Link } from "@tanstack/react-router";

import {
  authorInitials,
  formatDate,
  platformSlug,
  verifiedLabel,
} from "@/lib/extension-format";
import type { ExtensionSummary } from "@/mocks/extensions";

type ExtensionListItemProps = {
  extension: ExtensionSummary;
};

export function ExtensionListItem({ extension }: ExtensionListItemProps) {
  const visibleTags = extension.tags.slice(0, 3);
  const hiddenTagCount = extension.tags.length - visibleTags.length;

  return (
    <Link
      className="li"
      to="/extensions/$extensionId"
      params={{ extensionId: extension.id }}
      aria-label={`${extension.name} 상세 보기`}
    >
      <div className="li-title">
        <span className="li-ico" style={{ background: extension.iconColor }}>
          {extension.iconLabel}
        </span>
        <div className="li-tb">
          <h3>
            {extension.name}
            <span className="badge badge-accent match-badge">
              {extension.matchScore}%
            </span>
            <span
              className={`badge ${
                extension.isMcpVerified ? "badge-success" : "badge-outline"
              }`}
            >
              {verifiedLabel(extension)}
            </span>
          </h3>
          <div className="li-tags">
            {visibleTags.map((tag) => (
              <span className="t" key={tag}>
                {tag}
              </span>
            ))}
            {hiddenTagCount > 0 ? <span className="t">+{hiddenTagCount}</span> : null}
          </div>
        </div>
      </div>

      <span className="li-plat">{platformSlug(extension.platform)}</span>
      <span className="li-author">
        <span className="a-av">{authorInitials(extension.author)}</span>
        {extension.author}
      </span>
      <span className="li-rate">★ {extension.rating.toFixed(1)}</span>
      <span className="li-cmt">{extension.commentCount}</span>
      <span className="li-date">{formatDate(extension.createdAt)}</span>
    </Link>
  );
}
