# 16. Extendly React UI 코드 읽기 가이드

이 문서는 최근 Extendly UI 작업 중 **CSS를 제외한 React/TypeScript 프론트엔드 코드**를 공부하기 위한 가이드다.

목표는 “화면이 예쁘다”를 넘어서, React 앱이 어떤 단위로 쪼개지고, 상태가 어디에 있고, 자식 컴포넌트가 부모와 어떻게 대화하는지 이해하는 것이다.

## 먼저 읽을 순서

1. `apps/web/src/main.tsx`
2. `apps/web/src/router.tsx`
3. `apps/web/src/routes/__root.tsx`
4. `apps/web/src/components/layout/AppHeader.tsx`
5. `apps/web/src/routes/index.tsx`
6. `apps/web/src/components/search/CommandPalette.tsx`
7. `apps/web/src/components/extension/*`
8. `apps/web/src/routes/extensions/$extensionId.tsx`
9. `apps/web/src/routes/extensions/new.tsx`
10. `apps/web/src/routes/curator.tsx`

이 순서로 보면 “앱 시작 → 라우팅 → 레이아웃 → 페이지 상태 → 컴포넌트 분리 → 상세/폼/상태 UI” 흐름이 자연스럽다.

## 1. 앱 진입점과 RouterProvider

위치: `apps/web/src/main.tsx`

```tsx
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </StrictMode>,
)
```

### 알아야 하는 React 개념

- `createRoot`: React 앱을 실제 DOM의 `#root`에 붙인다.
- `StrictMode`: 개발 중 잠재 문제를 더 빨리 드러내는 React 도구다.
- `Provider`: 하위 컴포넌트들이 공통 기능을 쓰게 해주는 wrapper다.
- `RouterProvider`: URL에 맞는 route component를 렌더링한다.

### 왜 알아야 하나

React 앱은 아무 컴포넌트나 갑자기 화면에 뜨는 게 아니다. 항상 “entry point에서 provider를 감싸고, router가 현재 URL에 맞는 page를 골라 렌더링한다”는 구조로 시작한다.

## 2. RootLayout: header는 page의 자식이 아니다

위치: `apps/web/src/routes/__root.tsx`

```tsx
export const Route = createRootRoute({
  component: RootLayout,
});

function RootLayout() {
  return (
    <div>
      <AppHeader />
      <Outlet />
    </div>
  );
}
```

### 알아야 하는 React/TanStack Router 개념

- `createRootRoute`: 모든 route의 최상위 부모 route를 만든다.
- `Outlet`: 현재 URL에 맞는 하위 route page가 들어오는 자리다.
- layout component: 여러 페이지가 공유하는 UI를 둔다.

### 왜 알아야 하나

`AppHeader`를 `HomePage` 안에 넣으면 상세/등록/마이페이지마다 header를 또 넣어야 한다. 공통 UI는 layout에 두고, URL마다 바뀌는 영역만 `Outlet`에 들어가게 하는 것이 라우팅 앱의 기본 구조다.

## 3. AppHeader: 현재 URL을 읽어 active navigation 만들기

위치: `apps/web/src/components/layout/AppHeader.tsx`

```tsx
const pathname = useRouterState({
  select: (state) => state.location.pathname,
});

if (pathname === "/login" || pathname === "/signup") {
  return null;
}
```

```tsx
<Link
  key={item.to}
  className={isActive(pathname, item.to) ? "on" : undefined}
  to={item.to}
>
  {item.label}
</Link>
```

### 알아야 하는 React 개념

- hook: `useRouterState`처럼 현재 상태를 읽는 함수다.
- conditional return: 조건에 따라 아예 아무것도 렌더링하지 않을 수 있다.
- `Link`: 새로고침 없이 route를 이동한다.
- derived value: `pathname`을 바탕으로 active class를 계산한다.

### 왜 알아야 하나

프론트엔드 앱은 “현재 URL” 자체가 UI 상태다. 어떤 navigation을 강조할지, auth 화면에서 header를 숨길지 같은 판단은 URL 상태에서 파생된다.

## 4. HomePage: 상태를 부모가 소유한다

위치: `apps/web/src/routes/index.tsx`

```tsx
const [viewMode, setViewMode] = useState<ViewMode>("grid");
const [searchQuery, setSearchQuery] = useState("");
const [selectedPlatform, setSelectedPlatform] =
  useState<PlatformFilterValue>("All");
const [sort, setSort] = useState<SortValue>("match");
const [resultStatus, setResultStatus] = useState<ResultStatus>("success");
```

### 알아야 하는 React 개념

- `useState`: 화면 표현에 필요한 상태를 저장한다.
- union type: `"grid" | "list"`처럼 가능한 값을 좁힌다.
- page state: 특정 page에서만 쓰는 상태는 page component가 가진다.

### 왜 알아야 하나

검색어, 필터, 정렬, 보기 방식은 모두 Home 화면의 상태다. 이 상태를 각 버튼이나 입력 컴포넌트가 따로 가지면 화면이 쉽게 꼬인다. 그래서 부모인 `HomePage`가 상태를 들고, 자식에게 값과 변경 함수를 내려준다.

## 5. Derived State: 저장하지 말고 계산하라

위치: `apps/web/src/routes/index.tsx`

```tsx
const selectedSuggestion = suggestedQueries.includes(searchQuery)
  ? searchQuery
  : undefined;
```

```tsx
const visibleExtensions = useMemo(() => {
  if (selectedPlatform === "All") {
    return mockExtensions;
  }

  return mockExtensions.filter(
    (extension) => extension.platform === selectedPlatform,
  );
}, [selectedPlatform]);
```

### 알아야 하는 React 개념

- derived state: 기존 state에서 계산할 수 있는 값이다.
- `useMemo`: 의존 값이 바뀔 때만 계산 결과를 다시 만든다.
- filter: 원본 배열은 그대로 두고, 화면에 보여줄 배열만 계산한다.

### 왜 알아야 하나

`visibleExtensions`를 또 다른 `useState`로 저장하면 원본 데이터, 필터 상태, 결과 상태가 서로 어긋날 수 있다. React에서는 가능한 한 “저장해야 하는 상태”와 “계산 가능한 값”을 구분해야 한다.

## 6. Controlled Component: input 값은 부모 state에서 온다

위치: `apps/web/src/routes/index.tsx`

```tsx
<CommandPalette
  value={searchQuery}
  placeholder="논문 읽을 때 PDF 요약해주는 크롬 확장 찾아줘"
  isSubmitDisabled={!searchQuery.trim()}
  onClear={() => setSearchQuery("")}
  onValueChange={setSearchQuery}
  onSubmit={() => setResultStatus("success")}
/>
```

위치: `apps/web/src/components/search/CommandPalette.tsx`

```tsx
<input
  id={inputId}
  value={value}
  placeholder={placeholder}
  onChange={(event) => onValueChange(event.target.value)}
  onKeyDown={handleKeyDown}
/>
```

### 알아야 하는 React 개념

- controlled input: input의 현재 값이 React state로 관리된다.
- props: 부모가 자식에게 값을 내려준다.
- callback prop: 자식이 부모에게 “값이 바뀌었다”고 알려준다.

### 왜 알아야 하나

input이 자기 혼자 값을 관리하면 검색 결과, selected chip, clear 버튼, disabled 버튼 상태와 연결하기 어렵다. React에서는 이런 UI를 보통 controlled component로 만든다.

## 7. 자식 컴포넌트는 상태를 직접 바꾸지 않는다

위치: `apps/web/src/components/search/SuggestChips.tsx`

```tsx
type SuggestChipsProps = {
  suggestions: string[];
  selectedSuggestion?: string;
  onSelect: (suggestion: string) => void;
};
```

```tsx
<button
  className={`s${selectedSuggestion === suggestion ? " selected-chip" : ""}`}
  type="button"
  aria-pressed={selectedSuggestion === suggestion}
  onClick={() => onSelect(suggestion)}
>
  <b>#</b>
  {suggestion}
</button>
```

### 알아야 하는 React 개념

- presentational component: 화면 표현과 이벤트 전달만 담당한다.
- lifting state up: 실제 state 변경 함수는 부모가 갖는다.
- accessibility state: `aria-pressed`로 선택 상태를 보조기기에 전달한다.

### 왜 알아야 하나

`SuggestChips`가 직접 `searchQuery`를 알 필요는 없다. 이 컴포넌트는 “칩 목록을 그리고, 클릭하면 선택된 값을 부모에게 알려주는 역할”만 한다. 이렇게 책임을 좁히면 재사용하기 쉽다.

## 8. 조건부 렌더링: grid/list를 CSS로 숨기지 않는다

위치: `apps/web/src/routes/index.tsx`

```tsx
return viewMode === "grid" ? (
  <ExtensionGrid extensions={extensions} />
) : (
  <ExtensionBoard extensions={extensions} />
);
```

### 알아야 하는 React 개념

- conditional rendering: 상태에 따라 다른 컴포넌트를 렌더링한다.
- single source of truth: grid/list 둘 다 같은 `extensions` 배열을 받는다.

### 왜 알아야 하나

둘 다 렌더링해두고 CSS로 숨기면 DOM이 불필요하게 커지고, 접근성이나 focus 문제가 생길 수 있다. React에서는 상태에 따라 필요한 UI만 렌더링하는 방식이 더 명확하다.

## 9. 배열 렌더링과 key

위치: `apps/web/src/components/extension/ExtensionGrid.tsx`

```tsx
{extensions.map((extension) => (
  <ExtensionCard extension={extension} key={extension.id} />
))}
```

위치: `apps/web/src/components/extension/ExtensionBoard.tsx`

```tsx
{extensions.map((extension) => (
  <ExtensionListItem extension={extension} key={extension.id} />
))}
```

### 알아야 하는 React 개념

- `map`: 배열 데이터를 컴포넌트 배열로 바꾼다.
- `key`: React가 각 항목의 정체성을 추적하는 값이다.
- component composition: 목록 부모가 전체 배열을 받고, item/card가 단일 객체를 받는다.

### 왜 알아야 하나

게시판, 카드 리스트, 댓글 목록은 모두 배열 렌더링이다. `key`를 제대로 주지 않으면 React가 항목 변경을 잘못 추적해서 UI가 이상하게 바뀔 수 있다.

## 10. Link params: 목록에서 상세로 이동하기

위치: `apps/web/src/components/extension/ExtensionCard.tsx`

```tsx
<Link
  className="xc"
  to="/extensions/$extensionId"
  params={{ extensionId: extension.id }}
  aria-label={`${extension.name} 상세 보기`}
>
```

### 알아야 하는 React/TanStack Router 개념

- dynamic route: `/extensions/$extensionId`처럼 URL 일부가 데이터 id가 된다.
- `params`: route param에 들어갈 값을 전달한다.
- `Link`: SPA navigation을 수행한다.

### 왜 알아야 하나

상세 페이지로 데이터를 직접 props로 넘기지 않는다. 목록에서는 URL만 바꾸고, 상세 페이지는 URL의 `extensionId`를 읽어서 데이터를 다시 찾는다. 이게 라우팅 기반 앱의 자연스러운 데이터 흐름이다.

## 11. DetailPage: route param으로 데이터 찾기

위치: `apps/web/src/routes/extensions/$extensionId.tsx`

```tsx
const { extensionId } = Route.useParams();

const extension = mockExtensions.find(
  (candidate) => candidate.id === extensionId,
);
```

```tsx
if (!extension) {
  return (
    <PageShell padded>
      ...
      <h3>익스텐션을 찾을 수 없어요</h3>
      <p className="mono">extensionId: {extensionId}</p>
      ...
    </PageShell>
  );
}
```

### 알아야 하는 React 개념

- route params: URL에서 동적인 값을 읽는다.
- guard clause: 유효하지 않은 데이터일 때 먼저 return한다.
- not found UI: 앱이 깨지는 대신 상태를 화면으로 보여준다.

### 왜 알아야 하나

`/extensions/999`처럼 없는 URL은 반드시 발생한다. 좋은 UI는 이런 상황에서도 죽지 않고, 사용자가 다음 행동을 할 수 있게 보여준다.

## 12. DetailPage의 local UI state

위치: `apps/web/src/routes/extensions/$extensionId.tsx`

```tsx
const [isBookmarked, setIsBookmarked] = useState(false);
const [refreshStatus, setRefreshStatus] = useState<RefreshStatus>("idle");
```

```tsx
const handleRefresh = () => {
  setRefreshStatus("loading");
  window.setTimeout(() => {
    setRefreshStatus(extension.isMcpVerified ? "success" : "error");
  }, 700);
};
```

### 알아야 하는 React 개념

- local UI state: 서버 데이터가 아니라 버튼/패널 표현을 위한 상태다.
- status union: `"idle" | "loading" | "success" | "error"`처럼 UI 상태를 명확히 나눈다.
- mock async: 실제 API 없이 비동기 흐름을 연습한다.

### 왜 알아야 하나

좋은 프론트엔드는 성공 화면만 만들지 않는다. 로딩, 실패, 성공 이후 상태까지 준비한다. 나중에 API를 붙일 때 `setTimeout` 자리에 mutation을 넣으면 된다.

## 13. Child Component로 상세 패널 분리하기

위치: `apps/web/src/routes/extensions/$extensionId.tsx`

```tsx
<ExtensionMetaPanel
  extension={extension}
  refreshStatus={refreshStatus}
  onRefresh={handleRefresh}
/>
```

위치: `apps/web/src/components/extension/ExtensionMetaPanel.tsx`

```tsx
type ExtensionMetaPanelProps = {
  extension: ExtensionSummary;
  refreshStatus: RefreshStatus;
  onRefresh: () => void;
};
```

### 알아야 하는 React 개념

- props contract: 자식 컴포넌트가 필요한 입력과 이벤트를 타입으로 명시한다.
- container/presenter 분리: 페이지는 데이터를 찾고 상태를 관리하고, 패널은 표시를 담당한다.
- function prop: 자식 버튼 클릭이 부모의 함수를 실행한다.

### 왜 알아야 하나

상세 페이지에 모든 JSX를 몰아넣으면 읽기 어려워진다. `ExtensionMetaPanel`처럼 역할이 분명한 덩어리는 컴포넌트로 분리하는 게 좋다.

## 14. Submit Page: 폼은 draft state의 모음이다

위치: `apps/web/src/routes/extensions/new.tsx`

```tsx
const [sourceUrl, setSourceUrl] = useState("");
const [importStatus, setImportStatus] = useState<ImportStatus>("idle");
const [title, setTitle] = useState("");
const [description, setDescription] = useState("");
const [platform, setPlatform] = useState<Platform | "">("");
const [category, setCategory] = useState("");
const [tags, setTags] = useState("");
const [body, setBody] = useState("");
const [submitted, setSubmitted] = useState(false);
```

### 알아야 하는 React 개념

- form draft state: 사용자가 입력 중인 임시 값을 state로 관리한다.
- controlled form: 모든 input/select/textarea가 state와 연결된다.
- empty initial state: 예시는 `placeholder`, 실제 값은 빈 문자열에서 시작한다.

### 왜 알아야 하나

폼은 React 초보가 가장 많이 헷갈리는 영역이다. “placeholder와 value는 다르다”를 반드시 기억해야 한다. placeholder는 힌트이고, value는 실제 사용자가 입력한 값이다.

## 15. 자동 채움: API가 없어도 상태 흐름은 설계할 수 있다

위치: `apps/web/src/routes/extensions/new.tsx`

```tsx
const handleImport = () => {
  setSubmitted(false);
  setImportStatus("loading");
  window.setTimeout(() => {
    if (!sourceUrl.trim() || sourceUrl.includes("fail")) {
      setImportStatus("error");
      return;
    }

    setTitle(previewExtension.name);
    setDescription(previewExtension.description);
    setPlatform(previewExtension.platform);
    setCategory(previewExtension.category);
    setTags(previewExtension.tags.join(", "));
    setFieldSources({
      title: "mcp",
      description: "mcp",
      platform: "mcp",
      category: "mcp",
      tags: "mcp",
    });
    setImportStatus("success");
  }, 650);
};
```

### 알아야 하는 React 개념

- event handler: 버튼 클릭 시 실행되는 함수다.
- optimistic/mock flow: 실제 서버 없이도 로딩/성공/실패 UX를 만든다.
- multiple state update: 한 이벤트 안에서 여러 state를 함께 변경한다.

### 왜 알아야 하나

나중에 `POST /ai/fetch-metadata`를 붙여도 화면 구조는 거의 같다. 지금은 `setTimeout`, 나중에는 `useMutation`으로 바뀔 뿐이다. 중요한 건 상태 흐름을 먼저 설계하는 것이다.

## 16. 필드 출처 표시: UI도 상태다

위치: `apps/web/src/routes/extensions/new.tsx`

```tsx
type DraftField = "title" | "description" | "platform" | "category" | "tags";
type FieldSource = "empty" | "mcp" | "edited";

const [fieldSources, setFieldSources] =
  useState<Record<DraftField, FieldSource>>(emptyFieldSources);
```

```tsx
function FieldLabel({ htmlFor, label, fieldSource }: FieldLabelProps) {
  return (
    <div className="field-top">
      <label className="label" htmlFor={htmlFor}>
        {label}
      </label>
      {fieldSource !== "empty" ? (
        <span
          className={`source-chip ${fieldSource === "mcp" ? "mcp" : "edited"}`}
        >
          {fieldSource === "mcp" ? "MCP filled" : "edited"}
        </span>
      ) : null}
    </div>
  );
}
```

### 알아야 하는 React/TypeScript 개념

- `Record<K, V>`: 특정 키 집합에 대한 객체 타입을 만든다.
- UI metadata: 실제 데이터 값 외에, 그 값이 어디서 왔는지도 상태로 관리할 수 있다.
- 작은 컴포넌트 추출: 반복되는 label + badge 패턴을 `FieldLabel`로 분리했다.

### 왜 알아야 하나

사용자는 값만 보는 게 아니라 “이 값이 자동으로 들어온 건지, 내가 수정한 건지”도 알고 싶다. 프론트엔드는 이런 맥락까지 상태로 설계해야 한다.

## 17. Stepper는 저장하지 않고 계산한다

위치: `apps/web/src/routes/extensions/new.tsx`

```tsx
const currentStep = getCurrentStep(importStatus, submitted);
```

```tsx
function getCurrentStep(importStatus: ImportStatus, submitted: boolean) {
  if (submitted) {
    return 4;
  }

  if (importStatus === "success") {
    return 3;
  }

  if (importStatus === "loading" || importStatus === "error") {
    return 2;
  }

  return 1;
}
```

### 알아야 하는 React 개념

- derived UI: 현재 step은 별도 state가 아니라 `importStatus`, `submitted`에서 계산한다.
- pure function: 같은 입력이면 항상 같은 결과를 반환한다.

### 왜 알아야 하나

`currentStep`을 따로 `useState`로 관리하면 `importStatus`와 어긋날 수 있다. 계산 가능한 값은 계산하는 편이 안전하다.

## 18. Curator: 상태 머신처럼 생각하기

위치: `apps/web/src/routes/curator.tsx`

```tsx
const [goal, setGoal] = useState("");
const [runStatus, setRunStatus] = useState<RunStatus>("idle");
```

```tsx
const handleRun = () => {
  if (!goal.trim()) {
    setRunStatus("idle");
    return;
  }

  setRunStatus("running");
  window.setTimeout(() => {
    setRunStatus(goal.includes("fail") ? "error" : "done");
  }, 700);
};
```

### 알아야 하는 React 개념

- state machine thinking: idle → running → done/error 흐름으로 UI를 나눈다.
- guard condition: 입력이 없으면 running으로 가지 않는다.
- command UI: 입력값과 실행 상태가 버튼 disabled, 결과 영역, progress에 영향을 준다.

### 왜 알아야 하나

AI 기능 UI는 “답변만 보여주는 화면”이 아니라 진행 상태, 실패, 재시도, 추천 결과를 함께 다뤄야 한다. 상태를 문자열 union으로 나눠두면 UI가 훨씬 명확해진다.

## 19. CuratorResults: 상태별 화면을 분리한다

위치: `apps/web/src/routes/curator.tsx`

```tsx
function CuratorResults({
  status,
  onPromptSelect,
  onRetry,
}: CuratorResultsProps) {
  if (status === "idle") {
    return (...);
  }

  if (status === "running") {
    return (...);
  }

  if (status === "error") {
    return (...);
  }

  return (...done result...);
}
```

### 알아야 하는 React 개념

- early return: 상태별 UI를 위에서부터 분기한다.
- component boundary: 큐레이터 page 안에서도 결과 영역을 별도 함수로 분리했다.
- callback naming: `onPromptSelect`, `onRetry`처럼 이벤트 의도가 이름에 드러난다.

### 왜 알아야 하나

복잡한 JSX를 한 return 안에 삼항 연산자로 많이 넣으면 읽기 어려워진다. 상태가 3개 이상이면 early return이 공부하기도, 유지보수하기도 쉽다.

## 20. AuthShell: 같은 구조를 login/signup이 공유한다

위치: `apps/web/src/components/auth/AuthShell.tsx`

```tsx
type AuthShellProps = {
  points: AuthPoint[];
  children: ReactNode;
};
```

```tsx
export function AuthShell({ points, children }: AuthShellProps) {
  return (
    <main className="auth-wrap">
      <aside className="auth-aside">...</aside>
      <div className="auth-main">
        <div className="auth-card">{children}</div>
      </div>
    </main>
  );
}
```

### 알아야 하는 React 개념

- `children`: 부모가 넘긴 JSX를 컴포넌트 내부 특정 위치에 끼워 넣는다.
- layout composition: 같은 shell 안에 다른 form을 넣는다.
- reusable wrapper: 반복되는 페이지 구조를 한 곳으로 모은다.

### 왜 알아야 하나

로그인/회원가입은 좌측 설명 panel과 우측 form panel 구조가 같다. `AuthShell`을 쓰면 공통 구조는 재사용하고, 각 페이지는 form 내용만 담당한다.

## 21. TypeScript union type을 적극적으로 쓴 이유

예시 위치:

- `apps/web/src/components/search/ViewToggle.tsx`
- `apps/web/src/components/search/SortSegment.tsx`
- `apps/web/src/routes/extensions/new.tsx`
- `apps/web/src/components/ai/AgentProgress.tsx`

예시:

```ts
export type ViewMode = "grid" | "list";
export type SortValue = "match" | "popular" | "recent" | "bookmarked";
export type ImportStatus = "idle" | "loading" | "success" | "error";
export type RunStatus = "idle" | "running" | "done" | "error";
```

### 알아야 하는 개념

- union type은 “가능한 상태 목록”을 코드로 문서화한다.
- 잘못된 문자열을 넣으면 TypeScript가 잡아준다.
- UI 상태가 많아질수록 union type이 실수를 줄인다.

### 왜 알아야 하나

프론트엔드 UI는 상태 조합이 많다. 문자열을 아무렇게나 쓰면 `"sucess"` 같은 오타도 런타임까지 모른다. union type은 UI 상태의 안전벨트다.

## 22. 지금 코드에서 특히 익혀야 할 패턴 10개

1. URL에 맞는 page를 `createFileRoute`로 연결한다.
2. 공통 layout은 `__root.tsx`와 `Outlet`으로 만든다.
3. 내부 이동은 `Link`를 사용한다.
4. 입력값은 controlled component로 관리한다.
5. 자식은 직접 state를 바꾸지 않고 callback을 호출한다.
6. 계산 가능한 값은 state로 저장하지 않고 derived value로 만든다.
7. 배열은 `map`으로 렌더링하고 `key`를 준다.
8. 여러 상태 화면은 early return으로 분리한다.
9. mock async라도 `idle/loading/success/error`를 분리한다.
10. UI 맥락도 상태다. 예: `fieldSources`, `selectedSuggestion`, `refreshStatus`.

## 혼자 읽으면서 해볼 질문

- `searchQuery`는 왜 `CommandPalette` 안이 아니라 `HomePage`에 있을까?
- `visibleExtensions`를 `useState`로 만들면 어떤 문제가 생길까?
- `ExtensionCard`와 `ExtensionListItem`은 같은 데이터를 받는데 왜 다른 컴포넌트일까?
- `/extensions/999`에서 앱이 죽지 않는 이유는 무엇일까?
- `importStatus`가 없으면 등록 preview UI는 어떻게 복잡해질까?
- `FieldLabel`은 왜 별도 컴포넌트로 뺐을까?
- `AuthShell`에서 `children`을 쓰는 장점은 무엇일까?
- 나중에 API를 붙일 때 `setTimeout`은 어떤 코드로 대체될까?

## 다음에 API를 붙일 때 바뀔 부분

지금은 UI-only라 mock data와 local state를 쓴다. 나중에 서버를 붙이면 다음이 바뀐다.

- `mockExtensions` → `useQuery`로 받은 서버 데이터
- `setTimeout` import mock → `useMutation`으로 `POST /ai/fetch-metadata`
- 로그인 mock submit → `POST /auth/login`
- 댓글 입력 → `POST /extensions/:id/comments`
- 북마크 local toggle → `POST /extensions/:id/bookmark`

하지만 React 구조 자체는 크게 바뀌지 않는다. 페이지가 상태를 소유하고, 자식 컴포넌트가 props와 callback으로 대화하는 구조는 계속 유지된다.

