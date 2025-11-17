import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  HiOutlineHomeModern,
  HiOutlineSquares2X2,
  HiOutlineClipboardDocumentList,
  HiOutlineClipboardDocumentCheck,
  HiOutlineChartPie,
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
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const navigate = useNavigate();

  const reviewLinks = [
    { label: "Planning", stage: "planning" },
    { label: "Review", stage: "review" },
    { label: "Closure", stage: "closure" },
  ];

  const handleReviewNavigate = (stage) => {
    navigate(`/npc-dashboard?stage=${stage}`);
  };

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
          <div className="npc-sidenav__review">
            <button
              className={`npc-sidenav__item npc-sidenav__item--review ${isReviewOpen ? "is-open" : ""}`}
              type="button"
              onClick={() => setIsReviewOpen((prev) => !prev)}
            >
              <HiOutlineClipboardDocumentCheck size={20} />
              <span>Review Queue</span>
            </button>
            {isReviewOpen && (
              <div className="npc-sidenav__submenu">
                {reviewLinks.map((link) => (
                  <button key={link.stage} type="button" onClick={() => handleReviewNavigate(link.stage)}>
                    {link.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <NpcReviewerCard />
    </aside>
  );
}

