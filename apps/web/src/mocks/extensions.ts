export type ExtensionSummary = {
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
  email: "ran@example.com",
};

export const mockExtensions: ExtensionSummary[] = [
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
    sourceUrl: "https://www.raycast.com/raycast/github",

    author: "raycast",
    commentCount: 24,
    createdAt: "2026-05-22",

    version: "2.8.1",
    license: "MIT",
    compatibility: ["macOS", "Raycast Pro", "GitHub API"],
    permissions: ["GitHub repository read", "Notifications"],
    fetchedAt: "2026-06-10 14:20",
    features: [
      "GitHub pull request와 issue를 빠르게 검색합니다.",
      "알림과 리뷰 요청을 Raycast 안에서 확인합니다.",
      "자주 쓰는 repository action을 command로 실행합니다.",
    ],
    category: "Developer Tools",
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
    sourceUrl: "https://obsidian.md/plugins",

    author: "obsidian-labs",
    commentCount: 18,
    createdAt: "2026-05-01",

    version: "1.4.0",
    license: "Apache-2.0",
    compatibility: ["Obsidian 1.5+", "Desktop", "Mobile"],
    permissions: ["Read current page", "Write local vault"],
    fetchedAt: "2026-06-09 09:12",
    features: [
      "웹 페이지 제목, URL, 본문 일부를 노트로 저장합니다.",
      "태그와 출처 메타데이터를 자동으로 붙입니다.",
      "리서치용 clipping workflow를 단순화합니다.",
    ],
    category: "Research",
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
    sourceUrl: "https://marketplace.visualstudio.com",

    author: "open-source",
    commentCount: 31,
    createdAt: "2026-06-03",

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
    category: "AI Coding",
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
    author: "sol",
    content: "리서치 자료를 Obsidian으로 모을 때 편합니다.",
    createdAt: "2026-05-14",
  },
];