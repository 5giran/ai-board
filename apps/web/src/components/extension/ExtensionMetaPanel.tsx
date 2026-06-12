import { RefreshCw } from "lucide-react";
import type { ReactNode } from "react";

import {
  formatDate,
  formatDownloads,
  formatNumber,
  platformSlug,
} from "@/lib/extension-format";
import type { ExtensionSummary } from "@/mocks/extensions";

export type RefreshStatus = "idle" | "loading" | "success" | "error";

type ExtensionMetaPanelProps = {
  extension: ExtensionSummary;
  refreshStatus: RefreshStatus;
  onRefresh: () => void;
};

export function ExtensionMetaPanel({
  extension,
  refreshStatus,
  onRefresh,
}: ExtensionMetaPanelProps) {
  return (
    <aside className="mcp">
      <div className="mcp-h">수집된 정보</div>
      <p className="mcp-sub">MCP가 원본 링크에서 가져온 신뢰 메타데이터</p>

      <MetaRow label="다운로드" value={formatNumber(extension.downloads)} />
      <MetaRow label="최신 버전" value={`v${extension.version}`} />
      <MetaRow label="마지막 업데이트" value={formatDate(extension.updatedAt)} />
      <MetaRow label="GitHub stars" value={formatNumber(extension.stars)} />
      <MetaRow label="License" value={extension.license} />
      <MetaRow label="Source" value={`${platformSlug(extension.platform)} ↗`} />
      <MetaRow
        label="Confidence"
        value={`${extension.sourceConfidence ?? 80}% source verified`}
      />
      <MetaRow label="Compatibility" value={extension.compatibility.join(", ")} />
      <div className="mcp-row stack">
        <span className="k">Permissions</span>
        <span className="permission-list">
          {extension.permissions.map((permission) => (
            <span className="permission-chip" key={permission}>
              {permission}
            </span>
          ))}
        </span>
      </div>
      <MetaRow label="수집 시각" value={extension.fetchedAt} />

      <div className="mcp-note ok">
        <span className="i">✓</span>
        <span>{extension.trustNote}</span>
      </div>
      <div className="mcp-note warn">
        <span className="i">!</span>
        <span>권한 정보 있음: {extension.permissions.join(", ")}.</span>
      </div>
      {extension.freshness === "stale" ? (
        <div className="mcp-note warn">
          <span className="i">!</span>
          <span>최근 업데이트가 오래되었어요. 원본 변경 이력을 확인하세요.</span>
        </div>
      ) : (
        <div className="mcp-note ok">
          <span className="i">✓</span>
          <span>Freshness: {extension.freshness ?? "unknown"}.</span>
        </div>
      )}
      {refreshStatus === "success" ? (
        <div className="mcp-note ok">
          <span className="i">✓</span>
          <span>방금 mock metadata를 다시 확인했습니다.</span>
        </div>
      ) : null}
      {refreshStatus === "error" ? (
        <div className="mcp-note danger">
          <span className="i">×</span>
          <span>메타데이터 새로고침에 실패했습니다. 잠시 후 다시 시도하세요.</span>
        </div>
      ) : null}

      <button
        className="btn btn-outline btn-sm btn-block"
        style={{ marginTop: 12 }}
        type="button"
        disabled={refreshStatus === "loading"}
        onClick={onRefresh}
      >
        <RefreshCw
          className={refreshStatus === "loading" ? "spin" : undefined}
          aria-hidden="true"
        />
        {refreshStatus === "loading" ? "새로고침 중" : "정보 새로고침"}
      </button>

      <span className="sr-only">다운로드 {formatDownloads(extension.downloads)}</span>
    </aside>
  );
}

type MetaRowProps = {
  label: string;
  value: ReactNode;
};

function MetaRow({ label, value }: MetaRowProps) {
  return (
    <div className="mcp-row">
      <span className="k">{label}</span>
      <span className="v">{value}</span>
    </div>
  );
}
