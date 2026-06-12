import { formatDate } from "@/lib/extension-format";
import type { ExtensionSummary } from "@/mocks/extensions";

export type ImportStatus = "idle" | "loading" | "success" | "error";

type AutoFillPreviewProps = {
  status: ImportStatus;
  previewExtension: ExtensionSummary;
};

export function AutoFillPreview({
  status,
  previewExtension,
}: AutoFillPreviewProps) {
  return (
    <aside className="preview-panel">
      <div className="preview-label">자동 채움 미리보기</div>
      {status === "idle" ? <IdlePreview /> : null}
      {status === "loading" ? <LoadingPreview /> : null}
      {status === "success" ? (
        <SuccessPreview previewExtension={previewExtension} />
      ) : null}
      {status === "error" ? <ErrorPreview /> : null}
    </aside>
  );
}

function IdlePreview() {
  return (
    <div className="card" style={{ padding: 18 }}>
      <div className="state-note idle" style={{ marginTop: 0 }}>
        <span className="i mono">·</span>
        <span>URL을 입력하면 미리보기가 여기에 표시됩니다.</span>
      </div>
    </div>
  );
}

function LoadingPreview() {
  return (
    <div className="card" style={{ padding: 18 }}>
      <div className="skeleton" style={{ width: 38, height: 38, marginBottom: 14 }} />
      <div className="skeleton" style={{ width: "72%", height: 14, marginBottom: 10 }} />
      <div className="skeleton" style={{ width: "100%", height: 34 }} />
      <div className="state-note load">
        <span className="i mono">...</span>
        <span>메타데이터를 가져오는 중입니다.</span>
      </div>
    </div>
  );
}

function SuccessPreview({
  previewExtension,
}: {
  previewExtension: ExtensionSummary;
}) {
  return (
    <>
      <div className="xc" style={{ cursor: "default" }}>
        <div className="xc-top">
          <span className="xc-ico" style={{ background: previewExtension.iconColor }}>
            {previewExtension.iconLabel}
          </span>
          <div className="xc-h">
            <h3>{previewExtension.name}</h3>
            <div className="prov">
              {previewExtension.platform.toLowerCase()} · {previewExtension.handle}
            </div>
          </div>
          <span className="badge badge-success">MCP fetched</span>
        </div>
        <div className="d-meta mono" style={{ fontSize: 11.5 }}>
          <span>v{previewExtension.version}</span>
          <span>{formatDate(previewExtension.updatedAt)}</span>
          <span>★ {previewExtension.rating.toFixed(1)}</span>
        </div>
        <div className="xc-tags">
          {previewExtension.tags.map((tag) => (
            <span className="t" key={tag}>
              {tag}
            </span>
          ))}
        </div>
        <div className="confidence-row">
          <span className="source-chip mcp">name</span>
          <span className="source-chip mcp">version</span>
          <span className="source-chip mcp">rating</span>
          <span className="source-chip mcp">
            source {previewExtension.sourceConfidence ?? 80}%
          </span>
        </div>
      </div>
      <div className="state-note ok">
        <span className="i mono">✓</span>
        <span>이름, 버전, 별점, 업데이트 정보를 찾았습니다.</span>
      </div>
    </>
  );
}

function ErrorPreview() {
  return (
    <div className="card" style={{ padding: 18 }}>
      <div className="state-note fail" style={{ marginTop: 0 }}>
        <span className="i mono">×</span>
        <span>자동 수집에 실패했어요. 직접 입력할 수 있습니다.</span>
      </div>
    </div>
  );
}
