# 13. MCP 기능 설계와 구현

## 이번 챕터 목표

- MCP가 LLM과 외부 시스템 사이에서 하는 역할을 이해한다.
- JSON-RPC 기반 MCP Server를 설계한다.
- 실제 외부 서비스 하나를 연결한다.

## 먼저 이해할 개념

- MCP Server: LLM이 호출할 수 있는 도구를 제공하는 서버
- JSON-RPC: method, params, result/error 형태의 요청/응답 규약
- Tool: 외부 기능을 호출하는 단위
- Permission: API key와 권한 범위를 관리하는 전략
- External integration: 날씨, GitHub, 뉴스, 파일 분석 같은 외부 시스템 연결

## 직접 구현할 파일/기능

- MCP 서버 구조
- 최소 1개 tool
- 외부 API 연동
- API key 관리 전략
- 게시판 기능과 연결되는 MCP 사용 사례

## 구현 전에 스스로 답할 질문

- 게시판에서 MCP가 해결하면 좋은 문제는 무엇일까?
- 외부 서비스는 어떤 것을 선택할까?
- API key는 어디에 두고, 클라이언트에는 왜 노출하면 안 될까?
- MCP tool 실패 시 게시판 기능은 어떻게 반응해야 할까?

## 단계별 실습 과제

1. MCP 기반 기능 하나를 고른다.
2. 외부 서비스와 필요한 API key를 정리한다.
3. tool 이름과 input/output schema를 설계한다.
4. JSON-RPC 요청/응답 흐름을 정리한다.
5. MCP server에서 외부 API를 호출한다.
6. NestJS API 또는 Agent 기능에서 MCP tool을 호출하게 연결한다.
7. 실패 응답과 timeout 처리를 설계한다.

## 힌트

- 힌트 1: 처음 기능은 “URL 메타데이터 요약”이나 “날씨 브리핑”처럼 작게 잡는다.
- 힌트 2: tool 이름은 동사 중심으로 짓는다.
- 힌트 3: 외부 서비스 응답을 그대로 노출하지 말고 게시판에 필요한 모양으로 정리한다.

## 검증 명령과 성공 기준

```bash
pnpm --filter api build
```

성공 기준:

- MCP tool 하나가 외부 서비스를 호출한다.
- JSON-RPC 요청과 응답 예시를 README에 설명할 수 있다.
- API key 관리 방식을 설명할 수 있다.
- 실패 시 error 응답이 예측 가능하다.

## 나에게 공유할 내용

- 선택한 외부 서비스
- tool schema
- 성공 응답 예시
- 실패 응답 예시

## 회고 질문

- MCP를 일반 REST API 호출과 구분해서 설명하면 어떤 차이가 핵심일까?
