# 02. User Entity와 migration

## 이번 챕터 목표

- TypeORM Entity를 직접 설계한다.
- DB 테이블과 TypeScript class의 관계를 이해한다.
- migration을 만들고 실행하는 흐름을 익힌다.

## 먼저 이해할 개념

- Entity: DB 테이블로 매핑되는 class
- Column: 테이블 컬럼
- Primary key: row를 식별하는 값
- Index: 검색과 unique 제약을 위한 DB 구조
- Migration: DB 스키마 변경 이력

## 직접 구현할 파일/기능

- `apps/api/src/users/user.entity.ts`
- `UsersModule`에 `TypeOrmModule.forFeature` 등록
- migration 생성과 실행

## 구현 전에 스스로 답할 질문

- 사용자를 식별하는 값으로 숫자 id와 uuid 중 무엇을 쓸까?
- email은 왜 unique가 필요할까?
- password를 그대로 저장하면 왜 안 될까?
- Entity에 API 응답 형태를 그대로 넣어도 될까?

## 단계별 실습 과제

1. `UserEntity`를 만든다.
2. 최소 컬럼을 설계한다.
   - id
   - email
   - nickname
   - passwordHash
   - createdAt
   - updatedAt
3. `UsersModule`에 repository를 사용할 수 있게 설정한다.
4. DB 컨테이너를 켠다.
5. migration을 생성한다.
6. migration SQL을 읽고 예상한 테이블이 맞는지 확인한다.
7. migration을 실행한다.

## 힌트

- 힌트 1: password 컬럼 이름은 `password`보다 `passwordHash`가 의도를 잘 드러낸다.
- 힌트 2: Entity는 class지만 DB와 연결되므로 decorator가 중요하다.
- 힌트 3: `synchronize: false`이므로 migration을 직접 관리해야 한다.

## 검증 명령과 성공 기준

```bash
pnpm db:up
pnpm --filter api db:migration:generate
pnpm --filter api db:migration:run
pnpm --filter api build
```

성공 기준:

- migration 파일이 생성된다.
- `users` 테이블 생성 SQL을 읽고 이해한다.
- `UserEntity`의 각 필드가 왜 필요한지 설명할 수 있다.

## 나에게 공유할 내용

- Entity 코드
- 생성된 migration에서 핵심 SQL
- uuid, unique index, passwordHash에 대한 네 판단

## 회고 질문

- TypeScript type과 DB schema가 서로 다를 수 있는 지점은 어디일까?
