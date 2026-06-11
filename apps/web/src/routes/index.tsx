import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/")({
  component: HomePage,
});

// TODO: mock data
type ExtensionSummary = {
  id: string;
  name: string;
  platform: "Chrome" | "Obsidian" | "VS Code" | "Raycast" | "Notion";
  provider: string;
  description: string;
  tags: string[];
  rating: number;
  downloads: number;
  updatedAt: string;
  matchScore: number;
  isMcpVerified: boolean;
  sourceUrl: string;
};

const mockExtensions: ExtensionSummary[] = [
  {
    id: "1",
    name: "Raycast GitHub",
    platform: "Raycast",
    provider: "Raycast Community",
    description:
      "GitHub issues, pull requests, notifications를 빠르게 확인하고 처리하는 생산성 익스텐션.",
    tags: ["devtools", "github", "productivity"],
    rating: 4.8,
    downloads: 12400,
    updatedAt: "2026-05-21",
    matchScore: 94,
    isMcpVerified: true,
    sourceUrl: "#",
  },
  {
    id: "2",
    name: "Obsidian Web Clipper",
    platform: "Obsidian",
    provider: "Community Plugin",
    description:
      "웹 페이지를 Obsidian 노트로 저장하고 태그와 메타데이터를 함께 정리합니다.",
    tags: ["notes", "research", "automation"],
    rating: 4.7,
    downloads: 9800,
    updatedAt: "2026-04-30",
    matchScore: 91,
    isMcpVerified: true,
    sourceUrl: "#",
  },
  {
    id: "3",
    name: "Commit Message AI",
    platform: "VS Code",
    provider: "Open Source",
    description: "코드 변경사항을 분석해 커밋 메시지 초안을 추천합니다.",
    tags: ["git", "ai", "developer"],
    rating: 4.5,
    downloads: 22100,
    updatedAt: "2026-06-02",
    matchScore: 88,
    isMcpVerified: false,
    sourceUrl: "#",
  },
];
// TODO: 여기까지

function HomePage() {
  // useState Hook은 [현재값, 갱신함수] 배열을 리턴한다.
  // 여기서는 [viewMode=현재값, setViewMode=갱신함수]로 나눠 받은 것 (구조 분해, 함수는 읽기쓰기 한묶음)
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  // HomePage의 return안에 JSX로 들어있는 컴포넌트들은 
  // HomePage가 렌더링하는 자식/하위 컴포넌트입니다.
  return (
    <div>
      <AppHeader />
      <SearchHero />
      <FilterSection />

      <ViewToggle viewMode={viewMode} onChange={setViewMode} />

      {viewMode === "grid" ? (
        <ExtensionGrid extensions={mockExtensions} />
      ) : (
        <ExtensionBoard extensions={mockExtensions} />
      )}
    </div>
  );
}

function AppHeader() {
  return (
    <header>
      <h1>AppHeader</h1>
    </header>
  );
}

function SearchHero() {
  return (
    <section>
      <h2>SearchHero</h2>
    </section>
  );
}

function FilterSection() {
  return (
    <section>
      <h2>FilterSection</h2>
    </section>
  );
}

// Grid 형태 컴포넌트
// ExtensionGrid라는 컴포넌트는 props로 extensions라는 값을 받을 건데, 그건 ExtensionSummary 여러 개가 들어있는 배열이다.
type ExtensionGridProps = {
  extensions: ExtensionSummary[];
};

// { extensions }: ExtensionGridProps - 그냥 props 받아옴
function ExtensionGrid({ extensions }: ExtensionGridProps) {
  return (
    <section>
      <h2>ExtensionGrid</h2>

      <div>
        // extensions 배열을 하나씩 돌고, 각각의 extension 하나마다
        ExtensionCard를 하나씩 만든다.
        {extensions.map((extension) => (
          <ExtensionCard key={extension.id} extension={extension} />
        ))}
      </div>
    </section>
  );
}

// 둘 다 같은 ExtensionSummary 데이터를 props로 받는다.
// HomePage -> ExtensionGrid -> ExtensionCard 순서로 같은 extension 데이터가 내려간다.

// ExtensionGrid는 목록 전체(ExtensionSummary[])를 받고,
// ExtensionCard는 목록에서 꺼낸 하나(ExtensionSummary)를 받는다.
type ExtensionCardProps = {
  extension: ExtensionSummary;
};

function ExtensionCard({ extension }: ExtensionCardProps) {
  return (
    <article>
      // props로 받은 extension 하나에서 해당 프로퍼티들을 꺼내서 화면에 보여줌
      <h3>{extension.name}</h3>
      <p>{extension.provider}</p>
      <p>{extension.description}</p>
    </article>
  );
}

// 보드 리스트 형태 컴포넌트
type ExtensionBoardProps = {
  extensions: ExtensionSummary[];
};

function ExtensionBoard({ extensions }: ExtensionBoardProps) {
  return (
    <section>
      <h2>ExtensionBoard</h2>

      <div>
        {extensions.map((extension) => (
          <ExtensionListItem key={extension.id} extension={extension} />
        ))}
      </div>
    </section>
  );
}

// 게시판을 위한 ListItem 하나만 받는거임.
type ExtensionListItemProps = {
  extension: ExtensionSummary;
};

function ExtensionListItem({ extension }: ExtensionListItemProps) {
  return (
    <article>
      <h3>{extension.name}</h3>
      <p>{extension.provider}</p>
      <p>{extension.description}</p>
    </article>
  );
}

// 메인화면에서 그리드, 리스트 보기 방식 선택
type ViewMode = "grid" | "list";

type ViewToggleProps = {
  viewMode: ViewMode;
  onChange: (viewMode: ViewMode) => void;
};

function ViewToggle({ viewMode, onChange }: ViewToggleProps) {
  return (
    <div>
      <button type="button" onClick={() => onChange("grid")}>
        Grid {viewMode === "grid" ? "선택됨" : ""}
      </button>

      <button type="button" onClick={() => onChange("list")}>
        Grid {viewMode === "list" ? "선택됨" : ""}
      </button>
    </div>
  )
}
