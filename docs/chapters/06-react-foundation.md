# 06. React 기초 체력: Extendly 화면 쪼개기

## 이번 챕터 목표

- React 컴포넌트를 나누는 기준을 익힌다.
- props, state, derived value를 구분한다.
- Extendly 메인/검색 화면을 “페이지, 섹션, 재사용 UI”로 설계한다.
- API 연결 전 mock data로 익스텐션 카드와 필터 UI를 먼저 만든다.

## 먼저 이해할 개념

- Component: UI를 구성하는 함수
- Props: 부모가 자식에게 주는 입력값
- State: 컴포넌트가 기억해야 하는 값
- Render: 상태와 props를 바탕으로 UI를 다시 계산하는 과정
- Composition: 작은 컴포넌트를 조합해서 큰 화면을 만드는 방식
- Derived value: 검색어, 플랫폼, 정렬값에서 계산되는 화면 표시값

## 기준 문서

- 제품 명세: `docs/product/extendly_spec.md`
- UI/UX 지시서: `docs/product/extendly_codex_ui_spec.md`
- 와이어프레임: `docs/wireframes/extendly_wireframes.html`

이번 챕터에서는 구현 기준 중 S2 메인/검색 화면과 익스텐션 카드 구조를 우선 반영한다.

## 직접 구현할 파일/기능

- Extendly 메인/검색 정적 화면
- `HomePage`, `AppHeader`, `SearchHero`, `ExtensionGrid`, `ExtensionCard` 역할 분리
- 플랫폼 badge, 태그 pill, match badge, MCP verified badge
- 아직 API 연결 없이 mock extension data로 컴포넌트 경계 연습
- warm neutral 기반 디자인 토큰 초안 반영

## 구현 전에 스스로 답할 질문

- 어떤 JSX는 페이지 컴포넌트에 남기고, 어떤 JSX는 분리해야 할까?
- `ExtensionCard`가 직접 API를 호출하면 어떤 문제가 생길까?
- props가 많아질 때 타입을 어떻게 이름 붙일까?
- local state가 필요 없는 값을 state로 만들면 어떤 일이 생길까?
- 카드가 알아야 하는 정보와 목록 페이지가 알아야 하는 정보는 어떻게 다를까?
- RAG 검색 결과의 `matchScore`는 모든 카드에 있어야 할까, 의미 검색 결과에만 있어야 할까?

## 단계별 실습 과제

1. 메인/검색 화면을 header, hero, filter, result grid로 나눈다.
2. `ExtensionSummary` mock 타입을 직접 정의한다.
3. mock data에 `id`, `name`, `platform`, `provider`, `description`, `tags`, `rating`, `downloads`, `updatedAt`, `matchScore`, `isMcpVerified`, `sourceUrl`을 넣는다.
4. `ExtensionCard`가 extension 하나만 받아 렌더링하도록 만든다.
5. `ExtensionGrid`가 배열을 받아 map으로 렌더링하도록 만든다.
6. `SearchHero`에 자연어 검색 입력창, 추천 검색어 chips, `⌘ K` 힌트를 배치한다.
7. `PlatformFilter`에 `All`, `Chrome`, `Obsidian`, `VS Code`, `Raycast`, `Notion` 항목을 둔다.
8. 중복 JSX가 생겼는지 확인하고 한 번만 분리한다.

## 힌트

- 힌트 1: 컴포넌트 이름은 “어떻게 보이는가”보다 “무슨 역할인가”를 드러내면 좋다.
- 힌트 2: props 타입은 컴포넌트 바로 위에 두면 처음에는 읽기 쉽다.
- 힌트 3: state는 “사용자가 바꾸거나 시간이 지나며 바뀌는 값”에만 둔다.
- 힌트 4: `ExtensionCard`는 클릭 가능한 카드이지만, 원본 링크 버튼 같은 실제 행동은 상세 화면으로 미뤄도 된다.
- 힌트 5: UI 지시서의 카드 정보 밀도를 유지한다. 예쁜 빈 카드보다 이름, 플랫폼, 설명, 태그, 신뢰 정보가 먼저다.

## 검증 명령과 성공 기준

```bash
pnpm --filter web build
pnpm --filter web lint
```

성공 기준:

- Extendly 메인/검색 정적 화면이 렌더링된다.
- 컴포넌트가 최소 5개 역할로 나뉘어 있다.
- 각 컴포넌트가 받는 props를 설명할 수 있다.
- `ExtensionCard`가 API나 라우터에 직접 의존하지 않는다.
- mock data만 바꿔도 카드 목록 내용이 바뀐다.

## 나에게 공유할 내용

- 컴포넌트 트리
- props 타입
- “이 컴포넌트를 왜 나눴는지” 설명
- mock extension data 예시

## 회고 질문

- 컴포넌트를 너무 빨리 쪼개면 생기는 문제와 너무 늦게 쪼개면 생기는 문제는 무엇일까?
- Extendly 카드에서 “재사용 가능한 정보”와 “페이지별로 달라지는 정보”는 무엇이었나?
