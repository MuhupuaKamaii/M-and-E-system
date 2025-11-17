import {
  HiOutlineHomeModern,
  HiOutlineSquares2X2,
  HiOutlineClipboardDocumentList,
  HiOutlineChartPie,
  HiOutlineCog6Tooth,
} from "react-icons/hi2";
import NpcReviewerCard from "../profile/NpcReviewerCard";
import NpcApprovalSpotlight from "../common/NpcApprovalSpotlight";

const navItems = [
  { label: "Dashboard", icon: HiOutlineHomeModern },
  { label: "All Programmes", icon: HiOutlineSquares2X2 },
  { label: "All Reports", icon: HiOutlineClipboardDocumentList },
  { label: "Analytics", icon: HiOutlineChartPie },
];

export default function NpcSideNav({ active = "Dashboard", pendingApprovals = 0 }) {
  return (
    <aside className="npc-sidenav">
      <div>
        <NpcApprovalSpotlight pending={pendingApprovals} variant="compact" />
        <div className="npc-sidenav__list">
          {navItems.map(({ label, icon: Icon }) => (
            <button
              key={label}
              className={`npc-sidenav__item ${active === label ? "is-active" : ""}`}
              type="button"
            >
              <Icon size={20} />
              <span>{label}</span>
            </button>
          ))}
        </div>
      </div>
      <NpcReviewerCard />
    </aside>
  );
}

