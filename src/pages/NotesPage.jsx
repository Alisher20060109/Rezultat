import { useEffect, useState } from "react";
import { db } from "../firebase";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
} from "firebase/firestore";

export default function NotesPage() {
  const [text, setText] = useState("");
  const [notes, setNotes] = useState([]);

  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState("");

  const getNotes = async () => {
    try {
      const querySnapshot = await getDocs(
        collection(db, "notes")
      );

      const notesList = [];

      querySnapshot.forEach((item) => {
        notesList.push({
          id: item.id,
          ...item.data(),
        });
      });

      notesList.sort(
        (a, b) => b.createdAt - a.createdAt
      );

      setNotes(notesList);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getNotes();
  }, []);

  const addNote = async () => {
    if (!text.trim()) {
      alert("Matn kiriting");
      return;
    }

    try {
      await addDoc(collection(db, "notes"), {
        text,
        createdAt: Date.now(),
      });

      setText("");
      getNotes();
    } catch (error) {
      console.log(error);
    }
  };

  const saveEdit = async (id) => {
    if (!editingText.trim()) return;

    try {
      await updateDoc(doc(db, "notes", id), {
        text: editingText,
      });

      setEditingId(null);
      setEditingText("");

      getNotes();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div
      style={{
        maxWidth: "850px",
        margin: "0 auto",
        padding: "20px",
      }}
    >
      <div style={{ marginBottom: "25px" }}>
        <h1
          style={{
            color: "#f8fafc",
            fontSize: "32px",
            fontWeight: "800",
            marginBottom: "5px",
          }}
        >
          Notes
        </h1>

        <p
          style={{
            color: "#64748b",
            fontSize: "14px",
          }}
        >
          Shaxsiy qaydlaringiz
        </p>
      </div>

      <div
        style={{
          background:
            "linear-gradient(135deg,#1a1d27,#161922)",
          border:
            "1px solid rgba(255,255,255,0.07)",
          borderRadius: "18px",
          padding: "18px",
          marginBottom: "25px",
        }}
      >
        <textarea
          rows="5"
          placeholder="Bugungi fikrlaringizni yozing..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          style={{
            width: "100%",
            background: "#0f172a",
            border:
              "1px solid rgba(255,255,255,0.08)",
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
          onClick={addNote}
          style={{
            marginTop: "14px",
            width: "100%",
            padding: "12px",
            border: "none",
            borderRadius: "12px",
            cursor: "pointer",
            fontWeight: "700",
            color: "#fff",
            background:
              "linear-gradient(135deg,#f59e0b,#f97316)",
          }}
        >
          ✍️ Yozuv qo'shish
        </button>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "14px",
        }}
      >
        {notes.map((note) => (
          <div
            key={note.id}
            style={{
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <div
              style={{
                width: "fit-content",
                maxWidth: "80%",
                background:
                  "linear-gradient(135deg,#1a1d27,#232838)",
                border:
                  "1px solid rgba(255,255,255,0.08)",
                borderRadius: "18px 18px 4px 18px",
                padding: "15px",
              }}
            >
              {editingId === note.id ? (
                <>
                  <textarea
                    rows="5"
                    value={editingText}
                    onChange={(e) =>
                      setEditingText(
                        e.target.value
                      )
                    }
                    style={{
                      width: "100%",
                      background: "#0f172a",
                      border:
                        "1px solid rgba(255,255,255,0.08)",
                      color: "#fff",
                      borderRadius: "10px",
                      padding: "10px",
                      resize: "none",
                      boxSizing: "border-box",
                    }}
                  />

                  <button
                    onClick={() =>
                      saveEdit(note.id)
                    }
                    style={{
                      marginTop: "10px",
                      border: "none",
                      borderRadius: "8px",
                      padding:
                        "8px 14px",
                      cursor: "pointer",
                      color: "#fff",
                      background:
                        "#22c55e",
                    }}
                  >
                    Saqlash
                  </button>
                </>
              ) : (
                <>
                  <p
                    style={{
                      color: "#f1f5f9",
                      lineHeight: "1.7",
                      margin: 0,
                      whiteSpace:
                        "pre-wrap",
                    }}
                  >
                    {note.text}
                  </p>

                  <div
                    style={{
                      display: "flex",
                      justifyContent:
                        "space-between",
                      alignItems:
                        "center",
                      marginTop: "12px",
                      gap: "12px",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "12px",
                        color: "#64748b",
                      }}
                    >
                      {new Date(
                        note.createdAt
                      ).toLocaleString(
                        "uz-UZ"
                      )}
                    </span>

                    <button
                      onClick={() => {
                        setEditingId(
                          note.id
                        );
                        setEditingText(
                          note.text
                        );
                      }}
                      style={{
                        border: "none",
                        background:
                          "transparent",
                        color:
                          "#f59e0b",
                        cursor:
                          "pointer",
                        fontWeight:
                          "600",
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
    </div>
  );
}