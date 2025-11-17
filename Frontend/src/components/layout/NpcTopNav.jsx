import { HiOutlineBellAlert, HiOutlineEnvelope, HiOutlineUserCircle, HiOutlineArrowRight, HiOutlineMagnifyingGlass } from "react-icons/hi2";

const quickLinks = [
  { label: "Opportunities", href: "#" },
  { label: "Public Policies", href: "#" },
  { label: "Publications", href: "#" },
];

export default function NpcTopNav({ userName = "NPC Reviewer" }) {
  return (
    <header className="npc-nav">
      <div className="npc-nav__brand">
        <img
          src="https://npc.gov.na/wp-content/uploads/2020/05/cropped-cropped-NPC-logo.png"
          alt="Namibia NPC logo"
          className="npc-nav__logo"
        />
        <div>
          <p className="npc-nav__title">National Planning Commission</p>
          <p className="npc-nav__subtitle">NDP6 Monitoring Console</p>
        </div>
      </div>

      <div className="npc-nav__search">
        <HiOutlineMagnifyingGlass size={18} />
        <input type="search" placeholder="Search programmes, reports, OMAs..." />
      </div>

      <div className="npc-nav__links">
        {quickLinks.map((link) => (
          <a key={link.label} href={link.href}>
            {link.label}
          </a>
        ))}
      </div>

      <div className="npc-nav__actions">
        <button aria-label="Notifications" className="npc-icon-button">
          <HiOutlineBellAlert size={20} />
          <span className="npc-indicator">3</span>
        </button>
        <button aria-label="Messages" className="npc-icon-button">
          <HiOutlineEnvelope size={20} />
        </button>
        <div className="npc-profile">
          <HiOutlineUserCircle size={28} />
          <div>
            <p className="npc-profile__name">{userName}</p>
            <button className="npc-profile__cta">
              View profile <HiOutlineArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

