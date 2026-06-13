import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { db } from "../firebase";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";

// ─── Configs ────────────────────────────────────────────────────────────────

const priorityConfig = {
  high:   { label: "Yuqori", color: "#ef4444", bg: "rgba(239,68,68,0.1)",  border: "rgba(239,68,68,0.25)" },
  medium: { label: "O'rta",  color: "#f59e0b", bg: "rgba(245,158,11,0.1)", border: "rgba(245,158,11,0.25)" },
  low:    { label: "Past",   color: "#22c55e", bg: "rgba(34,197,94,0.1)",  border: "rgba(34,197,94,0.25)" },
};

const statusConfig = {
  pending:   { label: "Kutilmoqda", color: "#94a3b8", bg: "rgba(148,163,184,0.1)", border: "rgba(148,163,184,0.2)" },
  completed: { label: "Bajarildi",  color: "#22c55e", bg: "rgba(34,197,94,0.1)",   border: "rgba(34,197,94,0.25)" },
  partial:   { label: "Qisman",     color: "#f59e0b", bg: "rgba(245,158,11,0.1)",  border: "rgba(245,158,11,0.25)" },
};

const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000;
const REFETCH_INTERVAL  = 5 * 60 * 1000; // 5 daqiqa

// ─── Firebase helpers ────────────────────────────────────────────────────────

/** Fetch tasks, auto-delete those older than 24 hours */
async function fetchTasks() {
  const snapshot = await getDocs(collection(db, "tasks"));
  const now = Date.now();

  const deletePromises = [];
  const activeTasks    = [];

  snapshot.docs.forEach((d) => {
    const data      = d.data();
    const createdAt = data.createdAt
      ? (data.createdAt.toMillis ? data.createdAt.toMillis() : data.createdAt)
      : null;

    if (createdAt && now - createdAt > TWENTY_FOUR_HOURS) {
      deletePromises.push(deleteDoc(doc(db, "tasks", d.id)));
    } else {
      activeTasks.push({ id: d.id, ...data });
    }
  });

  if (deletePromises.length) await Promise.all(deletePromises);

  return activeTasks;
}

async function updateTaskStatus(id, status) {
  await updateDoc(doc(db, "tasks", id), { status });
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function Badge({ config }) {
  return (
    <span style={{
      padding: "3px 10px",
      borderRadius: "20px",
      fontSize: "12px",
      fontWeight: "600",
      color: config.color,
      background: config.bg,
      border: `1px solid ${config.border}`,
      letterSpacing: "0.2px",
    }}>
      {config.label}
    </span>
  );
}

function MetaChip({ icon, label }) {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: "5px",
      padding: "4px 10px", borderRadius: "8px",
      background: "rgba(255,255,255,0.05)",
      border: "1px solid rgba(255,255,255,0.08)",
      color: "#94a3b8", fontSize: "12px",
    }}>
      {icon} {label}
    </span>
  );
}

function TimeRemaining({ createdAt }) {
  if (!createdAt) return null;
  const created   = createdAt.toMillis ? createdAt.toMillis() : createdAt;
  const remaining = TWENTY_FOUR_HOURS - (Date.now() - created);
  if (remaining <= 0) return null;

  const hours   = Math.floor(remaining / (60 * 60 * 1000));
  const minutes = Math.floor((remaining % (60 * 60 * 1000)) / 60000);
  const isUrgent = hours < 3;

  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: "5px",
      padding: "4px 10px", borderRadius: "8px", fontSize: "12px",
      color: isUrgent ? "#ef4444" : "#64748b",
      background: isUrgent ? "rgba(239,68,68,0.08)" : "rgba(255,255,255,0.04)",
      border: `1px solid ${isUrgent ? "rgba(239,68,68,0.2)" : "rgba(255,255,255,0.07)"}`,
    }}>
      🕐 {hours > 0 ? `${hours}s ` : ""}{minutes}d qoldi
    </span>
  );
}

function TaskCard({ task, onComplete, onPartial, isUpdating }) {
  const priority  = priorityConfig[task.priority] ?? priorityConfig.medium;
  const status    = statusConfig[task.status]     ?? statusConfig.pending;
  const isDone    = task.status === "completed";
  const isPartial = task.status === "partial";

  return (
    <div
      style={{
        background: "linear-gradient(135deg, #1a1d27 0%, #16192280 100%)",
        border: `1px solid ${isDone ? "rgba(34,197,94,0.2)" : isPartial ? "rgba(245,158,11,0.2)" : "rgba(255,255,255,0.07)"}`,
        borderRadius: "16px",
        padding: "20px 22px",
        transition: "transform 0.15s, box-shadow 0.15s",
        opacity: isDone ? 0.75 : 1,
        position: "relative",
        overflow: "hidden",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform  = "translateY(-2px)";
        e.currentTarget.style.boxShadow  = "0 8px 24px rgba(0,0,0,0.3)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform  = "translateY(0)";
        e.currentTarget.style.boxShadow  = "none";
      }}
    >
      {/* Left accent bar */}
      <div style={{
        position: "absolute", left: 0, top: 0, bottom: 0,
        width: "4px", background: priority.color,
        borderRadius: "16px 0 0 16px",
      }} />

      {/* Top row */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "12px", marginBottom: "10px" }}>
        <h2 style={{
          margin: 0, fontSize: "17px", fontWeight: "700",
          color: isDone ? "#64748b" : "#f1f5f9",
          textDecoration: isDone ? "line-through" : "none",
          letterSpacing: "-0.2px", lineHeight: "1.3",
        }}>
          {task.title}
        </h2>
        <Badge config={status} />
      </div>

      {task.goal && (
        <p style={{ margin: "0 0 14px", color: "#94a3b8", fontSize: "14px", lineHeight: "1.5" }}>
          {task.goal}
        </p>
      )}

      <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "16px" }}>
        {task.type      && <MetaChip icon="🗂" label={task.type} />}
        {task.date      && <MetaChip icon="📅" label={task.date} />}
        {task.startTime && task.deadline && (
          <MetaChip icon="⏱" label={`${task.startTime} – ${task.deadline}`} />
        )}
        <TimeRemaining createdAt={task.createdAt} />
        <span style={{
          display: "inline-flex", alignItems: "center", gap: "5px",
          padding: "4px 10px", borderRadius: "8px", fontSize: "12px", fontWeight: "600",
          color: priority.color, background: priority.bg, border: `1px solid ${priority.border}`,
        }}>
          ⚡ {priority.label}
        </span>
      </div>

      {task.status === "pending" && (
        <div style={{ display: "flex", gap: "10px" }}>
          <button
            disabled={isUpdating}
            onClick={() => onComplete(task.id)}
            style={{
              flex: 1, padding: "10px 0", borderRadius: "10px", border: "none",
              background: "linear-gradient(135deg, #16a34a, #22c55e)",
              color: "#fff", fontSize: "14px", fontWeight: "600",
              cursor: isUpdating ? "not-allowed" : "pointer",
              opacity: isUpdating ? 0.6 : 1,
              display: "flex", alignItems: "center", justifyContent: "center", gap: "6px",
              transition: "opacity 0.15s",
              boxShadow: "0 4px 12px rgba(34,197,94,0.25)",
            }}
          >
            ✓ Bajarildi
          </button>
          <button
            disabled={isUpdating}
            onClick={() => onPartial(task.id)}
            style={{
              flex: 1, padding: "10px 0", borderRadius: "10px",
              border: "1px solid rgba(245,158,11,0.35)",
              background: "rgba(245,158,11,0.08)",
              color: "#f59e0b", fontSize: "14px", fontWeight: "600",
              cursor: isUpdating ? "not-allowed" : "pointer",
              opacity: isUpdating ? 0.6 : 1,
              display: "flex", alignItems: "center", justifyContent: "center", gap: "6px",
              transition: "background 0.15s",
            }}
          >
            ◑ Qisman
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────

export default function TasksPage() {
  const [filter, setFilter] = useState("all");
  const queryClient         = useQueryClient();

  // ── Data fetching: auto-refetch every 5 minutes ──────────────────────────
  const {
    data: tasks = [],
    isLoading,
    isError,
    isFetching,
  } = useQuery({
    queryKey:      ["tasks"],
    queryFn:       fetchTasks,
    refetchInterval: REFETCH_INTERVAL,       // 5 daqiqada bir avtomatik
    staleTime:     2 * 60 * 1000,            // 2 daqiqa stale deb hisoblanmaydi
    refetchOnWindowFocus: true,              // oyna fokusga kelganda ham yangilaydi
  });

  // ── Mutation: status update ───────────────────────────────────────────────
  const { mutate: changeStatus, isPending: isUpdating } = useMutation({
    mutationFn: ({ id, status }) => updateTaskStatus(id, status),
    // Optimistic update: serverdan javob kutmasdan UI ni yangilaydi
    onMutate: async ({ id, status }) => {
      await queryClient.cancelQueries({ queryKey: ["tasks"] });
      const previous = queryClient.getQueryData(["tasks"]);

      queryClient.setQueryData(["tasks"], (old = []) =>
        old.map((t) => (t.id === id ? { ...t, status } : t))
      );

      return { previous };
    },
    onError: (_err, _vars, context) => {
      // Xato bo'lsa avvalgi holatga qaytaradi
      if (context?.previous) {
        queryClient.setQueryData(["tasks"], context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  const handleComplete = (id) => changeStatus({ id, status: "completed" });
  const handlePartial  = (id) => changeStatus({ id, status: "partial" });

  // ── Derived counts & filtered list ───────────────────────────────────────
  const counts = {
    all:       tasks.length,
    pending:   tasks.filter((t) => t.status === "pending").length,
    completed: tasks.filter((t) => t.status === "completed").length,
    partial:   tasks.filter((t) => t.status === "partial").length,
  };

  const filtered = filter === "all" ? tasks : tasks.filter((t) => t.status === filter);

  const filterTabs = [
    { key: "all",       label: "Barchasi",   count: counts.all },
    { key: "pending",   label: "Kutilmoqda", count: counts.pending },
    { key: "completed", label: "Bajarildi",  count: counts.completed },
    { key: "partial",   label: "Qisman",     count: counts.partial },
  ];

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div style={{ maxWidth: "760px" }}>
      {/* Header */}
      <div style={{ marginBottom: "24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <p style={{ margin: 0, color: "#64748b", fontSize: "14px" }}>
          {new Date().toLocaleDateString("uz-UZ", {
            weekday: "long", year: "numeric", month: "long", day: "numeric",
          })}
        </p>
        {/* Avtomatik yangilanish indikatori */}
        {isFetching && !isLoading && (
          <span style={{ fontSize: "12px", color: "#64748b", display: "flex", alignItems: "center", gap: "5px" }}>
            <span style={{
              width: "6px", height: "6px", borderRadius: "50%",
              background: "#22c55e",
              animation: "pulse 1s infinite",
              display: "inline-block",
            }} />
            Yangilanmoqda…
          </span>
        )}
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px", marginBottom: "24px" }}>
        {[
          { label: "Jami vazifalar", value: counts.all,       color: "#f59e0b" },
          { label: "Bajarildi",      value: counts.completed, color: "#22c55e" },
          { label: "Qisman",         value: counts.partial,   color: "#f97316" },
        ].map((s) => (
          <div key={s.label} style={{
            background: "#1a1d27",
            border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: "14px", padding: "16px", textAlign: "center",
          }}>
            <div style={{ fontSize: "28px", fontWeight: "800", color: s.color }}>{s.value}</div>
            <div style={{ fontSize: "12px", color: "#64748b", marginTop: "2px" }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "20px", flexWrap: "wrap" }}>
        {filterTabs.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            style={{
              padding: "7px 14px", borderRadius: "10px",
              border: filter === f.key ? "none" : "1px solid rgba(255,255,255,0.08)",
              background: filter === f.key
                ? "linear-gradient(135deg, #f59e0b, #f97316)"
                : "rgba(255,255,255,0.04)",
              color: filter === f.key ? "#fff" : "#94a3b8",
              fontSize: "13px", fontWeight: filter === f.key ? "600" : "400",
              cursor: "pointer", display: "flex", alignItems: "center", gap: "6px",
              transition: "all 0.15s",
            }}
          >
            {f.label}
            <span style={{
              background: filter === f.key ? "rgba(255,255,255,0.25)" : "rgba(255,255,255,0.08)",
              borderRadius: "6px", padding: "1px 6px", fontSize: "11px",
            }}>
              {f.count}
            </span>
          </button>
        ))}
      </div>

      {/* Task list */}
      {isLoading ? (
        <div style={{ textAlign: "center", padding: "60px 0", color: "#475569" }}>
          <div style={{ fontSize: "32px", marginBottom: "12px" }}>⏳</div>
          Yuklanmoqda...
        </div>
      ) : isError ? (
        <div style={{ textAlign: "center", padding: "60px 0", color: "#ef4444" }}>
          <div style={{ fontSize: "32px", marginBottom: "12px" }}>⚠️</div>
          Ma'lumotlarni yuklashda xatolik yuz berdi
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 0", color: "#475569" }}>
          <div style={{ fontSize: "40px", marginBottom: "12px" }}>📭</div>
          Bu yerda hali vazifalar yo'q
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {filtered.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              isUpdating={isUpdating}
              onComplete={handleComplete}
              onPartial={handlePartial}
            />
          ))}
        </div>
      )}

      {/* CSS for pulse animation */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.3; }
        }
      `}</style>
    </div>
  );
}