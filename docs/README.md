# AI Board 학습 가이드

이 문서는 Extendly 익스텐션 아카이브 과제를 구현하면서 React, NestJS, TypeORM, PostgreSQL, RAG, MCP, Agent를 차례대로 익히기 위한 학습 로드맵입니다.

핵심 원칙은 하나입니다.

> 환경과 방향은 가이드가 잡고, 실제 도메인 구현은 직접 손으로 만든다.

## 구현 기준 문서

- [Extendly 제품 명세](./product/extendly_spec.md)
- [Extendly UI/UX 구현 지시서](./product/extendly_codex_ui_spec.md)
- [Extendly 와이어프레임](./wireframes/extendly_wireframes.html)
- [Extendly UI 레퍼런스 HTML](./wireframes/extendly_reference.html)

구현할 때는 제품 명세로 데이터/API 범위를 확인하고, UI/UX 구현 지시서로 토큰·컴포넌트·문구 기준을 확인한 뒤, 와이어프레임과 UI 레퍼런스 HTML을 같이 열어 화면 구조와 실제 시각 기준을 대조합니다.

## 읽는 순서

1. [학습 계약](./learning-contract.md)
2. [00. 환경과 구조 이해](./chapters/00-environment-tour.md)
3. [01. Users 모듈 만들기](./chapters/01-users-module.md)
4. [02. User Entity와 migration](./chapters/02-user-entity-migration.md)
5. [03. 회원가입과 로그인](./chapters/03-auth-signup-login.md)
6. [04. Extensions CRUD API](./chapters/04-extensions-crud-api.md)
7. [05. Extension 댓글, 태그, 북마크, 검색, 페이징](./chapters/05-extension-comments-tags-search-pagination.md)
8. [06. React 기초 체력: Extendly 화면 쪼개기](./chapters/06-react-foundation.md)
9. [07. React 라우팅과 레이아웃: Extendly 화면 구조](./chapters/07-react-routing-layout.md)
10. [07 -> 10. UI 먼저 만들기 위한 라우팅 최소 가이드](./chapters/07-to-10-ui-first-bridge.md)
11. [10-11. Extendly UI 먼저 완성하기: 화면 흐름 + UI 품질](./chapters/10-11-ui-only-flow-quality.md)
12. [08. React 서버 상태: Extendly API 연결](./chapters/08-react-server-state.md)
13. [09. React 폼과 인증 흐름: 로그인, 회원가입, 보호 화면](./chapters/09-react-forms-auth.md)
14. [10. React Extendly 화면 흐름](./chapters/10-react-extendly-flow.md)
15. [11. Extendly UI 품질](./chapters/11-react-ui-quality.md)
16. [12. RAG 자연어 익스텐션 검색](./chapters/12-rag-feature.md)
17. [13. MCP 원본 URL 메타데이터 자동수집](./chapters/13-mcp-feature.md)
18. [14. Agent AI 큐레이터](./chapters/14-agent-feature.md)
19. [15. 데모, README, 회고](./chapters/15-demo-readme-retrospective.md)

매 챕터를 끝낼 때는 [진행 기록 템플릿](./progress-template.md)을 채워서 공유합니다.

## 공부 방식

- 먼저 목표와 개념을 읽습니다.
- 구현 전에 질문에 답해 봅니다.
- 구현 기준 문서와 UI 레퍼런스를 체크합니다.
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
