import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { db } from "../firebase";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
} from "firebase/firestore";

// ─── Firebase helpers ────────────────────────────────────────────────────────

async function fetchNotes() {
  const snapshot = await getDocs(collection(db, "notes"));
  const notes = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
  return notes.sort((a, b) => b.createdAt - a.createdAt);
}

async function createNote(text) {
  await addDoc(collection(db, "notes"), {
    text,
    createdAt: Date.now(),
  });
}

async function editNote({ id, text }) {
  await updateDoc(doc(db, "notes", id), { text });
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function NotesPage() {
  const [text, setText]             = useState("");
  const [editingId, setEditingId]   = useState(null);
  const [editingText, setEditingText] = useState("");

  const queryClient = useQueryClient();

  // ── Fetch notes ──────────────────────────────────────────────────────────
  const {
    data: notes = [],
    isLoading,
    isError,
    isFetching,
  } = useQuery({
    queryKey: ["notes"],
    queryFn:  fetchNotes,
    staleTime: 2 * 60 * 1000,       // 2 daqiqa stale emas
    refetchOnWindowFocus: true,      // oyna fokusga kelganda yangilaydi
  });

  // ── Add note mutation ────────────────────────────────────────────────────
  const { mutate: addNote, isPending: isAdding } = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      setText("");
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
    onError: (err) => console.error("Qo'shishda xatolik:", err),
  });

  // ── Edit note mutation ───────────────────────────────────────────────────
  const { mutate: saveEdit, isPending: isSaving } = useMutation({
    mutationFn: editNote,
    // Optimistic update
    onMutate: async ({ id, text: newText }) => {
      await queryClient.cancelQueries({ queryKey: ["notes"] });
      const previous = queryClient.getQueryData(["notes"]);

      queryClient.setQueryData(["notes"], (old = []) =>
        old.map((n) => (n.id === id ? { ...n, text: newText } : n))
      );

      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["notes"], context.previous);
      }
    },
    onSuccess: () => {
      setEditingId(null);
      setEditingText("");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });

  // ── Handlers ─────────────────────────────────────────────────────────────
  const handleAdd = () => {
    if (!text.trim()) {
      alert("Matn kiriting");
      return;
    }
    addNote(text.trim());
  };

  const handleSaveEdit = (id) => {
    if (!editingText.trim()) return;
    saveEdit({ id, text: editingText.trim() });
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div style={{ maxWidth: "850px", margin: "0 auto", padding: "20px" }}>
      {/* Header */}
      <div style={{ marginBottom: "25px", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div>
          <h1 style={{ color: "#f8fafc", fontSize: "32px", fontWeight: "800", marginBottom: "5px", margin: 0 }}>
            Notes
          </h1>
          <p style={{ color: "#64748b", fontSize: "14px", margin: "4px 0 0" }}>
            Shaxsiy qaydlaringiz
          </p>
        </div>
        {isFetching && !isLoading && (
          <span style={{ fontSize: "12px", color: "#64748b", display: "flex", alignItems: "center", gap: "5px" }}>
            <span style={{
              width: "6px", height: "6px", borderRadius: "50%",
              background: "#22c55e", display: "inline-block",
              animation: "pulse 1s infinite",
            }} />
            Yangilanmoqda…
          </span>
        )}
      </div>

      {/* Input area */}
      <div style={{
        background: "linear-gradient(135deg,#1a1d27,#161922)",
        border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: "18px",
        padding: "18px",
        marginBottom: "25px",
      }}>
        <textarea
          rows="5"
          placeholder="Bugungi fikrlaringizni yozing..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          style={{
            width: "100%",
            background: "#0f172a",
            border: "1px solid rgba(255,255,255,0.08)",
            color: "#fff",
            borderRadius: "14px",
            padding: "15px",
            resize: "none",
            outline: "none",
            fontSize: "15px",
            boxSizing: "border-box",
          }}
        />

        <button
          onClick={handleAdd}
          disabled={isAdding}
          style={{
            marginTop: "14px",
            width: "100%",
            padding: "12px",
            border: "none",
            borderRadius: "12px",
            cursor: isAdding ? "not-allowed" : "pointer",
            fontWeight: "700",
            color: "#fff",
            opacity: isAdding ? 0.7 : 1,
            background: "linear-gradient(135deg,#f59e0b,#f97316)",
            transition: "opacity 0.15s",
          }}
        >
          {isAdding ? "Saqlanmoqda…" : "✍️ Yozuv qo'shish"}
        </button>
      </div>

      {/* Notes list */}
      {isLoading ? (
        <div style={{ textAlign: "center", padding: "60px 0", color: "#475569" }}>
          <div style={{ fontSize: "32px", marginBottom: "12px" }}>⏳</div>
          Yuklanmoqda...
        </div>
      ) : isError ? (
        <div style={{ textAlign: "center", padding: "60px 0", color: "#ef4444" }}>
          <div style={{ fontSize: "32px", marginBottom: "12px" }}>⚠️</div>
          Qaydlarni yuklashda xatolik yuz berdi
        </div>
      ) : notes.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 0", color: "#475569" }}>
          <div style={{ fontSize: "40px", marginBottom: "12px" }}>📭</div>
          Hali qaydlar yo'q
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          {notes.map((note) => (
            <div key={note.id} style={{ display: "flex", justifyContent: "flex-end" }}>
              <div style={{
                width: "fit-content",
                maxWidth: "80%",
                background: "linear-gradient(135deg,#1a1d27,#232838)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "18px 18px 4px 18px",
                padding: "15px",
              }}>
                {editingId === note.id ? (
                  <>
                    <textarea
                      rows="5"
                      value={editingText}
                      onChange={(e) => setEditingText(e.target.value)}
                      style={{
                        width: "100%",
                        background: "#0f172a",
                        border: "1px solid rgba(255,255,255,0.08)",
                        color: "#fff",
                        borderRadius: "10px",
                        padding: "10px",
                        resize: "none",
                        boxSizing: "border-box",
                        outline: "none",
                      }}
                    />
                    <div style={{ display: "flex", gap: "8px", marginTop: "10px" }}>
                      <button
                        onClick={() => handleSaveEdit(note.id)}
                        disabled={isSaving}
                        style={{
                          border: "none",
                          borderRadius: "8px",
                          padding: "8px 14px",
                          cursor: isSaving ? "not-allowed" : "pointer",
                          color: "#fff",
                          background: "#22c55e",
                          opacity: isSaving ? 0.7 : 1,
                          fontWeight: "600",
                          transition: "opacity 0.15s",
                        }}
                      >
                        {isSaving ? "Saqlanmoqda…" : "Saqlash"}
                      </button>
                      <button
                        onClick={() => { setEditingId(null); setEditingText(""); }}
                        disabled={isSaving}
                        style={{
                          border: "1px solid rgba(255,255,255,0.1)",
                          borderRadius: "8px",
                          padding: "8px 14px",
                          cursor: "pointer",
                          color: "#94a3b8",
                          background: "transparent",
                          fontWeight: "600",
                        }}
                      >
                        Bekor qilish
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <p style={{ color: "#f1f5f9", lineHeight: "1.7", margin: 0, whiteSpace: "pre-wrap" }}>
                      {note.text}
                    </p>
                    <div style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginTop: "12px",
                      gap: "12px",
                    }}>
                      <span style={{ fontSize: "12px", color: "#64748b" }}>
                        {new Date(note.createdAt).toLocaleString("uz-UZ")}
                      </span>
                      <button
                        onClick={() => { setEditingId(note.id); setEditingText(note.text); }}
                        style={{
                          border: "none",
                          background: "transparent",
                          color: "#f59e0b",
                          cursor: "pointer",
                          fontWeight: "600",
                          padding: 0,
                        }}
                      >
                        ✏️ Tahrirlash
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.3; }
        }
      `}</style>
    </div>
  );
}