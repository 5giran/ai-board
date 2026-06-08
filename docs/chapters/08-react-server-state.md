# 08. React 서버 상태

## 이번 챕터 목표

- TanStack Query로 API 데이터를 가져온다.
- 서버 상태와 클라이언트 상태를 구분한다.
- loading, error, empty, success 상태를 빠짐없이 만든다.

## 먼저 이해할 개념

- Server state: 서버가 원본인 데이터
- Client state: 화면 안에서만 필요한 상태
- Query key: 캐시를 식별하는 이름
- Stale time: 데이터를 신선하다고 보는 시간
- Invalidation: mutation 이후 관련 query를 다시 가져오게 하는 것

## 직접 구현할 파일/기능

- API client 함수
- 게시글 목록 query
- 게시글 상세 query
- 게시글 작성/수정/삭제 mutation
- query invalidation

## 구현 전에 스스로 답할 질문

- 게시글 목록은 Zustand에 넣으면 안 될까?
- query key에 search params를 포함해야 할까?
- 작성 성공 후 어떤 query를 무효화해야 할까?
- loading과 empty는 어떻게 다를까?

## 단계별 실습 과제

1. API 응답 타입을 정의한다.
2. `fetchPosts` 함수를 만든다.
3. 목록 페이지에서 `useQuery`를 사용한다.
4. loading UI를 만든다.
5. error UI를 만든다.
6. 빈 목록 UI를 만든다.
7. 작성 mutation 후 목록 query를 invalidation한다.

## 힌트

- 힌트 1: query key는 `['posts', { page, search, tag }]`처럼 조건을 포함할 수 있다.
- 힌트 2: 서버에서 온 데이터는 TanStack Query가 캐시하게 두는 편이 좋다.
- 힌트 3: mutation은 성공 후 화면 이동과 캐시 갱신을 함께 고려한다.

## 검증 명령과 성공 기준

```bash
pnpm --filter web build
pnpm --filter web lint
```

성공 기준:

- API 로딩 중임을 사용자가 알 수 있다.
- API 실패가 화면에 표시된다.
- 데이터가 없을 때 빈 상태가 보인다.
- mutation 이후 목록이 갱신된다.

## 나에게 공유할 내용

- query key 설계
- 어떤 데이터를 Query에 두고 어떤 데이터를 Zustand/local state에 두었는지
- invalidation 기준

## 회고 질문

- 서버 상태를 직접 useState로 관리하면 어떤 문제가 생길까?
