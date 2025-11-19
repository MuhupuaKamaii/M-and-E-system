import { useState } from "react";
import "./Login.css";

function Login() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:4000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await response.json();
      if (!response.ok) {
        setError(data.message || "Login failed");
        setIsLoading(false);
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
          setIsLoading(false);
      }
    } catch (err) {
      console.error(err);
      setError("Server error. Please try again later.");
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-background">
        <div className="login-content">
          <div className="login-card">
            <div className="login-header">
              <div className="login-logo">
                <div className="logo-icon">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="3" y="3" width="18" height="18" rx="4" fill="#2563EB" />
                    <path d="M8 12h8M8 8h8M8 16h6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h1>Monitoring & Evaluation</h1>
              </div>
              <div className="login-title">
                <h2>Welcome Back</h2>
                <p>Sign in to your account to continue</p>
              </div>
            </div>

            <form className="login-form" onSubmit={handleLogin}>
              <div className="form-group">
                <label htmlFor="username" className="form-label">
                  Username
                </label>
                <input
                  id="username"
                  type="text"
                  className="form-input"
                  placeholder="Enter your username"
                  value={form.username}
                  onChange={(e) => setForm({ ...form, username: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="password" className="form-label">
                  Password
                </label>
                <div className="password-input-container">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    className="form-input"
                    placeholder="Enter your password"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              <div className="form-options">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                  />
                  <span className="checkmark"></span>
                  Remember me
                </label>
                <a href="#" className="forgot-link">Forgot password?</a>
              </div>

              {error && (
                <div className="error-message">
                  {error}
                </div>
              )}

              <button
                type="submit"
                className={`login-button ${isLoading ? 'loading' : ''}`}
                disabled={!form.username || !form.password || isLoading}
              >
                {isLoading ? (
                  <div className="button-loader"></div>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;