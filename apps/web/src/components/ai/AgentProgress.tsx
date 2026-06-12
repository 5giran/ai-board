export type RunStatus = "idle" | "running" | "done" | "error";

type AgentProgressProps = {
  status: RunStatus;
};

const steps = [
  {
    title: "RAG 검색",
    description: "비슷한 익스텐션을 찾았어요",
  },
  {
    title: "MCP 조회",
    description: "다운로드·업데이트·GitHub 활성도 확인",
  },
  {
    title: "추천 조합 생성",
    description: "목표에 맞는 워크플로우로 묶는 중",
  },
];

export function AgentProgress({ status }: AgentProgressProps) {
  return (
    <aside className="agent">
      <div className="agent-h">Agent progress</div>
      {steps.map((step, index) => {
        const state = getStepState(status, index);

        return (
          <div className={`astep ${state}`} key={step.title}>
            <span className="an">{state === "done" ? "✓" : index + 1}</span>
            <div>
              <div className="at">{step.title}</div>
              <div className="ad">{step.description}</div>
            </div>
          </div>
        );
      })}
    </aside>
  );
}

function getStepState(status: RunStatus, index: number) {
  if (status === "done") {
    return "done";
  }

  if (status === "running") {
    if (index === 0) {
      return "done";
    }

    return index === 1 ? "active" : "wait";
  }

  if (status === "error") {
    return index === 0 ? "done" : index === 1 ? "active" : "wait";
  }

  return index === 0 ? "active" : "wait";
}
