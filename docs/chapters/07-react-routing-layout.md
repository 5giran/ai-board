# 07. React 라우팅과 레이아웃

## 이번 챕터 목표

- TanStack Router의 파일 기반 route를 익힌다.
- 공통 layout과 page route를 구분한다.
- route params와 search params를 화면 상태와 연결한다.

## 먼저 이해할 개념

- Route: URL과 화면 컴포넌트의 연결
- Layout route: 여러 페이지가 공유하는 구조
- Route params: `/posts/:postId` 같은 경로 값
- Search params: `?page=1&search=react` 같은 조회 조건
- Link: 새로고침 없이 이동하는 라우터 링크

## 직접 구현할 파일/기능

- 앱 공통 레이아웃
- 게시글 목록 route
- 게시글 상세 route
- 글쓰기 route
- 검색어와 페이지 번호를 search params로 관리

## 구현 전에 스스로 답할 질문

- header는 모든 페이지에 있어야 할까, 특정 페이지에만 있어야 할까?
- 검색어는 local state와 URL search params 중 어디에 있어야 할까?
- 상세 페이지에서 `postId`는 props로 받을까, route params에서 읽을까?
- URL에 상태를 남기면 사용자가 얻는 이점은 무엇일까?

## 단계별 실습 과제

1. `__root.tsx`에 앱 공통 layout을 만든다.
2. `/posts` 목록 route를 만든다.
3. `/posts/$postId` 상세 route를 만든다.
4. `/posts/new` 작성 route를 만든다.
5. 목록 route에서 `page`, `search`, `tag` search params 계획을 세운다.
6. route 이동에 `Link`를 사용한다.

## 힌트

- 힌트 1: 공통 navigation은 root layout에 두는 편이 자연스럽다.
- 힌트 2: 목록 필터는 URL에 있으면 새로고침, 공유, 뒤로가기에 강하다.
- 힌트 3: route 파일은 URL 구조를 드러내므로 이름을 신중히 짓는다.

## 검증 명령과 성공 기준

```bash
pnpm --filter web build
pnpm --filter web lint
```

성공 기준:

- 목록, 상세, 작성 route가 각각 열린다.
- Link로 페이지 이동이 된다.
- route params와 search params의 차이를 설명할 수 있다.

## 나에게 공유할 내용

- route 구조
- layout에 둔 것과 page에 둔 것
- 검색 상태를 URL에 둘지 판단한 이유

## 회고 질문

- 라우팅 구조는 왜 화면 구현 전에 먼저 생각하는 것이 좋을까?
