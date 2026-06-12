import { Routes, Route, Link, useLocation } from "react-router-dom";
import TasksPage from "./pages/TasksPage";
import NotesPage from "./pages/NotesPage";
import AdminPage from "./pages/AdminPage";

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
        <polyline points="10 9 9 9 8 9" strokeLinecap="round"/>
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

export default function App() {
  const location = useLocation();

  const pageTitle = {
    "/": "Tasks",
    "/notes": "Notes",
    "/admin": "Admin",
  }[location.pathname] || "App";

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0f1117",
        display: "flex",
        fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
        color: "#e2e8f0",
      }}
    >
      {/* ── Sidebar (desktop only) ── */}
      <aside
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
        className="sidebar"
      >
        {/* Logo */}
        <div style={{ marginBottom: "28px", padding: "0 4px" }}>
          <span
            style={{
              fontSize: "22px",
              fontWeight: "800",
              letterSpacing: "-0.5px",
              background: "linear-gradient(135deg, #f59e0b, #f97316)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Rezultat
          </span>
          <div
            style={{
              fontSize: "11px",
              color: "#475569",
              marginTop: "2px",
              letterSpacing: "0.5px",
              textTransform: "uppercase",
            }}
          >
            Workspace
          </div>
        </div>

        {/* Nav items */}
        {navItems.map((item) => (
          <NavLink key={item.to} item={item} />
        ))}

        {/* Bottom spacer */}
        <div style={{ flex: 1 }} />
        <div
          style={{
            padding: "12px 16px",
            borderRadius: "12px",
            background: "rgba(245,158,11,0.07)",
            border: "1px solid rgba(245,158,11,0.15)",
            fontSize: "12px",
            color: "#78716c",
            lineHeight: "1.5",
          }}
        >
          <span style={{ color: "#f59e0b", fontWeight: "600" }}>●</span> Connected
        </div>
      </aside>

      {/* ── Main area ── */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        {/* Top header bar */}
        <header
          style={{
            padding: "18px 28px",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
            background: "rgba(19, 21, 31, 0.8)",
            backdropFilter: "blur(12px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            position: "sticky",
            top: 0,
            zIndex: 10,
          }}
        >
          <div>
            <h1
              style={{
                margin: 0,
                fontSize: "20px",
                fontWeight: "700",
                letterSpacing: "-0.3px",
              }}
            >
              {pageTitle}
            </h1>
          </div>
          <div
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "50%",
              background: "linear-gradient(135deg, #f59e0b, #f97316)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "15px",
              fontWeight: "700",
              color: "#fff",
              cursor: "pointer",
              flexShrink: 0,
            }}
          >
            A
          </div>
        </header>

        {/* Page content */}
        <main style={{ flex: 1, padding: "28px" }}>
          <Routes>
            <Route path="/" element={<TasksPage />} />
            <Route path="/notes" element={<NotesPage />} />
            <Route path="/admin" element={<AdminPage />} />
          </Routes>
        </main>
      </div>

      {/* ── Bottom Nav (mobile only) ── */}
      <nav
        className="bottom-nav"
        style={{
          display: "none",
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          background: "rgba(19, 21, 31, 0.96)",
          backdropFilter: "blur(16px)",
          borderTop: "1px solid rgba(255,255,255,0.08)",
          padding: "8px 0 env(safe-area-inset-bottom, 8px)",
          zIndex: 100,
          justifyContent: "space-around",
          alignItems: "center",
        }}
      >
        {navItems.map((item) => {
          const isActive =
            item.to === "/"
              ? location.pathname === "/"
              : location.pathname.startsWith(item.to);
          return (
            <Link
              key={item.to}
              to={item.to}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "4px",
                textDecoration: "none",
                padding: "6px 20px",
                borderRadius: "12px",
                color: isActive ? "#f59e0b" : "#64748b",
                fontSize: "11px",
                fontWeight: isActive ? "600" : "400",
                transition: "color 0.15s",
              }}
            >
              {item.icon}
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Responsive styles */}
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