export default function ActivityTimeline({ items = [] }) {
  return (
    <div className="npc-card">
      <div className="npc-card__head">
        <div>
          <p className="npc-card__title">Latest activity</p>
          <p className="npc-card__subtitle">Auto-synced from workflow</p>
        </div>
      </div>

      <ul className="npc-timeline">
        {items.map((item) => (
          <li key={item.id} className="npc-timeline__item">
            <div className="npc-timeline__dot" />
            <div>
              <p className="npc-timeline__title">{item.title}</p>
              <p className="npc-timeline__meta">
                {item.oma} • {item.timeAgo}
              </p>
            </div>
            <span className="npc-timeline__tag">{item.status}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

