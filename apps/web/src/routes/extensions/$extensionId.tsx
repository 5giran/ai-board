import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowLeft, Bookmark, ExternalLink, Search } from "lucide-react";
import { useState } from "react";

import { CommentPreviewSection } from "@/components/extension/CommentPreviewSection";
import {
  ExtensionMetaPanel,
  type RefreshStatus,
} from "@/components/extension/ExtensionMetaPanel";
import { PageShell } from "@/components/layout/PageShell";
import {
  formatDate,
  formatDownloads,
  platformSlug,
} from "@/lib/extension-format";
import { mockComments, mockExtensions } from "@/mocks/extensions";

export const Route = createFileRoute("/extensions/$extensionId")({
  component: ExtensionDetailPage,
});

function ExtensionDetailPage() {
  const { extensionId } = Route.useParams();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [refreshStatus, setRefreshStatus] = useState<RefreshStatus>("idle");

  const extension = mockExtensions.find(
    (candidate) => candidate.id === extensionId,
  );

  if (!extension) {
    return (
      <PageShell padded>
        <Link className="back" to="/">
          <ArrowLeft size={14} aria-hidden="true" />
          검색 결과로 돌아가기
        </Link>
        <div className="state-card">
          <div>
            <span className="badge badge-outline">not found</span>
            <h3 style={{ marginTop: 12 }}>익스텐션을 찾을 수 없어요</h3>
            <p className="mono">extensionId: {extensionId}</p>
            <Link className="btn btn-primary" to="/">
              Explore로 이동
            </Link>
          </div>
        </div>
      </PageShell>
    );
  }

  const comments = mockComments.filter(
    (comment) => comment.extensionId === extensionId,
  );
  const matchReasons = extension.matchReasons ?? extension.tags;

  const handleRefresh = () => {
    setRefreshStatus("loading");
    window.setTimeout(() => {
      setRefreshStatus(extension.isMcpVerified ? "success" : "error");
    }, 700);
  };

  return (
    <PageShell padded>
      <Link className="back" to="/">
        <ArrowLeft size={14} aria-hidden="true" />
        검색 결과로 돌아가기
      </Link>

      <div className="detail">
        <main>
          <div className="d-head">
            <span className="d-ico" style={{ background: extension.iconColor }}>
              {extension.iconLabel}
            </span>
            <div>
              <div className="d-badges">
                <span className="badge badge-muted">
                  {platformSlug(extension.platform)}
                </span>
                <span
                  className={`badge ${
                    extension.isMcpVerified ? "badge-success" : "badge-outline"
                  }`}
                >
                  {extension.isMcpVerified ? "✓ MCP 검증" : "unverified"}
                </span>
                <span className="badge badge-outline">community</span>
              </div>
              <h1>{extension.name}</h1>
              <div className="d-meta">
                <span>{extension.handle}</span>
                <span>★ {extension.rating.toFixed(1)}</span>
                <span>{formatDownloads(extension.downloads)} 다운로드</span>
                <span>{formatDate(extension.updatedAt)}</span>
                <span>{extension.category}</span>
              </div>
              <div className="d-cta">
                <a
                  className="btn btn-primary"
                  href={extension.sourceUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  원본 링크 열기
                  <ExternalLink size={14} aria-hidden="true" />
                </a>
                <button
                  className={`btn btn-outline${
                    isBookmarked ? " bookmark-selected" : ""
                  }`}
                  type="button"
                  onClick={() => setIsBookmarked((current) => !current)}
                >
                  <Bookmark size={14} aria-hidden="true" />
                  {isBookmarked ? "Bookmarked" : "북마크"}
                </button>
                <Link
                  className="btn btn-ghost"
                  style={{ color: "hsl(var(--accent))" }}
                  to="/"
                >
                  <Search size={14} aria-hidden="true" />
                  비슷한 익스텐션 찾기
                </Link>
              </div>
              <div className="why-match">
                <b>RAG matched:</b>
                {matchReasons.map((reason) => (
                  <span className="reason-chip" key={reason}>
                    {reason}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <section className="d-sec">
            <h2>설명</h2>
            <p>{extension.description}</p>
            <p>
              반복되는 설치 비교와 메타데이터 확인을 줄이도록, 플랫폼 정보와
              사용 목적을 한 화면에서 비교할 수 있게 정리했습니다.
            </p>
          </section>

          <section className="d-sec">
            <h2>주요 기능</h2>
            <ul className="d-feat">
              {extension.features.map((feature) => (
                <li key={feature}>{feature}</li>
              ))}
            </ul>
          </section>

          <section className="d-sec">
            <h2>태그</h2>
            <div className="d-tags">
              {extension.tags.map((tag) => (
                <span className="t" key={tag}>
                  {tag}
                </span>
              ))}
            </div>
          </section>

          <CommentPreviewSection
            comments={comments}
            commentCount={extension.commentCount}
          />
        </main>

        <ExtensionMetaPanel
          extension={extension}
          refreshStatus={refreshStatus}
          onRefresh={handleRefresh}
        />
      </div>
    </PageShell>
  );
}
