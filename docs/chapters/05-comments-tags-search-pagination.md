# 05. 댓글, 태그, 검색, 페이징

## 이번 챕터 목표

- 게시판 필수 기능을 API 레벨에서 확장한다.
- 댓글, 태그, 검색, 페이징을 각각 분리해서 설계한다.
- Query parameter를 다루는 법을 익힌다.

## 먼저 이해할 개념

- Relation: 게시글, 댓글, 태그 사이의 관계
- Many-to-many: 게시글과 태그 관계
- Pagination: 전체 데이터를 작은 페이지로 나누기
- Search query: 사용자가 입력한 검색 조건
- Filtering: 태그 등 조건으로 목록을 제한하기

## 직접 구현할 파일/기능

- `comments` 모듈과 API
- `tags` 모듈과 API
- 게시글 목록 query parameter
- 검색과 페이징

## 구현 전에 스스로 답할 질문

- 댓글은 게시글 하위 resource로 볼까, 독립 resource로 볼까?
- 태그 이름과 slug를 둘 다 저장할 필요가 있을까?
- 검색은 제목만 할까, 본문까지 할까?
- 페이지 번호 방식과 cursor 방식 중 지금 단계에는 무엇이 적절할까?

## 단계별 실습 과제

1. `CommentEntity`를 만든다.
2. `POST /api/posts/:postId/comments`를 만든다.
3. 댓글 삭제 API를 만든다.
4. `TagEntity`를 만든다.
5. 게시글 작성/수정 시 태그를 함께 저장한다.
6. `GET /api/posts?page=&limit=&search=&tag=` 형태의 목록 조회를 만든다.
7. 응답에 `items`, `page`, `limit`, `total`을 포함한다.

## 힌트

- 힌트 1: 댓글은 Post, User와 각각 `ManyToOne` 관계를 가진다.
- 힌트 2: 태그는 중복 생성을 막기 위해 unique 기준이 필요하다.
- 힌트 3: 페이징은 처음에는 offset 방식으로 충분하다.

## 검증 명령과 성공 기준

```bash
pnpm --filter api build
pnpm --filter api test
```

성공 기준:

- 댓글을 작성하고 게시글 상세에서 볼 수 있다.
- 태그로 게시글을 필터링할 수 있다.
- 검색어로 목록 결과가 줄어든다.
- 페이징 meta가 응답에 포함된다.

## 나에게 공유할 내용

- 댓글 endpoint 설계
- 태그 저장 방식
- 검색과 페이징 query 설계

## 회고 질문

- “목록 API”가 단순 조회보다 복잡해지는 이유는 무엇일까?
