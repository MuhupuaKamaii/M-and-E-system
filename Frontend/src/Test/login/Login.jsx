import { useState } from "react";
import "./Login.css";

function Login() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);

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
          window.location.href = "/omaDashboard";
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
    <div className="login-page" role="main">
      <div className="login-card">
        <div className="brand">
          <div className="logo" aria-hidden>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="2" y="2" width="20" height="20" rx="5" fill="#2563EB" />
              <path d="M7 12h10M7 8h10M7 16h6" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h2 className="brand-title">Sign in to M&E</h2>
          <p className="brand-sub">Welcome back — please sign in to continue</p>
        </div>

        <form className="login-form" onSubmit={handleLogin} noValidate>
          <label className="field">
            <span className="label">Username</span>
            <input
              type="text"
              name="username"
              placeholder="Enter your username"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              className="input"
              autoComplete="username"
              required
            />
          </label>

          <label className="field">
            <span className="label">Password</span>
            <div className="password-row">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="input"
                autoComplete="current-password"
                required
                aria-describedby={error ? "login-error" : undefined}
              />
              <button
                type="button"
                className="show-btn"
                onClick={() => setShowPassword((s) => !s)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </label>

          <div className="options">
            <label className="remember">
              <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
              Remember me
            </label>
            <a className="forgot" href="#">Forgot?</a>
          </div>

          <button
            type="submit"
            className={`btn-primary ${(!form.username || !form.password) ? 'disabled' : ''}`}
            disabled={!form.username || !form.password}
          >
            Sign in
          </button>

          <div className="divider"><span>or continue with</span></div>

          <div className="socials">
            <button type="button" className="btn-google" onClick={() => alert('Google login placeholder')}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21.35 11.1h-9.18v2.92h5.35c-.23 1.42-1.48 4.17-5.35 4.17-3.22 0-5.85-2.66-5.85-5.93s2.63-5.93 5.85-5.93c1.83 0 3.06.78 3.76 1.45l2.57-2.49C17.48 3.1 15.58 2 12.17 2 7.78 2 4 5.58 4 10c0 4.39 3.78 8 8.17 8 4.71 0 7.69-3.31 7.69-7.9 0-.53-.06-.95-.51-1z" fill="#4285F4"/>
              </svg>
              <span>Continue with Google</span>
            </button>
          </div>

          {error && <div id="login-error" className="error">{error}</div>}
        </form>
      </div>
    </div>
  );
}

export default Login;
  