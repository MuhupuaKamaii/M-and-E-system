import { useMemo, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FiHome, FiFileText, FiBarChart2 } from "react-icons/fi";

const navItems = [
  { key: "dashboard", label: "Dashboard", icon: FiHome, to: () => ({}) },
  { key: "planning", label: "Planning", icon: FiFileText, to: () => ({ section: "planning" }) },
  { key: "report", label: "Report", icon: FiFileText, to: () => ({ section: "report" }) },
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

  const params = new URLSearchParams(location.search);
  const analyticsGroup = params.get("analyticsGroup");

  // Auto-open Analytics submenu if on analytics pages
  useEffect(() => {
    if (analyticsGroup && !isReviewOpen) setIsReviewOpen(true);
  }, [analyticsGroup]);

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
              <FiBarChart2 size={20} />
              <span>Analytics</span>
            </button>
            {isReviewOpen && (
              <div className="npc-sidenav__submenu">
                <select
                  className="npc-sidenav__select"
                  value={analyticsGroup || ''}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (!val) return;
                    navigate(`/npc-dashboard?analyticsGroup=${val}`);
                  }}
                >
                  <option value="" disabled>Select analytics</option>
                  {analyticsGroups.map((g) => (
                    <option key={g.key} value={g.key}>{g.label}</option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
}

