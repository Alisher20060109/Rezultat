import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { db } from "../firebase";
import { collection, addDoc } from "firebase/firestore";

// ─── Firebase helper ─────────────────────────────────────────────────────────

async function createTask(data) {
  await addDoc(collection(db, "tasks"), {
    ...data,
    status: "pending",
    createdAt: Date.now(),
  });
}

// ─── Default form state ───────────────────────────────────────────────────────

const defaultForm = {
  title:     "",
  type:      "Ta'lim",
  priority:  "medium",
  date:      "",
  startTime: "",
  deadline:  "",
  goal:      "",
};

// ─── Main Component ───────────────────────────────────────────────────────────

export default function AdminPage() {
  const [form, setForm] = useState(defaultForm);
  const queryClient     = useQueryClient();

  const set = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  // ── Mutation ─────────────────────────────────────────────────────────────
  const { mutate: addTask, isPending, isSuccess, isError } = useMutation({
    mutationFn: createTask,
    onSuccess: () => {
      setForm(defaultForm);
      // TasksPage cache ni ham yangilaydi (agar bir xil QueryClient bo'lsa)
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
    onError: (err) => console.error("Firebase xatoligi:", err),
  });

  // ── Submit ────────────────────────────────────────────────────────────────
  const handleSubmit = (e) => {
    e.preventDefault();

    const { title, date, startTime, deadline, goal } = form;
    if (!title || !date || !startTime || !deadline || !goal) {
      alert("Barcha maydonlarni to'ldiring");
      return;
    }

    addTask(form);
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div style={{ maxWidth: "850px", margin: "0 auto", padding: "20px" }}>
      {/* Header */}
      <div style={{ marginBottom: "24px" }}>
        <h1 style={{ color: "#f8fafc", fontSize: "32px", fontWeight: "800", marginBottom: "6px", margin: 0 }}>
          Vazifa qo'shish
        </h1>
        <p style={{ color: "#64748b", fontSize: "14px", margin: "4px 0 0" }}>
          Yangi vazifa yaratish paneli
        </p>
      </div>

      {/* Success / Error banners */}
      {isSuccess && (
        <div style={{
          marginBottom: "16px",
          padding: "12px 16px",
          borderRadius: "12px",
          background: "rgba(34,197,94,0.1)",
          border: "1px solid rgba(34,197,94,0.25)",
          color: "#22c55e",
          fontSize: "14px",
          fontWeight: "600",
        }}>
          ✅ Vazifa muvaffaqiyatli saqlandi
        </div>
      )}
      {isError && (
        <div style={{
          marginBottom: "16px",
          padding: "12px 16px",
          borderRadius: "12px",
          background: "rgba(239,68,68,0.1)",
          border: "1px solid rgba(239,68,68,0.25)",
          color: "#ef4444",
          fontSize: "14px",
          fontWeight: "600",
        }}>
          ⚠️ Firebasega yozishda xatolik yuz berdi
        </div>
      )}

      {/* Form — note: using onSubmit on a div to avoid HTML form issues */}
      <div
        style={{
          background: "linear-gradient(135deg,#1a1d27,#161922)",
          border: "1px solid rgba(255,255,255,0.07)",
          borderRadius: "18px",
          padding: "22px",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
        }}
      >
        <input
          type="text"
          placeholder="Vazifa nomi"
          value={form.title}
          onChange={set("title")}
          style={inputStyle}
        />

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: "14px" }}>
          <select value={form.type} onChange={set("type")} style={inputStyle}>
            <option value="Ta'lim">Ta'lim</option>
            <option value="Dasturlash">Dasturlash</option>
            <option value="Ish">Ish</option>
            <option value="Sport">Sport</option>
            <option value="Shaxsiy">Shaxsiy</option>
          </select>

          <select value={form.priority} onChange={set("priority")} style={inputStyle}>
            <option value="high">Yuqori</option>
            <option value="medium">O'rta</option>
            <option value="low">Past</option>
          </select>
        </div>

        <input
          type="date"
          value={form.date}
          onChange={set("date")}
          style={inputStyle}
        />

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: "14px" }}>
          <input
            type="time"
            value={form.startTime}
            onChange={set("startTime")}
            style={inputStyle}
          />
          <input
            type="time"
            value={form.deadline}
            onChange={set("deadline")}
            style={inputStyle}
          />
        </div>

        <textarea
          rows="5"
          placeholder="Maqsad yoki izoh..."
          value={form.goal}
          onChange={set("goal")}
          style={{ ...inputStyle, resize: "vertical" }}
        />

        <button
          onClick={handleSubmit}
          disabled={isPending}
          style={{
            border: "none",
            borderRadius: "12px",
            padding: "14px",
            cursor: isPending ? "not-allowed" : "pointer",
            color: "#fff",
            fontWeight: "700",
            fontSize: "15px",
            opacity: isPending ? 0.7 : 1,
            background: "linear-gradient(135deg,#f59e0b,#f97316)",
            transition: "opacity 0.15s",
          }}
        >
          {isPending ? "Saqlanmoqda…" : "Vazifani saqlash"}
        </button>
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "14px",
  borderRadius: "12px",
  border: "1px solid rgba(255,255,255,0.08)",
  background: "#0f172a",
  color: "#fff",
  outline: "none",
  fontSize: "14px",
  boxSizing: "border-box",
};