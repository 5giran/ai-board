# Extendly — Project Specification

> **문서 역할**: 본 문서는 **로직·데이터·API의 source of truth**다. UI/비주얼 구현(레이아웃, 토큰, 컴포넌트, 문구)은 `extendly_codex_ui_spec.md`를 따른다. **충돌 시 — 로직/데이터/API는 본 문서 우선, 외형/문구는 UI 지시서 우선.**
>
> 이 문서는 Codex가 구현 작업의 단일 기준으로 읽는 명세서다. 추상적 서술을 피하고, 화면 / 데이터 모델 / API / AI 기능을 구체적으로 정의한다.

---

## 1. Overview

**Extendly**는 여러 플랫폼(Chrome, Obsidian, VS Code, Raycast, Notion 등)의 익스텐션·플러그인을 한곳에 모아 검색·등록·공유하는 아카이브형 게시판이다. 일반 키워드 검색에 더해, 자연어로 "필요한 기능"을 설명하면 의미 기반(RAG)으로 익스텐션을 찾아주고, 등록 시 외부 소스의 메타데이터를 자동 수집(MCP)하며, 워크플로우를 말하면 에이전트가 도구를 조합해 추천 셋을 구성(Agent)한다.

- **컨셉 슬로건**: "Add something to your world."
- **개인 과제**: 프론트엔드 / 백엔드 / AI 응용을 모두 단독 설계·구현.
- **지원 플랫폼**: Chrome / Obsidian / VS Code / Raycast / Notion (+ All 필터). 신규 플랫폼을 추가하기 쉬운 구조로 설계한다.

---

## 2. Tech Stack (확정)

| 레이어 | 기술 |
|---|---|
| Frontend | React + TypeScript |
| Backend | NestJS (TypeScript) |
| Database | PostgreSQL + TypeORM |
| Auth | JWT (access/refresh) + Argon2 password hashing |
| LLM | 상용 모델 1종 (구현 시 선택) |
| Embedding / Vector | pgvector (PostgreSQL 확장) 우선 — 별도 인프라 없이 동일 DB에서 처리 |
| RAG Framework | LangChain (또는 직접 구현) |
| MCP | 자체 MCP Server (JSON-RPC), 외부 서비스 1종 이상 연동 |
| Agent | Function Calling 기반 추론 루프 + 상태관리 |

> 표기 규칙: 영문 기술 용어는 로컬, 그래디언트처럼 통용 표기를 그대로 사용한다.

---

## 3. Functional Requirements

### 3.1 게시판 기본 기능 (필수)
- 회원가입 / 로그인 (JWT + Argon2)
- 익스텐션 게시물 CRUD (생성/조회/수정/삭제)
- 댓글 (작성/조회/삭제)
- 태그 (다대다)
- 페이징
- 검색 (일반 키워드 검색)

### 3.2 AI 활용 기능 (필수 3종)
- **RAG**: 자연어 의미 기반 익스텐션 검색 / 유사 추천
- **MCP**: 등록 시 외부 소스(GitHub 등) 메타데이터 자동 수집
- **Agent**: 워크플로우 목표 입력 → 도구 조합 추천

---

## 4. Screens

각 화면은 `docs/wireframes`의 구조 기준을 따른다. 디자인 톤은 미확정(별도 정의 예정), 본 문서는 **구조와 데이터 흐름**만 규정한다.

### S1. 로그인 / 회원가입 `/login`, `/signup`
- 로그인: 이메일, 비밀번호 → JWT 발급, Argon2 검증
- 회원가입: 닉네임, 이메일, 비밀번호(+확인)
- 인증 실패/중복 이메일 에러 처리

### S2. 메인 / 검색 `/`
- 상단 GNB: 로고, 둘러보기, 등록하기, 로그인/프로필
- 히어로: 슬로건 + **자연어 검색 입력창** (RAG 진입점)
- 플랫폼 필터 칩: all / chrome / obsidian / vscode / raycast / notion
- 결과 영역: 정렬(추천/인기/최신/북마크), **카드 뷰 ⇄ 목록 뷰 토글**, 페이징
- **카드 뷰**: 아이콘, 이름, 플랫폼, 평점, 한줄설명, 태그, **N% 일치(임베딩 유사도)**, MCP 검증 배지
- **목록 뷰(게시판 보드)**: 한 행에 제목·태그 / 플랫폼 / **작성자** / 평점 / **댓글수** / **등록일** — 전형적 게시판 목록 형태로, 과제의 "기본 게시판 기능"을 시각적으로 충족. 작성자·댓글수·등록일은 목록 뷰에서 노출.
- 일반 검색과 RAG 검색을 UI에서 구분(일치율 노출 여부)

### S3. 익스텐션 상세 `/extensions/:id`
- 데스크톱 2-column 레이아웃.
- **좌측 main**: 뒤로가기, 아이콘·이름·플랫폼, 메타데이터 row(제공자·평점·다운로드·업데이트일·카테고리), 주요 CTA(원본 링크 열기 / 북마크 / 비슷한 익스텐션 찾기), 본문 설명, 주요 기능 bullet, 태그, 댓글(입력 + 목록).
- **우측 sticky 패널 — MCP 자동수집 정보**: 다운로드 수, 최신 버전, 마지막 업데이트, GitHub stars, License, Source, Compatibility, Permissions(권한 정보), 수집 시각, **정보 새로고침** 버튼.
- **신뢰/위험 상태 표시**: 공식 스토어 링크 / GitHub Repository / 최근 업데이트됨 / 권한 정보 있음 배지. 업데이트가 오래된 경우 "최근 업데이트가 오래되었어요", 출처 불명확 시 "검증되지 않은 출처" 경고.

### S4. 글 등록 `/extensions/new`
- 1페이지 폼이되 시각적으로 4단계 stepper처럼 구성.
- **Step 1 — 원본 URL 입력**: `원본 URL` 입력창(github / chrome web store / vscode marketplace placeholder) + "자동으로 불러오기" 버튼. helper: MCP가 이름·아이콘·설명·버전·별점·업데이트 정보를 자동 수집.
- **Step 2 — 자동 채움 미리보기**: 불러오기 전 빈 preview, 로딩 중 skeleton("메타데이터를 가져오는 중…"), 성공 시 아이콘·이름·플랫폼·설명·버전·업데이트일 + `MCP fetched` 배지, 실패 시 "자동 수집에 실패했어요. 직접 입력할 수 있습니다." + 재시도.
- **Step 3 — 직접 수정 필드**: 제목, 설명, 플랫폼, 카테고리, 태그, 원본 링크, 본문, 공개 여부/임시저장.
- **Step 4 — 제출**: 미리보기 / 임시저장 / 등록하기. 버튼은 비활성·로딩·완료 상태 분리.

### S5. AI 큐레이터 (Agent) `/curator`
- 자연어 목표 입력창 (예: "블로그 쓰는 개발자 워크플로우 추천")
- **추론 루프 표시**: ① RAG 유사 검색 → ② MCP 외부 조회 → ③ 추천 셋 구성
- 추천 결과 리스트 (각 항목에 추천 이유)

### S6. 마이페이지 `/me`
- 관리형 dashboard 느낌. 프로필 요약(닉네임, 이메일), 프로필 수정.
- 탭: 내가 등록한 익스텐션 / 작성한 댓글 / 북마크 / 임시저장 글.
- 항목별 관리(수정 / 삭제 / 원본 링크 열기). 카드·리스트 컴포넌트 재사용.

---

## 5. Data Model

> TypeORM 엔티티 기준. `vector` 타입은 pgvector 확장 사용.

### User
| 필드 | 타입 | 비고 |
|---|---|---|
| id | uuid (PK) | |
| email | varchar unique | |
| nickname | varchar | |
| passwordHash | varchar | Argon2 |
| createdAt | timestamptz | |

### Extension (게시물)
| 필드 | 타입 | 비고 |
|---|---|---|
| id | uuid (PK) | |
| title | varchar | |
| description | text | 본문 |
| platform | enum('chrome','obsidian','vscode','raycast','notion') | |
| category | varchar nullable | |
| sourceUrl | varchar | 원본 URL |
| iconUrl | varchar nullable | MCP 수집 |
| rating | float nullable | MCP 수집 |
| version | varchar nullable | MCP 수집 |
| license | varchar nullable | MCP 수집 |
| metadata | jsonb nullable | MCP 수집 원본(다운로드/스타/권한/호환성/수집시각 등) |
| isMcpVerified | boolean default false | MCP 수집 성공 여부 |
| status | enum('published','draft') default 'published' | 임시저장 지원 |
| embedding | vector(차원) nullable | RAG용 임베딩 |
| authorId | uuid (FK→User) | |
| createdAt / updatedAt | timestamptz | |

> `metadata` jsonb 권장 키: downloads, stars, lastUpdate, permissions[], compatibility, fetchedAt.

### Comment
| 필드 | 타입 | 비고 |
|---|---|---|
| id | uuid (PK) | |
| content | text | |
| extensionId | uuid (FK→Extension) | |
| authorId | uuid (FK→User) | |
| createdAt | timestamptz | |

### Tag / ExtensionTag
- Tag: id, name(unique)
- ExtensionTag: extensionId, tagId (다대다 조인)

### Bookmark
- userId, extensionId (복합 PK)

---

## 6. API (초안)

> NestJS 컨트롤러 기준. 인증 필요 엔드포인트는 🔒.

### Auth
- `POST /auth/signup` — { email, nickname, password }
- `POST /auth/login` — { email, password } → { accessToken, refreshToken }
- `POST /auth/refresh`

### Extensions
- `GET /extensions` — query: page, sort(popular|recent|match), platform, q(키워드). 응답 각 항목은 목록(보드) 뷰를 위해 `author`(작성자), `commentCount`(댓글수 집계), `createdAt`(등록일)을 포함한다.
- `GET /extensions/:id`
- `POST /extensions` 🔒 — 등록
- `PATCH /extensions/:id` 🔒
- `DELETE /extensions/:id` 🔒

### Comments
- `GET /extensions/:id/comments`
- `POST /extensions/:id/comments` 🔒
- `DELETE /comments/:id` 🔒

### Bookmarks
- `GET /me/bookmarks` 🔒
- `POST /extensions/:id/bookmark` 🔒 (toggle)

### AI
- `POST /ai/search` — { query } → RAG 의미 검색 결과 + 일치율
- `POST /ai/fetch-metadata` 🔒 — { sourceUrl } → MCP 자동수집 결과
- `POST /ai/curate` 🔒 — { goal } → Agent 추천 셋 + 추론 로그

---

## 7. AI Features — 상세 정의

### 7.1 RAG (의미 기반 검색 / 유사 추천)

**목적**: 사용자가 "필요한 기능"을 자연어 문장으로 입력하면, 키워드 일치가 아닌 의미 유사도로 익스텐션을 찾는다.

**파이프라인**
1. 익스텐션 등록 시 `title + description + tags`를 임베딩 모델로 벡터화 → `Extension.embedding`에 저장 (pgvector).
2. 검색 시 사용자 쿼리를 동일 임베딩 모델로 벡터화.
3. pgvector 코사인 유사도(`<=>` 연산자)로 top-K 검색.
4. 유사도 점수를 **N% 일치**로 환산해 카드에 노출 → 일반 검색과의 차별점 시각화.
5. (선택) 상위 결과를 LLM에 넣어 "이 익스텐션이 왜 맞는지" 요약 생성.

**구성 요소 체크리스트**
- 데이터 소스: 자체 DB의 Extension 레코드
- 임베딩 모델: LLM에 맞는 모델 1종
- Vector DB: pgvector (PostgreSQL 내장)
- 프레임워크: LangChain 또는 직접 구현

**엔드포인트**: `POST /ai/search`
```
req:  { "query": "매일 아침 노션에 날씨 자동으로 적어주는 거" }
res:  { "results": [ { "extension": {...}, "score": 0.96 }, ... ] }
```

---

### 7.2 MCP (외부 메타데이터 자동 수집)

**목적**: 등록 시 원본 URL만 받으면 MCP Server가 외부 서비스를 호출해 메타데이터를 자동으로 채운다. 수기 입력 최소화 + 데이터 정규화.

**아키텍처**
- 자체 **MCP Server** 구현, JSON-RPC 기반 요청/응답.
- 최소 1개 이상 실제 외부 서비스 연동 → **GitHub API**(repo 스타/최종 커밋/릴리스 버전 조회)를 1차 대상으로 한다.
- API Key / 권한 관리 전략 포함 (서버 측 보관, 클라이언트 비노출).

**흐름**
1. 사용자가 글 등록 화면에서 `sourceUrl` 입력 → "불러오기".
2. 백엔드가 MCP Server에 JSON-RPC 요청(메서드: `fetchExtensionMetadata`, params: { url }).
3. MCP Server가 URL을 파싱해 GitHub(또는 스토어) API 호출.
4. 이름·아이콘·별점·다운로드·버전·최종 업데이트를 표준 스키마로 반환.
5. 결과를 미리보기 카드에 채우고, `Extension.metadata`(jsonb) + 개별 컬럼에 저장.

**엔드포인트**: `POST /ai/fetch-metadata`
```
req:  { "sourceUrl": "https://github.com/owner/repo" }
res:  { "title": "...", "iconUrl": "...", "rating": 4.8, "version": "v2.1.0",
        "license": "MIT", "isMcpVerified": true,
        "metadata": { "downloads": 12400, "stars": 820, "lastUpdate": "2026-05",
                      "permissions": ["tabs","storage"], "compatibility": "...",
                      "fetchedAt": "2026-06-11T00:00:00Z" } }
```

**예외 처리**: 잘못된 URL / 비공개 repo / API rate limit → 사용자에게 수기 입력 fallback 제공.

---

### 7.3 Agent (AI 큐레이터)

**목적**: 사용자가 워크플로우/목표를 자연어로 말하면, 에이전트가 스스로 도구를 선택·실행하는 추론 루프를 돌려 추천 셋을 구성한다.

**구성**
- **Function Calling**: 에이전트가 호출 가능한 도구 정의
  - `ragSearch(query)` → RAG로 유사 익스텐션 검색
  - `fetchMetadata(url)` → MCP로 외부 최신 정보 조회
  - `listByPlatform(platform)` → 플랫폼별 목록
- **상태 관리(Memory/State)**: 대화/추론 단계별 상태 유지, 이미 조회한 도구 결과 캐싱.
- **추론 루프 구조**: LangGraph 또는 유사 구조(상태 그래프)로 단계 전이 관리.
- **무한 루프 방지**: 최대 반복 횟수 제한(예: step ≤ N), 동일 도구 반복 호출 가드, 타임아웃, 예외 처리.

**흐름**
1. 사용자 목표 입력 (예: "블로그 쓰는 개발자 워크플로우 도와줄 익스텐션 추천").
2. 에이전트가 단계적으로:
   - ① `ragSearch`로 후보 검색
   - ② 후보에 대해 `fetchMetadata`로 최신 버전·활성도 확인
   - ③ 결과를 종합해 추천 셋 + 추천 이유 생성
3. 각 단계를 UI에 추론 루프로 표시(진행 상태 가시화).
4. 최종 추천 리스트 반환 (항목별 추천 이유 포함).

**엔드포인트**: `POST /ai/curate`
```
req:  { "goal": "블로그 쓰는 개발자 워크플로우 추천" }
res:  { "steps": [ { "tool": "ragSearch", "summary": "..." }, ... ],
        "recommendations": [ { "extension": {...}, "reason": "..." }, ... ] }
```

---

## 8. 과제 요구사항 매핑

| # | 페이지 | 핵심 기능 | 과제 항목 |
|---|---|---|---|
| 1 | 로그인/회원가입 | JWT·Argon2 인증 | 게시판 필수(회원) |
| 2 | 메인/검색 | 자연어 RAG 검색 + 결과 | AI ① + 검색/페이징 |
| 3 | 익스텐션 상세 | 본문·태그·댓글 + MCP 자동수집 | AI ② + 게시물/댓글/태그 |
| 4 | 글 등록 | URL→MCP 자동 채움 | AI ② + 게시물 CRUD |
| 5 | AI 큐레이터 | Agent 추론 루프 추천 | AI ③ |
| 6 | 마이페이지 | 내 글/댓글/북마크 관리 | 게시물 CRUD |

> 필수 항목(회원 / CRUD / 댓글 / 태그 / 페이징 / 검색 + RAG / MCP / Agent)이 6개 화면에 모두 포함됨.

---

## 9. 제출물 (README 구성)

1. 프로젝트 개요
2. 주요 구현 기능
3. 전체 아키텍처 구조
4. 각 AI 활용 기능 / 기술 / 아키텍처 (RAG / MCP / Agent)
5. 데모 (스크린샷 1개 이상)
6. 회고 / 한계점 / 개선 아이디어

---

## 10. Codex 작업 지침

- 본 문서를 로직·데이터·API의 단일 기준(source of truth)으로 삼는다. 로직 충돌 시 이 문서 우선.
- **UI/비주얼(레이아웃·디자인 토큰·컴포넌트 구조·문구)은 `extendly_codex_ui_spec.md`를 따른다.** 외형 충돌 시 UI 지시서 우선.
- TypeScript strict 모드, DTO/Entity 분리, NestJS 모듈(Module/Controller/Service/Provider) 구조 준수.
- AI 기능 3종은 각각 독립 모듈로 구현하되, Agent가 RAG·MCP를 도구로 호출하는 의존 관계를 유지.
- 외부 API Key·시크릿은 환경변수로 관리, 클라이언트 비노출.
