import { Navigate } from "react-router-dom";

export default function RoleRoute({ children, allowedRoles }) {
  const role = (localStorage.getItem("role") || "").trim().toUpperCase();
  const normalized = allowedRoles.map(r => r.toUpperCase());

  return normalized.includes(role)
    ? children
    : <Navigate to="/" />;
}
