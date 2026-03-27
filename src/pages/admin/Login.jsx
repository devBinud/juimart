import { useNavigate } from "react-router-dom";
import { useState } from "react";
import logo from "../../assets/logo.png";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = () => {
    setError("");
    if (!username || !password) {
      setError("Please enter both username and password.");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      if (username === "admin" && password === "admin123") {
        localStorage.setItem("isAdmin", "true");
        localStorage.setItem("adminExpiry", Date.now() + 60 * 60 * 1000);
        navigate("/admin/dashboard");
      } else {
        setError("Invalid username or password.");
        setLoading(false);
      }
    }, 600);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleLogin();
  };

  return (
    <div style={s.page}>
      {/* Dark green overlay */}
      <div style={s.overlay} />

      <div style={s.cardWrap}>
        <div style={s.card}>

          <img src={logo} alt="Logo" style={{ ...s.logo, display: 'block', margin: '0 auto 20px' }} />
          <h2 style={s.title}>Admin Portal</h2>
          <p style={s.subtitle}>Sign in to manage your store</p>

          {error && <div style={s.errorBox}>{error}</div>}

          <div style={s.field}>
            <label style={s.label}>Username</label>
            <input
              type="text"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyDown={handleKeyDown}
              style={s.input}
              onFocus={(e) => (e.target.style.borderColor = "#22c55e")}
              onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
            />
          </div>

          <div style={s.field}>
            <label style={s.label}>Password</label>
            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={handleKeyDown}
              style={s.input}
              onFocus={(e) => (e.target.style.borderColor = "#22c55e")}
              onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
            />
          </div>

          <button
            onClick={handleLogin}
            disabled={loading}
            style={{ ...s.btn, opacity: loading ? 0.7 : 1 }}
            onMouseEnter={(e) => { if (!loading) e.target.style.background = "#16a34a"; }}
            onMouseLeave={(e) => { if (!loading) e.target.style.background = "#22c55e"; }}
          >
            {loading ? "Signing in..." : "Sign In →"}
          </button>

          <p style={s.hint}>🔒 Restricted access — authorized personnel only</p>
        </div>
      </div>
    </div>
  );
};

const s = {
  page: {
    minHeight: "100vh",
    backgroundImage: `url('https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1600&q=80')`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "'Outfit', sans-serif",
    padding: "20px",
    position: "relative",
  },
  overlay: {
    position: "absolute",
    inset: 0,
    background: "linear-gradient(135deg, rgba(21,128,61,0.85) 0%, rgba(15,60,30,0.92) 100%)",
    zIndex: 0,
  },
  cardWrap: {
    position: "relative",
    zIndex: 1,
    width: "100%",
    maxWidth: "420px",
  },
  card: {
    background: "rgba(255,255,255,0.97)",
    borderRadius: "20px",
    padding: "48px 40px",
    width: "100%",
    boxShadow: "0 32px 80px rgba(0,0,0,0.3)",
    textAlign: "center",
  },
  logo: {
    width: "120px",
    marginBottom: "20px",
  },
  title: {
    fontSize: "24px",
    fontWeight: 700,
    color: "#111827",
    marginBottom: "6px",
    letterSpacing: "-0.4px",
  },
  subtitle: {
    fontSize: "14px",
    color: "#6b7280",
    marginBottom: "28px",
  },
  errorBox: {
    background: "#fef2f2",
    border: "1px solid #fecaca",
    color: "#dc2626",
    borderRadius: "10px",
    padding: "10px 14px",
    fontSize: "13px",
    marginBottom: "20px",
    textAlign: "left",
  },
  field: {
    textAlign: "left",
    marginBottom: "18px",
  },
  label: {
    display: "block",
    fontSize: "13px",
    fontWeight: 600,
    color: "#374151",
    marginBottom: "6px",
  },
  input: {
    width: "100%",
    padding: "12px 16px",
    fontSize: "14px",
    border: "1.5px solid #e5e7eb",
    borderRadius: "10px",
    outline: "none",
    fontFamily: "'Outfit', sans-serif",
    color: "#111827",
    background: "#f9fafb",
    transition: "border-color 0.2s ease",
    boxSizing: "border-box",
  },
  btn: {
    width: "100%",
    padding: "13px",
    background: "#22c55e",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    fontSize: "15px",
    fontWeight: 700,
    cursor: "pointer",
    fontFamily: "'Outfit', sans-serif",
    transition: "background 0.2s ease",
    marginTop: "4px",
    letterSpacing: "0.2px",
  },
  hint: {
    fontSize: "12px",
    color: "#9ca3af",
    marginTop: "20px",
  },
};

export default Login;
