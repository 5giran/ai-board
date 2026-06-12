# 07 -> 10. UI 먼저 만들기 위한 라우팅 최소 가이드

## 이 문서의 목적

07장을 전부 깊게 끝낸 뒤 08, 09장을 지나 10장으로 가는 정석 흐름 대신, 지금은 화면을 먼저 보면서 배우기 위해 최소한의 라우팅만 처리한다.

이 문서는 다음 기준으로 진행한다.

- 코드 구조를 망치지 않는 선에서 route와 layout만 먼저 잡는다.
- API 연결, 인증 처리, mutation, query invalidation은 나중으로 미룬다.
- 데이터는 당분간 mock data를 사용한다.
- 화면 흐름은 10장의 목록, 상세, 등록, 큐레이터, 마이페이지 구조를 먼저 만든다.
- React 초보 학습을 위해 부모, 자식, props, state 흐름을 계속 말로 설명할 수 있게 한다.

## 지금 필요한 최소 작업

지금 당장 필요한 것은 완성된 라우팅 시스템이 아니라, 화면들이 서로 이동할 수 있는 뼈대다.

### 1. RootLayout을 공통 부모로 만든다

`__root.tsx`의 역할은 모든 페이지를 감싸는 공통 부모다.

구조는 이렇게 생각한다.

```txt
RouterProvider
└─ RootLayout
   ├─ AppHeader
   └─ Outlet
      └─ 현재 URL에 맞는 Page
```

여기서 `Outlet`은 자식 페이지가 들어오는 자리다. `/`이면 `HomePage`, `/extensions/1`이면 `ExtensionDetailPage`, `/extensions/new`이면 `ExtensionNewPage`가 들어온다.

학습 포인트:

- `RootLayout`은 전체 앱의 부모 컴포넌트다.
- `AppHeader`는 여러 페이지가 공유하므로 page가 아니라 layout에 둔다.
- `Outlet`은 props로 직접 넘기는 자식이 아니라, TanStack Router가 URL에 맞춰 끼워 넣는 자식 자리다.

### 2. 필요한 route 파일만 먼저 만든다

UI 흐름을 보기 위해 route는 먼저 만든다. 단, 내부는 완성 UI가 아니라 작은 placeholder로 시작해도 된다.

목표 route:

```txt
/
/extensions/$extensionId
/extensions/new
/curator
/login
/signup
/me
```

처음에는 각 route가 이런 정도만 보여도 된다.

```tsx
function ExtensionDetailPage() {
  return <div>Extension detail</div>
}
```

중요한 것은 예쁜 화면보다 "URL 하나에 page 하나"라는 감각을 잡는 것이다.

### 3. mock data를 여러 화면에서 쓸 수 있게 한다

상세 페이지는 목록에서 보던 익스텐션 하나를 다시 보여줘야 한다. 그러려면 `mockExtensions`가 `index.tsx` 안에만 있으면 불편하다.

UI 먼저 만들기 단계에서는 mock data를 분리하는 것이 좋다.

권장 위치:

```txt
apps/web/src/mocks/extensions.ts
```

역할:

- `ExtensionSummary` 타입을 둔다.
- `mockExtensions` 배열을 둔다.
- 목록 페이지와 상세 페이지가 같은 데이터를 import해서 쓴다.

props 흐름은 이렇게 된다.

```txt
HomePage
├─ ExtensionGrid extensions={visibleExtensions}
│  └─ ExtensionCard extension={extension}
└─ ExtensionBoard extensions={visibleExtensions}
   └─ ExtensionListItem extension={extension}

ExtensionDetailPage
└─ route param extensionId로 mockExtensions에서 하나를 찾음
```

주의할 점:

- 목록 페이지에서 상세 페이지로 props를 직접 넘기는 구조가 아니다.
- 상세 페이지는 URL의 `extensionId`를 읽고, 그 id로 데이터를 찾는다.
- 그래서 `extensionId`는 props가 아니라 route param이다.

## 지금 미뤄도 되는 것

아래는 중요하지만 지금 당장 하지 않아도 된다.

### 08장으로 미룰 것

- `useQuery`
- `fetchExtensions`
- loading, error, empty 상태의 실제 API 연결
- query key 설계
- mutation 후 invalidation
- 댓글 API
- 북마크 API
- MCP metadata fetch API
- AI curator API

지금은 mock data로 같은 화면 구조만 만든다.

### 09장으로 미룰 것

- 실제 로그인 요청
- 회원가입 요청
- token 저장
- 현재 사용자 query
- protected route
- 비로그인 사용자의 redirect
- 로그아웃

지금은 로그인, 회원가입, 마이페이지 화면의 외형과 흐름만 만든다.

### 10장 후반으로 미룰 것

- 작성 성공 후 실제 상세 이동
- 수정 성공 후 실제 상세 이동
- 삭제 성공 후 목록 이동
- optimistic UI
- API 실패 시 draft 유지
- 댓글 작성과 삭제

지금은 버튼과 화면 배치만 먼저 만든다.

## UI 먼저 만드는 순서

### Step 1. Layout과 Header

먼저 `RootLayout`에 `AppHeader`와 `Outlet`을 둔다.

이 단계의 목표:

- 모든 일반 페이지에서 header가 보인다.
- `/login`, `/signup`에서는 나중에 header를 숨길 수 있다는 기준만 알고 넘어간다.

처음부터 auth shell 분기까지 완벽히 만들 필요는 없다.

### Step 2. 목록에서 상세로 이동

카드 뷰와 목록 뷰에서 모두 상세 페이지로 이동할 수 있게 한다.

구조:

```txt
HomePage
└─ ExtensionGrid
   └─ ExtensionCard
      └─ Link to="/extensions/$extensionId"
```

또는:

```txt
HomePage
└─ ExtensionBoard
   └─ ExtensionListItem
      └─ Link to="/extensions/$extensionId"
```

학습 포인트:

- `HomePage`는 목록 전체 상태를 가진 부모다.
- `ExtensionGrid`는 배열을 받는 중간 부모다.
- `ExtensionCard`는 extension 하나만 받는 자식이다.
- 상세 이동은 state 변경이 아니라 route 이동이다.

### Step 3. 상세 페이지 UI

상세 페이지는 URL에서 `extensionId`를 읽는다.

구조:

```txt
ExtensionDetailPage
├─ ExtensionDetailHeader
├─ ExtensionDescription
├─ ExtensionTagList
├─ CommentPreviewSection
└─ ExtensionMetaPanel
```

처음에는 컴포넌트를 너무 잘게 나누지 않아도 된다. 화면이 길어지고 중복이 보이면 그때 분리한다.

상세 페이지에서 먼저 보여줄 정보:

- 이름
- 플랫폼
- 제공자
- 설명
- 태그
- 평점
- 다운로드 수
- MCP 검증 여부
- 원본 링크

### Step 4. 등록 페이지 UI

`/extensions/new`는 실제 저장 없이 4단계 흐름만 먼저 만든다.

구조:

```txt
ExtensionNewPage
├─ Stepper
├─ UrlImportBox
├─ AutoFillPreview
└─ ExtensionForm
```

처음 상태는 local state로 충분하다.

예시 state:

```tsx
const [sourceUrl, setSourceUrl] = useState("")
const [importStatus, setImportStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
```

학습 포인트:

- input 값처럼 화면 안에서만 필요한 값은 local state다.
- 서버에서 저장된 익스텐션 목록은 나중에 server state로 옮긴다.
- 자동 수집 결과는 당장은 mock preview로 표현한다.

### Step 5. AI 큐레이터 UI

`/curator`는 실제 Agent 호출 없이 입력창과 진행 상태만 만든다.

구조:

```txt
CuratorPage
├─ CommandPalette
├─ AgentProgress
└─ RecommendationList
```

처음에는 버튼을 누르면 local state만 바꿔도 된다.

예시:

```tsx
const [status, setStatus] = useState<"idle" | "running" | "done">("idle")
```

### Step 6. 로그인, 회원가입, 마이페이지 UI

`/login`, `/signup`, `/me`는 실제 인증 없이 화면만 만든다.

지금 목표:

- 로그인 form 외형
- 회원가입 form 외형
- 마이페이지 탭 외형

나중 목표:

- 제출 검증
- API 요청
- token 저장
- protected route

## search params는 지금 어떻게 할까?

07장에서는 `q`, `platform`, `sort`, `page`, `view`를 URL search params로 관리할지 결정해야 한다.

UI 먼저 만들기 단계에서는 이렇게 간다.

| 상태 | 지금 | 나중 |
|---|---|---|
| `q` | local state | URL search param + query key |
| `platform` | local state | URL search param + query key |
| `sort` | local state 또는 고정값 | URL search param + query key |
| `page` | 아직 생략 가능 | URL search param + query key |
| `view` | local state | URL 또는 local state 중 선택 |

이유:

- 지금은 화면 구조와 컴포넌트 관계를 익히는 것이 목표다.
- API 연결 전에는 URL search params까지 넣으면 배울 개념이 한 번에 너무 많아진다.
- 08장에서 API query key를 만들 때 `q`, `platform`, `sort`, `page`를 URL과 연결하면 자연스럽다.

단, 최종 판단은 이렇게 설명할 수 있어야 한다.

- 공유 가능한 검색 조건은 URL에 두는 편이 좋다.
- 입력 중인 임시 검색어는 local state로 둘 수 있다.
- 카드/목록 view는 표현 상태라서 URL에 둘 수도 있고 local state로 둘 수도 있다.

## 컴포넌트 분리 기준

UI를 먼저 만들 때도 분리 기준은 필요하다.

### 부모 컴포넌트가 할 일

부모는 상태를 들고, 자식에게 props를 내려준다.

예:

```txt
HomePage
├─ searchQuery state
├─ selectedPlatform state
├─ viewMode state
└─ visibleExtensions 계산
```

### 자식 컴포넌트가 할 일

자식은 받은 props를 화면에 그린다.

예:

```txt
SearchHero
├─ query를 input value로 사용
└─ onQueryChange를 input onChange에서 호출
```

### 중간 부모가 할 일

중간 부모는 배열을 받아서 `map`으로 더 작은 자식을 만든다.

예:

```txt
ExtensionGrid
└─ extensions.map(...)
   └─ ExtensionCard extension={extension}
```

핵심:

- 배열 전체가 필요한 컴포넌트와 아이템 하나만 필요한 컴포넌트를 구분한다.
- `map`은 보통 "목록 컴포넌트"가 담당한다.
- 카드 하나, 리스트 행 하나는 배열을 몰라도 된다.

## 이번 우회로의 완료 기준

이 문서 흐름을 끝냈다고 볼 수 있는 기준:

- `/`에서 목록이 보인다.
- 카드 뷰와 목록 뷰를 바꿀 수 있다.
- 카드와 목록 행에서 상세 페이지로 이동할 수 있다.
- `/extensions/$extensionId`에서 URL의 id로 상세 mock data를 찾는다.
- `/extensions/new`에서 등록 흐름 UI가 보인다.
- `/curator`에서 AI 큐레이터 UI가 보인다.
- `/login`, `/signup`, `/me` route가 열린다.
- 어떤 상태를 local state로 뒀고, 무엇을 나중에 URL/API로 옮길지 설명할 수 있다.

## 다음에 다시 정석 흐름으로 돌아오는 지점

UI 흐름이 어느 정도 보이면 다음 순서로 돌아온다.

1. 07장으로 돌아와 search params를 정리한다.
2. 08장에서 mock data를 API query로 바꾼다.
3. 09장에서 login, signup, protected action을 연결한다.
4. 10장에서 작성, 수정, 삭제, 댓글, 북마크 흐름을 진짜 mutation으로 바꾼다.
5. 11장에서 UI 품질과 반응형을 다듬는다.

## 지금 바로 이어서 할 첫 작업

다음 작업은 `/extensions/$extensionId` 상세 route를 만드는 것이다.

이유:

- 목록에서 상세로 이동하는 순간 화면 흐름이 생긴다.
- route params를 실제로 써볼 수 있다.
- 같은 mock data를 목록과 상세에서 공유해야 하는 이유가 바로 느껴진다.

작업 순서:

1. `mockExtensions`와 `ExtensionSummary`를 공용 mock 파일로 옮긴다.
2. `index.tsx`에서 공용 mock data를 import한다.
3. `extensions/$extensionId.tsx` route 파일을 만든다.
4. 상세 route에서 `extensionId` route param을 읽는다.
5. `mockExtensions.find(...)`로 하나를 찾는다.
6. 카드와 목록 행을 `Link`로 감싸 상세로 이동한다.

이 순서로 가면 07장의 라우팅 개념과 10장의 UI 흐름을 동시에 잡을 수 있다.
