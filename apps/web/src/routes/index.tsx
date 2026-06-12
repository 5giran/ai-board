import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import { ExtensionBoard } from "@/components/extension/ExtensionBoard";
import { ExtensionGrid } from "@/components/extension/ExtensionGrid";
import { PageShell } from "@/components/layout/PageShell";
import { CommandPalette } from "@/components/search/CommandPalette";
import {
  PlatformFilter,
  type PlatformFilterValue,
} from "@/components/search/PlatformFilter";
import { SortSegment, type SortValue } from "@/components/search/SortSegment";
import { SuggestChips } from "@/components/search/SuggestChips";
import { ViewToggle, type ViewMode } from "@/components/search/ViewToggle";
import { mockExtensions } from "@/mocks/extensions";

export const Route = createFileRoute("/")({
  component: HomePage,
});

const suggestedQueries = [
  "글쓰기 자동화",
  "개발 생산성",
  "탭 정리",
  "노트 정리",
  "AI 요약",
];

type ResultStatus = "loading" | "error" | "success";

function HomePage() {
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPlatform, setSelectedPlatform] =
    useState<PlatformFilterValue>("All");
  const [sort, setSort] = useState<SortValue>("match");
  const [resultStatus, setResultStatus] = useState<ResultStatus>("success");
  const selectedSuggestion = suggestedQueries.includes(searchQuery)
    ? searchQuery
    : undefined;

  const visibleExtensions = useMemo(() => {
    if (selectedPlatform === "All") {
      return mockExtensions;
    }

    return mockExtensions.filter(
      (extension) => extension.platform === selectedPlatform,
    );
  }, [selectedPlatform]);

  return (
    <PageShell>
      <section className="hero">
        <span className="eyebrow">
          <span className="dot" />
          AI-powered extension registry
        </span>
        <h1 className="head">
          필요한 걸 말하면,
          <br />
          <em>맞는 익스텐션</em>을 찾아줘요
        </h1>
        <p className="lede">
          Chrome · Obsidian · VS Code · Raycast에 흩어진 익스텐션을 자연어로
          검색하고 비교하세요.
        </p>
        <CommandPalette
          value={searchQuery}
          placeholder="논문 읽을 때 PDF 요약해주는 크롬 확장 찾아줘"
          buttonLabel="검색"
          hint="의미 기반 검색 · 키워드가 아니라"
          accentHint="하려는 일"
          kbd={["⌘", "K"]}
          inputId="extension-search"
          inputLabel="익스텐션 자연어 검색"
          isActive={Boolean(searchQuery.trim())}
          isSubmitDisabled={!searchQuery.trim()}
          selectedSuggestion={selectedSuggestion}
          onClear={() => setSearchQuery("")}
          onValueChange={setSearchQuery}
          onSubmit={() => setResultStatus("success")}
        />
        <SuggestChips
          suggestions={suggestedQueries}
          selectedSuggestion={selectedSuggestion}
          onSelect={setSearchQuery}
        />
      </section>

      <div className="toolbar">
        <SortSegment value={sort} onChange={setSort} />
        <PlatformFilter
          selectedPlatform={selectedPlatform}
          onPlatformChange={setSelectedPlatform}
        />
      </div>

      <div className="rhead">
        <div>
          <div className="n">
            {visibleExtensions.length} results{" "}
            <span>
              · {searchQuery.trim() ? `"${searchQuery.trim()}"` : "전체 추천"}
            </span>
          </div>
          <div className="q">sorted by semantic relevance · {sort}</div>
        </div>
        <div className="rhead-r">
          <span className="badge badge-accent">
            {searchQuery.trim() ? "RAG query" : "RAG ready"}
          </span>
          <ViewToggle viewMode={viewMode} onChange={setViewMode} />
        </div>
      </div>

      <ResultContent
        resultStatus={resultStatus}
        viewMode={viewMode}
        extensions={visibleExtensions}
        onRetry={() => setResultStatus("success")}
        onResetFilter={() => setSelectedPlatform("All")}
      />

      <div className="pager" aria-label="페이지 이동">
        <button type="button">‹</button>
        <button className="on" type="button">
          1
        </button>
        <button type="button">2</button>
        <button type="button">3</button>
        <button type="button">…</button>
        <button type="button">11</button>
        <button type="button">›</button>
      </div>
    </PageShell>
  );
}

type ResultContentProps = {
  resultStatus: ResultStatus;
  viewMode: ViewMode;
  extensions: typeof mockExtensions;
  onRetry: () => void;
  onResetFilter: () => void;
};

function ResultContent({
  resultStatus,
  viewMode,
  extensions,
  onRetry,
  onResetFilter,
}: ResultContentProps) {
  if (resultStatus === "loading") {
    return (
      <div className="grid" aria-label="검색 결과 로딩 중">
        {Array.from({ length: 6 }, (_, index) => (
          <div className="xc skeleton-card" key={index}>
            <div className="skeleton" style={{ width: 38, height: 38 }} />
            <div className="skeleton" style={{ width: "72%", height: 14 }} />
            <div className="skeleton" style={{ width: "100%", height: 36 }} />
            <div className="skeleton" style={{ width: "48%", height: 18 }} />
          </div>
        ))}
      </div>
    );
  }

  if (resultStatus === "error") {
    return (
      <div className="state-card" role="alert">
        <div>
          <h3>목록을 불러오지 못했어요</h3>
          <p>네트워크 없이 보여주는 mock error 상태입니다.</p>
          <button className="btn btn-outline" type="button" onClick={onRetry}>
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  if (extensions.length === 0) {
    return (
      <div className="state-card">
        <div>
          <h3>조건에 맞는 익스텐션이 없어요</h3>
          <p>플랫폼 필터를 초기화하면 전체 mock 데이터를 다시 볼 수 있습니다.</p>
          <button className="btn btn-outline" type="button" onClick={onResetFilter}>
            필터 초기화
          </button>
        </div>
      </div>
    );
  }

  return viewMode === "grid" ? (
    <ExtensionGrid extensions={extensions} />
  ) : (
    <ExtensionBoard extensions={extensions} />
  );
}
