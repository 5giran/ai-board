# 05. Extension 댓글, 태그, 북마크, 검색, 페이징

## 변경 메모: 어디를, 왜, 언제 고치는가

- 어디를 고쳤나: 기존 게시글 하위 댓글/태그/검색 API를 익스텐션 하위 댓글, 익스텐션 태그, 플랫폼 필터, 북마크, 검색/페이징 API 기준으로 바꾼다.
- 왜 고쳤나: Extendly UI는 익스텐션 상세의 댓글, 카드의 태그, 플랫폼 필터, 마이페이지 북마크 탭을 전제로 한다. 따라서 댓글과 태그도 `Post`가 아니라 `Extension`에 연결되어야 한다.
- 어느 시점에 고치나: 04장에서 `ExtensionEntity`가 생긴 직후 이어서 고친다. 이미 `CommentEntity.post` / `post_tags` 구현이 있다면, **프론트 상세 화면과 서버 상태를 실제 API에 연결하기 전** `CommentEntity.extension`, `extension_tags`, `/api/extensions/:id/comments`로 전환한다.
- 무엇을 나중으로 미루나: RAG의 의미 기반 `matchScore` 정렬은 12장에서 구현한다. MCP로 채우는 downloads/stars 기반 인기 정렬은 13장 이후 정확도가 좋아진다. 05장에서는 일반 검색, 플랫폼 필터, 태그 필터, offset pagination을 먼저 안정화한다.

## 이번 챕터 목표

- Extendly 필수 기능을 API 레벨에서 확장한다.
- 댓글, 태그, 북마크, 검색, 페이징을 각각 분리해서 설계한다.
- Query parameter를 다루는 법을 익힌다.
- 프론트의 메인 검색, 상세 댓글, 마이페이지 탭이 기대하는 API shape를 준비한다.

## 먼저 이해할 개념

- Relation: 익스텐션, 댓글, 태그, 사용자 사이의 관계
- Many-to-many: 익스텐션과 태그 관계
- Composite key: bookmark처럼 userId + extensionId가 한 쌍으로 고유한 관계
- Pagination: 전체 데이터를 작은 페이지로 나누기
- Search query: 사용자가 입력한 검색 조건
- Filtering: platform, tag 등 조건으로 목록을 제한하기
- Sorting: 인기, 최신, 평점, 관련도 같은 정렬 기준

## 직접 구현할 파일/기능

- `comments` 모듈과 API
- `tags` 모듈과 API
- `bookmarks` 또는 `me` 관련 API
- 익스텐션 목록 query parameter
- 검색, 플랫폼 필터, 태그 필터, 정렬, 페이징
- 상세 응답에 필요한 댓글/태그/metadata 포함 전략

## API 계약 초안

| Method | Path | 인증 | 설명 |
|---|---|---|---|
| GET | `/api/extensions?page=&limit=&q=&platform=&tag=&sort=` | public | 목록 검색/필터/정렬/페이징 |
| GET | `/api/extensions/:id/comments` | public | 댓글 목록 |
| POST | `/api/extensions/:id/comments` | required | 댓글 작성 |
| DELETE | `/api/comments/:id` | required | 댓글 삭제 |
| GET | `/api/me/bookmarks` | required | 내 북마크 목록 |
| POST | `/api/extensions/:id/bookmark` | required | 북마크 toggle |

목록 query 예시:

```txt
GET /api/extensions?page=1&limit=12&q=github&platform=raycast&tag=productivity&sort=recent
```

목록 응답 예시:

```json
{
  "items": [],
  "page": 1,
  "limit": 12,
  "total": 0,
  "totalPages": 0
}
```

## 구현 전에 스스로 답할 질문

- 댓글은 익스텐션 하위 resource로 볼까, 독립 resource로 볼까?
- 댓글 삭제 endpoint는 `/extensions/:id/comments/:commentId`와 `/comments/:id` 중 어느 쪽이 더 단순할까?
- 태그 이름과 slug를 둘 다 저장할 필요가 있을까?
- 검색은 title만 할까, description과 tags까지 포함할까?
- platform 필터는 enum으로 검증할까?
- 북마크 toggle은 POST 하나로 처리할까, POST/DELETE를 분리할까?
- 페이지 번호 방식과 cursor 방식 중 지금 단계에는 무엇이 적절할까?

## 단계별 실습 과제

1. `CommentEntity`가 `ExtensionEntity`, `UserEntity`와 `ManyToOne` 관계를 갖도록 설계한다.
2. `GET /api/extensions/:id/comments`를 만든다.
3. `POST /api/extensions/:id/comments`를 만든다.
4. `DELETE /api/comments/:id`를 만든다.
5. `TagEntity`를 만들거나 기존 태그 구현을 `extensions` 기준으로 전환한다.
6. `extension_tags` join table을 설계한다.
7. 익스텐션 작성/수정 시 태그를 함께 저장한다.
8. `BookmarkEntity`를 `userId + extensionId` 복합 unique 기준으로 설계한다.
9. `POST /api/extensions/:id/bookmark` toggle API를 만든다.
10. `GET /api/me/bookmarks`를 만든다.
11. `GET /api/extensions?page=&limit=&q=&platform=&tag=&sort=` 형태의 목록 조회를 만든다.
12. 응답에 `items`, `page`, `limit`, `total`, `totalPages`를 포함한다.

## 검색/필터/정렬 기준

- `q`: title, description, tags.name을 대상으로 일반 키워드 검색한다.
- `platform`: `chrome`, `obsidian`, `vscode`, `raycast`, `notion` 중 하나로 제한한다.
- `tag`: tag slug 또는 name으로 필터링한다.
- `sort=recent`: `createdAt` 또는 `updatedAt` 최신순.
- `sort=popular`: bookmarks, rating, downloads 중 현재 구현 가능한 값을 기준으로 한다. MCP 이전에는 bookmarks 또는 rating 우선으로 단순화해도 된다.
- `sort=match`: 05장에서는 일반 검색 관련도 정도로만 처리하거나 지원하지 않아도 된다. 진짜 의미 기반 match score는 12장 RAG에서 구현한다.

## 기존 `posts` 구현에서 옮겨 쓸 것

- `CommentEntity`의 author 관계와 삭제 권한 확인 흐름
- `TagsService.findOrCreateMany()`처럼 태그를 재사용하거나 생성하는 흐름
- many-to-many join이 pagination을 흔들지 않도록 id를 먼저 조회한 뒤 관계를 다시 불러오는 패턴
- `FindPostsQueryDto`의 page/limit validation 구조

## 힌트

- 힌트 1: 댓글은 Extension, User와 각각 `ManyToOne` 관계를 가진다.
- 힌트 2: 태그는 중복 생성을 막기 위해 unique 기준이 필요하다.
- 힌트 3: 페이징은 처음에는 offset 방식으로 충분하다.
- 힌트 4: 프론트 카드에 필요한 tags, bookmark count, rating, platform은 목록 응답에서 바로 쓰기 좋게 내려준다.
- 힌트 5: 댓글 작성/삭제는 상세 페이지 query와 연결되므로 mutation 후 `['comments', extensionId]`를 갱신하기 쉽게 응답을 설계한다.

## 검증 명령과 성공 기준

```bash
pnpm --filter api build
pnpm --filter api test
```

성공 기준:

- 댓글을 작성하고 익스텐션 상세에서 볼 수 있다.
- 태그로 익스텐션을 필터링할 수 있다.
- platform 필터로 목록 결과가 줄어든다.
- 검색어로 목록 결과가 줄어든다.
- 페이징 meta가 응답에 포함된다.
- 북마크 toggle 후 내 북마크 목록에서 확인할 수 있다.
- `CommentEntity`와 `TagEntity`가 `Post`가 아니라 `Extension`에 연결된다.

## 나에게 공유할 내용

- 댓글 endpoint 설계
- 태그 저장 방식
- 북마크 저장 방식
- 검색과 페이징 query 설계
- 기존 `posts` 기반 구현에서 어떤 파일을 `extensions` 기준으로 바꿔야 하는지
- 실제 코드 전환을 언제 할지: “프론트 API 연결 전, 늦어도 08장 시작 전”이라고 명시

## 회고 질문

- “목록 API”가 단순 조회보다 복잡해지는 이유는 무엇일까?
- UI 필터가 늘어날수록 backend query DTO와 response shape를 먼저 정해야 하는 이유는 무엇일까?
