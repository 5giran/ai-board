import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { AgentProgress, type RunStatus } from "@/components/ai/AgentProgress";
import { RecommendationCard } from "@/components/ai/RecommendationCard";
import { PageShell } from "@/components/layout/PageShell";
import { CommandPalette } from "@/components/search/CommandPalette";
import { SuggestChips } from "@/components/search/SuggestChips";

export const Route = createFileRoute("/curator")({
  component: CuratorPage,
});

const scenarios = ["개발 생산성", "글쓰기", "공부/리서치", "회의 정리", "브라우저 정리"];

function CuratorPage() {
  const [goal, setGoal] = useState("");
  const [runStatus, setRunStatus] = useState<RunStatus>("idle");
  const selectedScenario = scenarios.includes(goal) ? goal : undefined;

  const handleRun = () => {
    if (!goal.trim()) {
      setRunStatus("idle");
      return;
    }

    setRunStatus("running");
    window.setTimeout(() => {
      setRunStatus(goal.includes("fail") ? "error" : "done");
    }, 700);
  };

  return (
    <PageShell padded>
      <section className="cur-hero">
        <span className="eyebrow">
          <span className="dot" />
          AI Curator · Agent
        </span>
        <h1 className="head" style={{ fontSize: 34 }}>
          어떤 작업을 <em>더 쉽게</em> 만들고 싶나요?
        </h1>
        <p className="lede">
          목표를 입력하면 Agent가 RAG 검색과 MCP 조회를 거쳐 익스텐션 조합을
          추천합니다.
        </p>
        <CommandPalette
          value={goal}
          placeholder="예: 블로그 쓰는 개발자 워크플로우 추천"
          buttonLabel={runStatus === "running" ? "추천 중" : "추천 받기"}
          hint="Agent가 도구를 스스로 골라 실행해요"
          kbd={["⌘", "↵"]}
          inputId="curator-goal"
          inputLabel="AI 큐레이터 목표"
          isActive={Boolean(goal.trim())}
          isSubmitDisabled={!goal.trim() || runStatus === "running"}
          selectedSuggestion={selectedScenario}
          onClear={() => {
            setGoal("");
            setRunStatus("idle");
          }}
          onValueChange={(value) => {
            setGoal(value);
            if (!value.trim()) {
              setRunStatus("idle");
            }
          }}
          onSubmit={handleRun}
        />
        <SuggestChips
          suggestions={scenarios}
          selectedSuggestion={selectedScenario}
          onSelect={(scenario) => {
            setGoal(scenario);
            setRunStatus("done");
          }}
        />
      </section>

      <div className="cur-layout">
        <AgentProgress status={runStatus} />
        <CuratorResults
          status={runStatus}
          onPromptSelect={(prompt) => {
            setGoal(prompt);
            setRunStatus("done");
          }}
          onRetry={handleRun}
        />
      </div>
    </PageShell>
  );
}

type CuratorResultsProps = {
  status: RunStatus;
  onPromptSelect: (prompt: string) => void;
  onRetry: () => void;
};

function CuratorResults({
  status,
  onPromptSelect,
  onRetry,
}: CuratorResultsProps) {
  if (status === "idle") {
    return (
      <div className="state-card">
        <div>
          <h3>목표를 입력해 주세요</h3>
          <p>어떤 작업을 줄이고 싶은지 한 문장으로 적으면 됩니다.</p>
          <div className="prompt-rows">
            {[
              "회의록을 읽고 액션 아이템을 정리하고 싶어요",
              "자료 조사부터 블로그 발행까지 이어지는 흐름이 필요해요",
              "브라우저 탭과 노트가 흩어지는 문제를 줄이고 싶어요",
            ].map((prompt) => (
              <button
                className="prompt-row"
                key={prompt}
                type="button"
                onClick={() => onPromptSelect(prompt)}
              >
                <span>{prompt}</span>
                <span className="mono">↵</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (status === "running") {
    return (
      <div className="state-card">
        <div>
          <span className="badge badge-accent">RAG · MCP</span>
          <h3 style={{ marginTop: 12 }}>추천 조합을 만들고 있어요</h3>
          <p>유사 검색과 외부 메타데이터 확인 단계를 안전하게 표시합니다.</p>
        </div>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="state-card" role="alert">
        <div>
          <span className="badge badge-danger">error</span>
          <h3 style={{ marginTop: 12 }}>추천에 실패했어요</h3>
          <p>목표를 조금 더 구체적으로 적고 다시 시도해 보세요.</p>
          <button className="btn btn-outline" type="button" onClick={onRetry}>
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="rec-group">
        <div className="rec-head">
          <h2>글쓰기 워크플로우 추천</h2>
          <span className="badge badge-success">MCP 기준 최신</span>
        </div>
        <p className="rec-why">
          조사 → 정리 → 발행 단계를 나누어 조합했어요. 각 단계가 자연스럽게
          이어집니다.
        </p>
        <div className="rec-flow">
          <RecommendationCard
            stepLabel="1단계"
            iconLabel="RH"
            iconColor="#10b981"
            name="Research Helper"
            description="브라우저에서 자료를 읽고 PDF/웹문서를 요약합니다."
            reason="조사 단계에서 긴 문서를 짧은 노트 단위로 줄여줍니다."
            score={92}
          />
          <RecommendationCard
            stepLabel="2단계"
            iconLabel="OP"
            iconColor="#7c5cff"
            name="Obsidian Publisher"
            description="노트와 태그를 블로그 초안으로 변환합니다."
            reason="정리된 노트를 발행 가능한 구조로 이어줍니다."
            score={89}
          />
          <RecommendationCard
            stepLabel="3단계"
            iconLabel="GC"
            iconColor="#6366f1"
            name="Grammar Checker"
            description="문장 톤과 오탈자를 확인하고 대체 표현을 제안합니다."
            reason="최종 발행 전에 문장 품질을 빠르게 점검합니다."
            score={86}
          />
        </div>
      </div>

      <div className="rec-group">
        <div className="rec-head">
          <h2 style={{ fontSize: 14 }}>대체 후보</h2>
          <span className="badge badge-muted">Raycast 선호 시</span>
        </div>
        <div className="rec-flow">
          <RecommendationCard
            iconLabel="RS"
            iconColor="#ef4444"
            name="Raycast Snippets"
            description="자주 쓰는 문장·링크·프롬프트를 빠르게 호출합니다."
            reason="반복 입력을 줄여 글쓰기 전환 비용을 낮춥니다."
            actionLabel="원본 보기"
          />
        </div>
      </div>
    </div>
  );
}
