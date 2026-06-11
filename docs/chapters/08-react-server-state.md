# 08. React 서버 상태: Extendly API 연결

## 이번 챕터 목표

- TanStack Query로 API 데이터를 가져온다.
- 서버 상태와 클라이언트 상태를 구분한다.
- loading, error, empty, success 상태를 빠짐없이 만든다.
- Extendly의 익스텐션 목록, 상세, 댓글, 북마크, AI 요청을 query/mutation으로 설계한다.

## 먼저 이해할 개념

- Server state: 서버가 원본인 데이터
- Client state: 화면 안에서만 필요한 상태
- Query key: 캐시를 식별하는 이름
- Stale time: 데이터를 신선하다고 보는 시간
- Invalidation: mutation 이후 관련 query를 다시 가져오게 하는 것
- Mutation: 생성, 수정, 삭제, 북마크, AI 실행처럼 서버 상태를 바꾸거나 요청을 실행하는 작업

## Extendly에서 다룰 서버 상태

| 기능 | API | Query key 예시 |
|---|---|---|
| 익스텐션 목록 | `GET /extensions` | `['extensions', { q, platform, sort, page }]` |
| RAG 의미 검색 | `POST /ai/search` | `['ai-search', query]` 또는 mutation |
| 익스텐션 상세 | `GET /extensions/:id` | `['extension', id]` |
| 댓글 목록 | `GET /extensions/:id/comments` | `['comments', id]` |
| 메타데이터 자동수집 | `POST /ai/fetch-metadata` | mutation |
| AI 큐레이터 | `POST /ai/curate` | mutation |
| 내 북마크 | `GET /me/bookmarks` | `['me', 'bookmarks']` |

## 직접 구현할 파일/기능

- API client 함수
- 익스텐션 목록 query
- 익스텐션 상세 query
- 댓글 query와 작성/삭제 mutation
- 익스텐션 작성/수정/삭제 mutation
- 북마크 toggle mutation
- RAG 검색, MCP 자동수집, Agent 큐레이터 요청
- query invalidation

## 구현 전에 스스로 답할 질문

- 익스텐션 목록은 Zustand에 넣으면 안 될까?
- query key에 search params를 포함해야 할까?
- 작성 성공 후 어떤 query를 무효화해야 할까?
- loading과 empty는 어떻게 다를까?
- 자연어 검색 입력값은 서버 상태일까, 클라이언트 상태일까?
- `POST /ai/search`는 query처럼 캐시할까, mutation처럼 실행할까?
- 북마크 toggle 후 상세, 목록, 마이페이지 중 어떤 데이터를 갱신해야 할까?

## 단계별 실습 과제

1. API 응답 타입을 정의한다.
2. `fetchExtensions(params)` 함수를 만든다.
3. 목록 페이지에서 `useQuery`를 사용한다.
4. loading UI를 만든다.
5. error UI를 만든다.
6. 빈 목록 UI를 만든다.
7. `fetchExtension(id)` 상세 query를 만든다.
8. 댓글 query와 댓글 작성 mutation을 만든다.
9. 작성 mutation 후 목록 query를 invalidation한다.
10. 북마크 toggle 후 관련 query를 invalidation한다.
11. `fetchMetadata(sourceUrl)`와 `curateExtensions(goal)`은 mutation으로 먼저 구현한다.

## 힌트

- 힌트 1: query key는 `['extensions', { page, q, platform, sort }]`처럼 조건을 포함할 수 있다.
- 힌트 2: 서버에서 온 데이터는 TanStack Query가 캐시하게 두는 편이 좋다.
- 힌트 3: mutation은 성공 후 화면 이동과 캐시 갱신을 함께 고려한다.
- 힌트 4: RAG 검색 결과에는 `matchScore`가 있으므로 일반 검색 결과와 타입을 구분하거나 optional 필드로 둔다.
- 힌트 5: MCP 자동수집 결과는 바로 저장된 데이터가 아니라 등록 폼의 draft 값을 채우는 응답일 수 있다.

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
- 검색 조건이 query key에 반영된다.
- AI 요청은 실행 중, 성공, 실패 상태가 구분된다.

## 나에게 공유할 내용

- query key 설계
- 어떤 데이터를 Query에 두고 어떤 데이터를 Zustand/local state에 두었는지
- invalidation 기준
- AI 요청을 query와 mutation 중 어디에 둔 이유

## 회고 질문

- 서버 상태를 직접 useState로 관리하면 어떤 문제가 생길까?
- Extendly에서 캐시하면 좋은 데이터와 매번 새로 요청해야 하는 데이터는 무엇이었나?
