import {
  HiOutlineCheckCircle,
  HiOutlineXCircle,
  HiOutlineArrowPathRoundedSquare,
} from "react-icons/hi2";

const stageIcons = {
  planning: HiOutlineArrowPathRoundedSquare,
  execution: HiOutlineCheckCircle,
  closure: HiOutlineCheckCircle,
  review: HiOutlineArrowPathRoundedSquare,
};

export default function WorkflowStageCard({
  title,
  description,
  stats,
  stageKey,
  statusText,
  statusTone = "neutral",
}) {
  const Icon = stageIcons[stageKey] || HiOutlineArrowPathRoundedSquare;
  const toneMap = {
    approved: { Icon: HiOutlineCheckCircle },
    rejected: { Icon: HiOutlineXCircle },
    neutral: { Icon: HiOutlineArrowPathRoundedSquare },
  };
  const { Icon: StatusIcon } = toneMap[statusTone] || toneMap.neutral;

  return (
    <article className={`npc-workflow npc-workflow--${statusTone}`}>
      <header>
        <div className="npc-workflow__icon">
          <Icon size={20} />
        </div>
        <div>
          <p className="npc-workflow__title">{title}</p>
          <p className="npc-workflow__description">{description}</p>
        </div>
      </header>

      <div className="npc-workflow__stats">
        {stats.map((item) => (
          <div key={item.label}>
            <p className="npc-workflow__value">{item.value}</p>
            <p className="npc-workflow__label">{item.label}</p>
          </div>
        ))}
      </div>

      <footer>
        <span className={`npc-workflow__status npc-workflow__status--${statusTone}`}>
          <StatusIcon size={14} />
          {statusText}
        </span>
      </footer>
    </article>
  );
}

