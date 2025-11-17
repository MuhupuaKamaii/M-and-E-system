// AdminDashboard.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AddUser from "../pages/AddUser";
import UserManagement from "../pages/UserManagement";
import { FiUsers, FiSettings, FiHome, FiLogOut } from "react-icons/fi";

export default function AdminDashboard() {
  const [activePage, setActivePage] = useState("dashboard");
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token"); // clear auth token
    navigate("/login"); // redirect to login page
  };

  const styles = {
    container: {
      display: "flex",
      minHeight: "100vh",
      fontFamily: "'Segoe UI', sans-serif",
      backgroundColor: "#f4f6f8",
      color: "#1a1a1a",
    },

    // Sidebar
    sidebar: {
      width: "260px",
      backgroundColor: "#0d1b2a",
      color: "#e0e6ed",
      display: "flex",
      flexDirection: "column",
      padding: "30px 20px",
      justifyContent: "space-between",
    },
    logo: {
      fontSize: "1.6rem",
      fontWeight: "700",
      marginBottom: "35px",
      letterSpacing: "1px",
    },
    menu: { display: "flex", flexDirection: "column", gap: "15px" },
    menuItem: {
      display: "flex",
      alignItems: "center",
      gap: "12px",
      padding: "12px 16px",
      borderRadius: "8px",
      cursor: "pointer",
      fontSize: "1rem",
      transition: "all 0.2s",
    },
    activeMenuItem: {
      backgroundColor: "#1b2a41",
      fontWeight: 600,
    },
    menuHover: {
      backgroundColor: "#1a273d",
    },
    bottomMenu: { marginTop: "auto", display: "flex", flexDirection: "column", gap: "12px" },

    // Main content
    main: { flex: 1, padding: "40px 50px" },
    header: { fontSize: "2rem", fontWeight: "700", marginBottom: "10px" },
    subtext: { opacity: 0.7, marginBottom: "25px", fontSize: "1rem" },
    card: {
      backgroundColor: "#fff",
      padding: "30px",
      borderRadius: "14px",
      boxShadow: "0 4px 18px rgba(0,0,0,0.12)",
      marginBottom: "30px",
    },
  };

  return (
    <div style={styles.container}>
      {/* Sidebar */}
      <aside style={styles.sidebar}>
        <div>
          <div style={styles.logo}>Admin Panel</div>
          <div style={styles.menu}>
            <div
              style={{
                ...styles.menuItem,
                ...(activePage === "dashboard" ? styles.activeMenuItem : {}),
              }}
              onClick={() => setActivePage("dashboard")}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#1a273d")}
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor =
                  activePage === "dashboard" ? "#1b2a41" : "transparent")
              }
            >
              <FiHome /> Dashboard Overview
            </div>

            <div
              style={{
                ...styles.menuItem,
                ...(activePage === "users" ? styles.activeMenuItem : {}),
              }}
              onClick={() => setActivePage("users")}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#1a273d")}
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor =
                  activePage === "users" ? "#1b2a41" : "transparent")
              }
            >
              <FiUsers /> User Management
            </div>
          </div>
        </div>

        {/* Bottom Menu */}
        <div style={styles.bottomMenu}>
          <div
            style={styles.menuItem}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#1a273d")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
          >
            <FiSettings /> System Settings
          </div>

          <div
            style={styles.menuItem}
            onClick={handleLogout}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#1a273d")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
          >
            <FiLogOut /> Logout
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main style={styles.main}>
        {activePage === "dashboard" && (
          <>
            <h1 style={styles.header}>Dashboard Overview</h1>
            <p style={styles.subtext}>Quickly add users and monitor system roles.</p>
            <div style={styles.card}>
              <AddUser />
            </div>
          </>
        )}

        {activePage === "users" && (
          <>
            <h1 style={styles.header}>User Management</h1>
            <p style={styles.subtext}>Search, edit, or remove platform users efficiently.</p>
            <div style={styles.card}>
              <UserManagement />
            </div>
          </>
        )}
      </main>
    </div>
  );
}
