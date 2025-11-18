import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AddUser from "../pages/AddUser";
import UserManagement from "../pages/UserManagement";
import { FiUsers, FiSettings, FiHome, FiLogOut, FiUserPlus } from "react-icons/fi";

// Chart.js Imports
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from "chart.js";
import { Pie, Bar } from "react-chartjs-2";
import CountUp from "react-countup";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const API_BASE_URL = "http://localhost:4000/api";

export default function AdminDashboard() {
  const [activePage, setActivePage] = useState("dashboard");
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();


  // Fetch dashboard statistics
  useEffect(() => {
    const fetchStats = async () => {
      const currentToken = localStorage.getItem("token"); // Get fresh token each time


      if (!currentToken) { //using currentToken here instead of token
        navigate("/login");
        return;
      }

      try {
        setLoading(true);

        const response = await fetch(`${API_BASE_URL}/dashboard/stats`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${currentToken}`,
          },
        });


        if (!response.ok) {
          if (response.status === 401) {
            localStorage.clear();
            navigate("/login");
            return;
          }
          throw new Error("Failed to fetch dashboard data");
        }

        const data = await response.json();
        setStats(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching stats:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (activePage === "dashboard") {
      fetchStats();
    }
  }, [activePage, navigate]); //remmove token from dependency array

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("fullName");
    localStorage.removeItem("role");
    localStorage.removeItem("organisationId");
    localStorage.removeItem("focusAreaId");
    navigate("/login");
  };

  // Prepare chart data
  const pieData = stats ? {
    labels: ["Admins", "NPC Users", "OMA Users"],
    datasets: [
      {
        data: [stats.admins, stats.npcUsers, stats.omaUsers],
        backgroundColor: ["#003366", "#0056a6", "#00a6ff"],
        hoverOffset: 10,
      },
    ],
  } : null;

  const barData = stats ? {
    labels: stats.organisations.map((org) => org.name),
    datasets: [
      {
        label: "Users per Organisation",
        data: stats.organisations.map((org) => org.users),
        backgroundColor: "#003366",
        borderRadius: 6,
      },
    ],
  } : null;

  const styles = {
    container: { display: "flex", minHeight: "100vh", fontFamily: "'Segoe UI', sans-serif", backgroundColor: "#f4f6f8", color: "#1a1a1a" },
    sidebar: { width: "260px", backgroundColor: "#0d1b2a", color: "#e0e6ed", display: "flex", flexDirection: "column", padding: "30px 20px", justifyContent: "space-between" },
    logo: { fontSize: "1.6rem", fontWeight: "700", marginBottom: "35px", letterSpacing: "1px" },
    menu: { display: "flex", flexDirection: "column", gap: "15px" },
    menuItem: { display: "flex", alignItems: "center", gap: "12px", padding: "12px 16px", borderRadius: "8px", cursor: "pointer", fontSize: "1rem", transition: "all 0.2s" },
    activeMenuItem: { backgroundColor: "#1b2a41", fontWeight: 600 },
    bottomMenu: { marginTop: "auto", display: "flex", flexDirection: "column", gap: "12px" },
    main: { flex: 1, padding: "40px 50px" },
    header: { fontSize: "2rem", fontWeight: "700", marginBottom: "10px" },
    subtext: { opacity: 0.7, marginBottom: "25px", fontSize: "1rem" },
    card: { backgroundColor: "#fff", padding: "30px", borderRadius: "14px", boxShadow: "0 4px 18px rgba(0,0,0,0.12)", marginBottom: "30px" },
    statsContainer: { display: "flex", gap: "20px", flexWrap: "wrap", marginBottom: "30px" },
    statCard: {
      flex: "1 1 200px",
      background: "#0d1b2a",
      color: "#fff",
      padding: "25px",
      borderRadius: "12px",
      boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
      transition: "0.3s",
      cursor: "pointer",
    },
    statCardHover: { transform: "translateY(-5px)", boxShadow: "0 8px 25px rgba(0,0,0,0.3)" },
    statValue: { fontSize: "1.8rem", fontWeight: "700" },
    statLabel: { opacity: 0.8, marginTop: "5px" },
    chartWrapper: { display: "flex", gap: "20px", flexWrap: "wrap" },
    chartCard: { flex: "1 1 400px", background: "#fff", padding: "20px", borderRadius: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" },
    loadingMsg: { textAlign: "center", padding: "40px", fontSize: "1.2rem", color: "#666" },
    errorMsg: { textAlign: "center", padding: "40px", fontSize: "1.2rem", color: "#dc2626", backgroundColor: "#fee", borderRadius: "8px" },
  };

  const renderDashboardOverview = () => {
    if (loading) {
      return <div style={styles.loadingMsg}>Loading dashboard data...</div>;
    }

    if (error) {
      return <div style={styles.errorMsg}>Error: {error}</div>;
    }

    if (!stats) {
      return <div style={styles.loadingMsg}>No data available</div>;
    }

    return (
      <>
        <h1 style={styles.header}>Dashboard Overview</h1>
        <p style={styles.subtext}>Welcome! Monitor system statistics and manage users efficiently.</p>

        {/* Stats Cards */}
        <div style={styles.statsContainer}>
          {[
            { label: "Total Users", value: stats.totalUsers },
            { label: "Admins", value: stats.admins },
            { label: "OMA Users", value: stats.omaUsers },
            { label: "NPC Users", value: stats.npcUsers },
          ].map((stat, idx) => (
            <div
              key={idx}
              style={styles.statCard}
              onMouseEnter={(e) => Object.assign(e.currentTarget.style, styles.statCardHover)}
              onMouseLeave={(e) => Object.assign(e.currentTarget.style, { transform: "none", boxShadow: "0 4px 15px rgba(0,0,0,0.2)" })}
            >
              <div style={styles.statValue}>
                <CountUp end={stat.value} duration={1.5} separator="," />
              </div>
              <div style={styles.statLabel}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div style={styles.chartWrapper}>
          <div style={styles.chartCard}>
            <h3 style={{ marginBottom: "10px" }}>Users by Role</h3>
            {pieData && <Pie data={pieData} />}
          </div>

          <div style={styles.chartCard}>
            <h3 style={{ marginBottom: "10px" }}>Users per Organisation</h3>
            {barData && <Bar data={barData} options={{ responsive: true, plugins: { legend: { display: false } } }} />}
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
            <div
              style={{ ...styles.menuItem, ...(activePage === "dashboard" ? styles.activeMenuItem : {}) }}
              onClick={() => setActivePage("dashboard")}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#1a273d")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = activePage === "dashboard" ? "#1b2a41" : "transparent")}
            >
              <FiHome /> Dashboard Overview
            </div>

            <div
              style={{ ...styles.menuItem, ...(activePage === "addUser" ? styles.activeMenuItem : {}) }}
              onClick={() => setActivePage("addUser")}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#1a273d")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = activePage === "addUser" ? "#1b2a41" : "transparent")}
            >
              <FiUserPlus /> Add User
            </div>

            <div
              style={{ ...styles.menuItem, ...(activePage === "users" ? styles.activeMenuItem : {}) }}
              onClick={() => setActivePage("users")}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#1a273d")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = activePage === "users" ? "#1b2a41" : "transparent")}
            >
              <FiUsers /> User Management
            </div>
          </div>
        </div>

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
        {activePage === "dashboard" && renderDashboardOverview()}
        {activePage === "addUser" && (
          <>
            <h1 style={styles.header}>Add New User</h1>
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