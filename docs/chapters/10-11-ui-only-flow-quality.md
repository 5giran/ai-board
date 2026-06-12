# 10-11. Extendly UI 먼저 완성하기: 화면 흐름 + UI 품질

## 이 문서의 목적

이 문서는 07장을 최소한으로 처리한 뒤, 08장 서버 상태와 09장 인증 흐름을 잠시 건너뛰고 Extendly의 UI를 먼저 완성하기 위한 실습 가이드다.

정석 순서는 다음과 같다.

```txt
07 라우팅
→ 08 서버 상태
→ 09 인증/폼
→ 10 화면 흐름
→ 11 UI 품질
```

하지만 지금은 화면을 먼저 보며 배우기 위해 다음 순서로 진행한다.

```txt
07 최소 라우팅
→ 10 화면 흐름 UI
→ 11 UI 품질 polish
→ 나중에 08 API 연결
→ 나중에 09 인증 연결
```

핵심 원칙:

- 실제 API 호출은 하지 않는다.
- 실제 로그인/회원가입 처리는 하지 않는다.
- 데이터는 `mockExtensions`와 local state로 표현한다.
- loading, error, empty, success 상태는 UI 연습용 mock state로 만든다.
- route와 화면 이동은 실제로 구현한다.
- 최종 목표는 "API 없이도 Extendly가 완성된 제품처럼 보이는 UI"다.

## 전제: 07장에서 최소로 끝낼 것

UI 작업에 들어가기 전에 route 뼈대만 준비한다.

필수 route:

```txt
/
/extensions/$extensionId
/extensions/new
/curator
/login
/signup
/me
```

필수 layout:

```txt
RouterProvider
└─ RootLayout
   ├─ AppHeader
   └─ Outlet
      └─ 현재 URL에 맞는 Page
```

학습 기준:

- `RootLayout`은 전체 앱의 부모다.
- `AppHeader`는 공통 UI라서 layout에 둔다.
- `Outlet`은 URL에 맞는 page route가 들어오는 자리다.
- 각 route page는 서로 props를 직접 주고받지 않는다.
- 상세 페이지는 props가 아니라 route param인 `extensionId`로 데이터를 찾는다.

## 이번 UI 선행 챕터의 목표

- 목록, 상세, 등록, 큐레이터, 로그인, 회원가입, 마이페이지 화면을 모두 만든다.
- 카드 뷰와 목록 뷰를 모두 완성한다.
- 목록에서 상세로 이동하는 흐름을 만든다.
- 등록 화면은 실제 저장 없이 4단계 UI를 완성한다.
- AI 큐레이터는 실제 Agent 호출 없이 진행 상태와 추천 결과 UI를 완성한다.
- 로그인/회원가입은 실제 인증 없이 2-column auth shell과 form UI를 완성한다.
- 반응형, 접근성, loading/error/empty 상태, 디자인 토큰을 점검한다.

## 지금 하지 않는 것

### 08장으로 미룰 것

- `useQuery`
- `useMutation`
- API client 함수
- query key 설계
- query invalidation
- 서버 loading/error 상태
- 댓글 API
- 북마크 API
- MCP metadata fetch API
- AI curator API

### 09장으로 미룰 것

- 로그인 요청
- 회원가입 요청
- access token 저장
- 현재 사용자 query
- protected route
- 로그아웃
- 비로그인 redirect
- 서버 validation 에러 처리

### 지금 대신 할 것

- API 결과처럼 보이는 mock data를 만든다.
- 로그인된 사용자처럼 보이는 mock viewer를 만든다.
- 버튼 클릭 시 local state만 바꾼다.
- loading/error/empty는 임시 토글 또는 mock status로 표현한다.
- 작성/수정/삭제는 실제 저장 없이 UI 상태와 이동 흐름만 보여준다.

## 데이터 준비

### mock data 파일

권장 위치:

```txt
apps/web/src/mocks/extensions.ts
```

역할:

- `ExtensionSummary` 타입
- `ExtensionDetail` 타입 또는 상세용 확장 필드
- `mockExtensions` 배열
- `mockComments` 배열
- `mockViewer` 객체

처음에는 `ExtensionSummary` 하나로 시작해도 된다. UI가 커지면 상세 화면에 필요한 필드를 추가한다.

목록 뷰에 필요한 필드:

```txt
id
name
platform
provider
description
tags
rating
downloads
updatedAt
matchScore
isMcpVerified
sourceUrl
author
commentCount
createdAt
```

상세 UI에 추가하면 좋은 필드:

```txt
version
license
compatibility
permissions
fetchedAt
features
category
```

### 데이터 흐름

목록 페이지:

```txt
HomePage
├─ viewMode state
├─ searchQuery state
├─ selectedPlatform state
├─ sort state
└─ visibleExtensions 계산
   ├─ ExtensionGrid extensions={visibleExtensions}
   │  └─ ExtensionCard extension={extension}
   └─ ExtensionBoard extensions={visibleExtensions}
      └─ ExtensionListItem extension={extension}
```

상세 페이지:

```txt
ExtensionDetailPage
├─ Route.useParams()로 extensionId 읽기
├─ mockExtensions.find(...)로 extension 찾기
└─ 찾은 extension을 상세 UI에 표시
```

핵심:

- `HomePage`에서 `ExtensionDetailPage`로 props를 직접 넘기지 않는다.
- 목록에서 상세로 이동할 때는 `Link`로 URL만 바꾼다.
- 상세 페이지는 URL의 `extensionId`를 보고 데이터를 다시 찾는다.

## 화면 구현 순서

## Step 1. AppHeader와 PageShell

먼저 전체 앱의 공통 틀을 만든다.

컴포넌트:

```txt
RootLayout
├─ AppHeader
└─ Outlet
```

`AppHeader`에 둘 것:

- Extendly 로고
- Explore 링크 `/`
- Submit 링크 `/extensions/new`
- AI Curator 링크 `/curator`
- Login 링크 `/login`
- Sign up 링크 `/signup`
- My Page 링크 `/me`

UI 기준:

- 높이 56px
- sticky header
- 배경은 page background와 어울리는 반투명 surface
- 로그인/회원가입 화면에서는 나중에 숨길 수 있도록 구조를 염두에 둔다

학습 포인트:

- header는 page의 자식이 아니라 layout의 자식이다.
- `Link`는 새로고침 없이 route 이동을 한다.
- 현재 URL에 따라 active 스타일을 줄 수 있다.

## Step 2. 메인 검색 화면 `/`

메인 화면 순서:

```txt
HomePage
├─ SearchHero
├─ ResultToolbar
├─ ResultHeader
├─ ViewToggle
└─ ExtensionGrid 또는 ExtensionBoard
```

### SearchHero

역할:

- 서비스의 첫 인상
- 자연어 검색 입력
- 추천 query chip

props 흐름:

```txt
HomePage
├─ searchQuery state
└─ SearchHero
   ├─ query={searchQuery}
   ├─ suggestions={suggestedQueries}
   └─ onQueryChange={setSearchQuery}
```

학습 포인트:

- input 값은 부모의 state에서 온다.
- input이 바뀌면 자식이 직접 state를 바꾸는 것이 아니라 `onQueryChange`를 호출한다.
- 실제 state 변경 함수는 부모인 `HomePage`가 가지고 있다.

### PlatformFilter

역할:

- All, Chrome, Obsidian, VS Code, Raycast, Notion 필터

props 흐름:

```txt
HomePage
├─ selectedPlatform state
└─ FilterSection
   └─ PlatformFilter
      ├─ selectedPlatform
      └─ onPlatformChange
```

`visibleExtensions` 계산:

```txt
selectedPlatform === "All"
  → 전체 mockExtensions
selectedPlatform !== "All"
  → platform이 같은 것만 filter
```

### SortSegment

지금은 실제 정렬 API가 없으므로 local state로만 만든다.

상태 예시:

```txt
sort = "match" | "popular" | "recent" | "bookmarked"
```

처음에는 정렬 로직을 실제로 다 구현하지 않아도 된다. UI에서 선택 상태만 보여도 된다.

### ViewToggle

역할:

- 카드 뷰와 목록 뷰를 바꾼다.

상태:

```txt
viewMode = "grid" | "list"
```

조건부 렌더링:

```txt
viewMode === "grid"
  → ExtensionGrid
viewMode === "list"
  → ExtensionBoard
```

주의:

- CSS로 숨기기보다 React 조건부 렌더링을 우선한다.
- `ExtensionGrid`와 `ExtensionBoard`는 같은 `visibleExtensions`를 받는다.
- 같은 데이터를 두 가지 표현으로 보여주는 연습이다.

## Step 3. 카드 뷰와 목록 뷰

### 카드 뷰

구조:

```txt
ExtensionGrid
└─ extensions.map(...)
   └─ ExtensionCard extension={extension}
```

`ExtensionGrid`는 배열을 받는 중간 부모다. `ExtensionCard`는 하나의 extension만 받는 자식이다.

카드에 보여줄 정보:

- 이름
- provider
- description
- tags
- platform
- rating
- downloads
- match score
- MCP verified badge

상세 이동:

- 카드 전체 또는 제목을 `Link`로 감싼다.
- 이동 URL은 `/extensions/$extensionId`다.

### 목록 뷰

구조:

```txt
ExtensionBoard
├─ board header
└─ extensions.map(...)
   └─ ExtensionListItem extension={extension}
```

목록 뷰는 게시판 흐름을 증명하는 화면이다.

컬럼:

```txt
익스텐션/태그 | 플랫폼 | 작성자 | 평점 | 댓글 | 등록일
```

목록 뷰에만 꼭 보여줄 정보:

- 작성자
- 댓글수
- 등록일

학습 포인트:

- 카드 뷰와 목록 뷰는 같은 데이터를 받는다.
- 하지만 어떤 정보를 강조할지는 컴포넌트마다 다르다.
- 목록 뷰는 전통적인 게시판 UI를 담당한다.

## Step 4. 상세 페이지 `/extensions/$extensionId`

상세 페이지 구조:

```txt
ExtensionDetailPage
├─ BackLink
├─ ExtensionDetailHeader
├─ ExtensionDescription
├─ FeatureList
├─ TagList
├─ CommentPreviewSection
└─ ExtensionMetaPanel
```

상세 페이지의 첫 로직:

```txt
Route.useParams()
→ extensionId
→ mockExtensions.find(...)
→ extension
```

없는 id 처리:

```txt
if (!extension) {
  return NotFound UI
}
```

왼쪽 main에 둘 것:

- 뒤로가기
- 아이콘 또는 platform mark
- 이름
- provider
- platform badge
- MCP verified badge
- rating
- downloads
- updatedAt
- source link
- bookmark button
- similar extension CTA
- description
- feature list
- tags
- comments preview

오른쪽 meta panel에 둘 것:

- downloads
- version
- license
- compatibility
- permissions
- fetchedAt
- source
- refresh button
- verified note
- warning note

지금은 버튼을 눌러도 실제 API가 없어도 된다.

UI-only 버튼 동작:

- bookmark button: local state로 "Bookmarked" 텍스트만 바꾸기
- similar extension CTA: `/`로 이동하거나 아직은 버튼만 배치
- refresh metadata: `idle/loading/success/error` mock status만 바꾸기

## Step 5. 등록 페이지 `/extensions/new`

등록 페이지는 실제 저장 없이 4단계 흐름을 보여준다.

구조:

```txt
ExtensionNewPage
├─ SubmitHeader
├─ Stepper
├─ UrlImportBox
├─ AutoFillPreview
└─ ExtensionForm
```

4단계:

```txt
1. 원본 URL
2. 자동 채움 미리보기
3. 직접 수정
4. 제출
```

local state 예시:

```txt
sourceUrl
importStatus: "idle" | "loading" | "success" | "error"
draft title
draft description
draft platform
draft tags
```

UI-only 동작:

- "자동으로 불러오기" 클릭 시 `importStatus`를 loading으로 바꾼다.
- 잠깐 뒤 success를 수동으로 바꾸거나, 지금은 버튼별로 상태를 바꾸게 해도 된다.
- success 상태에서는 mock preview를 보여준다.
- error 상태에서는 "자동 수집에 실패했어요. 직접 입력할 수 있습니다."를 보여준다.
- "등록하기" 클릭 시 실제 저장 없이 완료 메시지 또는 상세 이동 버튼을 보여준다.

학습 포인트:

- input draft는 local state다.
- API에서 온 데이터가 아니므로 TanStack Query가 필요 없다.
- 나중에 13장 MCP에서 `POST /ai/fetch-metadata`를 연결하면 `importStatus`가 mutation 상태로 바뀐다.

## Step 6. AI 큐레이터 `/curator`

AI 큐레이터는 챗봇 화면이 아니라 추천 도구 화면으로 만든다.

구조:

```txt
CuratorPage
├─ CuratorHero
├─ CommandPalette
├─ AgentProgress
└─ RecommendationGroups
```

local state:

```txt
goal
runStatus: "idle" | "running" | "done" | "error"
```

progress 단계:

```txt
1. RAG 유사 검색
2. MCP 외부 조회
3. 추천 조합 생성
```

주의:

- 내부 추론 과정을 길게 보여주지 않는다.
- 사용자에게 안전한 단계와 결과만 보여준다.
- 추천 이유는 짧고 실행 가능한 문장으로 쓴다.

UI-only 동작:

- "추천 받기" 버튼 클릭 시 running 상태 표시
- done 상태에서는 mock 추천 결과 표시
- error 상태에서는 다시 시도 버튼 표시

## Step 7. 로그인 `/login`과 회원가입 `/signup`

실제 인증은 하지 않는다. UI shell과 form 경험만 먼저 만든다.

구조:

```txt
AuthPage
├─ dark aside
└─ form panel
```

로그인 필드:

- email
- password

회원가입 필드:

- nickname
- email
- password
- password confirm

UI-only 상태:

- input local state
- 제출 중 mock state
- 클라이언트 검증 메시지
- 서버 에러처럼 보이는 mock error

주의:

- `/login`, `/signup`에서는 공통 header를 숨길지 나중에 결정한다.
- 지금 당장 복잡한 auth guard는 만들지 않는다.
- 실제 token 저장은 09장으로 미룬다.

## Step 8. 마이페이지 `/me`

마이페이지는 실제 로그인 확인 없이 mock viewer 기준으로 만든다.

구조:

```txt
MyPage
├─ ProfileHeader
├─ MyTabs
└─ MyList
```

탭:

```txt
내가 등록한 익스텐션
작성한 댓글
북마크
임시저장
```

상태:

```txt
selectedTab = "extensions" | "comments" | "bookmarks" | "drafts"
```

지금은 search param이 아니라 local state로 충분하다.

학습 포인트:

- 마이페이지 탭은 page 안에서만 쓰는 표현 상태다.
- 나중에 공유 가능한 URL이 필요하면 `?tab=bookmarks`로 옮길 수 있다.

## UI 품질 기준

## 디자인 토큰

UI 기준은 `docs/product/extendly_codex_ui_spec.md`를 따른다.

먼저 적용할 것:

- HSL CSS variables
- page background 3겹 배경
- tighter radius
- mono metadata
- command palette shadow
- accent color 제한

색 사용 원칙:

- accent 보라색은 AI가 개입한 지점에만 쓴다.
- match score, RAG/MCP badge, 검색 CTA, curator CTA가 accent 대상이다.
- 일반 카드, 일반 버튼, 일반 텍스트에 accent를 흩뿌리지 않는다.

## 공통 UI 상태

API가 없어도 상태 UI는 만들 수 있다.

필수 상태:

```txt
loading
error
empty
success
```

목록 화면 예시:

- loading: skeleton card 또는 "불러오는 중"
- error: "목록을 불러오지 못했어요" + 다시 시도 버튼
- empty: "조건에 맞는 익스텐션이 없어요" + 필터 초기화 버튼
- success: 카드/목록 결과

등록 자동수집 preview 예시:

- idle: URL을 입력하면 미리보기가 여기에 표시됨
- loading: 메타데이터를 가져오는 중
- success: MCP fetched badge와 preview
- error: 자동 수집 실패, 직접 입력 가능

큐레이터 예시:

- idle: 목표를 입력하라는 빈 상태
- running: 3단계 progress
- done: 추천 결과
- error: 추천 실패 + 다시 시도

## 접근성 기준

필수 체크:

- input에는 label 또는 aria-label이 있다.
- button은 실제 `button` 요소를 쓴다.
- 링크 이동은 `Link`를 쓴다.
- focus-visible 스타일이 보인다.
- 색만으로 상태를 구분하지 않는다.
- 모바일에서 버튼 텍스트가 넘치지 않는다.
- 카드 전체 클릭과 내부 버튼 클릭이 충돌하지 않는다.

## 반응형 기준

메인:

- desktop: 카드 3열
- tablet: 카드 2열
- mobile: 카드 1열

상세:

- desktop: main + sticky meta panel 2-column
- mobile: meta panel이 본문 아래로 내려간다

등록:

- desktop: form + preview panel 2-column
- mobile: stepper와 preview가 세로로 쌓인다

목록 보드:

- desktop: 컬럼 header 표시
- 880px 이하: header 숨김, 행 내용 축약

Auth:

- desktop: 2-column
- mobile: dark aside 숨김, form만 표시

## 컴포넌트 분리 기준

분리할 가능성이 높은 컴포넌트:

```txt
layout/AppHeader
layout/PageShell
search/CommandPalette
search/PlatformFilter
search/SortSegment
search/ViewToggle
extension/ExtensionCard
extension/ExtensionBoard
extension/ExtensionListItem
extension/ExtensionMetaPanel
extension/CommentPreviewSection
submit/Stepper
submit/UrlImportBox
submit/AutoFillPreview
submit/ExtensionForm
ai/AgentProgress
ai/RecommendationCard
auth/AuthShell
mypage/ProfileHeader
mypage/MyTabs
```

하지만 처음부터 전부 나누지는 않는다.

분리 기준:

- 두 번 이상 반복된다.
- 이름을 붙이면 읽기 쉬워진다.
- 부모가 너무 길어져서 역할이 섞인다.
- props로 입력과 출력이 명확하다.

분리하지 않아도 되는 경우:

- 한 페이지에서만 쓰이고 아직 짧다.
- props가 너무 복잡해서 오히려 읽기 어렵다.
- UI 방향이 아직 자주 바뀐다.

## 단계별 실습 과제

1. `RootLayout`에 `AppHeader`와 `Outlet`을 둔다.
2. 목표 route 7개가 모두 열리게 만든다.
3. `mockExtensions`를 공용 mock 파일로 분리한다.
4. 메인에서 command palette, 플랫폼 필터, 정렬 segment, view toggle을 배치한다.
5. 카드 뷰와 목록 뷰가 같은 `visibleExtensions`를 받게 만든다.
6. 카드와 목록 행에서 상세 페이지로 이동하게 만든다.
7. 상세 페이지에서 `extensionId` route param으로 mock data를 찾는다.
8. 상세 페이지의 main 영역과 meta panel을 만든다.
9. 댓글 preview 영역과 bookmark UI를 만든다.
10. 등록 페이지에 stepper, URL import box, preview, form을 만든다.
11. 자동 채움 preview의 idle/loading/success/error 상태를 만든다.
12. AI 큐레이터에 command palette, progress, 추천 결과를 만든다.
13. 로그인/회원가입 auth shell과 form UI를 만든다.
14. 마이페이지 profile, tab, list UI를 만든다.
15. loading/error/empty 상태를 각 주요 화면에 배치한다.
16. UI 지시서 토큰과 배경을 적용한다.
17. 데스크톱, 태블릿, 모바일 폭에서 깨지는 곳을 수정한다.
18. build와 lint를 통과시킨다.

## 성공 기준

기능 흐름:

- `/`에서 메인 검색 화면이 보인다.
- 카드 뷰와 목록 뷰를 전환할 수 있다.
- 카드와 목록 행에서 상세로 이동할 수 있다.
- `/extensions/$extensionId`에서 id에 맞는 상세 mock data가 보인다.
- 없는 id는 not found UI를 보여준다.
- `/extensions/new`에서 4단계 등록 UI가 보인다.
- `/curator`에서 AI 큐레이터 진행 상태와 추천 결과 UI가 보인다.
- `/login`, `/signup`에서 auth shell이 보인다.
- `/me`에서 profile과 tab UI가 보인다.

UI 품질:

- command palette가 메인 화면의 가장 강한 시각적 중심이다.
- 목록 뷰에는 작성자, 댓글수, 등록일이 보인다.
- 상세 metadata panel에는 MCP/신뢰/권한 정보가 보인다.
- 등록 preview에는 idle/loading/success/error 상태가 있다.
- 큐레이터 progress는 RAG, MCP, 추천 조합 단계만 안전하게 보여준다.
- 데이터와 메타데이터는 mono 스타일로 구분된다.
- accent 색은 AI 관련 지점에만 쓰인다.
- 모바일에서 텍스트와 버튼이 겹치지 않는다.
- 주요 input에 label이 있다.
- keyboard focus가 보인다.

검증:

```bash
pnpm --filter web build
pnpm --filter web lint
```

가능하면 브라우저에서 직접 확인한다.

확인 URL:

```txt
/
/extensions/1
/extensions/2
/extensions/999
/extensions/new
/curator
/login
/signup
/me
```

## 나중에 08장으로 돌아갈 때 바꿀 것

UI-only 상태를 실제 서버 상태로 바꾼다.

바뀌는 것:

- `mockExtensions` → `fetchExtensions`
- local loading/error → `useQuery`의 상태
- `mockExtensions.find(...)` → `fetchExtension(extensionId)`
- mock comments → comments query
- bookmark local state → bookmark mutation
- metadata refresh mock state → MCP fetch mutation
- curator mock run → AI curator mutation

유지되는 것:

- route 구조
- layout 구조
- 카드/목록 컴포넌트
- 상세 meta panel
- 등록 form UI
- loading/error/empty 화면 패턴

## 나중에 09장으로 돌아갈 때 바꿀 것

Auth UI를 실제 인증 흐름으로 바꾼다.

바뀌는 것:

- login form local submit → login mutation
- signup form local submit → signup mutation
- mock viewer → current user query
- `/me` mock 접근 → protected route
- submit/bookmark/comment 버튼 → 비로그인 안내 또는 redirect
- logout 버튼 → token 제거와 사용자 상태 초기화

유지되는 것:

- auth shell
- form layout
- label/error message 위치
- submit button 상태 표현
- 마이페이지 tab UI

## 회고 질문

- API 없이 UI를 먼저 만들었을 때 컴포넌트 구조를 이해하는 데 어떤 도움이 있었나?
- `HomePage`가 들고 있어야 하는 state와 자식이 props로 받아야 하는 값은 무엇이었나?
- route param과 props의 차이가 가장 잘 드러난 화면은 어디였나?
- 카드 뷰와 목록 뷰는 같은 데이터를 어떻게 다르게 표현했나?
- UI-only mock state와 나중에 TanStack Query 상태는 어떻게 대응될까?
- Extendly가 랜딩페이지가 아니라 실제 검색/마켓플레이스처럼 보이게 만든 결정은 무엇이었나?
