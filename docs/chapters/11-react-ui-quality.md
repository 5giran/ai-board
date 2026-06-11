# 11. React UI 품질: Extendly 마켓플레이스 polish

## 이번 챕터 목표

- 기능이 “동작”하는 수준에서 “쓸 만한” 수준으로 올린다.
- 로딩, 에러, 빈 상태, 접근성, 반응형을 점검한다.
- shadcn/ui를 프로젝트 스타일에 맞게 사용하는 법을 익힌다.
- Extendly를 커맨드 팔레트 중심의 빠르고 깔끔한 개발자용 익스텐션 레지스트리처럼 다듬는다.

## 먼저 이해할 개념

- Loading state: 사용자가 기다려야 함을 알려주는 상태
- Error state: 실패 원인과 다음 행동을 안내하는 상태
- Empty state: 데이터가 없을 때의 정상 상태
- Accessibility: 키보드, 스크린 리더, label, focus 고려
- Component API: 재사용 컴포넌트가 외부에 제공하는 props
- Visual hierarchy: 검색, 필터, 결과, 신뢰 정보의 우선순위
- Responsive constraint: 카드, 버튼, metadata panel이 화면 폭에 맞게 줄어드는 규칙
- Design token: HSL 채널 값, radius, shadow, font stack처럼 화면 전체를 지배하는 기준값

## Extendly UI 기준

- 메인/검색은 Raycast/VS Code식 command palette가 가장 먼저 보이게 만든다.
- 카드는 작고 정보 밀도 있게 만들고, 목록 뷰는 작성자/댓글수/등록일이 있는 게시판 보드로 만든다.
- 상세는 Chrome Web Store와 VS Code Marketplace처럼 신뢰 metadata를 명확히 보여준다.
- 등록은 Vercel Marketplace와 Notion Marketplace처럼 외부 integration을 연결하는 느낌으로 만든다.
- AI 큐레이터는 챗봇보다 command palette와 추천 결과 중심으로 만든다.
- 데이터·메타데이터(평점, 다운로드, 태그, 플랫폼, 날짜, match score, kbd)는 전부 mono로 표시한다.
- accent 보라색은 검색/추천 CTA, match score, RAG/MCP 배지, eyebrow처럼 AI가 개입한 지점에만 쓴다.

## 직접 구현할 파일/기능

- 공통 loading UI
- 공통 error UI
- 공통 empty UI
- 익스텐션 카드 polish
- 목록 보드와 view toggle polish
- 상세 metadata panel polish
- 등록 stepper polish
- AI 큐레이터 progress panel polish
- form 접근성 개선
- 모바일 레이아웃 점검

## 구현 전에 스스로 답할 질문

- 사용자에게 “오류”만 보여주는 것과 “다시 시도”를 제공하는 것은 어떻게 다를까?
- shadcn 컴포넌트를 바로 쓰는 것과 감싼 컴포넌트를 만드는 기준은 무엇일까?
- 버튼 안 텍스트가 모바일에서 깨지면 어떻게 설계해야 할까?
- input에는 왜 label이 필요할까?
- “AI 기능”을 과하게 챗봇처럼 보이지 않게 하려면 어떤 정보를 보여줘야 할까?
- 카드 hover, shadow, radius는 정보 탐색 속도에 어떤 영향을 줄까?
- 신뢰/위험 배지는 상세 페이지에서 어디에 두는 것이 가장 자연스러울까?
- command palette가 페이지에서 가장 강한 시각적 위계를 가져야 하는 이유는 무엇일까?
- accent 색이 의미 없이 흩어지면 사용자는 무엇을 놓칠까?

## 단계별 실습 과제

1. UI 지시서의 HSL 토큰과 3겹 body 배경(글로우, 56px 그리드, 페이퍼)을 적용한다.
2. button, badge, input, command palette의 치수와 radius를 지시서 기준으로 맞춘다.
3. 목록 loading skeleton 또는 loading message를 만든다.
4. error 상태에 다시 시도 버튼을 둔다.
5. empty 상태에 다음 행동을 제안한다.
6. form input과 label 연결을 확인한다.
7. 버튼, 링크, form이 키보드로 이동 가능한지 확인한다.
8. 모바일 폭에서 텍스트와 버튼이 겹치지 않는지 확인한다.
9. 카드 grid를 데스크톱 3열, 태블릿 2열, 모바일 1열로 만든다.
10. 목록 보드는 데스크톱에서 컬럼 헤더를 보이고, 880px 이하에서 행을 축약한다.
11. `ExtensionCard`, `ExtensionListItem`, `RecommendationCard` variant를 계획한다.
12. 상세 페이지 2-column 레이아웃이 모바일에서 1-column으로 접히는지 확인한다.
13. 등록 폼의 비활성, 로딩, 완료, 실패 버튼 상태를 분리한다.
14. AI 큐레이터 progress panel에는 내부 추론이 아니라 `RAG 검색`, `MCP 조회`, `추천 조합 생성` 같은 안전한 단계만 표시한다.
15. 중복되는 UI 상태를 재사용 컴포넌트로 분리할지 판단한다.

## 힌트

- 힌트 1: loading, error, empty는 예외가 아니라 화면의 정상 분기다.
- 힌트 2: 재사용 컴포넌트는 두 번 이상 반복되고 의미가 같을 때 만든다.
- 힌트 3: 접근성은 마지막 장식이 아니라 form과 navigation의 기본 품질이다.
- 힌트 4: UI 지시서의 HSL 토큰을 그대로 쓰고, 색은 `hsl(var(--token))` 형태로 통일한다.
- 힌트 5: 큰 히어로보다 command palette, 결과 수, 필터, 카드/목록 전환의 스캔 가능성이 더 중요하다.
- 힌트 6: 버튼에는 가능한 경우 lucide icon을 함께 써서 도구 느낌을 살린다.
- 힌트 7: 모든 패널을 같은 흰 카드와 같은 그림자로 만들면 command palette와 MCP 패널의 우선순위가 사라진다.

## 검증 명령과 성공 기준

```bash
pnpm --filter web build
pnpm --filter web lint
```

가능하면 브라우저에서 직접 확인한다.

성공 기준:

- loading, error, empty 상태가 모두 존재한다.
- 주요 폼에 label과 에러 메시지가 있다.
- 모바일에서 레이아웃이 깨지지 않는다.
- shadcn/ui 사용 기준을 설명할 수 있다.
- 카드, 상세 panel, 등록 form, 큐레이터 화면이 같은 디자인 토큰을 공유한다.
- command palette가 가장 강한 그림자와 시각적 위계를 가진다.
- 카드/목록 view toggle이 동작하고 목록 뷰 컬럼이 모바일에서 깨지지 않는다.
- 데이터·메타데이터가 mono로 표시된다.
- RAG/MCP/Agent 상태가 사용자가 이해할 수 있는 UI 언어로 표시된다.
- 텍스트가 버튼, 카드, panel 밖으로 넘치지 않는다.

## 나에게 공유할 내용

- 개선 전후 화면
- 공통 컴포넌트로 분리한 것과 분리하지 않은 것
- 접근성 체크 결과
- 반응형 체크 결과
- UI 지시서에서 적용한 항목과 보류한 항목

## 회고 질문

- UI 품질을 높이는 작업 중 기능 구현만큼 중요하다고 느낀 부분은 무엇인가?
- Extendly가 “랜딩페이지”가 아니라 “실제로 쓰는 검색/마켓플레이스”처럼 보이게 만든 결정은 무엇이었나?
