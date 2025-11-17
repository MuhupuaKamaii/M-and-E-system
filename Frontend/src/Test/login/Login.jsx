import { useState } from "react";

function Login() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("http://localhost:4000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await response.json();
      if (!response.ok) {
        setError(data.message || "Login failed");
        return;
      }

      const user = data.user || data;

      localStorage.setItem("token", user.token);
      localStorage.setItem("userId", user.userId || user.user_id);
      localStorage.setItem("fullName", user.fullName || user.full_name);
      localStorage.setItem("role", user.role);
      localStorage.setItem("organisationId", user.organisationId || user.organisation_id);
      localStorage.setItem("focusAreaId", user.focusAreaId || user.focus_area_id);

      switch (user.role) {
        case "Admin":
          window.location.href = "/admin-dashboard";
          break;
        case "NPC":
          window.location.href = "/npc-dashboard";
          break;
        case "OMA":
          window.location.href = "/oma-dashboard";
          break;
        default:
          setError("Unknown role");
      }
    } catch (err) {
      console.error(err);
      setError("Server error. Please try again later.");
    }
  };

  // -----------------------------
  // INLINE STYLES
  // -----------------------------
  const styles = {
    container: {
      height: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      background: "#f5f5f5", // subtle light gray
      fontFamily: "'Inter', sans-serif",
    },
    card: {
      background: "#ffffff",
      width: "360px",
      padding: "40px 30px",
      borderRadius: "14px",
      border: "1px solid #e5e7eb",
      boxShadow: "0 4px 15px rgba(0,0,0,0.08)",
    },
    title: {
      textAlign: "center",
      marginBottom: "25px",
      fontSize: "26px",
      fontWeight: "700",
      color: "#1e3a8a",
    },
    input: {
      width: "100%",
      padding: "12px",
      marginBottom: "15px",
      border: "1px solid #d1d5db",
      borderRadius: "8px",
      fontSize: "15px",
      outline: "none",
      transition: "0.25s",
    },
    button: {
      width: "100%",
      padding: "12px",
      background: "#2563eb",
      border: "none",
      borderRadius: "8px",
      color: "#fff",
      fontSize: "16px",
      cursor: "pointer",
      transition: "0.25s",
    },
    buttonDisabled: {
      background: "#93c5fd",
      cursor: "not-allowed",
    },
    error: {
      marginTop: "10px",
      textAlign: "center",
      color: "#dc2626",
      fontSize: "14px",
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Login</h2>

        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Username"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            style={styles.input}
          />

          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            style={styles.input}
          />

          <button
            type="submit"
            disabled={!form.username || !form.password}
            style={{
              ...styles.button,
              ...( !form.username || !form.password ? styles.buttonDisabled : {} )
            }}
          >
            Login
          </button>

          {error && <p style={styles.error}>{error}</p>}
        </form>
      </div>
    </div>
  );
}

export default Login;
  