export type Platform = "Chrome" | "Obsidian" | "VS Code" | "Raycast" | "Notion";

export type ExtensionSummary = {
  id: string;
  name: string;
  platform: Platform;
  provider: string;
  handle: string;
  description: string;
  tags: string[];
  rating: number;
  downloads: number;
  updatedAt: string;
  matchScore: number;
  isMcpVerified: boolean;
  sourceUrl: string;
  iconColor: string;
  iconLabel: string;

  author: string;
  commentCount: number;
  createdAt: string;

  version: string;
  license: string;
  compatibility: string[];
  permissions: string[];
  fetchedAt: string;
  features: string[];
  category: string;
  stars: number;
  trustNote: string;
  matchReasons?: string[];
  freshness?: "fresh" | "stale" | "unknown";
  sourceConfidence?: number;
};

export type MockComment = {
  id: string;
  extensionId: string;
  author: string;
  content: string;
  createdAt: string;
};

export type MockViewer = {
  nickname: string;
  email: string;
};

export const mockViewer: MockViewer = {
  nickname: "ran",
  email: "ran@extendly.dev",
};

export const mockExtensions: ExtensionSummary[] = [
  {
    id: "1",
    name: "Raycast GitHub",
    platform: "Raycast",
    provider: "Raycast Community",
    handle: "@raycast/community",
    description:
      "GitHub issues, PR, notifications를 빠르게 확인하고 처리하는 생산성 익스텐션.",
    tags: ["devtools", "github", "productivity"],
    rating: 4.8,
    downloads: 12400,
    updatedAt: "2026-05-21",
    matchScore: 94,
    isMcpVerified: true,
    sourceUrl: "https://www.raycast.com/raycast/github",
    iconColor: "#ef4444",
    iconLabel: "RG",

    author: "raycast",
    commentCount: 24,
    createdAt: "2026-05-21",

    version: "2.8.1",
    license: "MIT",
    compatibility: ["macOS 14+", "Raycast Pro", "GitHub API"],
    permissions: ["GitHub repository read", "Notifications", "User profile"],
    fetchedAt: "2026-06-10 14:20",
    features: [
      "GitHub pull request와 issue를 빠르게 검색합니다.",
      "알림과 리뷰 요청을 Raycast 안에서 확인합니다.",
      "자주 쓰는 repository action을 command로 실행합니다.",
    ],
    category: "Developer tools",
    stars: 4200,
    trustNote: "공식 Raycast Store와 GitHub OAuth 문서가 확인되었습니다.",
    matchReasons: ["github workflow", "notifications", "review queue"],
    freshness: "fresh",
    sourceConfidence: 96,
  },
  {
    id: "2",
    name: "Obsidian Web Clipper",
    platform: "Obsidian",
    provider: "Community Plugin",
    handle: "@obsidian/plugin",
    description:
      "웹 페이지를 Obsidian 노트로 저장하고 태그와 메타데이터를 함께 정리합니다.",
    tags: ["notes", "research", "automation"],
    rating: 4.7,
    downloads: 9800,
    updatedAt: "2026-04-30",
    matchScore: 91,
    isMcpVerified: true,
    sourceUrl: "https://obsidian.md/plugins",
    iconColor: "#7c5cff",
    iconLabel: "OW",

    author: "obsidian",
    commentCount: 12,
    createdAt: "2026-04-30",

    version: "1.8.3",
    license: "MIT",
    compatibility: ["Obsidian 1.6+", "Desktop", "Mobile"],
    permissions: ["Read current page", "Write local vault", "Clipboard"],
    fetchedAt: "2026-06-11 13:20",
    features: [
      "현재 페이지의 본문과 링크를 Markdown 형태로 저장합니다.",
      "선택한 텍스트를 노트 하이라이트로 캡처합니다.",
      "태그, 출처, 작성일 메타데이터를 자동 생성합니다.",
    ],
    category: "Research",
    stars: 1240,
    trustNote: "공식 스토어 링크와 GitHub Repository가 확인되었습니다.",
    matchReasons: ["web clipping", "research notes", "metadata sync"],
    freshness: "fresh",
    sourceConfidence: 94,
  },
  {
    id: "3",
    name: "Commit Message AI",
    platform: "VS Code",
    provider: "Open Source",
    handle: "@opensource/vscode",
    description: "코드 변경사항을 분석해 커밋 메시지 초안을 추천합니다.",
    tags: ["git", "ai", "developer"],
    rating: 4.5,
    downloads: 22100,
    updatedAt: "2026-06-02",
    matchScore: 88,
    isMcpVerified: false,
    sourceUrl: "https://marketplace.visualstudio.com",
    iconColor: "#3b82f6",
    iconLabel: "CM",

    author: "opensource",
    commentCount: 38,
    createdAt: "2026-06-02",

    version: "0.9.5",
    license: "GPL-3.0",
    compatibility: ["VS Code 1.90+", "Git"],
    permissions: ["Read git diff", "Read workspace files"],
    fetchedAt: "2026-06-08 18:44",
    features: [
      "현재 git diff를 분석합니다.",
      "conventional commit 형식의 메시지를 추천합니다.",
      "변경 범위에 맞는 짧은 설명을 생성합니다.",
    ],
    category: "AI coding",
    stars: 730,
    trustNote: "Marketplace 정보는 확인했지만 저장소 검증은 대기 중입니다.",
    matchReasons: ["git diff", "commit message", "developer workflow"],
    freshness: "fresh",
    sourceConfidence: 72,
  },
  {
    id: "4",
    name: "Tab Tidy",
    platform: "Chrome",
    provider: "Chrome Store",
    handle: "@chrome/store",
    description: "열려 있는 탭을 주제별로 자동 그룹핑하고 세션을 저장합니다.",
    tags: ["tabs", "browser", "focus"],
    rating: 4.6,
    downloads: 31200,
    updatedAt: "2026-05-10",
    matchScore: 85,
    isMcpVerified: true,
    sourceUrl: "https://chromewebstore.google.com",
    iconColor: "#10b981",
    iconLabel: "TT",

    author: "chrome",
    commentCount: 17,
    createdAt: "2026-05-10",

    version: "3.2.0",
    license: "Proprietary",
    compatibility: ["Chrome 123+", "Edge"],
    permissions: ["Read tabs", "Storage", "Session restore"],
    fetchedAt: "2026-06-10 11:02",
    features: [
      "열린 탭을 주제별 그룹으로 정리합니다.",
      "집중 시간에 방해되는 탭을 임시 보관합니다.",
      "작업 세션을 저장하고 다시 불러옵니다.",
    ],
    category: "Productivity",
    stars: 0,
    trustNote: "Chrome Web Store 원본 메타데이터가 확인되었습니다.",
    matchReasons: ["tab groups", "session restore", "focus mode"],
    freshness: "fresh",
    sourceConfidence: 89,
  },
  {
    id: "5",
    name: "Notion Publisher",
    platform: "Notion",
    provider: "Notion Integration",
    handle: "@notion/integration",
    description: "마크다운 글을 Notion 페이지로 발행하고 태그를 동기화합니다.",
    tags: ["notion", "publish", "markdown"],
    rating: 4.4,
    downloads: 7100,
    updatedAt: "2026-03-28",
    matchScore: 82,
    isMcpVerified: true,
    sourceUrl: "https://www.notion.so/integrations",
    iconColor: "#f59e0b",
    iconLabel: "NP",

    author: "notion",
    commentCount: 9,
    createdAt: "2026-03-28",

    version: "1.2.7",
    license: "Apache-2.0",
    compatibility: ["Notion API 2025-09", "Markdown"],
    permissions: ["Read pages", "Create pages", "Update properties"],
    fetchedAt: "2026-06-09 16:40",
    features: [
      "마크다운 초안을 Notion 페이지로 발행합니다.",
      "태그와 상태 필드를 Notion database 속성으로 동기화합니다.",
      "발행 전 미리보기와 링크 검사를 제공합니다.",
    ],
    category: "Publishing",
    stars: 860,
    trustNote: "Notion Integration Gallery와 GitHub Release가 확인되었습니다.",
    matchReasons: ["markdown publish", "notion database", "tag sync"],
    freshness: "stale",
    sourceConfidence: 91,
  },
  {
    id: "6",
    name: "Grammar Checker",
    platform: "Obsidian",
    provider: "Community Plugin",
    handle: "@obsidian/plugin",
    description: "문장 톤과 오탈자를 확인하고 대체 표현을 제안합니다.",
    tags: ["writing", "grammar", "ai"],
    rating: 4.7,
    downloads: 14000,
    updatedAt: "2026-05-18",
    matchScore: 79,
    isMcpVerified: true,
    sourceUrl: "https://obsidian.md/plugins",
    iconColor: "#6366f1",
    iconLabel: "GC",

    author: "obsidian",
    commentCount: 21,
    createdAt: "2026-05-18",

    version: "2.1.4",
    license: "MIT",
    compatibility: ["Obsidian 1.5+", "Local vault"],
    permissions: ["Read note content", "Network request"],
    fetchedAt: "2026-06-10 08:24",
    features: [
      "문장 톤과 맞춤법을 점검합니다.",
      "긴 문장을 더 읽기 쉬운 표현으로 바꿔 제안합니다.",
      "노트 안에서 바로 교정 후보를 적용할 수 있습니다.",
    ],
    category: "Writing",
    stars: 2100,
    trustNote: "Plugin registry와 GitHub Repository가 확인되었습니다.",
    matchReasons: ["writing", "grammar", "tone rewrite"],
    freshness: "fresh",
    sourceConfidence: 93,
  },
];

export const mockComments: MockComment[] = [
  {
    id: "c1",
    extensionId: "1",
    author: "mina",
    content: "PR 확인 흐름이 빨라져서 Raycast 안에서 거의 다 처리하게 됐어요.",
    createdAt: "2026-06-01",
  },
  {
    id: "c2",
    extensionId: "1",
    author: "jun",
    content: "GitHub 알림을 자주 보는 사람한테 특히 좋아요.",
    createdAt: "2026-06-04",
  },
  {
    id: "c3",
    extensionId: "2",
    author: "minji",
    content: "PDF에서 클립한 내용을 Obsidian Daily Note로 바로 보내는 흐름이 좋았어요.",
    createdAt: "2026-06-09",
  },
  {
    id: "c4",
    extensionId: "2",
    author: "devnote",
    content: "업데이트가 꾸준해서 팀 문서화 플로우에 붙여 쓰기 괜찮습니다.",
    createdAt: "2026-06-06",
  },
  {
    id: "c5",
    extensionId: "3",
    author: "sol",
    content: "커밋 단위가 작을수록 추천 메시지가 더 정확했어요.",
    createdAt: "2026-06-05",
  },
];
