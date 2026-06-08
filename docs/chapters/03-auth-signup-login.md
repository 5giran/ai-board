# 03. 회원가입과 로그인

## 이번 챕터 목표

- 회원가입과 로그인 API를 직접 구현한다.
- DTO와 validation을 사용한다.
- 비밀번호 hashing과 JWT 발급 흐름을 이해한다.

## 먼저 이해할 개념

- DTO: 요청 body의 모양을 표현한다.
- ValidationPipe: 들어온 데이터를 검증하고 필요한 값만 통과시킨다.
- Hashing: 비밀번호 원문을 저장하지 않기 위한 처리
- JWT: 로그인 이후 사용자를 식별하는 token
- Guard: 인증이 필요한 요청을 보호한다.

## 직접 구현할 파일/기능

- `auth` 모듈, controller, service
- `CreateUserDto`
- `LoginDto`
- 회원가입 API
- 로그인 API
- JWT access token 발급
- 내 정보 조회 API 초안

## 구현 전에 스스로 답할 질문

- 회원가입은 `users` 책임일까, `auth` 책임일까?
- DTO에서 email, nickname, password는 어떤 검증이 필요할까?
- 로그인 실패는 어떤 HTTP status가 적절할까?
- JWT payload에는 무엇을 넣고 무엇을 넣지 말아야 할까?

## 단계별 실습 과제

1. `AuthModule`을 만든다.
2. `AuthController`에 `POST /api/auth/signup`, `POST /api/auth/login`을 만든다.
3. DTO를 만들고 validation decorator를 붙인다.
4. `UsersService`에 email/nickname 중복 확인과 사용자 생성 메서드를 만든다.
5. `argon2`로 비밀번호를 hash한다.
6. 로그인 시 hash 검증 후 JWT를 발급한다.
7. 응답에서 `passwordHash`가 절대 나가지 않게 한다.

## 힌트

- 힌트 1: 회원가입은 사용자 생성과 인증 시작이 섞여 있으므로 service 역할 분리가 중요하다.
- 힌트 2: `JwtService.signAsync`를 사용하면 token 생성을 service에 둘 수 있다.
- 힌트 3: API 응답 타입은 Entity 그대로보다 별도 객체로 만드는 편이 안전하다.

## 검증 명령과 성공 기준

```bash
pnpm --filter api build
pnpm --filter api test
```

수동 검증:

```bash
curl -X POST http://localhost:3000/api/auth/signup
curl -X POST http://localhost:3000/api/auth/login
```

성공 기준:

- 회원가입이 사용자를 생성한다.
- 같은 email은 중복 가입되지 않는다.
- 로그인 성공 시 access token을 받는다.
- 잘못된 비밀번호는 실패한다.

## 나에게 공유할 내용

- DTO 설계
- AuthService와 UsersService 책임 분리
- JWT payload에 넣은 값

## 회고 질문

- 인증 기능에서 “동작함”보다 “안전함”이 중요한 순간은 어디일까?
