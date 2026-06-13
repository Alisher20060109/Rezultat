import { useState } from "react";
import { Routes, Route, Link, useLocation, Navigate } from "react-router-dom";
import TasksPage from "./pages/TasksPage";
import NotesPage from "./pages/NotesPage";
import AdminPage from "./pages/AdminPage";

// ─── Login credentials (o'zgartiring) ────────────────────────────────────────
const CREDENTIALS = {
  username: "Alisher",
  password: "1234",
};

// ─── Nav items ────────────────────────────────────────────────────────────────
const navItems = [
  {
    to: "/",
    label: "Tasks",
    icon: (
      <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M9 11l3 3L22 4" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    to: "/notes",
    label: "Notes",
    icon: (
      <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" strokeLinecap="round" strokeLinejoin="round"/>
        <polyline points="14 2 14 8 20 8" strokeLinecap="round" strokeLinejoin="round"/>
        <line x1="16" y1="13" x2="8" y2="13" strokeLinecap="round"/>
        <line x1="16" y1="17" x2="8" y2="17" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    to: "/admin",
    label: "Admin",
    icon: (
      <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <circle cx="12" cy="8" r="4" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M20 21a8 8 0 10-16 0" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
];

// ─── Login Page ───────────────────────────────────────────────────────────────
function LoginPage({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass]  = useState(false);
  const [error, setError]        = useState("");
  const [loading, setLoading]    = useState(false);

  const handleSubmit = async () => {
    if (!username.trim() || !password.trim()) {
      setError("Barcha maydonlarni to'ldiring");
      return;
    }

    setLoading(true);
    setError("");

    // Kichik kechikish — UI uchun
    await new Promise((r) => setTimeout(r, 600));

    if (
      username.trim() === CREDENTIALS.username &&
      password === CREDENTIALS.password
    ) {
      sessionStorage.setItem("auth", "true");
      onLogin();
    } else {
      setError("Login yoki parol noto'g'ri");
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSubmit();
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0f1117",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "20px",
      fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
    }}>
      <div style={{ width: "100%", maxWidth: "400px" }}>

        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: "56px",
            height: "56px",
            borderRadius: "16px",
            background: "linear-gradient(135deg, #f59e0b, #f97316)",
            marginBottom: "16px",
          }}>
            <svg width="28" height="28" fill="none" stroke="#fff" strokeWidth="2.5" viewBox="0 0 24 24">
              <path d="M9 11l3 3L22 4" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div style={{
            fontSize: "26px",
            fontWeight: "800",
            letterSpacing: "-0.5px",
            background: "linear-gradient(135deg, #f59e0b, #f97316)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            marginBottom: "6px",
          }}>
            Rezultat
          </div>
          <div style={{ color: "#475569", fontSize: "14px" }}>
            Kirish uchun ma'lumotlarni kiriting
          </div>
        </div>

        {/* Card */}
        <div style={{
          background: "linear-gradient(135deg, #1a1d27, #161922)",
          border: "1px solid rgba(255,255,255,0.07)",
          borderRadius: "20px",
          padding: "28px",
        }}>
          {/* Error */}
          {error && (
            <div style={{
              marginBottom: "18px",
              padding: "12px 14px",
              borderRadius: "12px",
              background: "rgba(239,68,68,0.1)",
              border: "1px solid rgba(239,68,68,0.25)",
              color: "#ef4444",
              fontSize: "13px",
              fontWeight: "500",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}>
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              {error}
            </div>
          )}

          {/* Username */}
          <div style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", color: "#94a3b8", fontSize: "13px", fontWeight: "500", marginBottom: "8px" }}>
              Foydalanuvchi nomi
            </label>
            <div style={{ position: "relative" }}>
              <span style={{
                position: "absolute", left: "14px", top: "50%",
                transform: "translateY(-50%)", color: "#475569",
                display: "flex", alignItems: "center",
              }}>
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <circle cx="12" cy="8" r="4"/><path d="M20 21a8 8 0 10-16 0"/>
                </svg>
              </span>
              <input
                type="text"
                placeholder="admin"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyDown={handleKeyDown}
                autoComplete="username"
                style={{
                  width: "100%",
                  padding: "13px 14px 13px 40px",
                  background: "#0f172a",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: "12px",
                  color: "#f1f5f9",
                  fontSize: "14px",
                  outline: "none",
                  boxSizing: "border-box",
                  transition: "border-color 0.15s",
                }}
                onFocus={(e) => e.target.style.borderColor = "rgba(245,158,11,0.5)"}
                onBlur={(e) => e.target.style.borderColor = "rgba(255,255,255,0.08)"}
              />
            </div>
          </div>

          {/* Password */}
          <div style={{ marginBottom: "24px" }}>
            <label style={{ display: "block", color: "#94a3b8", fontSize: "13px", fontWeight: "500", marginBottom: "8px" }}>
              Parol
            </label>
            <div style={{ position: "relative" }}>
              <span style={{
                position: "absolute", left: "14px", top: "50%",
                transform: "translateY(-50%)", color: "#475569",
                display: "flex", alignItems: "center",
              }}>
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>
                </svg>
              </span>
              <input
                type={showPass ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={handleKeyDown}
                autoComplete="current-password"
                style={{
                  width: "100%",
                  padding: "13px 44px 13px 40px",
                  background: "#0f172a",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: "12px",
                  color: "#f1f5f9",
                  fontSize: "14px",
                  outline: "none",
                  boxSizing: "border-box",
                  transition: "border-color 0.15s",
                }}
                onFocus={(e) => e.target.style.borderColor = "rgba(245,158,11,0.5)"}
                onBlur={(e) => e.target.style.borderColor = "rgba(255,255,255,0.08)"}
              />
              <button
                onClick={() => setShowPass(!showPass)}
                style={{
                  position: "absolute", right: "12px", top: "50%",
                  transform: "translateY(-50%)",
                  background: "transparent", border: "none",
                  cursor: "pointer", color: "#475569", padding: "4px",
                  display: "flex", alignItems: "center",
                }}
              >
                {showPass ? (
                  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/>
                    <line x1="1" y1="1" x2="23" y2="23"/>
                  </svg>
                ) : (
                  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{
              width: "100%",
              padding: "14px",
              border: "none",
              borderRadius: "12px",
              background: loading
                ? "rgba(245,158,11,0.5)"
                : "linear-gradient(135deg, #f59e0b, #f97316)",
              color: "#fff",
              fontSize: "15px",
              fontWeight: "700",
              cursor: loading ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              transition: "opacity 0.15s",
            }}
          >
            {loading ? (
              <>
                <span style={{
                  width: "16px", height: "16px",
                  border: "2px solid rgba(255,255,255,0.3)",
                  borderTop: "2px solid #fff",
                  borderRadius: "50%",
                  display: "inline-block",
                  animation: "spin 0.7s linear infinite",
                }} />
                Tekshirilmoqda…
              </>
            ) : (
              <>
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/>
                </svg>
                Kirish
              </>
            )}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        input::placeholder { color: #334155; }
      `}</style>
    </div>
  );
}

// ─── NavLink ──────────────────────────────────────────────────────────────────
function NavLink({ item }) {
  const location = useLocation();
  const isActive =
    item.to === "/" ? location.pathname === "/" : location.pathname.startsWith(item.to);

  return (
    <Link
      to={item.to}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "12px",
        padding: "11px 16px",
        borderRadius: "12px",
        textDecoration: "none",
        fontWeight: isActive ? "600" : "400",
        fontSize: "15px",
        transition: "all 0.18s ease",
        color: isActive ? "#fff" : "#94a3b8",
        background: isActive
          ? "linear-gradient(135deg, #f59e0b 0%, #f97316 100%)"
          : "transparent",
        boxShadow: isActive ? "0 4px 14px rgba(245,158,11,0.35)" : "none",
      }}
    >
      <span style={{ opacity: isActive ? 1 : 0.7 }}>{item.icon}</span>
      {item.label}
    </Link>
  );
}

// ─── Main Layout ──────────────────────────────────────────────────────────────
function MainLayout({ onLogout }) {
  const location = useLocation();

  const pageTitle = {
    "/": "Tasks",
    "/notes": "Notes",
    "/admin": "Admin",
  }[location.pathname] || "App";

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0f1117",
      display: "flex",
      fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
      color: "#e2e8f0",
    }}>
      {/* Sidebar */}
      <aside
        className="sidebar"
        style={{
          width: "220px",
          minHeight: "100vh",
          background: "linear-gradient(180deg, #1a1d27 0%, #13151f 100%)",
          borderRight: "1px solid rgba(255,255,255,0.06)",
          padding: "28px 16px 24px",
          display: "flex",
          flexDirection: "column",
          gap: "6px",
          flexShrink: 0,
          position: "sticky",
          top: 0,
          alignSelf: "flex-start",
          height: "100vh",
        }}
      >
        <div style={{ marginBottom: "28px", padding: "0 4px" }}>
          <span style={{
            fontSize: "22px", fontWeight: "800", letterSpacing: "-0.5px",
            background: "linear-gradient(135deg, #f59e0b, #f97316)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          }}>
            Rezultat
          </span>
          <div style={{ fontSize: "11px", color: "#475569", marginTop: "2px", letterSpacing: "0.5px", textTransform: "uppercase" }}>
            Workspace
          </div>
        </div>

        {navItems.map((item) => <NavLink key={item.to} item={item} />)}

        <div style={{ flex: 1 }} />

        <div style={{
          padding: "12px 16px", borderRadius: "12px",
          background: "rgba(245,158,11,0.07)",
          border: "1px solid rgba(245,158,11,0.15)",
          fontSize: "12px", color: "#78716c", lineHeight: "1.5",
          marginBottom: "8px",
        }}>
          <span style={{ color: "#f59e0b", fontWeight: "600" }}>●</span> Connected
        </div>

        {/* Logout button */}
        <button
          onClick={onLogout}
          style={{
            display: "flex", alignItems: "center", gap: "10px",
            padding: "11px 16px", borderRadius: "12px",
            background: "transparent",
            border: "1px solid rgba(239,68,68,0.2)",
            color: "#ef4444", fontSize: "14px", fontWeight: "500",
            cursor: "pointer", width: "100%",
            transition: "background 0.15s",
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = "rgba(239,68,68,0.08)"}
          onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
        >
          <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
          Chiqish
        </button>
      </aside>

      {/* Main area */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        <header style={{
          padding: "18px 28px",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          background: "rgba(19, 21, 31, 0.8)",
          backdropFilter: "blur(12px)",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          position: "sticky", top: 0, zIndex: 10,
        }}>
          <h1 style={{ margin: 0, fontSize: "20px", fontWeight: "700", letterSpacing: "-0.3px" }}>
            {pageTitle}
          </h1>
          <div style={{
            width: "36px", height: "36px", borderRadius: "50%",
            background: "linear-gradient(135deg, #f59e0b, #f97316)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "15px", fontWeight: "700", color: "#fff",
            cursor: "pointer", flexShrink: 0,
          }}>
            A
          </div>
        </header>

        <main style={{ flex: 1, padding: "28px" }}>
          <Routes>
            <Route path="/" element={<TasksPage />} />
            <Route path="/notes" element={<NotesPage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>

      {/* Bottom nav (mobile) */}
      <nav
        className="bottom-nav"
        style={{
          display: "none",
          position: "fixed", bottom: 0, left: 0, right: 0,
          background: "rgba(19, 21, 31, 0.96)",
          backdropFilter: "blur(16px)",
          borderTop: "1px solid rgba(255,255,255,0.08)",
          padding: "8px 0 env(safe-area-inset-bottom, 8px)",
          zIndex: 100, justifyContent: "space-around", alignItems: "center",
        }}
      >
        {navItems.map((item) => {
          const isActive =
            item.to === "/" ? location.pathname === "/" : location.pathname.startsWith(item.to);
          return (
            <Link
              key={item.to}
              to={item.to}
              style={{
                display: "flex", flexDirection: "column",
                alignItems: "center", gap: "4px",
                textDecoration: "none", padding: "6px 20px", borderRadius: "12px",
                color: isActive ? "#f59e0b" : "#64748b",
                fontSize: "11px", fontWeight: isActive ? "600" : "400",
                transition: "color 0.15s",
              }}
            >
              {item.icon}
              {item.label}
            </Link>
          );
        })}
        {/* Mobile logout */}
        <button
          onClick={onLogout}
          style={{
            display: "flex", flexDirection: "column",
            alignItems: "center", gap: "4px",
            background: "transparent", border: "none",
            padding: "6px 20px", borderRadius: "12px",
            color: "#ef4444", fontSize: "11px", cursor: "pointer",
          }}
        >
          <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
          Chiqish
        </button>
      </nav>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; }
        @media (max-width: 768px) {
          .sidebar { display: none !important; }
          .bottom-nav { display: flex !important; }
          main { padding: 16px 16px 80px !important; }
          header { padding: 14px 18px !important; }
        }
      `}</style>
    </div>
  );
}

// ─── App root ─────────────────────────────────────────────────────────────────
export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    () => sessionStorage.getItem("auth") === "true"
  );

  const handleLogout = () => {
    sessionStorage.removeItem("auth");
    setIsLoggedIn(false);
  };

  if (!isLoggedIn) {
    return <LoginPage onLogin={() => setIsLoggedIn(true)} />;
  }

  return <MainLayout onLogout={handleLogout} />;
}