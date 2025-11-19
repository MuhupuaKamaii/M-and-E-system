import { HiOutlineExclamationTriangle } from "react-icons/hi2";

export default function AtRiskCard({
  title = "At Risk OMAs",
  body = "One or more OMAs are currently identified as highly vulnerable or compromised. Click to view details and required actions.",
  ctaLabel = "VIEW AT RISK OMAs",
  onClick = () => {},
}) {
  return (
    <div
      className={`npc-atrisk ${onClick ? "is-clickable" : ""}`}
      role={onClick ? "button" : "alert"}
      aria-live="assertive"
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      onKeyDown={(e) => {
        if (onClick && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          onClick();
        }
      }}
    >
      <div className="npc-atrisk__icon">
        <HiOutlineExclamationTriangle size={28} />
      </div>
      <div className="npc-atrisk__text">
        <h3>{title}</h3>
        <p>{body}</p>
      </div>
      <button type="button" className="npc-atrisk__cta" onClick={onClick}>
        {ctaLabel}
      </button>
    </div>
  );
}
