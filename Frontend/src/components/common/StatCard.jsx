import { HiArrowTrendingUp, HiArrowTrendingDown } from "react-icons/hi2";

export default function StatCard({
  label,
  value,
  subtext,
  trend = { direction: "up", value: "0%" },
  tone = "default",
}) {
  const isUp = trend.direction === "up";
  const TrendIcon = isUp ? HiArrowTrendingUp : HiArrowTrendingDown;

  return (
    <article className={`npc-stat npc-stat--${tone}`}>
      <div>
        <p className="npc-stat__label">{label}</p>
        <p className="npc-stat__value">{value}</p>
        {subtext && <p className="npc-stat__subtext">{subtext}</p>}
      </div>
      <div className={`npc-trend ${isUp ? "npc-trend--up" : "npc-trend--down"}`}>
        <TrendIcon size={16} />
        <span>{trend.value}</span>
      </div>
    </article>
  );
}

