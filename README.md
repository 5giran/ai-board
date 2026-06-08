# AI Board

React, NestJS, TypeORM, PostgreSQL 기반 AI 게시판 과제 프로젝트입니다.

## Stack

- Frontend: React, Vite, TypeScript, TanStack Router, TanStack Query, Zustand, shadcn/ui
- Backend: NestJS, TypeORM, PostgreSQL
- AI extensions: RAG, MCP, Agent 기능은 `apps/api/src/ai` 아래에서 단계적으로 확장
- Runtime target: Node.js 24 LTS

## Workspace

- `apps/web`: 게시판 웹 클라이언트
- `apps/api`: REST API 서버
- `packages/shared`: 프론트/백 공통 타입과 스키마를 둘 공간
- `infra`: 로컬 개발 인프라 설정

## Quick Start

```bash
pnpm install
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env
pnpm db:up
pnpm dev
```

## Learning Guide

이 프로젝트는 학습하면서 직접 구현하는 방식으로 진행합니다.

- [전체 학습 가이드](./docs/README.md)
- [학습 계약](./docs/learning-contract.md)
- [진행 기록 템플릿](./docs/progress-template.md)

## Useful Scripts

```bash
pnpm dev:web
pnpm dev:api
pnpm build
pnpm --filter api db:migration:generate
pnpm --filter api db:migration:run
```

## Current Architecture

```txt
apps/
  web/
    src/routes        # TanStack Router file routes
    src/components/ui # shadcn/ui components
    src/lib           # API client, QueryClient
    src/stores        # Zustand UI state
  api/
    src/config        # 환경변수와 TypeORM 설정
    src/database      # TypeORM DataSource, migrations
packages/
  shared/
infra/
  compose.yaml
```

## Next Implementation Steps

1. NestJS 모듈 구조와 TypeORM Entity 직접 만들기
2. Auth API: 회원가입, 로그인, JWT Guard
3. Posts API: 게시글 CRUD, 검색, 페이징
4. Comments/Tags API
5. React 화면과 API 연동
6. RAG, MCP, Agent 기능 추가
