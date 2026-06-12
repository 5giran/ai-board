type RecommendationCardProps = {
  stepLabel?: string;
  iconLabel: string;
  iconColor: string;
  name: string;
  description: string;
  reason?: string;
  score?: number;
  actionLabel?: string;
};

export function RecommendationCard({
  stepLabel,
  iconLabel,
  iconColor,
  name,
  description,
  reason,
  score,
  actionLabel,
}: RecommendationCardProps) {
  return (
    <div className="rec-card">
      {stepLabel ? <span className="rec-step">{stepLabel}</span> : null}
      <span className="rec-ico" style={{ background: iconColor }}>
        {iconLabel}
      </span>
      <div className="rb">
        <h4>{name}</h4>
        <p>{description}</p>
        {reason ? <div className="rec-reason">{reason}</div> : null}
      </div>
      {typeof score === "number" ? (
        <span className="badge badge-accent">의미 {score}%</span>
      ) : null}
      {actionLabel ? (
        <button className="btn btn-outline btn-sm" type="button">
          {actionLabel}
        </button>
      ) : null}
    </div>
  );
}
