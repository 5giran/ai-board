# 12. RAG 기능 설계와 구현: 자연어 익스텐션 검색

## 이번 챕터 목표

- Extendly 익스텐션 데이터와 LLM을 연결하는 RAG 기능을 설계한다.
- embedding, vector DB, retrieval, generation 흐름을 이해한다.
- 사용자가 필요한 기능을 자연어로 말하면 의미 기반으로 익스텐션을 찾는 기능을 구현한다.

## 먼저 이해할 개념

- Embedding: 텍스트를 벡터로 바꾸는 과정
- Vector search: 의미적으로 가까운 데이터를 찾는 검색
- Retrieval: 질문과 관련된 문서를 가져오는 단계
- Generation: 가져온 문서를 근거로 답변을 생성하는 단계
- Grounding: 답변이 근거 데이터에 묶이도록 하는 것
- Similarity score: 벡터 거리 또는 유사도를 UI의 `N% 일치`로 환산한 값

## Extendly RAG 정의

- 데이터 소스: 자체 DB의 `Extension` 레코드
- embedding 대상: `title + description + tags`
- 저장 위치: `Extension.embedding` pgvector 컬럼
- 검색 방식: 사용자 자연어 query embedding 후 pgvector cosine similarity top-K 검색
- UI 차별점: 일반 키워드 검색과 달리 카드에 `N% 일치` 또는 `의미 일치 높음` badge 표시
- endpoint: `POST /ai/search`

## 직접 구현할 파일/기능

- `Extension.embedding` 저장 구조
- embedding 생성 service
- 익스텐션 등록/수정 시 embedding 생성 흐름
- 자연어 의미 검색 API `POST /ai/search`
- 상세 화면의 “비슷한 익스텐션 찾기” 기능
- 검색 결과의 match score 응답
- 선택 사항: 상위 결과에 대해 “왜 맞는지” 한 줄 추천 이유 생성

## 구현 전에 스스로 답할 질문

- RAG 데이터 소스는 익스텐션 title, description, tags 중 어디까지 포함할까?
- 새 익스텐션이 작성될 때 embedding은 언제 만들까?
- 검색 결과를 몇 개까지 LLM에 넣을까?
- RAG 검색 결과가 0개일 때 UI는 어떤 다음 행동을 제안할까?
- 일반 키워드 검색과 의미 검색은 API와 UI에서 어떻게 구분할까?
- AI가 설명을 생성한다면 출처 익스텐션 id를 반드시 함께 줄 수 있을까?

## 단계별 실습 과제

1. `Extension` entity에 embedding 컬럼을 추가하는 migration 계획을 세운다.
2. embedding 대상 문자열을 `title + description + tags`로 만드는 함수를 작성한다.
3. pgvector extension 사용 방법을 확인한다.
4. embedding 생성 흐름을 service로 분리한다.
5. 익스텐션 생성/수정 시 embedding을 생성하거나 재생성한다.
6. 사용자 query를 embedding으로 변환한다.
7. pgvector cosine similarity로 top-K 익스텐션을 조회한다.
8. 유사도를 `matchScore` 퍼센트로 환산한다.
9. `POST /ai/search` 응답에 `extension`, `score`, `matchScore`, 선택적으로 `reason`을 포함한다.
10. 프론트에서 RAG 검색 결과일 때만 match badge를 노출한다.

## 힌트

- 힌트 1: 처음에는 전체 본문보다 title, description, tags만 대상으로 삼아도 충분하다.
- 힌트 2: vector query는 TypeORM repository보다 raw SQL이 단순할 수 있다.
- 힌트 3: RAG 응답은 “검색 결과”와 “생성된 추천 이유”를 분리하면 검증하기 좋다.
- 힌트 4: embedding 모델과 차원 수는 환경변수와 migration이 함께 맞아야 한다.
- 힌트 5: similarity score는 모델/거리식에 따라 의미가 달라지므로 UI 문구는 과장하지 않는다.

## 검증 명령과 성공 기준

```bash
pnpm --filter api build
pnpm --filter api test
```

성공 기준:

- 자연어 query로 관련 익스텐션이 검색된다.
- 응답에 `matchScore`가 포함된다.
- 일반 키워드 검색과 RAG 검색의 차이를 설명할 수 있다.
- RAG 구조를 데이터 소스, embedding, vector search, 선택적 LLM 요약으로 설명할 수 있다.

## 나에게 공유할 내용

- 구현한 RAG 검색 흐름
- embedding 대상과 metadata
- retrieval 결과 예시
- `POST /ai/search` 요청/응답 예시
- 프론트 카드에서 match badge를 표시한 방식

## 회고 질문

- RAG가 단순 LLM 호출보다 신뢰도를 높이는 지점은 어디였나?
- 사용자의 “필요한 기능” 문장을 데이터베이스 검색으로 바꾸는 과정에서 가장 어려웠던 부분은 무엇이었나?
