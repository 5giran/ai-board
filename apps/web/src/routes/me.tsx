import { Link, createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { PageShell } from "@/components/layout/PageShell";
import { MyTabs, type MyTab } from "@/components/mypage/MyTabs";
import { ProfileHeader } from "@/components/mypage/ProfileHeader";
import {
  formatDownloads,
  platformSlug,
} from "@/lib/extension-format";
import { mockComments, mockExtensions, mockViewer } from "@/mocks/extensions";

export const Route = createFileRoute("/me")({
  component: MyPage,
});

function MyPage() {
  const [selectedTab, setSelectedTab] = useState<MyTab>("extensions");

  return (
    <PageShell padded>
      <ProfileHeader viewer={mockViewer} />
      <MyTabs selectedTab={selectedTab} onChange={setSelectedTab} />
      <div className="mp-list">
        <MyList selectedTab={selectedTab} />
      </div>
    </PageShell>
  );
}

function MyList({ selectedTab }: { selectedTab: MyTab }) {
  if (selectedTab === "extensions") {
    return (
      <>
        <ExtensionItem extensionId="2" status="published" />
        <ExtensionItem extensionId="5" status="published" />
      </>
    );
  }

  if (selectedTab === "comments") {
    return (
      <>
        {mockComments.slice(0, 3).map((comment) => (
          <div className="mp-item" key={comment.id}>
            <span
              className="mi-ico"
              style={{ background: "hsl(var(--muted))", color: "hsl(var(--muted-foreground))" }}
            >
              CM
            </span>
            <div className="mi-b">
              <h4>{comment.content}</h4>
              <div className="mi-meta">
                {comment.author} · {comment.createdAt} · comment
              </div>
            </div>
            <div className="mp-actions">
              <button className="btn btn-ghost btn-sm" type="button">
                수정
              </button>
              <button className="btn btn-ghost btn-sm btn-danger" type="button">
                삭제
              </button>
            </div>
          </div>
        ))}
      </>
    );
  }

  if (selectedTab === "bookmarks") {
    return (
      <>
        <ExtensionItem extensionId="1" status="bookmarked" />
        <ExtensionItem extensionId="6" status="bookmarked" />
      </>
    );
  }

  return (
    <>
      <div className="mp-item">
        <span
          className="mi-ico"
          style={{ background: "hsl(var(--muted))", color: "hsl(var(--muted-foreground))" }}
        >
          ..
        </span>
        <div className="mi-b">
          <h4>
            Tab Session Saver{" "}
            <span className="badge badge-warning" style={{ marginLeft: 6 }}>
              draft
            </span>
          </h4>
          <div className="mi-meta">chrome · 임시저장 · 수정 2일 전</div>
        </div>
        <div className="mp-actions">
          <button className="btn btn-ghost btn-sm" type="button">
            이어 작성
          </button>
          <button className="btn btn-ghost btn-sm btn-danger" type="button">
            삭제
          </button>
        </div>
      </div>
    </>
  );
}

type ExtensionItemProps = {
  extensionId: string;
  status: "published" | "bookmarked";
};

function ExtensionItem({ extensionId, status }: ExtensionItemProps) {
  const extension = mockExtensions.find((item) => item.id === extensionId);

  if (!extension) {
    return null;
  }

  return (
    <div className="mp-item">
      <span className="mi-ico" style={{ background: extension.iconColor }}>
        {extension.iconLabel}
      </span>
      <div className="mi-b">
        <h4>
          <Link to="/extensions/$extensionId" params={{ extensionId }}>
            {extension.name}
          </Link>
        </h4>
        <div className="mi-meta">
          {platformSlug(extension.platform)} · ★ {extension.rating.toFixed(1)} ·{" "}
          {formatDownloads(extension.downloads)} · {status}
        </div>
      </div>
      <div className="mp-actions">
        <button className="btn btn-ghost btn-sm" type="button">
          수정
        </button>
        <a
          className="btn btn-ghost btn-sm"
          href={extension.sourceUrl}
          target="_blank"
          rel="noreferrer"
        >
          원본 ↗
        </a>
        <button className="btn btn-ghost btn-sm btn-danger" type="button">
          삭제
        </button>
      </div>
    </div>
  );
}
