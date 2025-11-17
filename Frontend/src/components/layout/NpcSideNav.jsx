import { HiOutlineHomeModern, HiOutlineSquares2X2, HiOutlineClipboardDocumentList, HiOutlineChartPie, HiOutlineCog6Tooth, HiOutlineGlobeAlt } from "react-icons/hi2";

const navItems = [
  { label: "Dashboard", icon: HiOutlineHomeModern },
  { label: "All Programmes", icon: HiOutlineSquares2X2 },
  { label: "All Reports", icon: HiOutlineClipboardDocumentList },
  { label: "Review Queue", icon: HiOutlineChartPie },
  { label: "Analytics", icon: HiOutlineGlobeAlt },
  { label: "Admin Settings", icon: HiOutlineCog6Tooth },
];

export default function NpcSideNav({ active = "Dashboard" }) {
  return (
    <aside className="npc-sidenav">
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
    </aside>
  );
}

