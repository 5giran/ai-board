# 07. React 라우팅과 레이아웃: Extendly 화면 구조

## 이번 챕터 목표

- TanStack Router의 파일 기반 route를 익힌다.
- 공통 layout과 page route를 구분한다.
- Extendly의 6개 핵심 화면을 URL 구조로 확정한다.
- route params와 search params를 검색, 상세, 작성 흐름과 연결한다.

## 먼저 이해할 개념

- Route: URL과 화면 컴포넌트의 연결
- Layout route: 여러 페이지가 공유하는 구조
- Route params: `/extensions/:extensionId` 같은 경로 값
- Search params: `?page=1&q=github&platform=raycast` 같은 조회 조건
- Link: 새로고침 없이 이동하는 라우터 링크
- Protected route: 로그인한 사용자만 접근할 수 있는 화면

## Extendly route 초안

| URL | 화면 | 핵심 상태 |
|---|---|---|
| `/` | 메인 / 검색 | `q`, `platform`, `sort`, `page`, `mode` |
| `/login` | 로그인 | redirect |
| `/signup` | 회원가입 | redirect |
| `/extensions/:extensionId` | 익스텐션 상세 | route param |
| `/extensions/new` | 글 등록 | 인증 필요, source URL import |
| `/curator` | AI 큐레이터 | goal, agent run state |
| `/me` | 마이페이지 | 인증 필요, tab |

## 직접 구현할 파일/기능

- 앱 공통 layout과 header
- 메인/검색 route
- 익스텐션 상세 route
- 익스텐션 등록 route
- AI 큐레이터 route
- 로그인/회원가입 route
- 마이페이지 route
- 검색어, 플랫폼, 정렬, 페이지 번호를 search params로 관리

## 구현 전에 스스로 답할 질문

- header는 모든 페이지에 있어야 할까, 특정 페이지에만 있어야 할까?
- 검색어는 local state와 URL search params 중 어디에 있어야 할까?
- 상세 페이지에서 `extensionId`는 props로 받을까, route params에서 읽을까?
- URL에 상태를 남기면 사용자가 얻는 이점은 무엇일까?
- `/extensions/new`와 `/me`는 로그인하지 않은 사용자가 접근하면 어떻게 처리할까?
- 자연어 RAG 검색 결과와 일반 키워드 검색 결과를 URL에서 어떻게 구분할까?

## 단계별 실습 과제

1. `__root.tsx`에 앱 공통 layout을 만든다.
2. root layout에 `AppHeader`를 배치한다. 단, 로그인/회원가입 화면에서 header를 그대로 둘지 별도 auth shell을 둘지 결정한다.
3. `/` route를 메인/검색 화면으로 만든다.
4. `/extensions/$extensionId` 상세 route를 만든다.
5. `/extensions/new` 등록 route를 만든다.
6. `/curator`, `/login`, `/signup`, `/me` route를 만든다.
7. 메인 route에서 `q`, `platform`, `sort`, `page`, `mode` search params 계획을 세운다.
8. 마이페이지 route에서 `tab` search param을 쓸지 local state를 쓸지 결정한다.
9. route 이동에 `Link`를 사용한다.

## 힌트

- 힌트 1: 공통 navigation은 root layout에 두는 편이 자연스럽다.
- 힌트 2: 목록 필터는 URL에 있으면 새로고침, 공유, 뒤로가기에 강하다.
- 힌트 3: route 파일은 URL 구조를 드러내므로 이름을 신중히 짓는다.
- 힌트 4: 검색 입력 중인 임시 값은 local state, 실제 적용된 검색 조건은 search params에 두면 편하다.
- 힌트 5: 인증이 필요한 route는 UI만 막지 말고 API 호출 실패까지 고려한다.

## 검증 명령과 성공 기준

```bash
pnpm --filter web build
pnpm --filter web lint
```

성공 기준:

- 메인, 상세, 등록, 큐레이터, 인증, 마이페이지 route가 각각 열린다.
- Link로 페이지 이동이 된다.
- route params와 search params의 차이를 설명할 수 있다.
- 검색 조건을 바꾸면 URL이 함께 바뀐다.
- 상세 페이지 URL에서 `extensionId`를 읽어 화면에 사용할 수 있다.

## 나에게 공유할 내용

- route 구조
- layout에 둔 것과 page에 둔 것
- 검색 상태를 URL에 둘지 판단한 이유
- 인증이 필요한 route 처리 계획

## 회고 질문

- 라우팅 구조는 왜 화면 구현 전에 먼저 생각하는 것이 좋을까?
- Extendly에서 사용자가 공유하고 싶어 할 URL 상태는 무엇이었나?
