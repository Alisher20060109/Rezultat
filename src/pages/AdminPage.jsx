
import { useState } from "react";
import { db } from "../firebase";
import { collection, addDoc } from "firebase/firestore";

export default function AdminPage() {
  const [title, setTitle] = useState("");
  const [type, setType] = useState("Ta'lim");
  const [priority, setPriority] = useState("medium");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [deadline, setDeadline] = useState("");
  const [goal, setGoal] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !title ||
      !date ||
      !startTime ||
      !deadline ||
      !goal
    ) {
      alert("Barcha maydonlarni to'ldiring");
      return;
    }

    try {
      await addDoc(collection(db, "tasks"), {
        title,
        type,
        priority,
        date,
        startTime,
        deadline,
        goal,
        status: "pending",
        createdAt: Date.now(),
      });

      alert("Vazifa muvaffaqiyatli saqlandi");

      setTitle("");
      setType("Ta'lim");
      setPriority("medium");
      setDate("");
      setStartTime("");
      setDeadline("");
      setGoal("");
    } catch (error) {
      console.error(error);
      alert("Firebasega yozishda xatolik");
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
      <div style={{ marginBottom: "24px" }}>
        <h1
          style={{
            color: "#f8fafc",
            fontSize: "32px",
            fontWeight: "800",
            marginBottom: "6px",
          }}
        >
          Vazifa qo‘shish
        </h1>

        <p
          style={{
            color: "#64748b",
            fontSize: "14px",
          }}
        >
          Yangi vazifa yaratish paneli
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        style={{
          background:
            "linear-gradient(135deg,#1a1d27,#161922)",
          border:
            "1px solid rgba(255,255,255,0.07)",
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
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={inputStyle}
        />

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit,minmax(220px,1fr))",
            gap: "14px",
          }}
        >
          <select
            value={type}
            onChange={(e) =>
              setType(e.target.value)
            }
            style={inputStyle}
          >
            <option value="Ta'lim">
              Ta'lim
            </option>
            <option value="Dasturlash">
              Dasturlash
            </option>
            <option value="Ish">
              Ish
            </option>
            <option value="Sport">
              Sport
            </option>
            <option value="Shaxsiy">
              Shaxsiy
            </option>
          </select>

          <select
            value={priority}
            onChange={(e) =>
              setPriority(e.target.value)
            }
            style={inputStyle}
          >
            <option value="high">
              Yuqori
            </option>
            <option value="medium">
              O‘rta
            </option>
            <option value="low">
              Past
            </option>
          </select>
        </div>

        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          style={inputStyle}
        />

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit,minmax(220px,1fr))",
            gap: "14px",
          }}
        >
          <input
            type="time"
            value={startTime}
            onChange={(e) =>
              setStartTime(e.target.value)
            }
            style={inputStyle}
          />

          <input
            type="time"
            value={deadline}
            onChange={(e) =>
              setDeadline(e.target.value)
            }
            style={inputStyle}
          />
        </div>

        <textarea
          rows="5"
          placeholder="Maqsad yoki izoh..."
          value={goal}
          onChange={(e) =>
            setGoal(e.target.value)
          }
          style={{
            ...inputStyle,
            resize: "vertical",
          }}
        />

        <button
          type="submit"
          style={{
            border: "none",
            borderRadius: "12px",
            padding: "14px",
            cursor: "pointer",
            color: "#fff",
            fontWeight: "700",
            fontSize: "15px",
            background:
              "linear-gradient(135deg,#f59e0b,#f97316)",
          }}
        >
          Vazifani saqlash
        </button>
      </form>
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

