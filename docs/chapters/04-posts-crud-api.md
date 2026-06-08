# 04. 게시글 CRUD API

## 이번 챕터 목표

- 게시글 도메인을 직접 설계한다.
- 인증된 사용자만 글을 작성, 수정, 삭제하게 한다.
- CRUD API의 기본 흐름을 익힌다.

## 먼저 이해할 개념

- Resource: API에서 다루는 핵심 대상
- CRUD: create, read, update, delete
- Ownership: 작성자만 수정/삭제할 수 있는 규칙
- Soft delete: 실제 row를 지우지 않고 삭제 상태로 표시

## 직접 구현할 파일/기능

- `posts` 모듈, controller, service
- `PostEntity`
- create/update DTO
- 게시글 목록 조회
- 게시글 상세 조회
- 게시글 작성, 수정, 삭제

## 구현 전에 스스로 답할 질문

- 게시글 제목과 본문은 어느 길이까지 허용할까?
- 삭제는 hard delete와 soft delete 중 무엇이 좋을까?
- 글 수정 시 작성자 확인은 controller와 service 중 어디서 할까?
- 목록 API와 상세 API 응답은 같아야 할까?

## 단계별 실습 과제

1. `PostsModule`을 만든다.
2. `PostEntity`를 설계한다.
3. migration을 만든다.
4. `POST /api/posts`를 만든다.
5. `GET /api/posts`를 만든다.
6. `GET /api/posts/:id`를 만든다.
7. `PATCH /api/posts/:id`를 만든다.
8. `DELETE /api/posts/:id`를 만든다.
9. 작성자만 수정/삭제 가능한지 확인한다.

## 힌트

- 힌트 1: Post는 User와 `ManyToOne` 관계를 가진다.
- 힌트 2: 목록 응답에는 본문 전체보다 excerpt 또는 일부 필드만 보내도 된다.
- 힌트 3: 권한 확인은 service에서 DB 데이터와 현재 사용자를 비교하는 흐름이 자연스럽다.

## 검증 명령과 성공 기준

```bash
pnpm --filter api build
pnpm --filter api test
```

성공 기준:

- 인증 token 없이 작성 API가 실패한다.
- 작성자는 자신의 글을 수정할 수 있다.
- 다른 사용자는 수정/삭제할 수 없다.
- 목록과 상세 응답의 차이를 설명할 수 있다.

## 나에게 공유할 내용

- PostEntity 설계
- CRUD endpoint 목록
- 작성자 권한 확인 방식

## 회고 질문

- CRUD를 만들 때 가장 먼저 안정적으로 설계해야 하는 규칙은 무엇이었나?
