# 13. MCP 기능 설계와 구현: 원본 URL 메타데이터 자동수집

## 이번 챕터 목표

- MCP가 LLM과 외부 시스템 사이에서 하는 역할을 이해한다.
- JSON-RPC 기반 MCP Server를 설계한다.
- GitHub 등 외부 소스에서 익스텐션 메타데이터를 자동 수집한다.
- 등록 화면의 “원본 URL 입력 → 자동으로 불러오기” 흐름을 구현한다.

## 먼저 이해할 개념

- MCP Server: LLM이 호출할 수 있는 도구를 제공하는 서버
- JSON-RPC: method, params, result/error 형태의 요청/응답 규약
- Tool: 외부 기능을 호출하는 단위
- Permission: API key와 권한 범위를 관리하는 전략
- External integration: GitHub, 스토어, 파일 분석 같은 외부 시스템 연결
- Metadata normalization: 외부 API 응답을 Extendly 저장 구조에 맞게 정리하는 과정

## Extendly MCP 정의

- 1차 외부 서비스: GitHub API
- JSON-RPC method: `fetchExtensionMetadata`
- 입력: `{ url }`
- 출력: title, iconUrl, platform, description, rating, version, license, isMcpVerified, metadata
- NestJS endpoint: `POST /ai/fetch-metadata`
- 저장 위치: `Extension` 개별 컬럼과 `metadata` jsonb
- 사용자 경험: 자동수집 실패 시 수기 입력 fallback 제공

## 직접 구현할 파일/기능

- MCP 서버 구조
- `fetchExtensionMetadata` tool
- GitHub URL parser
- GitHub API 연동
- API key 관리 전략
- 외부 응답을 Extendly metadata schema로 정규화
- 등록 페이지 자동 채움 preview와 연결
- 상세 페이지 MCP 수집 정보 panel과 연결

## 구현 전에 스스로 답할 질문

- Extendly에서 MCP가 해결하는 수기 입력 문제는 무엇일까?
- GitHub repo URL에서 어떤 값을 가져올 수 있을까?
- API key는 어디에 두고, 클라이언트에는 왜 노출하면 안 될까?
- MCP tool 실패 시 등록 기능은 어떻게 반응해야 할까?
- Chrome Web Store, VS Code Marketplace, Notion 같은 추가 소스는 나중에 어떻게 확장할까?
- `metadata` jsonb에 넣을 값과 개별 컬럼으로 승격할 값의 기준은 무엇일까?

## 단계별 실습 과제

1. `fetchExtensionMetadata` input/output schema를 설계한다.
2. GitHub repo URL 파서의 성공/실패 케이스를 정리한다.
3. GitHub API에서 stars, license, latest release, pushedAt 또는 updatedAt을 조회한다.
4. JSON-RPC 요청/응답 흐름을 정리한다.
5. MCP server에서 외부 API를 호출한다.
6. 외부 응답을 Extendly metadata schema로 정규화한다.
7. NestJS `POST /ai/fetch-metadata`에서 MCP tool을 호출하게 연결한다.
8. 등록 페이지에서 응답을 자동 채움 preview와 form draft에 반영한다.
9. 실패 응답, rate limit, timeout 처리를 설계한다.
10. 상세 페이지의 `MCP 수집 정보` panel에 저장된 metadata를 표시한다.

## 힌트

- 힌트 1: 처음에는 GitHub repo URL만 지원해도 충분하다.
- 힌트 2: tool 이름은 동사 중심으로 짓는다.
- 힌트 3: 외부 서비스 응답을 그대로 노출하지 말고 익스텐션 등록에 필요한 모양으로 정리한다.
- 힌트 4: API key와 token은 서버 환경변수에 두고 브라우저로 내려보내지 않는다.
- 힌트 5: 자동수집에 실패해도 사용자가 직접 제목, 설명, 플랫폼, 원본 링크를 입력할 수 있어야 한다.

## 검증 명령과 성공 기준

```bash
pnpm --filter api build
```

성공 기준:

- MCP tool이 GitHub 같은 외부 서비스를 호출한다.
- JSON-RPC 요청과 응답 예시를 README에 설명할 수 있다.
- API key 관리 방식을 설명할 수 있다.
- 실패 시 error 응답이 예측 가능하다.
- 등록 화면에서 자동 채움 성공/실패 UI가 동작한다.
- 상세 화면에서 다운로드, 최신 버전, 마지막 업데이트, GitHub stars, License, Source 같은 metadata를 표시할 수 있다.

## 나에게 공유할 내용

- GitHub 연동 범위
- tool schema
- 성공 응답 예시
- 실패 응답 예시
- 프론트 등록 화면에 반영한 자동 채움 흐름

## 회고 질문

- MCP를 일반 REST API 호출과 구분해서 설명하면 어떤 차이가 핵심일까?
- 자동수집된 정보를 사용자에게 “신뢰할 수 있는 정보”로 보여주려면 어떤 보조 정보가 필요했나?
