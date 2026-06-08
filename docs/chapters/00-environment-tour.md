# 00. 환경과 구조 이해

## 이번 챕터 목표

- 현재 모노레포 구조를 설명할 수 있다.
- 프론트, 백엔드, 공통 패키지, 인프라의 역할을 구분한다.
- 앞으로 구현할 코드가 어디에 들어갈지 예측할 수 있다.

## 먼저 이해할 개념

- `pnpm workspace`: 여러 앱과 패키지를 하나의 저장소에서 관리한다.
- `apps/web`: React 클라이언트가 들어간다.
- `apps/api`: NestJS API 서버가 들어간다.
- `packages/shared`: 프론트와 백엔드가 공유할 타입을 둘 수 있다.
- `infra`: PostgreSQL 같은 개발 인프라 설정을 둔다.

## 직접 확인할 파일

- `package.json`
- `pnpm-workspace.yaml`
- `apps/web/package.json`
- `apps/api/package.json`
- `infra/compose.yaml`
- `apps/api/src/app.module.ts`
- `apps/web/src/routes/index.tsx`

## 구현 전에 스스로 답할 질문

- 왜 프론트와 백엔드를 한 폴더에 섞지 않았을까?
- `apps/web`이 API 서버를 직접 알면 안 되는 부분은 무엇일까?
- `packages/shared`에 아무 타입이나 넣어도 될까?
- Docker Compose는 애플리케이션 코드인가, 실행 환경인가?

## 단계별 실습 과제

1. 루트 `package.json`의 script를 읽고 각 명령이 무엇을 실행하는지 적는다.
2. `apps/web`의 의존성 중 React 학습에 중요한 패키지를 표시한다.
3. `apps/api`의 의존성 중 DB와 인증에 관련된 패키지를 표시한다.
4. 현재 앱이 “기준선 상태”라는 것을 설명하는 문장을 직접 쓴다.

## 힌트

- 힌트 1: `--filter web`은 workspace 중 `web` 패키지만 대상으로 실행한다.
- 힌트 2: `TypeOrmModule.forRootAsync`는 DB 연결 설정을 Nest 앱에 연결한다.
- 힌트 3: `src/routes/index.tsx`는 TanStack Router에서 `/` 페이지에 대응한다.

## 검증 명령과 성공 기준

```bash
pnpm build
pnpm --filter api test
```

성공 기준:

- 두 명령이 통과한다.
- 현재는 게시판 도메인 코드가 아직 없다는 점을 설명할 수 있다.

## 나에게 공유할 내용

- 현재 구조를 5문장 안에 요약한다.
- 다음 챕터에서 Users 모듈을 어디에 만들지 말한다.

## 회고 질문

- 모노레포가 처음에는 복잡해 보이지만 장점이 생기는 순간은 언제일까?
