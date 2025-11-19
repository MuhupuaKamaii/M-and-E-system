import { motion } from "framer-motion";

export default function GlowCard({ title, subtitle, rightSlot = null, tone = "default", children }) {
  const glow = tone === "success" ? "0 0 24px rgba(47,155,98,0.35)" : tone === "alert" ? "0 0 24px rgba(192,52,42,0.35)" : "0 0 24px rgba(124,77,255,0.25)";
  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ type: "spring", stiffness: 300, damping: 22 }}
      style={{
        background: "rgba(255,255,255,0.06)",
        border: "1px solid rgba(255,255,255,0.12)",
        borderRadius: 16,
        padding: 16,
        boxShadow: glow,
        backdropFilter: "blur(12px)",
      }}
    >
      {(title || subtitle || rightSlot) && (
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
          <div>
            {title && <p style={{ margin: 0, fontWeight: 700 }}>{title}</p>}
            {subtitle && (
              <p style={{ margin: "4px 0 0", opacity: 0.8, fontSize: 14 }}>{subtitle}</p>
            )}
          </div>
          {rightSlot}
        </div>
      )}
      {children}
    </motion.div>
  );
}
