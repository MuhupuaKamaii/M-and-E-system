import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  HiOutlineHomeModern,
  HiOutlineSquares2X2,
  HiOutlineClipboardDocumentList,
  HiOutlineClipboardDocumentCheck,
  HiOutlineChartPie,
} from "react-icons/hi2";

const navItems = [
  { key: "dashboard", label: "Dashboard", icon: HiOutlineHomeModern, to: () => ({}) },
  { key: "planning", label: "Planning", icon: HiOutlineClipboardDocumentList, to: () => ({ section: "planning" }) },
  { key: "report", label: "Report", icon: HiOutlineChartPie, to: () => ({ section: "report" }) },
];

export default function NpcSideNav({ active = "Dashboard", pendingApprovals = 0 }) {
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const activeLabel = useMemo(() => {
    const params = new URLSearchParams(location.search);
    const section = params.get("section");
    if (section === "planning") return "Planning";
    if (section === "report") return "Report";
    return "Dashboard";
  }, [location.search]);

  const reviewLinks = [
    { label: "Planning", stage: "planning" },
    { label: "Analytic", stage: "analytic" },
    { label: "Closure", stage: "closure" },
  ];

  const handleReviewNavigate = (stage) => {
    navigate(`/npc-dashboard?stage=${stage}`);
  };

  const analyticsGroups = [
    { label: "OMA Analytics", key: "oma" },
    { label: "NPC Analytics", key: "npc" },
  ];

  return (
    <aside className="npc-sidenav">
      <div>
        <div className="npc-sidenav__list">
          {navItems.map(({ key, label, icon: Icon, to }) => (
            <button
              key={key}
              className={`npc-sidenav__item ${activeLabel === label ? "is-active" : ""}`}
              type="button"
              onClick={() => {
                const params = to ? to() : {};
                const query = new URLSearchParams(params).toString();
                navigate(query ? `/npc-dashboard?${query}` : "/npc-dashboard");
              }}
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
              <span>Analytics</span>
            </button>
            {isReviewOpen && (
              <div className="npc-sidenav__submenu">
                {analyticsGroups.map((group) => (
                  <button
                    key={group.key}
                    type="button"
                    onClick={() => navigate(`/npc-dashboard?analyticsGroup=${group.key}`)}
                  >
                    {group.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
}

