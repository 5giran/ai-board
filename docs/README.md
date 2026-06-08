# AI Board 학습 가이드

이 문서는 AI 게시판 과제를 구현하면서 React, NestJS, TypeORM, PostgreSQL, RAG, MCP, Agent를 차례대로 익히기 위한 학습 로드맵입니다.

핵심 원칙은 하나입니다.

> 환경과 방향은 가이드가 잡고, 실제 도메인 구현은 직접 손으로 만든다.

## 읽는 순서

1. [학습 계약](./learning-contract.md)
2. [00. 환경과 구조 이해](./chapters/00-environment-tour.md)
3. [01. Users 모듈 만들기](./chapters/01-users-module.md)
4. [02. User Entity와 migration](./chapters/02-user-entity-migration.md)
5. [03. 회원가입과 로그인](./chapters/03-auth-signup-login.md)
6. [04. 게시글 CRUD API](./chapters/04-posts-crud-api.md)
7. [05. 댓글, 태그, 검색, 페이징](./chapters/05-comments-tags-search-pagination.md)
8. [06. React 기초 체력](./chapters/06-react-foundation.md)
9. [07. React 라우팅과 레이아웃](./chapters/07-react-routing-layout.md)
10. [08. React 서버 상태](./chapters/08-react-server-state.md)
11. [09. React 폼과 인증 흐름](./chapters/09-react-forms-auth.md)
12. [10. React 게시글 화면 흐름](./chapters/10-react-posts-flow.md)
13. [11. React UI 품질](./chapters/11-react-ui-quality.md)
14. [12. RAG 기능](./chapters/12-rag-feature.md)
15. [13. MCP 기능](./chapters/13-mcp-feature.md)
16. [14. Agent 기능](./chapters/14-agent-feature.md)
17. [15. 데모, README, 회고](./chapters/15-demo-readme-retrospective.md)

매 챕터를 끝낼 때는 [진행 기록 템플릿](./progress-template.md)을 채워서 공유합니다.

## 공부 방식

- 먼저 목표와 개념을 읽습니다.
- 구현 전에 질문에 답해 봅니다.
- 실습 과제를 직접 구현합니다.
- 막히면 힌트를 1번부터 순서대로 봅니다.
- 검증 명령으로 결과를 확인합니다.
- 마지막에 “왜 이렇게 나눴는지”를 설명합니다.

완성 코드를 먼저 복사하지 않습니다. 이 프로젝트의 목적은 결과물을 만드는 것뿐 아니라, 다음 프로젝트에서 혼자 구조를 잡을 수 있게 되는 것입니다.

## React 학습 목표

React 파트는 특히 깊게 다룹니다.

- 페이지, 섹션, 재사용 컴포넌트의 분리 기준
- props와 local state를 쓰는 기준
- Zustand와 TanStack Query의 책임 분리
- TanStack Router의 layout, route params, search params
- loading, error, empty, success 상태 설계
- form 입력, 검증, 제출, 실패 메시지 처리
- shadcn/ui를 그대로 쓰는 경우와 감싸는 경우
- 목록, 상세, 작성, 수정 화면의 중복 제거

프론트 구현을 빨리 끝내는 것보다 “React로 생각하는 방식”을 익히는 것을 우선합니다.

## 최종 제출 체크

마지막에는 [최종 제출 체크리스트](./checklists/final-submission.md)를 기준으로 README, 데모, 스크린샷, 회고를 정리합니다.
