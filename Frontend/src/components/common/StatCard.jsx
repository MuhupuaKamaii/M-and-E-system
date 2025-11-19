import { HiArrowTrendingUp, HiArrowTrendingDown } from "react-icons/hi2";

export default function StatCard({
  label,
  value,
  subtext,
  trend = { direction: "up", value: "0%" },
  tone = "default",
  onClick,
}) {
  const isUp = trend.direction === "up";
  const TrendIcon = isUp ? HiArrowTrendingUp : HiArrowTrendingDown;

  return (
    <div
      className={`npc-stat npc-stat--${tone} ${onClick ? "is-clickable" : ""}`}
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
      <div>
        <p className="npc-stat__label">{label}</p>
        <p className="npc-stat__value">{value}</p>
        {subtext && <p className="npc-stat__subtext">{subtext}</p>}
      </div>
      <div className={`npc-trend ${isUp ? "npc-trend--up" : "npc-trend--down"}`}>
        <TrendIcon size={16} />
        <span>{trend.value}</span>
      </div>
    </div>
  );
}

