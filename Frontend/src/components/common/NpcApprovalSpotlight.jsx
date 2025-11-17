import { HiOutlineCheckBadge, HiOutlineClock, HiOutlineExclamationTriangle } from "react-icons/hi2";

export default function NpcApprovalSpotlight({
  pending = 0,
  approved = 0,
  rejected = 0,
  variant = "full",
}) {
  if (variant === "compact") {
    return (
      <div className="npc-approval npc-approval--compact">
        <div className="npc-approval__icon">
          <HiOutlineCheckBadge size={20} />
        </div>
        <div>
          <p>NPC approval gate</p>
          <span>{pending} reports waiting</span>
        </div>
      </div>
    );
  }

  return (
    <div className="npc-card npc-approval">
      <div className="npc-card__head">
        <div>
          <p className="npc-card__title">NPC approval gate</p>
          <p className="npc-card__subtitle">Validate feasibility & KPIs</p>
        </div>
      </div>
      <div className="npc-approval__stats">
        <div>
          <HiOutlineClock size={18} />
          <div>
            <p>{pending}</p>
            <span>Queued</span>
          </div>
        </div>
        <div>
          <HiOutlineCheckBadge size={18} />
          <div>
            <p>{approved}</p>
            <span>Approved</span>
          </div>
        </div>
        <div>
          <HiOutlineExclamationTriangle size={18} />
          <div>
            <p>{rejected}</p>
            <span>Returned</span>
          </div>
        </div>
      </div>
      <button className="npc-primary" type="button">
        Open approval queue
      </button>
    </div>
  );
}

