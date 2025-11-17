import { useState } from "react";

function Login() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(""); // reset error on submit

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

      const user = data.user || data; // handle both formats

      // Save user info in localStorage
      localStorage.setItem("token", user.token);
      localStorage.setItem("userId", user.userId || user.user_id);
      localStorage.setItem("fullName", user.fullName || user.full_name);
      localStorage.setItem("role", user.role.trim().toUpperCase());
      localStorage.setItem("organisationId", user.organisationId || user.organisation_id);
      localStorage.setItem("focusAreaId", user.focusAreaId || user.focus_area_id);

      // Redirect based on role
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

  return (
    <div style={{ width: 300, margin: "80px auto" }}>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Username"
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
        />
        <br /><br />
        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <br /><br />
        <button type="submit" disabled={!form.username || !form.password}>
          Login
        </button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}

export default Login;
