# Backend 04-05 Implementation Notes

이 문서는 4장 Posts CRUD와 5장 Comments, Tags, Search, Pagination 구현을 나중에 다시 읽고 이해하기 위한 학습 노트입니다.

목표는 "코드가 어디에 있는지"보다 "요청이 들어왔을 때 어떤 객체와 계층을 지나며 처리되는지"를 이해하는 것입니다.

## 1. 지금까지의 백엔드 흐름 복습

### Users 흐름

`UsersModule`은 사용자 테이블을 다루기 위해 `TypeOrmModule.forFeature([UserEntity])`를 등록합니다.

`UsersService`는 `Repository<UserEntity>`를 주입받아 users 테이블을 조회하거나 저장합니다.

주요 역할:

- `findByEmail(email)`: 로그인과 회원가입 중복 검사에서 사용
- `findByNickname(nickname)`: 회원가입 닉네임 중복 검사에서 사용
- `createUser(email, nickname, passwordHash)`: 해시된 비밀번호를 가진 사용자 생성

주의할 점:

`UserEntity`에는 `passwordHash`가 있습니다. 이 값은 절대 API 응답으로 그대로 나가면 안 됩니다. 그래서 Auth/Posts/Comments 응답은 항상 필요한 필드만 직접 골라 반환합니다.

### Auth 흐름

`AuthService.signup()`은 다음 순서로 동작합니다.

1. 이메일 중복 확인
2. 닉네임 중복 확인
3. 비밀번호를 `argon2.hash()`로 해시
4. `UsersService.createUser()`로 사용자 저장
5. 응답에는 `id`, `email`, `nickname`, `createAt`만 반환

`AuthService.login()`은 다음 순서로 동작합니다.

1. 이메일로 사용자 조회
2. 사용자가 없으면 `UnauthorizedException`
3. `argon2.verify()`로 비밀번호 검증
4. JWT payload를 `{ sub: user.id, email: user.email }` 형태로 생성
5. `accessToken` 반환

여기서 `sub`는 JWT에서 subject, 즉 토큰의 주체를 뜻하는 관용적인 필드입니다. 우리 앱에서는 `user.id`를 넣었습니다.

### JWT Guard 흐름

`JwtAuthGuard`는 `@UseGuards(JwtAuthGuard)`가 붙은 Controller 메서드 앞에서 실행됩니다.

요청 헤더는 아래 형태여야 합니다.

```http
Authorization: Bearer <accessToken>
```

Guard의 처리 순서:

1. `Authorization` 헤더를 읽는다.
2. `Bearer` 형식인지 확인한다.
3. JWT를 검증한다.
4. payload의 `{ sub, email }`을 앱에서 쓰기 쉬운 `{ id, email }`로 바꾼다.
5. `request.user = { id, email }`을 넣는다.

그래서 Controller에서는 아래처럼 현재 로그인 사용자의 id를 꺼낼 수 있습니다.

```ts
request.user.id
```

## 2. PostsController와 PostsService 역할

### Controller 역할

Controller는 HTTP 입구입니다.

담당하는 것:

- URL과 HTTP method 연결
- `@Body()`, `@Param()`, `@Query()`, `@Req()`로 요청 데이터 꺼내기
- `ParseUUIDPipe`로 URL id 검증
- `@UseGuards(JwtAuthGuard)`로 인증이 필요한 API 표시
- Service 호출

예를 들어 게시글 수정 요청은 다음 경로로 들어옵니다.

```http
PATCH /api/posts/:id
Authorization: Bearer <token>
Content-Type: application/json
```

Controller는 `id`, `body`, `request.user.id`를 꺼내 `PostsService.update(id, dto, currentUserId)`로 넘깁니다.

### Service 역할

Service는 비즈니스 규칙과 DB 처리를 담당합니다.

담당하는 것:

- Repository로 DB 조회/저장
- 게시글이 없으면 `NotFoundException`
- 작성자가 아니면 `ForbiddenException`
- 태그 저장 및 연결
- soft delete 처리
- Entity를 응답 객체로 변환
- 민감 정보가 응답에 섞이지 않게 필드 제한

중요한 판단:

작성자 확인, ownership check는 Controller가 아니라 Service에 있습니다.

이유는 "작성자만 수정/삭제 가능"이 HTTP 라우트 규칙이 아니라 데이터 규칙이기 때문입니다. 나중에 관리자용 Controller, 테스트 코드, 내부 배치 작업 등이 같은 Service를 호출해도 권한 규칙이 한 곳에서 유지됩니다.

## 3. Entity 관계 정리

### PostEntity

`PostEntity`는 게시글 테이블 `posts`에 대응합니다.

주요 필드:

- `id`: uuid primary key
- `title`: 제목
- `content`: 본문
- `author`: 작성자
- `comments`: 댓글 목록
- `tags`: 태그 목록
- `createdAt`, `updatedAt`, `deletedAt`

`deletedAt`은 soft delete를 위한 컬럼입니다. 삭제 시 행을 실제로 지우는 대신 `deleted_at`에 시간이 기록됩니다.

### 게시글과 사용자 관계

게시글 여러 개는 사용자 한 명에게 속합니다.

관계:

- 게시글 -> 사용자: `ManyToOne`
- DB 컬럼: `posts.author_id`
- 용어: 외래 키, foreign key

`@JoinColumn({ name: 'author_id' })`는 이 관계를 저장할 실제 DB 컬럼 이름을 지정합니다.

### CommentEntity

`CommentEntity`는 댓글 테이블 `comments`에 대응합니다.

주요 필드:

- `id`
- `content`
- `post`
- `author`
- `createdAt`, `updatedAt`, `deletedAt`

댓글은 두 개의 `ManyToOne` 관계를 가집니다.

1. 댓글 여러 개가 게시글 하나에 속함
2. 댓글 여러 개가 사용자 하나에 속함

DB에는 아래 외래 키가 생깁니다.

- `comments.post_id -> posts.id`
- `comments.author_id -> users.id`

댓글도 soft delete를 사용합니다. 댓글 삭제 API를 호출하면 댓글 행이 없어지는 것이 아니라 `deleted_at`이 채워집니다.

### 게시글과 댓글 관계

게시글 기준:

- 게시글 하나는 댓글 여러 개를 가질 수 있음
- `PostEntity.comments`는 `OneToMany`

댓글 기준:

- 댓글 하나는 게시글 하나에 속함
- `CommentEntity.post`는 `ManyToOne`

실제 외래 키는 `comments.post_id`에 있습니다. `PostEntity.comments`는 역방향으로 댓글 목록을 읽기 위한 관계입니다.

### TagEntity

`TagEntity`는 태그 테이블 `tags`에 대응합니다.

주요 필드:

- `id`
- `name`: 사람이 보는 태그 이름
- `slug`: URL/query에서 쓰기 쉬운 태그 식별자
- `createdAt`

중복 방지:

- `name` unique
- `slug` unique

예:

- name: `Nest JS`
- slug: `nest-js`

### 게시글과 태그 many-to-many 관계

게시글과 태그는 다대다 관계, many-to-many입니다.

의미:

- 게시글 하나는 태그 여러 개를 가질 수 있음
- 태그 하나는 게시글 여러 개에 붙을 수 있음

관계형 DB에서는 many-to-many를 바로 저장하지 않고 중간 연결 테이블, join table을 둡니다.

이번 구현의 join table:

- 테이블 이름: `post_tags`
- 컬럼: `post_id`, `tag_id`
- primary key: `(post_id, tag_id)`

`@JoinTable()`은 이 연결 테이블을 어느 쪽 Entity가 소유할지 정합니다. 양쪽에 모두 쓰면 안 되고 한쪽에만 써야 합니다. 이번에는 게시글 작성/수정 시 태그를 붙이므로 `PostEntity.tags`에 `@JoinTable()`을 두었습니다.

## 4. 게시글 작성 시 태그 저장 흐름

요청 예:

```http
POST /api/posts
Authorization: Bearer <token>
Content-Type: application/json
```

```json
{
  "title": "NestJS 관계 학습",
  "content": "댓글과 태그를 연결해 본다.",
  "tags": ["nestjs", "typeorm", "backend"]
}
```

처리 흐름:

1. `JwtAuthGuard`가 토큰을 검증한다.
2. `request.user = { id, email }`을 만든다.
3. `PostsController.create()`가 body와 `request.user.id`를 꺼낸다.
4. `CreatePostDto`가 title/content/tags를 검증한다.
5. `PostsService.create()`가 호출된다.
6. `TagsService.findOrCreateMany(tags)`가 실행된다.
7. 이미 존재하는 태그는 재사용한다.
8. 없는 태그는 새로 생성한다.
9. `PostEntity`를 생성하면서 author와 tags를 연결한다.
10. TypeORM이 `posts`와 `post_tags`에 데이터를 저장한다.
11. `findOne()`으로 다시 조회해서 author, tags, comments가 포함된 응답을 만든다.

응답 예:

```json
{
  "id": "post-uuid",
  "title": "NestJS 관계 학습",
  "content": "댓글과 태그를 연결해 본다.",
  "createdAt": "2026-06-11T00:00:00.000Z",
  "updatedAt": "2026-06-11T00:00:00.000Z",
  "author": {
    "id": "user-uuid",
    "nickname": "ran"
  },
  "tags": [
    {
      "id": "tag-uuid",
      "name": "nestjs",
      "slug": "nestjs"
    }
  ],
  "comments": []
}
```

## 5. 게시글 상세 조회 흐름

요청:

```http
GET /api/posts/:id
```

인증은 필요 없습니다. 공개 API입니다.

처리 흐름:

1. `PostsController.findOne()`이 `ParseUUIDPipe`로 id 형식을 검증한다.
2. `PostsService.findOne(id)`가 실행된다.
3. `PostEntity`를 author, tags, comments.author 관계와 함께 조회한다.
4. 게시글이 없으면 `NotFoundException`
5. 응답 객체로 직접 변환한다.

중요:

응답 author에는 `id`, `nickname`만 들어갑니다. `UserEntity.passwordHash`는 select에도 포함하지 않고, 응답 변환에서도 포함하지 않습니다.

상세 응답에는 댓글 목록도 포함됩니다.

```json
{
  "id": "post-uuid",
  "title": "NestJS 관계 학습",
  "content": "댓글과 태그를 연결해 본다.",
  "author": {
    "id": "user-uuid",
    "nickname": "ran"
  },
  "tags": [
    {
      "id": "tag-uuid",
      "name": "nestjs",
      "slug": "nestjs"
    }
  ],
  "comments": [
    {
      "id": "comment-uuid",
      "content": "좋은 정리입니다.",
      "createdAt": "2026-06-11T00:00:00.000Z",
      "updatedAt": "2026-06-11T00:00:00.000Z",
      "author": {
        "id": "user-uuid",
        "nickname": "ran"
      }
    }
  ],
  "createdAt": "2026-06-11T00:00:00.000Z",
  "updatedAt": "2026-06-11T00:00:00.000Z"
}
```

## 6. 댓글 작성/삭제 권한 흐름

### 댓글 작성

요청:

```http
POST /api/posts/:postId/comments
Authorization: Bearer <token>
Content-Type: application/json
```

```json
{
  "content": "댓글 내용입니다."
}
```

처리 흐름:

1. JWT Guard가 로그인 여부를 확인한다.
2. `CreateCommentDto`가 content를 검증한다.
3. `CommentsService.create(postId, dto, authorId)`가 실행된다.
4. 게시글이 존재하는지 확인한다.
5. 댓글을 저장한다.
6. 응답에는 댓글 작성자의 `id`, `nickname`만 포함한다.

### 댓글 삭제

요청:

```http
DELETE /api/posts/:postId/comments/:commentId
Authorization: Bearer <token>
```

처리 흐름:

1. JWT Guard가 로그인 여부를 확인한다.
2. URL의 `postId`, `commentId`를 `ParseUUIDPipe`로 검증한다.
3. 댓글을 조회한다.
4. 댓글이 없으면 `NotFoundException`
5. `comment.author.id !== currentUserId`이면 `ForbiddenException`
6. 작성자가 맞으면 soft delete
7. 성공 응답은 `204 No Content`

권한 확인이 Service에 있는 이유:

댓글 삭제 권한은 HTTP 요청 모양이 아니라 댓글 데이터의 규칙입니다. Controller에 넣으면 다른 진입점에서 같은 규칙을 잊을 수 있습니다. Service에 넣으면 항상 같은 기준으로 보호됩니다.

## 7. 게시글 목록 검색, 태그 필터, 페이지네이션

요청:

```http
GET /api/posts?page=1&limit=10&search=nestjs&tag=backend
```

지원 query parameter:

- `page`: 1부터 시작하는 페이지 번호
- `limit`: 한 페이지에 가져올 게시글 수, 최대 50
- `search`: 제목 또는 본문 검색어
- `tag`: 태그 slug 또는 name

응답 형태:

```json
{
  "items": [
    {
      "id": "post-uuid",
      "title": "NestJS 관계 학습",
      "content": "댓글과 태그를 연결해 본다.",
      "createdAt": "2026-06-11T00:00:00.000Z",
      "updatedAt": "2026-06-11T00:00:00.000Z",
      "author": {
        "id": "user-uuid",
        "nickname": "ran"
      },
      "tags": [
        {
          "id": "tag-uuid",
          "name": "backend",
          "slug": "backend"
        }
      ]
    }
  ],
  "page": 1,
  "limit": 10,
  "total": 1,
  "totalPages": 1
}
```

### Query parameter와 DTO 처리

HTTP query parameter는 기본적으로 문자열입니다.

예를 들어 `?page=2&limit=10`은 처음에는 아래처럼 들어옵니다.

```ts
{
  page: "2",
  limit: "10"
}
```

`FindPostsQueryDto`에서는 `@Transform()`을 사용해 문자열을 숫자로 바꿉니다.

```ts
@Transform(({ value }) => (value === undefined ? 1 : Number(value)))
@IsInt()
@Min(1)
page = 1;
```

`main.ts`의 `ValidationPipe({ transform: true })`가 켜져 있기 때문에 DTO transform과 validation이 함께 동작합니다.

### offset pagination

이번 구현은 offset pagination입니다.

계산:

```ts
offset = (page - 1) * limit
```

예:

- page=1, limit=10 -> offset=0
- page=2, limit=10 -> offset=10
- page=3, limit=10 -> offset=20

장점:

- 이해하기 쉽다.
- 프론트에서 페이지 버튼 UI를 만들기 쉽다.
- `total`, `totalPages`와 잘 어울린다.

단점:

- 데이터가 아주 많아지면 뒤 페이지로 갈수록 느려질 수 있다.
- 실시간으로 데이터가 추가/삭제되면 페이지 경계가 흔들릴 수 있다.

지금 학습 단계에서는 offset 방식이 충분합니다.

### search 조건

`search`는 제목과 본문에 모두 적용됩니다.

SQL 관점:

```sql
post.title ILIKE '%검색어%'
OR post.content ILIKE '%검색어%'
```

`ILIKE`는 PostgreSQL에서 대소문자를 덜 엄격하게 비교하는 검색 연산자입니다.

코드에서는 `Brackets`를 사용해 OR 조건을 괄호로 묶습니다.

```sql
AND (title ILIKE ... OR content ILIKE ...)
```

이렇게 해야 다른 조건, 예를 들어 tag 필터와 섞였을 때 의도한 조건식이 됩니다.

### tag 필터 기준

프론트엔드에서는 `slug` 사용을 권장합니다.

예:

```http
GET /api/posts?tag=nestjs
```

하지만 학습과 수동 테스트 편의를 위해 `name`도 함께 허용했습니다.

예:

```http
GET /api/posts?tag=NestJS
```

Service에서는 입력값을 slug로 변환한 값과 원래 name을 함께 비교합니다.

```sql
filterTag.slug = :tagSlug
OR filterTag.name = :tagName
```

## 8. 왜 목록 API가 단순 조회보다 복잡한가

단순 상세 조회는 보통 id 하나로 끝납니다.

```http
GET /api/posts/:id
```

하지만 목록 API는 사용자의 화면 상태가 많이 섞입니다.

예:

- 몇 번째 페이지인가?
- 한 페이지에 몇 개를 보여줄 것인가?
- 검색어가 있는가?
- 특정 태그만 볼 것인가?
- 최신순 정렬인가?
- 전체 결과 개수는 몇 개인가?

그래서 목록 API는 단순히 `find()`만 호출하기보다 조건을 조립해야 합니다. 이번 구현에서 `QueryBuilder`를 쓴 이유도 여기에 있습니다.

또 many-to-many 관계인 태그를 join하면 게시글 하나가 태그 개수만큼 중복 행으로 보일 수 있습니다. 그래서 이번 구현은 먼저 조건에 맞는 post id 목록을 distinct로 구하고, 그 id들로 다시 author/tags를 조회합니다. 이 방식은 페이지네이션 결과가 태그 join 중복 때문에 흔들리는 일을 줄입니다.

## 9. 프론트엔드에서 사용할 API 목록

### 회원가입

```http
POST /api/auth/signup
Content-Type: application/json
```

```json
{
  "email": "ran@example.com",
  "nickname": "ran",
  "password": "password123"
}
```

### 로그인

```http
POST /api/auth/login
Content-Type: application/json
```

```json
{
  "email": "ran@example.com",
  "password": "password123"
}
```

응답:

```json
{
  "accessToken": "jwt-token"
}
```

### 게시글 작성

```http
POST /api/posts
Authorization: Bearer <accessToken>
Content-Type: application/json
```

```json
{
  "title": "첫 게시글",
  "content": "본문입니다.",
  "tags": ["nestjs", "typeorm"]
}
```

### 게시글 목록

```http
GET /api/posts?page=1&limit=10
```

검색:

```http
GET /api/posts?page=1&limit=10&search=typeorm
```

태그 필터:

```http
GET /api/posts?page=1&limit=10&tag=nestjs
```

검색과 태그 필터 함께 사용:

```http
GET /api/posts?page=1&limit=10&search=relation&tag=backend
```

### 게시글 상세

```http
GET /api/posts/:id
```

상세 응답에는 `tags`와 `comments`가 포함됩니다.

### 게시글 수정

```http
PATCH /api/posts/:id
Authorization: Bearer <accessToken>
Content-Type: application/json
```

```json
{
  "title": "수정된 제목",
  "content": "수정된 본문",
  "tags": ["nestjs", "backend"]
}
```

태그를 수정하지 않으려면 `tags` 필드를 보내지 않습니다.

```json
{
  "title": "제목만 수정"
}
```

태그를 모두 제거하려면 빈 배열을 보냅니다.

```json
{
  "tags": []
}
```

### 게시글 삭제

```http
DELETE /api/posts/:id
Authorization: Bearer <accessToken>
```

성공 시:

```http
204 No Content
```

### 댓글 작성

```http
POST /api/posts/:postId/comments
Authorization: Bearer <accessToken>
Content-Type: application/json
```

```json
{
  "content": "댓글입니다."
}
```

### 댓글 삭제

```http
DELETE /api/posts/:postId/comments/:commentId
Authorization: Bearer <accessToken>
```

성공 시:

```http
204 No Content
```

## 10. migration 결과

TypeORM generate로 생성된 migration은 다음 구조를 만듭니다.

- `tags`
  - `id`
  - `name`
  - `slug`
  - `created_at`
  - unique: `name`
  - unique: `slug`
- `comments`
  - `id`
  - `content`
  - `created_at`
  - `updated_at`
  - `deleted_at`
  - `post_id`
  - `author_id`
- `post_tags`
  - `post_id`
  - `tag_id`
  - primary key: `(post_id, tag_id)`
  - index: `post_id`
  - index: `tag_id`

기존 migration은 수정하지 않았고, 새 Entity 변경 사항에 대한 migration만 추가했습니다.
