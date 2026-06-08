# 12. RAG 기능 설계와 구현

## 이번 챕터 목표

- 게시판 데이터와 LLM을 연결하는 RAG 기능을 설계한다.
- embedding, vector DB, retrieval, generation 흐름을 이해한다.
- 과제 요구사항에 맞는 RAG 기반 기능을 하나 구현한다.

## 먼저 이해할 개념

- Embedding: 텍스트를 벡터로 바꾸는 과정
- Vector search: 의미적으로 가까운 데이터를 찾는 검색
- Retrieval: 질문과 관련된 문서를 가져오는 단계
- Generation: 가져온 문서를 근거로 답변을 생성하는 단계
- Grounding: 답변이 근거 데이터에 묶이도록 하는 것

## 직접 구현할 파일/기능

- 게시글 또는 FAQ를 embedding 대상으로 선택
- pgvector 기반 저장 구조
- embedding 생성 service
- 유사 게시글 추천 또는 지식 베이스 Q&A API
- 출처 링크가 포함된 AI 응답

## 구현 전에 스스로 답할 질문

- RAG 데이터 소스는 게시글, 댓글, 공지 중 무엇으로 시작할까?
- 새 글이 작성될 때 embedding은 언제 만들까?
- 검색 결과를 몇 개까지 LLM에 넣을까?
- AI 답변에 출처가 없으면 어떤 문제가 생길까?

## 단계별 실습 과제

1. 구현할 RAG 기능을 하나 고른다.
2. embedding 대상 테이블 또는 metadata를 설계한다.
3. pgvector extension 사용 방법을 확인한다.
4. embedding 생성 흐름을 service로 분리한다.
5. 사용자 질문 또는 글 초안으로 관련 게시글을 검색한다.
6. 검색 결과를 요약하거나 답변 생성에 사용한다.
7. 응답에 관련 게시글 id, title, url을 포함한다.

## 힌트

- 힌트 1: 처음에는 모든 게시글보다 게시글 본문만 대상으로 삼아도 충분하다.
- 힌트 2: vector query는 TypeORM repository보다 raw SQL이 단순할 수 있다.
- 힌트 3: RAG 응답은 “AI 답변”과 “근거 목록”을 분리하면 검증하기 좋다.

## 검증 명령과 성공 기준

```bash
pnpm --filter api build
pnpm --filter api test
```

성공 기준:

- 관련 게시글이 검색된다.
- AI 응답에 근거 게시글이 함께 포함된다.
- RAG 구조를 데이터 소스, embedding, vector search, LLM 호출로 설명할 수 있다.

## 나에게 공유할 내용

- 선택한 RAG 기능
- embedding 대상과 metadata
- retrieval 결과 예시
- AI 응답 예시와 출처

## 회고 질문

- RAG가 단순 LLM 호출보다 신뢰도를 높이는 지점은 어디였나?
