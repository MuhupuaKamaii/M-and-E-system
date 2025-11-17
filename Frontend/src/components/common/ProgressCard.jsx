export default function ProgressCard({
  title,
  programme,
  progress = 0,
  targetLabel = "Target",
  status = "On Track",
  badgeColor = "var(--accent-teal)",
}) {
  return (
    <article className="npc-progress">
      <div className="npc-progress__head">
        <div>
          <p className="npc-progress__title">{title}</p>
          <p className="npc-progress__programme">{programme}</p>
        </div>
        <span className="npc-progress__badge" style={{ backgroundColor: badgeColor }}>
          {status}
        </span>
      </div>
      <div className="npc-progress__bar">
        <div style={{ width: `${progress}%` }} />
      </div>
      <div className="npc-progress__meta">
        <span>{progress}% progress</span>
        <span>{targetLabel}</span>
      </div>
    </article>
  );
}

