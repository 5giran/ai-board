# 14. Agent 기능 설계와 구현

## 이번 챕터 목표

- AI Agent가 도구를 선택하고 실행하는 흐름을 설계한다.
- function calling과 상태 관리를 이해한다.
- 무한 루프 방지와 예외 처리를 포함한 Agent 기능을 구현한다.

## 먼저 이해할 개념

- Agent loop: 목표를 보고 다음 행동을 선택하는 반복 구조
- Function calling: LLM이 호출할 도구와 인자를 선택하는 방식
- Memory/State: Agent가 현재 작업 맥락을 기억하는 구조
- Tool result: 도구 호출 결과를 다시 reasoning에 반영하는 값
- Loop guard: 무한 반복을 막는 제한

## 직접 구현할 파일/기능

- Agent use case 하나 선택
- agent service
- tool registry
- function calling schema
- 최대 반복 횟수 제한
- 실패 처리와 로그

## 구현 전에 스스로 답할 질문

- Agent가 스스로 판단해야 하는 부분은 무엇이고, 고정 로직으로 충분한 부분은 무엇일까?
- Agent가 사용할 도구는 몇 개로 시작할까?
- 사용자에게 바로 실행하면 위험한 action은 무엇일까?
- Agent가 멈춰야 하는 조건은 무엇일까?

## 단계별 실습 과제

1. Agent 기능 하나를 고른다.
2. Agent가 사용할 tool 목록을 정한다.
3. 각 tool의 input/output을 정의한다.
4. Agent 상태에 저장할 값을 정한다.
5. LLM 호출, tool 선택, tool 실행, 최종 응답 흐름을 만든다.
6. 최대 반복 횟수를 둔다.
7. tool 실패와 LLM 실패를 각각 처리한다.
8. 실행 로그를 남긴다.

## 힌트

- 힌트 1: 처음 Agent는 “콘텐츠 확장 에이전트”처럼 위험도가 낮은 기능이 좋다.
- 힌트 2: tool은 작고 예측 가능해야 Agent가 안정적으로 쓴다.
- 힌트 3: 최종 응답과 내부 로그는 분리한다.

## 검증 명령과 성공 기준

```bash
pnpm --filter api build
pnpm --filter api test
```

성공 기준:

- Agent가 최소 1개 tool을 호출한다.
- 최대 반복 횟수를 넘지 않는다.
- 실패 시 사용자에게 이해 가능한 응답을 준다.
- Agent 구조를 loop, state, tool, guard로 설명할 수 있다.

## 나에게 공유할 내용

- 선택한 Agent 기능
- tool 목록
- Agent 실행 로그 예시
- loop 종료 조건

## 회고 질문

- Agent를 만들 때 “똑똑함”보다 “통제 가능함”이 중요한 이유는 무엇일까?
