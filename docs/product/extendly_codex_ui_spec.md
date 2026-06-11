# Extendly UI/UX 구현 지시서 for Codex

> **문서 역할**: 본 문서는 **UI/외형/문구의 기준(source of truth)**이다. 데이터 모델·API 계약·AI 파이프라인은 `extendly_spec.md`를 따른다. **충돌 시 — 외형/문구는 본 문서 우선, 로직/데이터/API는 `extendly_spec.md` 우선.** 플랫폼 enum·엔티티 필드·엔드포인트 시그니처는 임의로 바꾸지 말고 `extendly_spec.md`를 참조한다.
>
> **이 문서의 목표**: 승인된 프로토타입(`extendly_prototype.html`, `main_viewtoggle_demo.html`)을 픽셀·토큰 수준에서 재현하는 것. "예쁘게 만들어 주세요" 같은 모호한 지시는 없다. 아래의 토큰·컴포넌트 스펙·치수를 **그대로** 사용하라. 임의 변경 금지.

---

## 0. 디자인 한 줄 요약

Extendly는 **"개발자용 익스텐션 레지스트리(패키지 매니저 느낌)"**다. 핵심 시그니처는 **커맨드 팔레트(command palette)** — 검색을 Raycast/VS Code의 ⌘K 인터페이스처럼 다룬다. 본문은 sans(Inter/Pretendard), **데이터·메타데이터는 전부 mono(JetBrains Mono)**. accent 보라색은 **AI가 개입한 지점에만**(검색 CTA, match score, RAG/MCP 배지, eyebrow) 쓴다. 나머지는 전부 무채색.

**절대 하지 말 것**: 모든 패널을 같은 흰 카드+같은 그림자로 평평하게 만들기 / accent를 장식으로 흩뿌리기 / 큰 히어로만 있는 랜딩페이지 / 둥근 18px+옅은 그림자의 제네릭 룩.

---

## 1. 기술 전제

- **React + TypeScript**, Tailwind CSS, **shadcn/ui(new-york style)** 사용.
- shadcn 컴포넌트(Button, Card, Badge, Input, Textarea, Select, Tabs, Skeleton, Avatar, Separator)를 베이스로 쓰되, 아래 §2 토큰을 `globals.css`/`tailwind.config`에 주입해 디폴트 룩을 덮어쓴다.
- 폰트는 Inter + JetBrains Mono를 `next/font` 또는 `<link>`로 로드. 한글은 Pretendard fallback.
- 아이콘은 lucide-react. (프로토타입의 인라인 SVG/이모지는 lucide로 대체 가능.)

---

## 2. 디자인 토큰 (그대로 복사)

shadcn 규약대로 **HSL 채널 값**으로 정의한다. `globals.css`:

```css
:root{
  --background:0 0% 100%;
  --foreground:240 10% 8%;
  --card:0 0% 100%;
  --card-foreground:240 10% 8%;
  --muted:240 5% 96%;
  --muted-foreground:240 4% 46%;
  --border:240 6% 90%;
  --input:240 6% 90%;
  --ring:255 92% 67%;
  --primary:240 10% 10%;
  --primary-foreground:0 0% 98%;
  --accent:255 92% 67%;            /* violet — the only chroma */
  --accent-muted:255 100% 97%;
  --success:142 52% 38%;
  --warning:35 80% 42%;
  --danger:0 72% 51%;
  --radius:0.625rem;               /* 10px — tighter than generic 18px */
  --surface-canvas:48 20% 98%;     /* warm paper, page background */
}
```

- 폰트 변수: `--font-sans:'Inter',ui-sans-serif,system-ui,'Pretendard','Apple SD Gothic Neo','Noto Sans KR',sans-serif;` / `--font-mono:'JetBrains Mono',ui-monospace,monospace;`
- 색은 항상 `hsl(var(--token))` 또는 `hsl(var(--token)/.5)` 형태로 사용.

### 2.1 페이지 배경 (시그니처 질감 — 반드시 적용)

`body`에 단색 금지. 아래 3겹 배경을 그대로:

```css
background:
  radial-gradient(60rem 30rem at 78% -8%, hsl(255 92% 67% / .05), transparent 60%),
  linear-gradient(hsl(240 6% 90% / .32) 1px, transparent 1px) 0 0 / 100% 56px,
  hsl(var(--surface-canvas));
```

(우상단 옅은 보라 글로우 + 56px 간격 가로 그리드라인 + 따뜻한 페이퍼 베이스.)

---

## 3. 타이포 규칙

| 역할 | 폰트 | 비고 |
|---|---|---|
| 본문, 제목, 라벨, 버튼 | sans | 기본 |
| **데이터·메타데이터** | **mono** | 평점·다운로드·버전·작성자 핸들·태그·플랫폼명·match%·날짜·kbd — 전부 mono |
| eyebrow / 섹션 라벨 | mono | 대문자 + letter-spacing |

- 히어로 제목 `h1.head`: `font-size:44px; line-height:1.04; letter-spacing:-.03em; font-weight:800;` 강조어는 `<em>`(font-style normal) + `color:hsl(var(--accent))`.
- 폰트 스케일 점프를 분명히: 제목 44 → lede 16 → body 14 → meta 11.5~12.5. 중간값 남발 금지.

---

## 4. 핵심 컴포넌트 스펙 (치수 그대로)

> 모두 프로토타입에서 추출한 실제 값. shadcn 컴포넌트의 variant로 매핑해 구현하라.

### 4.1 Button
- 기본: `height:34px; padding:0 14px; border-radius:calc(var(--radius) - 2px); font-size:13px; font-weight:600; gap:6px; transition:.14s;`
- sm: `height:30px; padding:0 11px; font-size:12.5px;` / lg: `height:40px; padding:0 18px; font-size:14px;`
- variant: **primary**(bg `--primary`, text white) / **accent**(bg `--accent`, text white, `box-shadow:0 1px 2px hsl(255 92% 40% /.25)`) / **outline**(bg card, border) / **ghost**(transparent).
- accent 버튼은 **검색·추천받기 등 AI 액션에만**.

### 4.2 Badge (전부 mono)
- 공통: `height:21px; padding:0 8px; border-radius:6px; font-size:11.5px; font-weight:600; font-family:mono;`
- variant: **accent**(bg `--accent-muted`, text `hsl(255 70% 56%)`) = match%·RAG / **success**(bg `hsl(142 40% 94%)`, text `--success`) = ✓ MCP / **outline** = unverified / **warning** = draft·권한 / **muted** = 일반.

### 4.3 Input / Textarea / Select
- `height:38px; padding:0 12px; border:1px solid hsl(var(--input)); border-radius:calc(var(--radius) - 2px); font-size:14px;`
- focus: `border-color:hsl(var(--accent)); box-shadow:0 0 0 3px hsl(var(--accent)/.12);`
- textarea: `height:auto; padding:10px 12px; resize:vertical;`

### 4.4 Command palette (시그니처 — 검색창)
구조: 바깥 박스 + 상단 입력행 + 하단 힌트행.
- 박스: `border-radius:calc(var(--radius) + 2px); box-shadow:0 1px 0 hsl(240 10% 8% /.03), 0 12px 32px -12px hsl(240 10% 8% /.18); max-width:640px; overflow:hidden;` — **페이지에서 가장 강한 그림자(눈이 먼저 가야 함)**.
- 입력행: 좌측 `›_`(mono, accent) + input(`font-size:15px`) + accent 검색 버튼.
- 힌트행: 상단 border, bg `hsl(var(--muted)/.4)`, 좌측 "의미 기반 검색 · 키워드가 아니라 **하려는 일**로 찾아요", 우측 `⌘ K` kbd 2개.
- kbd: `font-family:mono; font-size:11px; border:1px solid border; border-bottom-width:2px; border-radius:5px; padding:2px 6px;`
- 메인과 AI 큐레이터가 이 컴포넌트를 공유(큐레이터는 버튼 라벨 "추천 받기", kbd `⌘ ↵`).

### 4.5 헤더 (AppHeader)
- `height:56px; position:sticky; top:0; bg:hsl(var(--surface-canvas)/.82); backdrop-filter:blur(12px) saturate(1.2); border-bottom:1px solid border.`
- 좌측: 로고마크(26px, bg primary, mono, `::after`로 `›`) + "Extendly". 내비 Explore/Submit/AI Curator(활성 시 bg muted).
- 우측: 로그인(ghost)·회원가입(primary)·아바타(30px, bg `hsl(142 40% 92%)`, mono).
- 로그인/회원가입 페이지에서는 헤더 숨김.

---

## 5. 화면별 구현 스펙

라우트와 기능 범위는 `extendly_spec.md`의 S1~S6을 따른다. 아래는 **레이아웃·컴포넌트 배치**.

### S1. 로그인 / 회원가입 `/login` `/signup`
- 2-column(`1fr 1fr`), 모바일에서 좌측 숨김.
- **좌측 aside**: 다크 패널(`bg:hsl(240 10% 10%)` + 좌상단 보라 radial glow), 로고(흰색 반전), 서비스 포인트 3개(번호 칩 `›_`/`✓`/`✦` + 설명), 하단 mono 풋터.
- **우측 main**: 중앙 카드(max 380px). 제목 24px/800, 필드, primary lg 풀폭 버튼.
- 로그인: 이메일·비밀번호 + "🔒 JWT 발급 · Argon2 검증" helper + 회원가입 전환 링크.
- 회원가입: 닉네임·이메일·비밀번호·비밀번호확인 + 불일치 시 `.err`(danger) 표시.

### S2. 메인 / 검색 `/` (Explore) — **게시판 핵심 화면**
순서: 히어로 → 툴바 → 결과헤더 → **카드/목록 뷰** → 페이저.
- **히어로**(카드로 감싸지 말 것, 배경 위 직접): eyebrow(mono, 보라 점) → h1(44px, "맞는 익스텐션"만 accent) → lede → **command palette** → suggest 칩(`#` mono 접두).
- **툴바**: 좌측 정렬 세그먼트(추천·인기·최신·북마크, shadcn Tabs 또는 세그먼트), 우측 플랫폼 필터(`all chrome obsidian vscode raycast notion`, mono, 활성 시 카드 bg+border). 상하 X, 하단 border만.
- **결과 헤더**: 좌측 "128 results · "쿼리"" + mono 서브 "sorted by semantic relevance", 우측에 **RAG 배지** + **뷰 토글**.
- **뷰 토글(View Toggle)** — 필수, §6 참조.
- **페이저**: mono, 중앙, 현재 페이지 primary.

### S3. 익스텐션 상세 `/extensions/:id`
- 2-column(`1fr 340px`).
- **좌측**: 뒤로가기 → d-head(아이콘 60px + 배지行[플랫폼·✓MCP·community] + h1 24px + mono 메타行[핸들·평점·다운로드·날짜·카테고리] + CTA[원본 링크 열기 primary / ＋북마크 outline / 비슷한 익스텐션 찾기 ghost-accent]) → 설명 → 주요 기능(✓ 리스트) → 태그 → 댓글(textarea + 등록 버튼 + 목록[아바타·작성자·mono 날짜·내용]).
- **우측 sticky(`top:72px`) MCP 패널**: 헤더 "⚡ 수집된 정보" + 서브 → key/value 행들(다운로드·최신버전·마지막 업데이트·GitHub stars·License·Source·Compatibility·수집 시각, value는 mono) → 신뢰 노트(success: 공식/GitHub 확인) → 권한 노트(warning: clipboard 등) → "↻ 정보 새로고침" outline 버튼.
- 위험 상태: 오래된 업데이트 → warning 노트, 출처 불명확 → danger/outline "unverified" 배지.

### S4. 글 등록 `/extensions/new`
- 페이지 타이틀 + 서브 → **stepper**(4단계: 원본 URL[done] · 자동 채움[on] · 직접 수정 · 제출) → 2-column(`1fr 320px`).
- **좌측 폼 카드**: URL 입력행(input + "자동으로 불러오기" primary) + helper("⚡ MCP가 …자동 수집") → separator → 제목 → 설명(textarea) → 플랫폼/카테고리(2-col select) → 태그 → 본문(textarea) → form-actions(미리보기 ghost / 임시저장 outline / 등록하기 primary).
- **우측 sticky preview 패널**: mono 라벨 "자동 채움 미리보기" → 미리보기 카드(`MCP fetched` 배지) → 3-state 노트(ok success / load muted+skeleton / fail danger).
- stepper 상태색: done(success 톤), on(primary 채움), 대기(기본).

### S5. AI 큐레이터 `/curator`
- 히어로(축소판, h1 34px) + **command palette**(버튼 "추천 받기", kbd `⌘ ↵`) + 시나리오 칩.
- 2-column(`260px 1fr`).
- **좌측 sticky Agent progress**: mono 헤더 "AGENT PROGRESS" + 세로 타임라인 3스텝. 상태: **done**(an=success ✓), **active**(an=accent + `box-shadow:0 0 0 4px hsl(var(--accent)/.18)`), **wait**(an=muted). 스텝 간 연결선(`::after`).
- **우측 추천 결과**: 그룹 헤더(제목 + "MCP 기준 최신" 배지) + 이유 문장 → rec-card 리스트(단계 칩 `1단계`/mono accent + 아이콘 + 이름/설명 + "의미 92%" accent 배지). 대체 후보 그룹(원본 보기 버튼).
- **금지**: chain-of-thought 장황 노출. 단계/근거/결과만.

### S6. 마이페이지 `/me`
- 프로필 헤드(아바타 56px + 닉네임 20px + mono 이메일 + 프로필 수정 outline) → **탭**(등록한 익스텐션·작성한 댓글·북마크·임시저장, 밑줄형) → 리스트.
- 리스트 아이템: 아이콘 36px + 제목(+draft면 warning 배지) + mono 메타(`플랫폼 · ★평점 · 다운로드 · status`) + 우측 액션(수정 ghost / 원본↗ ghost / 삭제 ghost-danger). 임시저장은 "이어 작성".

---

## 6. 뷰 토글 (View Toggle) — 게시판 증명 장치, 필수

메인 결과 영역은 **카드 뷰 ⇄ 목록 뷰**를 전환한다. 과제의 "기본 게시판 기능"을 시각적으로 증명하는 핵심 장치이므로 생략 금지.

- **토글 UI**: 결과 헤더 우측. `bg:muted; border-radius:8px; padding:3px;` 안에 버튼 2개(카드/목록, mono 12px). 활성 버튼은 `bg:card + box-shadow`. 아이콘은 lucide `LayoutGrid` / `List`.
- **카드 뷰(grid)**: `repeat(3,1fr); gap:12px`. 카드(`ExtensionCard`) = 아이콘38 + 이름/핸들 + match 배지 + 2줄 clamp 설명 + 태그(mono) + 푸터(★평점·다운로드 mono / ✓MCP·unverified 배지). hover: `border-color accent/.45 + 그림자 + translateY(-1px)`.
- **목록 뷰(list) = 전통적 게시판 보드**(`ExtensionListItem`):
  - 컨테이너 `.board`: border + radius + overflow hidden.
  - **테이블 헤더**(mono, 대문자): `익스텐션/태그 | 플랫폼 | 작성자 | 평점 | 댓글 | 등록일`.
  - 행 그리드: `grid-template-columns:minmax(0,1fr) 96px 110px 84px 64px 96px; gap:14px;`
  - 행 구성: 아이콘30 + 제목(+match·MCP 배지 인라인) + 태그 / mono 플랫폼 / 작성자(아바타22+핸들) / ★평점 / 💬 댓글수 / mono 등록일. hover bg `muted/.45`.
  - **목록 뷰에만 작성자·댓글수·등록일을 노출**(게시판 컬럼). 카드 뷰엔 없음.
- 두 뷰 모두 match%·MCP 배지 유지 → "게시판이지만 RAG·MCP가 살아있음"을 동시 표현.
- **반응형**: ≤880px에서 보드 헤더 숨기고 행을 `1fr auto` 2열로 축약(플랫폼·평점·댓글 숨김).

### 6.1 전환 구현 (함정 주의)
React 조건부 렌더링으로 구현: `view` state(`'grid'|'list'`)로 `{view==='grid' ? <GridView/> : <BoardView/>}`.
- **순수 CSS `hidden` 토글 금지**: `.grid{display:grid}`가 `[hidden]{display:none}`을 specificity로 이겨 숨김이 안 먹는 버그가 있다(프로토타입에서 확인). React에서는 조건부 렌더링으로 회피. 부득이 show/hide 방식이면 `[hidden]{display:none !important;}`를 전역에 둘 것.

---

## 7. 인터랙션 / 모션 / 접근성

- hover transition `140~160ms`, transform/opacity 위주. 카드 hover는 `translateY(-1px)` + 그림자. 과한 애니메이션·스크롤 효과 금지.
- `prefers-reduced-motion` 존중. focus-visible 링은 `--ring`(`box-shadow:0 0 0 3px hsl(var(--ring)/.4)`).
- 모든 input에 label/aria-label. 카드 전체 클릭 가능하되 내부 버튼은 개별 접근 가능.
- 모바일: 헤더 내비 축약, command palette 풀폭, 카드 1열, 상세/등록의 우측 패널은 본문 아래로.

---

## 8. 컴포넌트 구조 (권장)

```
src/components/
  layout/   AppHeader, PageShell, SectionHeader
  ui/       (shadcn) button, card, badge, input, textarea, select, tabs, skeleton, avatar, separator
  search/   CommandPalette, SuggestChips, SortSegment, PlatformFilter, ViewToggle
  extension/ ExtensionCard, ExtensionListItem, ExtensionBoard, ExtensionMetaPanel(MCP), CommentList
  submit/   Stepper, UrlImportBox, AutoFillPreview, ExtensionForm
  ai/       AgentProgress, RecommendationCard, RecommendationGroup
  mypage/   ProfileHeader, MyTabs, MyListItem
```

- `CommandPalette`는 메인·큐레이터가 props(placeholder, 버튼 라벨, kbd)로 공유.
- `ExtensionCard`/`ExtensionListItem`은 같은 데이터 타입을 받는 두 표현. `ExtensionBoard`가 list 행들을 감싼다.

---

## 9. Mock 데이터

API 연동 전 UI 작업용. 6건(아이콘 색 포함):

```ts
export const mockExtensions = [
  {id:"1", name:"Raycast GitHub", handle:"@raycast/community", platform:"raycast", author:"raycast",
   desc:"GitHub issues, PR, notifications를 빠르게 확인하고 처리하는 생산성 익스텐션.",
   tags:["devtools","github","productivity"], rating:4.8, downloads:"12.4k", comments:24,
   matchScore:94, mcpVerified:true, updatedAt:"2026.05.21", color:"#ef4444"},
  {id:"2", name:"Obsidian Web Clipper", handle:"@obsidian/plugin", platform:"obsidian", author:"obsidian",
   desc:"웹 페이지를 Obsidian 노트로 저장하고 태그와 메타데이터를 함께 정리합니다.",
   tags:["notes","research","automation"], rating:4.7, downloads:"9.8k", comments:12,
   matchScore:91, mcpVerified:true, updatedAt:"2026.04.30", color:"#7c5cff"},
  {id:"3", name:"Commit Message AI", handle:"@opensource/vscode", platform:"vscode", author:"opensource",
   desc:"코드 변경사항을 분석해 커밋 메시지 초안을 추천합니다.",
   tags:["git","ai","developer"], rating:4.5, downloads:"22.1k", comments:38,
   matchScore:88, mcpVerified:false, updatedAt:"2026.06.02", color:"#3b82f6"},
  {id:"4", name:"Tab Tidy", handle:"@chrome/store", platform:"chrome", author:"chrome",
   desc:"열려 있는 탭을 주제별로 자동 그룹핑하고 세션을 저장합니다.",
   tags:["tabs","browser","focus"], rating:4.6, downloads:"31.2k", comments:17,
   matchScore:85, mcpVerified:true, updatedAt:"2026.05.10", color:"#10b981"},
  {id:"5", name:"Notion Publisher", handle:"@notion/integration", platform:"notion", author:"notion",
   desc:"마크다운 글을 Notion 페이지로 발행하고 태그를 동기화합니다.",
   tags:["notion","publish","markdown"], rating:4.4, downloads:"7.1k", comments:9,
   matchScore:82, mcpVerified:true, updatedAt:"2026.03.28", color:"#f59e0b"},
  {id:"6", name:"Grammar Checker", handle:"@obsidian/plugin", platform:"obsidian", author:"obsidian",
   desc:"문장 톤과 오탈자를 확인하고 대체 표현을 제안합니다.",
   tags:["writing","grammar","ai"], rating:4.7, downloads:"14.0k", comments:21,
   matchScore:79, mcpVerified:true, updatedAt:"2026.05.18", color:"#6366f1"},
];
```

아이콘 라벨은 이름 이니셜 2자(mono, 흰색). 색은 위 `color` 사용.

---

## 10. UI 문구 (한국어 톤 고정)

- 메인 슬로건: `필요한 걸 말하면,` / `맞는 익스텐션을 찾아줘요`(후자 accent)
- lede: `Chrome · Obsidian · VS Code · Raycast에 흩어진 익스텐션을 자연어로 검색하고 비교하세요.`
- 검색 힌트: `의미 기반 검색 · 키워드가 아니라 하려는 일로 찾아요`
- 결과: `128 results · "쿼리"` / `sorted by semantic relevance`
- 상세: `수집된 정보` / `원본 링크 열기` / `비슷한 익스텐션 찾기` / `정보 새로고침`
- 등록: `자동으로 불러오기` / `⚡ MCP가 이름·아이콘·설명·버전·별점·업데이트 정보를 자동으로 가져옵니다.`
- 큐레이터: `어떤 작업을 더 쉽게 만들고 싶나요?`(더 쉽게 accent) / `RAG 검색` `MCP 조회` `추천 조합 생성` / `이 조합을 추천하는 이유`
- 영문 라벨(eyebrow·핸들·플랫폼·정렬 보조)은 소문자 mono 유지: `all chrome obsidian vscode raycast notion`, `sorted by semantic relevance`.

---

## 11. 금지 사항 (재강조)

- 디자인 토큰(§2)·컴포넌트 치수(§4)를 임의로 바꾸지 마라. 프로토타입 재현이 목표다.
- accent 보라를 AI 개입 지점 외에 쓰지 마라.
- 모든 패널을 동일 흰 카드+동일 그림자로 만들지 마라(위계 소멸). command palette가 가장 강한 그림자.
- 데이터/메타데이터에 sans 쓰지 마라(전부 mono).
- 뷰 토글·목록(보드) 뷰를 생략하지 마라(게시판 필수 증명).
- AI Agent의 내부 추론을 장황히 노출하지 마라.
- 비즈니스 로직/API 함수명·데이터 흐름을 깨지 마라(`extendly_spec.md` 우선).
- heavy animation 라이브러리 추가 금지.

---

## 12. 완료 기준 (self-check)

- [ ] §2 토큰이 globals.css에 그대로 들어갔다(HSL 채널 값).
- [ ] body에 3겹 배경(글로우+그리드+페이퍼)이 적용됐다.
- [ ] command palette가 메인·큐레이터에서 가장 강한 그림자로 렌더된다.
- [ ] 데이터·메타데이터가 전부 mono다.
- [ ] accent 보라가 검색 CTA·match·RAG/MCP·eyebrow에만 쓰였다.
- [ ] 6개 화면(S1~S6)이 §5 레이아웃대로 나온다.
- [ ] 메인에 카드/목록 뷰 토글이 작동하고, 목록 뷰가 작성자·댓글수·등록일을 가진 보드다.
- [ ] 상세 우측 MCP 패널에 License·Compatibility·Permissions·수집시각·새로고침이 있다.
- [ ] 등록이 4-step stepper + 3-state 미리보기다.
- [ ] 큐레이터에 done/active/wait 상태의 Agent progress 타임라인이 있다.
- [ ] 반응형(≤880px)에서 깨지지 않는다. focus-visible·reduced-motion 대응.

---

## 13. 산출물 요약 (작업 후 보고)

1. 변경/생성한 파일 목록  2. 새 컴포넌트 목록  3. 각 화면 스크린샷 또는 확인 경로  4. 실행 방법  5. 남은 TODO
