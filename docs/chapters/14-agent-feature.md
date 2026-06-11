# 14. Agent 기능 설계와 구현: AI 큐레이터

## 이번 챕터 목표

- AI Agent가 도구를 선택하고 실행하는 흐름을 설계한다.
- function calling과 상태 관리를 이해한다.
- 무한 루프 방지와 예외 처리를 포함한 Agent 기능을 구현한다.
- 사용자의 워크플로우 목표를 받아 RAG 검색과 MCP 조회를 조합해 익스텐션 추천 셋을 만든다.

## 먼저 이해할 개념

- Agent loop: 목표를 보고 다음 행동을 선택하는 반복 구조
- Function calling: LLM이 호출할 도구와 인자를 선택하는 방식
- Memory/State: Agent가 현재 작업 맥락을 기억하는 구조
- Tool result: 도구 호출 결과를 다시 reasoning에 반영하는 값
- Loop guard: 무한 반복을 막는 제한
- User-visible progress: 내부 추론이 아니라 사용자에게 보여도 되는 실행 단계

## 직접 구현할 파일/기능

- AI 큐레이터 use case
- `POST /ai/curate`
- agent service
- tool registry
- function calling schema
- `ragSearch(query)` tool
- `fetchMetadata(url)` tool
- `listByPlatform(platform)` tool
- agent state와 step log
- 최대 반복 횟수 제한
- 실패 처리와 로그
- 프론트 `/curator` 화면(command palette, scenario chips, agent progress timeline, recommendation groups)

## 구현 전에 스스로 답할 질문

- Agent가 스스로 판단해야 하는 부분은 무엇이고, 고정 로직으로 충분한 부분은 무엇일까?
- Agent가 사용할 도구는 몇 개로 시작할까?
- 사용자에게 바로 실행하면 위험한 action은 무엇일까?
- Agent가 멈춰야 하는 조건은 무엇일까?
- 추천 결과는 “익스텐션 하나”가 아니라 “워크플로우 조합”으로 보여주는 것이 좋을까?
- 사용자에게 공개해도 되는 step log와 숨겨야 하는 내부 추론은 어떻게 구분할까?
- MCP 조회가 실패한 후보는 추천에서 제외할까, 낮은 신뢰도로 표시할까?
- progress timeline의 done/active/wait 상태는 Agent 응답 상태와 어떻게 매핑할까?

## 단계별 실습 과제

1. AI 큐레이터의 입력 schema를 `{ goal }`로 정의한다.
2. Agent가 사용할 tool 목록을 `ragSearch`, `fetchMetadata`, `listByPlatform`으로 시작한다.
3. 각 tool의 input/output을 정의한다.
4. Agent state에 goal, candidates, metadataById, steps, recommendations를 둔다.
5. LLM 호출, tool 선택, tool 실행, 최종 추천 응답 흐름을 만든다.
6. 최대 반복 횟수와 동일 도구 반복 호출 가드를 둔다.
7. tool 실패와 LLM 실패를 각각 처리한다.
8. 사용자에게 보여줄 step log를 남긴다.
9. `POST /ai/curate` 응답에 `steps`와 `recommendations`를 포함한다.
10. `/curator` 화면에 command palette, 추천 시나리오 chips, 좌측 sticky progress timeline, 우측 recommendation groups를 만든다.
11. progress timeline은 `RAG 검색`, `MCP 조회`, `추천 조합 생성`을 done/active/wait 상태로 표시한다.

## 힌트

- 힌트 1: 처음 Agent는 실제 설치나 외부 변경 없이 추천만 수행하게 만든다.
- 힌트 2: tool은 작고 예측 가능해야 Agent가 안정적으로 쓴다.
- 힌트 3: 최종 응답과 내부 로그는 분리한다.
- 힌트 4: UI에는 chain-of-thought가 아니라 `RAG 검색`, `MCP 조회`, `추천 조합 생성` 같은 안전한 진행 상태만 보여준다.
- 힌트 5: 추천 이유는 “왜 이 목표에 맞는지”와 “어떤 단계에 쓰는지”를 중심으로 짧게 쓴다.
- 힌트 6: Agent가 RAG와 MCP를 도구로 호출하는 의존 관계를 유지한다.
- 힌트 7: 큐레이터 입력도 메인과 같은 `CommandPalette`를 공유하되 버튼 라벨과 kbd만 `추천 받기`, `⌘ ↵`로 바꾼다.

## 검증 명령과 성공 기준

```bash
pnpm --filter api build
pnpm --filter api test
```

성공 기준:

- Agent가 RAG tool과 MCP tool 중 최소 1개 이상을 호출한다.
- 최대 반복 횟수를 넘지 않는다.
- 실패 시 사용자에게 이해 가능한 응답을 준다.
- Agent 구조를 loop, state, tool, guard로 설명할 수 있다.
- `POST /ai/curate`가 steps와 recommendations를 반환한다.
- `/curator` 화면에서 실행 중, 성공, 실패 상태와 done/active/wait progress가 구분된다.

## 나에게 공유할 내용

- AI 큐레이터 추천 흐름
- tool 목록
- Agent 실행 로그 예시
- loop 종료 조건
- 프론트 progress panel에 노출한 step 목록
- 추천 결과 예시

## 회고 질문

- Agent를 만들 때 “똑똑함”보다 “통제 가능함”이 중요한 이유는 무엇일까?
- Extendly 큐레이터에서 Agent가 일반 검색보다 더 나은 사용자 경험을 주는 순간은 언제였나?
