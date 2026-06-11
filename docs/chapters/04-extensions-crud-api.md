# 04. Extensions CRUD API

## 변경 메모: 어디를, 왜, 언제 고치는가

- 어디를 고쳤나: 기존 `posts` / `PostEntity` / `/api/posts` 기준 챕터를 Extendly의 핵심 resource인 `extensions` / `ExtensionEntity` / `/api/extensions` 기준으로 바꾼다.
- 왜 고쳤나: 제품 명세의 중심 데이터는 일반 게시글이 아니라 Chrome, Obsidian, VS Code, Raycast, Notion 익스텐션이다. 프론트도 `ExtensionCard`, 상세 metadata panel, 등록 URL import를 기준으로 설계되므로 백엔드 계약이 먼저 맞아야 한다.
- 어느 시점에 고치나: 새로 구현한다면 지금부터 `extensions`로 만든다. 이미 현재 repo처럼 `posts` 구현이 있다면 정적 프론트 UI는 mock data로 진행해도 되지만, **08장 React 서버 상태에서 실제 API를 연결하기 전에는 반드시 `posts`를 `extensions`로 전환한다.**
- 무엇을 재사용하나: 기존 `posts` 구현의 NestJS module/controller/service 구조, JWT guard, ownership check, soft delete 방식, pagination 패턴은 재사용한다. 단, endpoint와 entity field는 Extendly 명세에 맞춘다.
- 하지 말아야 할 것: 프론트를 임시로 `/api/posts`에 붙이지 않는다. 한번 붙이면 query key, API client, DTO 타입, 화면 field 이름을 다시 고쳐야 한다.

## 이번 챕터 목표

- Extendly의 핵심 resource인 익스텐션 도메인을 직접 설계한다.
- 인증된 사용자만 익스텐션을 등록, 수정, 삭제하게 한다.
- CRUD API의 기본 흐름을 익힌다.
- 이후 MCP, RAG, Agent가 붙을 수 있는 데이터 구조를 준비한다.
- 메인 화면의 카드 뷰와 목록(게시판 보드) 뷰가 함께 쓸 목록 응답 shape를 준비한다.

## 먼저 이해할 개념

- Resource: API에서 다루는 핵심 대상
- CRUD: create, read, update, delete
- Ownership: 등록자만 수정/삭제할 수 있는 규칙
- Enum: `platform`, `status`처럼 허용값이 정해진 필드
- JSONB metadata: MCP 자동수집 원본 정보를 유연하게 담는 필드
- Soft delete: 실제 row를 지우지 않고 삭제 상태로 표시하는 구현 선택지

## Extendly Extension 모델 초안

| 필드 | 타입 | 비고 |
|---|---|---|
| id | uuid | PK |
| title | varchar | 익스텐션 이름 |
| description | text | 설명/본문 |
| platform | enum | `chrome`, `obsidian`, `vscode`, `raycast`, `notion` |
| category | varchar nullable | 생산성, 개발, 글쓰기 등 |
| sourceUrl | varchar | 원본 URL |
| iconUrl | varchar nullable | MCP 수집 또는 수동 입력 |
| rating | float nullable | MCP 수집 |
| version | varchar nullable | MCP 수집 |
| license | varchar nullable | MCP 수집 |
| metadata | jsonb nullable | downloads, stars, permissions, compatibility, fetchedAt 등 |
| isMcpVerified | boolean | MCP 수집 성공 여부 |
| status | enum | `published`, `draft` |
| author | ManyToOne User | 등록자 |
| createdAt / updatedAt | timestamptz | 생성/수정 시각 |
| deletedAt | timestamptz nullable | soft delete를 선택하는 경우 |

`embedding` 컬럼은 RAG 기능을 구현하는 12장에서 추가해도 된다. 지금 04장에서 미리 추가한다면 pgvector 확장, 벡터 차원 수, embedding 모델이 함께 결정되어야 한다.

## 직접 구현할 파일/기능

- `extensions` 모듈, controller, service
- `ExtensionEntity`
- `CreateExtensionDto`, `UpdateExtensionDto`, `FindExtensionsQueryDto`
- 익스텐션 목록 조회
- 익스텐션 상세 조회
- 익스텐션 등록, 수정, 삭제
- 등록자 ownership check

## API 계약 초안

| Method | Path | 인증 | 설명 |
|---|---|---|---|
| GET | `/api/extensions` | public | 목록, 검색, 필터, 페이징 |
| GET | `/api/extensions/:id` | public | 상세 |
| POST | `/api/extensions` | required | 등록 |
| PATCH | `/api/extensions/:id` | required | 수정 |
| DELETE | `/api/extensions/:id` | required | 삭제 |

등록 요청 예시:

```json
{
  "title": "Obsidian Web Clipper",
  "description": "웹 페이지를 Obsidian 노트로 저장하고 태그와 메타데이터를 함께 정리합니다.",
  "platform": "obsidian",
  "category": "productivity",
  "sourceUrl": "https://github.com/example/obsidian-web-clipper",
  "tags": ["notes", "research", "automation"],
  "status": "published"
}
```

MCP 자동수집으로 채워지는 `iconUrl`, `rating`, `version`, `license`, `metadata`, `isMcpVerified`는 13장에서 본격 연결한다. 04장에서는 필드와 DTO 확장 가능성만 열어 둔다.

목록 응답의 각 item은 카드 뷰와 목록 뷰를 모두 지원해야 한다. 카드 뷰에는 `title`, `platform`, `rating`, `description`, `tags`, `isMcpVerified`가 필요하고, 목록(보드) 뷰에는 추가로 `author` 요약, `commentCount`, `createdAt`이 필요하다. `commentCount`는 05장에서 댓글 관계를 붙인 뒤 집계해도 된다.

## 구현 전에 스스로 답할 질문

- 익스텐션의 `description`은 카드 한 줄 설명과 상세 본문을 함께 담당해도 될까?
- `platform`은 문자열로 둘까, enum으로 제한할까?
- `sourceUrl`은 어떤 URL 형식까지 허용할까?
- 삭제는 hard delete와 soft delete 중 무엇이 좋을까?
- 글 수정 시 등록자 확인은 controller와 service 중 어디서 할까?
- MCP 수집 필드는 사용자가 직접 수정할 수 있어야 할까?
- `draft` 상태의 익스텐션은 목록 API에 노출할까?
- 목록 뷰의 작성자, 댓글수, 등록일은 DB column과 relation 중 어디에서 가져와야 할까?

## 단계별 실습 과제

1. 기존 `PostsModule` 구현을 참고하되 새 기준은 `ExtensionsModule`로 잡는다.
2. `ExtensionEntity`를 제품 명세 기준으로 설계한다.
3. platform/status enum을 정의한다.
4. create/update/find DTO를 만든다.
5. migration을 만든다.
6. `POST /api/extensions`를 만든다.
7. `GET /api/extensions`를 만든다.
8. 목록 응답 item에 카드/보드 공통 필드와 `author`, `commentCount`, `createdAt`을 포함할 계획을 세운다.
9. `GET /api/extensions/:id`를 만든다.
10. `PATCH /api/extensions/:id`를 만든다.
11. `DELETE /api/extensions/:id`를 만든다.
12. 등록자만 수정/삭제 가능한지 확인한다.

## 기존 `posts` 구현에서 옮겨 쓸 것

- Controller가 request user를 읽고 service에 `currentUserId`를 넘기는 흐름
- Service에서 실제 DB row의 author id와 현재 user id를 비교하는 ownership check
- `CreateDateColumn`, `UpdateDateColumn`, 선택적 `DeleteDateColumn`
- 목록 조회에서 query builder로 조건을 조립하는 방식
- save 직후 상세 응답을 다시 조회해 일관된 response shape를 만드는 방식

## 힌트

- 힌트 1: Extension은 User와 `ManyToOne` 관계를 가진다.
- 힌트 2: 목록 응답에는 상세 본문 전체보다 카드와 게시판 보드에 필요한 요약 필드를 우선 보낸다.
- 힌트 3: 권한 확인은 service에서 DB 데이터와 현재 사용자를 비교하는 흐름이 자연스럽다.
- 힌트 4: MCP/RAG 필드를 04장에서 모두 완성하려고 하지 말고, 13장과 12장에서 채울 hook을 남긴다.
- 힌트 5: DTO field 이름은 프론트 mock data의 `ExtensionSummary`와 맞추면 API 연결이 쉬워진다.

## 검증 명령과 성공 기준

```bash
pnpm --filter api build
pnpm --filter api test
```

성공 기준:

- 인증 token 없이 등록 API가 실패한다.
- 등록자는 자신의 익스텐션을 수정할 수 있다.
- 다른 사용자는 수정/삭제할 수 없다.
- 목록과 상세 응답의 차이를 설명할 수 있다.
- 목록 응답 item이 카드 뷰와 목록 뷰에 필요한 필드를 모두 포함한다.
- `/api/posts`가 아니라 `/api/extensions` 계약을 기준으로 프론트 API client를 설계할 수 있다.

## 나에게 공유할 내용

- `ExtensionEntity` 설계
- CRUD endpoint 목록
- 기존 `posts` 구현에서 재사용한 패턴
- 등록자 권한 확인 방식
- 실제 코드 전환을 언제 할지: “08장 API 연결 전”이라고 명시

## 회고 질문

- CRUD를 만들 때 가장 먼저 안정적으로 설계해야 하는 규칙은 무엇이었나?
- `Post`에서 `Extension`으로 바꾸며 단순 이름 변경이 아니라 데이터 계약 변경이 된 부분은 무엇이었나?
