# Extendly UI/UX 구현 지시서 for Codex

> **문서 역할**: 본 문서는 **UI/외형/문구의 기준**이다. 데이터 모델·API 계약·AI 파이프라인은 `extendly_spec.md`를 따른다. **충돌 시 — 외형/문구는 본 문서 우선, 로직/데이터/API는 `extendly_spec.md` 우선.** 플랫폼 enum, 엔티티 필드, 엔드포인트 시그니처는 임의로 바꾸지 말고 `extendly_spec.md`를 참조한다.

## 0. 작업 목표

현재 프로젝트의 와이어프레임을 기반으로 Extendly의 UI/UX를 실제 서비스처럼 다듬어 주세요.

Extendly는 **Chrome, Obsidian, VS Code, Raycast 등 여러 플랫폼의 익스텐션을 한곳에서 검색·등록·추천받는 익스텐션 아카이브 게시판**입니다.  
기존 와이어프레임의 화면 구조와 기능 요구사항은 유지하되, 아래 레퍼런스 조합을 기준으로 UI를 재구성합니다.

- 메인/검색: Raycast Store + Product Hunt
- 익스텐션 카드: Raycast Store + Vercel Marketplace
- 상세 페이지: Chrome Web Store + VS Code Marketplace
- 등록 페이지: Vercel Marketplace + Notion Marketplace
- AI 큐레이터: GPT Store + Raycast식 command/search UX

중요한 방향은 **“느려 보이는 예쁨”이 아니라 “빠르고 깔끔한 개발자용 마켓플레이스”**입니다.  
무거운 애니메이션, 대형 이미지, 과한 3D/글래스모피즘은 피하고, 정보 밀도·검색성·반응속도·신뢰감을 우선합니다.

---

## 1. 원본 와이어프레임에서 반드시 유지할 화면

기존 와이어프레임은 다음 화면과 과제 요구사항을 가지고 있습니다. 이 구조는 유지하세요.

| 화면 | 유지할 핵심 기능 |
|---|---|
| 로그인 / 회원가입 | 회원 기반 게시판, JWT/Argon2 인증 UI |
| 메인 / 검색 | 자연어 RAG 의미 검색, 플랫폼 필터, 검색 결과, 정렬, 페이징 |
| 익스텐션 상세 | 본문, 태그, 댓글, 원본 링크, MCP 자동수집 메타데이터 |
| 글 등록 / 작성 | 원본 URL 입력, MCP 자동 채움, 제목/설명 수정, 플랫폼/태그 입력, 등록 |
| AI 큐레이터 | 사용자의 자연어 목표 입력, Agent 추론 루프 표시, 추천 결과 |
| 마이페이지 | 내 글, 댓글, 북마크, 프로필 수정 |

---

## 2. 전체 디자인 콘셉트

### 2.1 키워드

- Developer-friendly
- Extension marketplace
- Fast search
- Curated directory
- Quiet premium
- Warm minimal
- Trustworthy metadata
- AI-assisted but not gimmicky

### 2.2 피해야 할 느낌

- 랜딩페이지처럼 과하게 큰 히어로만 있는 구조
- 의미 없는 스크롤 애니메이션
- 너무 많은 gradient
- 카드마다 그림자가 과해서 무거워 보이는 스타일
- AI 기능을 “챗봇 화면”으로만 표현하는 것
- 정보가 부족한 예쁜 빈 카드

### 2.3 원하는 느낌

- Raycast Store처럼 빠르고 명령형 검색이 중심
- Product Hunt처럼 탐색/랭킹/커뮤니티 감각이 있음
- Vercel Marketplace처럼 개발자용 통합 도구 디렉터리 느낌
- Chrome Web Store / VS Code Marketplace처럼 상세 메타데이터가 신뢰감 있게 정리됨
- GPT Store처럼 목적 기반 추천과 카테고리 탐색이 가능함

---

## 3. 디자인 토큰 제안

현재 와이어프레임의 warm neutral 계열은 유지하고, 약간 더 현대적인 토큰으로 정리하세요.

```css
:root {
  --background: #fafaf8;
  --foreground: #232321;

  --surface: #ffffff;
  --surface-muted: #f3f1eb;
  --surface-subtle: #f8f7f3;

  --border: #e2dfd6;
  --border-strong: #c8c3b8;

  --muted: #6f6c63;
  --muted-light: #9a958b;

  --primary: #242320;
  --primary-foreground: #ffffff;

  --accent: #7c5cff;
  --accent-soft: #eee9ff;

  --success: #2f855a;
  --success-soft: #e7f5ee;

  --warning: #b7791f;
  --warning-soft: #fff7e6;

  --danger: #c53030;
  --danger-soft: #fff0f0;

  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 18px;
  --radius-xl: 24px;

  --shadow-card: 0 1px 2px rgba(25, 23, 17, 0.04);
  --shadow-popover: 0 16px 40px rgba(25, 23, 17, 0.10);
}
```

### 폰트

우선순위:

```css
font-family:
  Pretendard,
  Inter,
  ui-sans-serif,
  system-ui,
  -apple-system,
  BlinkMacSystemFont,
  "Segoe UI",
  "Apple SD Gothic Neo",
  "Noto Sans KR",
  sans-serif;
```

외부 폰트를 꼭 불러오지 않아도 됩니다. 성능을 위해 시스템 폰트만 써도 좋습니다.

---

## 4. 전체 레이아웃 규칙

### 4.1 페이지 폭

- 기본 max-width: `1180px` 또는 `1200px`
- 본문 좌우 padding: 모바일 `20px`, 데스크톱 `32px`
- 카드 그리드:
  - 데스크톱: 3열 또는 4열
  - 태블릿: 2열
  - 모바일: 1열

### 4.2 Header / GNB

Raycast + Vercel 느낌으로 얇고 고정감 있게 만듭니다.

포함 요소:

- 좌측: Extendly 로고
  - puzzle, command, sparkles 계열 아이콘 중 하나
  - 텍스트 로고: `Extendly`
- 중앙 또는 좌측 보조: `Explore`, `Submit`, `AI Curator`
- 우측:
  - 로그인 전: `로그인`, `회원가입`
  - 로그인 후: 프로필 아바타, 마이페이지
- Header는 너무 높지 않게 `64px` 정도
- border-bottom 사용
- 배경은 `rgba(250, 250, 248, 0.86)` + backdrop blur 가능
- 단, backdrop blur가 프로젝트 성능/호환성에 부담이면 일반 배경으로 처리

---

## 5. 메인 / 검색 페이지

### 5.1 레퍼런스 방향

- Raycast Store: command/search 중심
- Product Hunt: 제품 탐색, 인기/최신/커뮤니티 흐름

### 5.2 화면 구성

상단 히어로는 크지만 과하지 않게 구성합니다.

#### Hero 영역

내용:

- 작은 eyebrow badge:
  - `AI-powered extension archive`
  - 또는 `Find any extension by what you want to do`
- 메인 카피:
  - `필요한 기능을 말하면, 맞는 익스텐션을 찾아줘요`
- 보조 문구:
  - `Chrome, Obsidian, VS Code, Raycast 등 흩어진 익스텐션을 자연어로 검색하고 비교하세요.`
- 대형 검색창:
  - placeholder 예시:
    - `예: 논문 읽을 때 PDF 요약해주는 크롬 확장 찾아줘`
    - `예: Obsidian에서 블로그 글 발행 도와주는 플러그인`
    - `예: VS Code에서 커밋 메시지 자동 추천`
  - 좌측 아이콘: sparkles 또는 command
  - 우측 버튼: `검색`
  - 키보드 힌트: `⌘ K`
- 추천 검색어 chips:
  - `글쓰기 자동화`
  - `개발 생산성`
  - `탭 정리`
  - `노트 정리`
  - `AI 요약`
  - `디자인 도구`

#### 필터 / 정렬 영역

Product Hunt식 탐색감을 줍니다.

- 탭:
  - `추천`
  - `인기`
  - `최신`
  - `북마크 많은`
  - `AI 도구`
- 플랫폼 필터:
  - `All`
  - `Chrome`
  - `Obsidian`
  - `VS Code`
  - `Raycast`
  - `Notion`
- 정렬:
  - `관련도`
  - `인기순`
  - `최신 업데이트`
  - `평점순`

#### 결과 영역

- 좌측 또는 상단에 결과 개수:
  - `128개의 익스텐션을 찾았어요`
- 검색어가 있을 때:
  - `"글쓰기 자동화"와 관련된 결과`
- 검색 결과가 없을 때:
  - 빈 상태 UI:
    - `아직 등록된 익스텐션이 없어요`
    - `직접 요청 글을 등록하거나 새 익스텐션을 추가해보세요`
    - CTA: `익스텐션 등록하기`, `원하는 기능 요청하기`

---

## 6. 익스텐션 카드 컴포넌트

### 6.1 레퍼런스 방향

- Raycast Store: 작은 아이콘 + 명확한 이름 + 간결한 설명
- Vercel Marketplace: integration card, category, provider, 신뢰감 있는 메타데이터

### 6.2 카드 필수 정보

각 카드는 아래 정보를 담도록 구성합니다.

- 아이콘
- 익스텐션 이름
- 플랫폼 badge
- 작성자 또는 제공자
- 한 줄 설명
- 태그 2~3개
- 평점 또는 추천 수
- 다운로드 수 또는 북마크 수
- 최신 업데이트
- RAG 검색 결과일 경우 match badge:
  - `92% match`
  - `의미 일치 높음`
- MCP로 수집된 항목일 경우:
  - `Verified by MCP`
  - 또는 작은 bolt/check badge

### 6.3 카드 스타일

- 배경: white
- border: 1px solid var(--border)
- radius: 18px
- shadow는 아주 약하게
- hover:
  - border 색만 살짝 진하게
  - translateY(-1px) 정도만
  - shadow 과하게 금지
- 설명은 2줄 clamp
- 태그는 작은 pill
- 카드 전체 클릭 가능
- 내부 CTA는 보조적으로만 사용

### 6.4 카드 variant

가능하면 3가지 variant를 만듭니다.

1. `ExtensionCard`
   - 메인 그리드용
2. `ExtensionListItem`
   - 검색 결과를 리스트형으로 볼 때
3. `RecommendationCard`
   - AI 큐레이터 추천 결과용
   - 추천 이유 영역 포함

---

## 7. 익스텐션 상세 페이지

### 7.1 레퍼런스 방향

- Chrome Web Store: 사용자 신뢰 정보, 평점, 리뷰/댓글, 설치/원본 링크
- VS Code Marketplace: 버전, 업데이트, 카테고리, 설치 수, 상세 설명, 릴리즈 정보

### 7.2 상세 레이아웃

데스크톱 기준 2-column 구조를 권장합니다.

#### 좌측 main column

- 뒤로가기
- 아이콘 + 이름 + 플랫폼
- 제목 아래 metadata row:
  - 제공자
  - 평점
  - 다운로드
  - 업데이트 날짜
  - 카테고리
- 주요 CTA:
  - `원본 링크 열기`
  - `북마크`
  - `비슷한 익스텐션 찾기`
- 본문 설명
- 주요 기능 bullet
- 태그
- 댓글 영역
  - 댓글 입력
  - 댓글 목록
  - 작성자, 작성일, 내용

#### 우측 sticky metadata panel

MCP 자동수집 정보를 신뢰감 있게 보여줍니다.

- `MCP 수집 정보`
- 다운로드 수
- 최신 버전
- 마지막 업데이트
- GitHub stars
- License
- Source
- Compatibility
- Permissions / 권한 정보
- 수집 시각
- `정보 새로고침` 버튼

### 7.3 신뢰 요소

상세 페이지에는 단순히 예쁜 카드보다 “믿고 눌러도 되는지”가 중요합니다.

가능하면 아래 UI를 추가합니다.

- `공식 스토어 링크`
- `GitHub Repository`
- `최근 업데이트됨`
- `권한 정보 있음`
- `커뮤니티 댓글`
- 위험/주의 상태:
  - 업데이트가 오래된 경우: `최근 업데이트가 오래되었어요`
  - 출처가 불명확한 경우: `검증되지 않은 출처`

---

## 8. 글 등록 / 작성 페이지

### 8.1 레퍼런스 방향

- Vercel Marketplace: 외부 integration을 연결/등록하는 느낌
- Notion Marketplace: creator가 템플릿을 제출하는 간단하고 명확한 폼

### 8.2 등록 흐름

등록 페이지는 1페이지 폼이어도 되지만, 시각적으로는 stepper처럼 보이게 만듭니다.

#### Step 1. 원본 URL 입력

- 입력창 label: `원본 URL`
- placeholder:
  - `https://github.com/...`
  - `https://chromewebstore.google.com/...`
  - `https://marketplace.visualstudio.com/...`
- 버튼:
  - `자동으로 불러오기`
- helper text:
  - `MCP가 이름, 아이콘, 설명, 버전, 별점, 업데이트 정보를 자동으로 가져옵니다.`

#### Step 2. 자동 채움 미리보기

불러오기 전:
- 빈 preview card
- `URL을 입력하면 미리보기가 생성됩니다`

불러온 후:
- 아이콘
- 이름
- 플랫폼
- 설명
- 버전
- 업데이트 날짜
- 신뢰 badge: `MCP fetched`

로딩 중:
- skeleton
- `메타데이터를 가져오는 중...`

실패:
- `자동 수집에 실패했어요. 직접 입력할 수 있습니다.`
- 재시도 버튼

#### Step 3. 직접 수정 가능 필드

- 제목
- 설명
- 플랫폼
- 카테고리
- 태그
- 원본 링크
- 본문
- 공개 여부 또는 임시저장

#### Step 4. 제출

- `미리보기`
- `임시저장`
- `등록하기`

### 8.3 폼 UX

- 필수 입력값은 명확히 표시
- 에러는 input 아래에 짧게 표시
- 버튼은 비활성/로딩/완료 상태를 분리
- 폼 전체 width는 너무 넓지 않게 `720px~840px`
- 우측에 미리보기 panel을 두면 좋음

---

## 9. AI 큐레이터 페이지

### 9.1 레퍼런스 방향

- GPT Store: 목적 기반 추천, 카테고리 탐색
- Raycast command/search UX: 빠른 명령 입력, 키보드 중심, 결과 카드

### 9.2 핵심 컨셉

AI 큐레이터는 단순 챗봇 페이지가 아니라,  
**“내 목표를 입력하면 Agent가 RAG 검색 + MCP 조회를 거쳐 익스텐션 조합을 추천하는 화면”**으로 보여야 합니다.

### 9.3 화면 구성

#### 상단 command input

- 큰 command/search box
- placeholder:
  - `예: 블로그 쓰는 개발자인데 글쓰기 워크플로우를 도와줘`
  - `예: 논문 읽고 요약하고 노트로 정리하고 싶어`
  - `예: 개발할 때 GitHub 이슈 관리가 귀찮아`
- 버튼:
  - `추천 받기`
- keyboard hint:
  - `⌘ Enter`

#### 추천 시나리오 chips

- `개발 생산성`
- `글쓰기`
- `공부/리서치`
- `디자인`
- `회의 정리`
- `브라우저 정리`
- `노트 자동화`

#### Agent progress panel

너무 복잡하게 Chain-of-thought처럼 보이지 않게, 사용자에게 보여줄 수 있는 “도구 사용 단계”만 표시합니다.

- `1. RAG 검색`
  - `비슷한 익스텐션을 찾는 중`
- `2. MCP 조회`
  - `다운로드, 업데이트, GitHub 활성도를 확인하는 중`
- `3. 추천 조합 생성`
  - `목표에 맞는 워크플로우로 묶는 중`

주의:
- 내부 추론을 장황하게 노출하지 마세요.
- 사용자에게는 안전한 진행 상태와 추천 근거만 보여주세요.

#### 추천 결과

추천 결과는 “하나의 익스텐션”보다 “워크플로우 조합”으로 보이면 좋습니다.

예시:

- `글쓰기 워크플로우 추천`
  1. Research Helper
  2. Obsidian Publisher
  3. Grammar Checker
- 각 카드에:
  - 추천 이유
  - 어떤 단계에 쓰는지
  - 대체 후보
  - 신뢰 메타데이터

---

## 10. 로그인 / 회원가입

현재 구조를 유지하되 더 깔끔하게 다듬습니다.

- 중앙 카드
- 좌측 또는 상단에 짧은 서비스 소개
- email/password input
- error state
- loading state
- 로그인/회원가입 전환 link
- 모바일에서는 1열

디자인은 전체 서비스와 통일합니다.

---

## 11. 마이페이지

마이페이지는 관리형 dashboard 느낌으로 만듭니다.

포함:

- 프로필 요약
- 내가 등록한 익스텐션
- 작성한 댓글
- 북마크
- 임시저장 글
- 관리 메뉴:
  - 수정
  - 삭제
  - 원본 링크 열기

탭 UI를 사용하고, 카드/리스트를 재사용하세요.

---

## 12. 컴포넌트 구조 제안

프로젝트 구조를 먼저 확인하고, 현재 구조에 맞춰 적용하세요.  
새 구조가 필요하다면 아래처럼 나누는 것을 권장합니다.

```txt
src/
  components/
    layout/
      AppHeader.tsx
      PageShell.tsx
      SectionHeader.tsx
    ui/
      Badge.tsx
      Button.tsx
      Card.tsx
      EmptyState.tsx
      Input.tsx
      Skeleton.tsx
      Tabs.tsx
    extension/
      ExtensionCard.tsx
      ExtensionListItem.tsx
      ExtensionMetaPanel.tsx
      ExtensionSearchBar.tsx
      PlatformFilter.tsx
    ai/
      AgentCommandBox.tsx
      AgentProgress.tsx
      RecommendationCard.tsx
    form/
      UrlImportBox.tsx
      AutoFillPreview.tsx
      ExtensionForm.tsx
  pages/ 또는 app/
    Home/Search
    ExtensionDetail
    CreateExtension
    AiCurator
    Auth
    MyPage
```

이미 shadcn/ui가 설치되어 있다면 Button, Card, Badge, Input, Tabs, Dialog, Skeleton 등을 적극 활용하세요.  
설치되어 있지 않고 프로젝트가 작다면, 무리하게 새 라이브러리를 추가하지 말고 CSS/Tailwind로 직접 구현해도 됩니다.

---

## 13. Mock data 제안

API가 아직 없거나 UI 작업 우선이라면 아래 mock data를 사용하세요.

```ts
export const mockExtensions = [
  {
    id: "1",
    name: "Raycast GitHub",
    platform: "Raycast",
    provider: "Raycast Community",
    description: "GitHub issues, pull requests, notifications를 빠르게 확인하고 처리하는 생산성 익스텐션.",
    tags: ["devtools", "github", "productivity"],
    rating: 4.8,
    downloads: 12400,
    bookmarks: 318,
    updatedAt: "2026-05-21",
    version: "2.1.0",
    matchScore: 94,
    isMcpVerified: true,
    sourceUrl: "#"
  },
  {
    id: "2",
    name: "Obsidian Web Clipper",
    platform: "Obsidian",
    provider: "Community Plugin",
    description: "웹 페이지를 Obsidian 노트로 저장하고 태그와 메타데이터를 함께 정리합니다.",
    tags: ["notes", "research", "automation"],
    rating: 4.7,
    downloads: 9800,
    bookmarks: 246,
    updatedAt: "2026-04-30",
    version: "1.8.3",
    matchScore: 91,
    isMcpVerified: true,
    sourceUrl: "#"
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
    bookmarks: 412,
    updatedAt: "2026-06-02",
    version: "0.9.4",
    matchScore: 88,
    isMcpVerified: false,
    sourceUrl: "#"
  }
];
```

---

## 14. 접근성 / 반응형 / 성능 기준

### 14.1 접근성

- 모든 버튼은 focus-visible 스타일 필요
- input label 또는 aria-label 필요
- 카드 전체 클릭 가능해도 내부 링크/버튼 접근 가능해야 함
- badge 색상만으로 의미 전달 금지
- 대비 낮은 회색 텍스트는 너무 작게 쓰지 말 것
- 모바일 터치 타겟은 최소 40px 이상 권장

### 14.2 반응형

- 모바일에서 header nav는 축약
- 검색창은 full-width
- 결과 카드는 1열
- 상세 페이지의 우측 메타 패널은 본문 아래로 이동
- 등록 페이지의 preview panel도 아래로 이동

### 14.3 성능

- 대형 이미지나 무거운 애니메이션 금지
- hover animation은 transform/opacity 중심
- 카드 hover transition은 `150ms~180ms`
- skeleton 사용
- 이미지/icon은 lazy loading 가능하면 적용
- `prefers-reduced-motion` 대응
- 페이지 이동이나 필터 변경 시 layout shift 최소화

---

## 15. 구현 우선순위

1. 디자인 토큰과 공통 레이아웃 정리
2. Header / PageShell / 공통 Card / Badge / Button / Input 정리
3. 메인 검색 페이지 구현
4. ExtensionCard 구현
5. 상세 페이지 구현
6. 등록 페이지 구현
7. AI 큐레이터 페이지 구현
8. 마이페이지 / 인증 페이지 polish
9. 반응형 / 접근성 / loading / empty state 정리

---

## 16. 화면별 완료 기준

### 메인/검색 완료 기준

- 자연어 검색창이 화면의 중심에 있음
- 플랫폼 필터와 정렬 UI가 있음
- 익스텐션 카드 그리드가 있음
- 카드에 플랫폼, 설명, 태그, 평점/다운로드, match score가 보임
- 빈 상태와 로딩 상태가 있음

### 카드 완료 기준

- 카드만 봐도 어떤 플랫폼의 어떤 익스텐션인지 알 수 있음
- 설명이 2줄로 정리됨
- match score와 MCP verified 상태를 표현함
- hover/focus 상태가 있음
- 모바일에서도 깨지지 않음

### 상세 페이지 완료 기준

- 좌측에는 설명/태그/댓글
- 우측에는 MCP 메타데이터 패널
- 원본 링크 CTA가 명확함
- 댓글 입력/목록이 있음
- 오래된 업데이트나 검증 안 됨 상태를 표시할 수 있음

### 등록 페이지 완료 기준

- URL 입력 → 자동 수집 → 미리보기 → 수정 → 등록 흐름이 보임
- 로딩/실패/성공 상태가 분리되어 있음
- 직접 입력도 가능함
- 미리보기 카드가 실제 등록 후 카드와 유사함

### AI 큐레이터 완료 기준

- command input이 중심임
- 추천 목적 chips가 있음
- Agent 진행 과정은 안전한 단계 중심으로 표시됨
- 추천 결과가 이유와 함께 카드로 나옴
- 내부 추론을 장황하게 노출하지 않음

---

## 17. 구체적인 UI 문구

서비스 내 한국어 문구는 아래 톤을 사용하세요.

### 메인

- `필요한 기능을 말하면, 맞는 익스텐션을 찾아줘요`
- `흩어진 익스텐션을 한곳에서 검색하고 비교하세요.`
- `무엇을 하고 싶은지 문장으로 입력해보세요`
- `추천 검색어`
- `관련도 높은 익스텐션`

### 카드

- `의미 일치`
- `MCP 검증`
- `최근 업데이트`
- `북마크`
- `원본 보기`

### 상세

- `수집된 정보`
- `공식 링크`
- `최근 업데이트`
- `권한 정보`
- `댓글`
- `비슷한 익스텐션`

### 등록

- `원본 URL 붙여넣기`
- `자동으로 불러오기`
- `수집된 정보를 확인해주세요`
- `직접 수정할 수 있어요`
- `등록하기`

### AI 큐레이터

- `어떤 작업을 더 쉽게 만들고 싶나요?`
- `목표를 이해하는 중`
- `비슷한 익스텐션 검색 중`
- `최신 정보 확인 중`
- `추천 조합 만들기`
- `이 조합을 추천하는 이유`

---

## 18. 금지 사항

- 비즈니스 로직/API 계약을 임의로 깨지 마세요.
- 로그인/회원가입/게시글 CRUD/API 호출이 이미 있다면 함수명과 데이터 흐름을 최대한 유지하세요.
- heavy animation library를 추가하지 마세요.
- 랜딩페이지 템플릿처럼 기능 영역을 아래로 밀어내지 마세요.
- 검색창, 카드, 상세 정보보다 장식 요소가 더 눈에 띄면 안 됩니다.
- AI Agent의 내부 chain-of-thought를 실제 추론처럼 길게 노출하지 마세요. 사용자에게는 단계/근거/결과만 보여주세요.

---

## 19. 최종 산출물

작업 후 아래 내용을 요약해 주세요.

1. 변경한 파일 목록
2. 새로 만든 컴포넌트 목록
3. 각 화면별 적용한 레퍼런스
4. 실행 방법
5. 남은 TODO
6. 스크린샷 또는 브라우저에서 확인할 수 있는 경로

---

## 20. 참고 레퍼런스 URL

- Raycast Store: https://www.raycast.com/store
- Product Hunt: https://www.producthunt.com/
- Vercel Marketplace: https://vercel.com/marketplace
- Chrome Web Store: https://chromewebstore.google.com/
- VS Code Marketplace: https://marketplace.visualstudio.com/vscode
- Explore GPTs: https://chatgpt.com/gpts
- Notion Marketplace: https://www.notion.com/templates
- shadcn/ui: https://ui.shadcn.com/
