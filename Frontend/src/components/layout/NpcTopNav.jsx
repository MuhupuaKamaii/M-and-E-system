import { HiOutlineMagnifyingGlass } from "react-icons/hi2";

export default function NpcTopNav() {
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

      <div className="npc-nav__controls">
        <div className="npc-nav__search">
          <HiOutlineMagnifyingGlass size={18} />
          <input type="search" placeholder="Search programmes, reports, OMAs..." />
        </div>

        <button className="npc-nav__admin" type="button">
          Admin settings
        </button>
      </div>
    </header>
  );
}

