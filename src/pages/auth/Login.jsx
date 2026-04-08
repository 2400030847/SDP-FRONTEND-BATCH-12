import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import authService from "../../services/authService";

const DEMO_ACCOUNTS = [
  { email: "admin@12club.com", password: "admin123", role: "Admin", avatar: "👑" },
  { email: "lender@12club.com", password: "lender123", role: "Lender", avatar: "🏦" },
  { email: "borrower@12club.com", password: "borrower123", role: "Borrower", avatar: "👤" },
  { email: "analyst@12club.com", password: "analyst123", role: "Analyst", avatar: "📊" },
];

const Login = () => {
  const navigate = useNavigate();
  const { login, verifyOtp, sendLoginOtp, demoLogin, user } = useAuth();

  const [mode, setMode] = useState("password"); // "password" or "otp"
  const [form, setForm] = useState({ email: "", password: "" });

  // Backend CAPTCHA
  const [captcha, setCaptcha] = useState({ id: "", image: "" });
  const [captchaAnswer, setCaptchaAnswer] = useState("");

  // OTP state
  const [otpEmail, setOtpEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) navigate("/dashboard");
  }, [user]);

  useEffect(() => {
    if (mode === "password") loadCaptcha();
  }, [mode]);

  const loadCaptcha = async () => {
    try {
      const response = await authService.getCaptcha();
      if (response.success && response.data) {
        setCaptcha({
          id: response.data.captchaId,
          image: response.data.captchaImage || response.data.image,
        });
      }
    } catch (err) {
      console.error("Failed to load CAPTCHA:", err);
    }
  };

  // Password + CAPTCHA login
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(form.email, form.password, captcha.id, captchaAnswer);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Invalid email or password");
      loadCaptcha();
      setCaptchaAnswer("");
    } finally {
      setLoading(false);
    }
  };

  // Demo login — bypasses CAPTCHA
  const handleDemoLogin = async (account) => {
    setError("");
    setLoading(true);
    try {
      await demoLogin(account.email, account.password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Demo login failed");
    } finally {
      setLoading(false);
    }
  };

  // OTP login
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await sendLoginOtp(otpEmail);
      setOtpSent(true);
    } catch (err) {
      setError(err.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await verifyOtp(otpEmail, otp);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <span className="auth-logo">🏦</span>
          <h2>Welcome to LoanVault</h2>
          <p>Sign in to manage your loans</p>
        </div>

        {/* Mode Toggle */}
        <div style={{
          display: "flex", gap: 0, marginBottom: "20px",
          background: "rgba(255,255,255,0.06)", borderRadius: "10px", overflow: "hidden"
        }}>
          <button
            type="button"
            onClick={() => { setMode("password"); setError(""); }}
            style={{
              flex: 1, padding: "10px", border: "none", cursor: "pointer", fontSize: "13px",
              background: mode === "password" ? "var(--primary-500)" : "transparent",
              color: mode === "password" ? "#fff" : "var(--text-muted)",
              borderRadius: 0, transform: "none"
            }}
          >Password Login</button>
          <button
            type="button"
            onClick={() => { setMode("otp"); setError(""); setOtpSent(false); }}
            style={{
              flex: 1, padding: "10px", border: "none", cursor: "pointer", fontSize: "13px",
              background: mode === "otp" ? "var(--primary-500)" : "transparent",
              color: mode === "otp" ? "#fff" : "var(--text-muted)",
              borderRadius: 0, transform: "none"
            }}
          >Passwordless OTP</button>
        </div>

        {error && (
          <div style={{
            padding: "10px 14px",
            background: "rgba(239, 68, 68, 0.12)",
            border: "1px solid rgba(239, 68, 68, 0.2)",
            borderRadius: "8px",
            color: "#f87171",
            fontSize: "13px",
            marginBottom: "16px",
            textAlign: "center"
          }}>
            {error}
          </div>
        )}

        {/* PASSWORD + CAPTCHA LOGIN */}
        {mode === "password" && (
          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label>Verify you are human</label>
              <div className="captcha-row">
                {captcha.image ? (
                  <img
                    src={`data:image/png;base64,${captcha.image}`}
                    alt="CAPTCHA"
                    style={{ borderRadius: "8px", maxHeight: "45px", background: "white", padding: "3px" }}
                  />
                ) : (
                  <span className="captcha-question" style={{ opacity: 0.5 }}>Loading CAPTCHA...</span>
                )}
                <button
                  type="button"
                  onClick={loadCaptcha}
                  style={{
                    background: "rgba(255,255,255,0.1)", border: "none", borderRadius: "50%",
                    width: "36px", height: "36px", fontSize: "18px", cursor: "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center", color: "#fff",
                    padding: 0, transform: "none"
                  }}
                  title="Refresh CAPTCHA"
                >↻</button>
                <input
                  type="text"
                  placeholder="Enter CAPTCHA"
                  value={captchaAnswer}
                  onChange={(e) => setCaptchaAnswer(e.target.value)}
                  required
                  style={{ flex: 1 }}
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>
        )}

        {/* OTP LOGIN */}
        {mode === "otp" && !otpSent && (
          <form className="auth-form" onSubmit={handleSendOtp}>
            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={otpEmail}
                onChange={(e) => setOtpEmail(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
              {loading ? "Sending OTP..." : "Send OTP"}
            </button>
          </form>
        )}

        {mode === "otp" && otpSent && (
          <form className="auth-form" onSubmit={handleVerifyOtp}>
            <p style={{ fontSize: "13px", color: "var(--text-secondary)", marginBottom: "16px" }}>
              OTP sent to your email. Enter it below.
            </p>
            <div className="form-group">
              <label>Enter OTP</label>
              <input
                type="text"
                placeholder="6-digit OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                maxLength={6}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
              {loading ? "Verifying..." : "Verify & Sign In"}
            </button>
            <button
              type="button"
              onClick={() => { setOtpSent(false); setOtp(""); }}
              style={{
                background: "transparent", border: "none", color: "var(--text-muted)",
                fontSize: "13px", marginTop: "8px", cursor: "pointer", padding: "8px",
                transform: "none"
              }}
            >← Change email</button>
          </form>
        )}

        {/* DEMO LOGIN SECTION */}
        <div className="demo-section">
          <div className="demo-section-title">Quick Demo Login</div>
          <div className="demo-buttons">
            {DEMO_ACCOUNTS.map((acc) => (
              <button
                key={acc.role}
                className="demo-btn"
                onClick={() => handleDemoLogin(acc)}
                disabled={loading}
              >
                <span className="demo-icon">{acc.avatar}</span>
                {acc.role}
              </button>
            ))}
          </div>
        </div>

        <div className="auth-footer">
          Don't have an account? <Link to="/register">Sign up</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;