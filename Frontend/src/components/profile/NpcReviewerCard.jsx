import { HiOutlineUserCircle, HiOutlineEnvelope, HiOutlineClock } from "react-icons/hi2";

export default function NpcReviewerCard({
  name = "NPC Reviewer",
  role = "National Reviewer",
  email = "npc.reviewer@npc.gov.na",
  lastSeen = "Today, 08:15",
}) {
  return (
    <div className="npc-reviewer">
      <div className="npc-reviewer__avatar">
        <HiOutlineUserCircle size={28} />
      </div>
      <div>
        <p className="npc-reviewer__name">{name}</p>
        <p className="npc-reviewer__role">{role}</p>
      </div>
      <div className="npc-reviewer__meta">
        <p>
          <HiOutlineEnvelope size={16} />
          <span>{email}</span>
        </p>
        <p>
          <HiOutlineClock size={16} />
          <span>Last review: {lastSeen}</span>
        </p>
      </div>
    </div>
  );
}

