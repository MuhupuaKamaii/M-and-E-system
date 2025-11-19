export default function ProgressCard({
  title,
  programme,
  progress = 0,
  targetLabel = "Target",
  status = "On Track",
  badgeColor = "var(--accent-teal)",
  onClick,
}) {
  const s = (status || "").toLowerCase();
  const tone = s.includes("track") || s.includes("good") ? "good" : s.includes("attention") || s.includes("warning") ? "warning" : "bad";
  const motionClass =
    status.toLowerCase().includes("attention")
      ? "npc-attention-pulse"
      : status.toLowerCase().includes("review")
      ? "npc-deadline-blink"
      : "";
  return (
    <article
      className={`npc-progress npc-progress--${tone} ${motionClass} ${onClick ? "is-clickable" : ""}`}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      onKeyDown={(e) => {
        if (onClick && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          onClick();
        }
      }}
    >
      <div className="npc-progress__head">
        <div>
          <p className="npc-progress__title">{title}</p>
          <p className="npc-progress__programme">{programme}</p>
        </div>
        <span className={`npc-progress__badge npc-progress__badge--${tone}`} style={{ backgroundColor: badgeColor }}>
          {status}
        </span>
      </div>
      <div className="npc-progress__bar">
        <div className="npc-shimmer-bar" style={{ width: `${progress}%` }} />
      </div>
      <div className="npc-progress__meta">
        <span>{progress}% progress</span>
        <span>{targetLabel}</span>
      </div>
    </article>
  );
}

