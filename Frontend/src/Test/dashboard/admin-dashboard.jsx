import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AddUser from "../pages/AddUser";
import UserManagement from "../pages/UserManagement";
import UserActivityTracking from "../pages/UserActivityTracking";
import ReportsPage from "../pages/ReportsPage";

import {
  FiUsers,
  FiSettings,
  FiHome,
  FiLogOut,
  FiUserPlus,
  FiActivity
} from "react-icons/fi";

// Chart.js Imports
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
} from "chart.js";

import { Pie, Bar } from "react-chartjs-2";
import CountUp from "react-countup";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

export default function AdminDashboard() {
  const [page, setPage] = useState("dashboard");
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // Detect URL query params so external pages can open specific sections
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const qPage = params.get("page");
    const qUserId = params.get("userId");

    if (qPage === "tracking" || qUserId) {
      setPage("tracking");
    }
  }, []);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/dashboard/stats", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        if (res.status === 401) {
          localStorage.clear();
          navigate("/login");
          return;
        }
        throw new Error("Failed to fetch dashboard statistics");
      }

      const data = await res.json();
      setStats(data);
    } catch (err) {
      console.error("Error fetching dashboard stats:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("role");
    localStorage.removeItem("fullName");
    localStorage.removeItem("organisationId");
    localStorage.removeItem("focusAreaId");
    navigate("/login");
  };

  const handleUserCreated = () => {
    fetchDashboardStats();
    setShowAddUserModal(false);
  };

  // Prepare chart data
  const pieData = stats && {
    labels: ["Admins", "NPC Users", "OMA Users"],
    datasets: [
      {
        data: [stats.admins, stats.npcUsers, stats.omaUsers],
        backgroundColor: ["#003366", "#0056a6", "#00a6ff"],
        hoverOffset: 10,
      },
    ],
  };

  const barData = stats && {
    labels: stats.organisations.map((org) => org.name),
    datasets: [
      {
        label: "Users per Organisation",
        data: stats.organisations.map((org) => org.users),
        backgroundColor: "#003366",
        borderRadius: 6,
      },
    ],
  };

  const styles = {
    container: { display: "flex", minHeight: "100vh", fontFamily: "'Segoe UI', sans-serif", backgroundColor: "#f4f6f8", color: "#1a1a1a" },
    sidebar: { width: "260px", backgroundColor: "#0d1b2a", color: "#e0e6ed", display: "flex", flexDirection: "column", padding: "30px 20px", justifyContent: "space-between" },
    logo: { fontSize: "1.6rem", fontWeight: "700", marginBottom: "35px" },
    menu: { display: "flex", flexDirection: "column", gap: "15px" },
    menuItem: { display: "flex", alignItems: "center", gap: "12px", padding: "12px 16px", borderRadius: "8px", cursor: "pointer", fontSize: "1rem" },
    activeMenuItem: { backgroundColor: "#1b2a41", fontWeight: 600 },
    bottomMenu: { marginTop: "auto", display: "flex", flexDirection: "column", gap: "12px" },
    main: { flex: 1, padding: "40px 50px" },
    header: { fontSize: "2rem", fontWeight: "700" },
    subtext: { opacity: 0.7, marginBottom: "25px" },
    card: { backgroundColor: "#fff", padding: "30px", borderRadius: "14px", boxShadow: "0 4px 18px rgba(0,0,0,0.12)", marginBottom: "30px" },
    buttonPrimary: { padding: "10px 20px", background: "#003366", color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer", display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" },
    modalOverlay: { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000 },
    modalContent: { background: "#fff", padding: "30px", borderRadius: "12px", width: "600px", maxHeight: "80vh", overflowY: "auto" },
    loadingContainer: { display: "flex", justifyContent: "center", alignItems: "center", minHeight: "300px", fontSize: "1.2rem", color: "#666" },
    errorContainer: { padding: "20px", backgroundColor: "#fee", color: "#c00", borderRadius: "8px", marginBottom: "20px" },
    retryButton: { padding: "8px 16px", background: "#003366", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer", marginTop: "10px" },
  };

  const renderDashboardOverview = () => {
    if (loading) {
      return <div style={styles.loadingContainer}>Loading dashboard data...</div>;
    }

    if (error) {
      return (
        <div style={styles.errorContainer}>
          <strong>Error:</strong> {error}
          <br />
          <button style={styles.retryButton} onClick={fetchDashboardStats}>Retry</button>
        </div>
      );
    }

    if (!stats) {
      return <div style={styles.loadingContainer}>No data found.</div>;
    }

    return (
      <>
        <h1 style={styles.header}>Dashboard Overview</h1>
        <p style={styles.subtext}>Welcome! Monitor system statistics and manage users efficiently.</p>

        <div style={{ display: "flex", gap: "20px", flexWrap: "wrap", marginBottom: "30px" }}>
          {[
            { label: "Total Users", value: stats.totalUsers },
            { label: "Admins", value: stats.admins },
            { label: "NPC Users", value: stats.npcUsers },
            { label: "OMA Users", value: stats.omaUsers },
          ].map((item, idx) => (
            <div key={idx} style={{ background: "#0d1b2a", color: "#fff", padding: "25px", borderRadius: "12px", flex: "1 1 200px" }}>
              <div style={{ fontSize: "1.8rem", fontWeight: 700 }}>
                <CountUp end={item.value} duration={1.5} />
              </div>
              <div>{item.label}</div>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
          <div style={{ ...styles.card, flex: "1 1 400px" }}>
            <h3>Users by Role</h3>
            <Pie data={pieData} />
          </div>

          <div style={{ ...styles.card, flex: "1 1 400px" }}>
            <h3>Users per Organisation</h3>
            {stats.organisations.length > 0 ? (
              <Bar data={barData} options={{ responsive: true, plugins: { legend: { display: false } } }} />
            ) : (
              <p style={{ color: "#666", textAlign: "center", padding: "20px" }}>No organisation data available</p>
            )}
          </div>
        </div>
      </>
    );
  };

  return (
    <div style={styles.container}>
      {/* Sidebar */}
      <aside style={styles.sidebar}>
        <div>
          <div style={styles.logo}>Admin Panel</div>
          <div style={styles.menu}>
            <div style={{ ...styles.menuItem, ...(page === "dashboard" ? styles.activeMenuItem : {}) }} onClick={() => setPage("dashboard")}>
              <FiHome /> Dashboard Overview
            </div>
            <div style={{ ...styles.menuItem, ...(page === "users" ? styles.activeMenuItem : {}) }} onClick={() => setPage("users")}>
              <FiUsers /> User Management
            </div>
            <div style={{ ...styles.menuItem, ...(page === "tracking" ? styles.activeMenuItem : {}) }} onClick={() => setPage("tracking")}>
              <FiActivity /> User Activity Tracking
            </div>
            <div style={{ ...styles.menuItem, ...(page === "reports" ? styles.activeMenuItem : {}) }} onClick={() => setPage("reports")}>
              <FiSettings /> Reports
            </div>
          </div>
        </div>

        <div style={styles.bottomMenu}>
          <div style={styles.menuItem}><FiSettings /> System Settings</div>
          <div style={styles.menuItem} onClick={handleLogout}><FiLogOut /> Logout</div>
        </div>
      </aside>

      {/* Main */}
      <main style={styles.main}>
        {page === "dashboard" && renderDashboardOverview()}

        {page === "users" && (
          <>
            <h1 style={styles.header}>User Management</h1>
            <button style={styles.buttonPrimary} onClick={() => setShowAddUserModal(true)}>
              <FiUserPlus /> Add User
            </button>
            <div style={styles.card}>
              <UserManagement onUserUpdated={fetchDashboardStats} />
            </div>
          </>
        )}

        {page === "tracking" && (
          <>
            <h1 style={styles.header}>User Activity Tracking</h1>
            <div style={styles.card}>
              <UserActivityTracking />
            </div>
          </>
        )}

        {page === "reports" && (
          <>
            <h1 style={styles.header}>Reports</h1>
            <div style={styles.card}>
              <ReportsPage />
            </div>
          </>
        )}
      </main>

      {/* Add User Modal */}
      {showAddUserModal && (
        <div style={styles.modalOverlay} onClick={() => setShowAddUserModal(false)}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h2 style={{ marginBottom: "20px" }}>Add New User</h2>
            <AddUser onUserCreated={handleUserCreated} />

            <button
              style={{
                padding: "10px 20px",
                background: "#ccc",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                marginTop: 20,
              }}
              onClick={() => setShowAddUserModal(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
