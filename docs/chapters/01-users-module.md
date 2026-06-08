# 01. Users 모듈 만들기

## 이번 챕터 목표

- NestJS의 module, controller, service 역할을 구분한다.
- `users` 도메인의 첫 구조를 직접 만든다.
- 아직 DB 저장은 하지 않고, 모듈 경계부터 익힌다.

## 먼저 이해할 개념

- Module: 관련 provider와 controller를 묶는다.
- Controller: HTTP 요청을 받는다.
- Service: 비즈니스 로직을 담당한다.
- Provider: Nest의 dependency injection 대상이다.

## 직접 구현할 파일/기능

- `apps/api/src/users/users.module.ts`
- `apps/api/src/users/users.controller.ts`
- `apps/api/src/users/users.service.ts`
- `apps/api/src/app.module.ts`에 `UsersModule` 등록

## 구현 전에 스스로 답할 질문

- 사용자를 다루는 HTTP 요청은 controller와 service 중 어디에 있어야 할까?
- service를 controller 안에서 직접 `new`로 만들지 않는 이유는 무엇일까?
- module을 만드는 것이 단순히 폴더를 만드는 것과 어떻게 다를까?

## 단계별 실습 과제

1. `apps/api/src/users` 디렉터리를 만든다.
2. `UsersModule`을 만든다.
3. `UsersService`를 만들고 임시로 사용자 목록을 반환하는 메서드를 둔다.
4. `UsersController`를 만들고 `GET /api/users`가 service를 호출하게 한다.
5. `AppModule`에 `UsersModule`을 등록한다.

## 힌트

- 힌트 1: `@Module({ controllers: [], providers: [] })` 구조를 떠올린다.
- 힌트 2: controller 생성자에서 service를 주입받는다.
- 힌트 3: 전역 prefix가 `api`이므로 `@Controller('users')`는 `/api/users`가 된다.

## 검증 명령과 성공 기준

```bash
pnpm --filter api build
pnpm --filter api test
```

가능하면 서버를 켜고 확인한다.

```bash
pnpm dev:api
curl http://localhost:3000/api/users
```

성공 기준:

- API 서버가 빌드된다.
- `GET /api/users`가 임시 데이터를 반환한다.
- controller와 service의 책임을 말로 설명할 수 있다.

## 나에게 공유할 내용

- `UsersController`가 직접 데이터를 만들지 않고 service를 부르는 이유를 설명한다.
- `UsersModule`에 무엇을 등록했는지 보여준다.

## 회고 질문

- NestJS에서 폴더 구조와 module 구조는 왜 함께 생각해야 할까?
