type StepperProps = {
  currentStep: number;
};

const steps = ["원본 URL", "자동 채움", "직접 수정", "제출"];

export function Stepper({ currentStep }: StepperProps) {
  return (
    <div className="stepper" aria-label="등록 단계">
      {steps.map((step, index) => {
        const stepNumber = index + 1;
        const className =
          stepNumber < currentStep
            ? "step done"
            : stepNumber === currentStep
              ? "step on"
              : "step";

        return (
          <div className={className} key={step}>
            <span className="sn">{stepNumber < currentStep ? "✓" : stepNumber}</span>
            <span className="st">{step}</span>
          </div>
        );
      })}
    </div>
  );
}
