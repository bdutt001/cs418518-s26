import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./AdvisingForm.css";

const API_URL = import.meta.env.VITE_API_KEY;
const API = `${API_URL}/api/advising`;
const COURSE_API = `${API_URL}/courses/taken`;

export default function AdvisingForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const user = JSON.parse(localStorage.getItem("loggedInUser"));


  const isAdmin = user?.u_is_admin;

  const [adminDecision, setAdminDecision] = useState("Pending");
  const [feedback, setFeedback] = useState("");

  const [recordId, setRecordId] = useState(null);
  const [status, setStatus] = useState("Pending");
  const [isEditable, setIsEditable] = useState(true);

  const [form, setForm] = useState({
    lastTerm: "",
    lastGpa: "",
    currentTerm: ""
  });

  const [courses, setCourses] = useState([
    { level: "", course_name: "" }
  ]);

  const [takenCourses, setTakenCourses] = useState([]);

  // ========================
  // LOAD EXISTING RECORD
  // ========================
  useEffect(() => {
    if (!id) return;

    fetch(`${API}/${id}`)
      .then(res => res.json())
      .then(data => {
        setRecordId(data.record.id);
        setStatus(data.record.status);

        setAdminDecision(data.record.status || "Pending");

        setForm({
          lastTerm: data.record.last_term || "",
          lastGpa: data.record.last_gpa || "",
          currentTerm: data.record.current_term || ""
        });

        setCourses(data.courses || []);

        if (data.record.status !== "Pending") {
          setIsEditable(false);
        }
      })
      .catch(console.error);
  }, [id]);

  // ========================
  // FETCH TAKEN COURSES
  // ========================
  useEffect(() => {
    if (!form.lastTerm || !user?.u_id) return;

    fetch(`${COURSE_API}/${user.u_id}?term=${form.lastTerm}`)
      .then(res => res.json())
      .then(data => setTakenCourses(data || []))
      .catch(console.error);
  }, [form.lastTerm]);

  // ========================
  // HANDLERS
  // ========================
  function updateForm(field, value) {
    setForm(prev => ({ ...prev, [field]: value }));
  }

  function addRow() {
    if (!isEditable) return;
    setCourses(prev => [...prev, { level: "", course_name: "" }]);
  }

  async function handleAdminSubmit() {
    if (!feedback.trim()) {
      alert("Please provide feedback before submitting");
      return;
    }

    try {
      const res = await fetch(`${API}/${recordId}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: adminDecision,
          feedback
        })
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        alert(data.error || "Failed to update status");
        return;
      }

      alert("Decision submitted");

      navigate("/advising-history");
    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  }

  function updateCourse(index, field, value) {
    const updated = [...courses];

    if (
      field === "course_name" &&
      takenCourses.includes(value)
    ) {
      alert("You already took this course last term");
      return;
    }

    updated[index][field] = value;
    setCourses(updated);
  }

  function removeRow(index) {
    if (!isEditable) return;
    setCourses(prev => prev.filter((_, i) => i !== index));
  }

  // ========================
  // SUBMIT
  // ========================
  async function handleSubmit() {
    if (!form.lastTerm || !form.currentTerm) {
      alert("Please fill in required fields");
      return;
    }

    const payload = {
      userId: user.u_id,
      lastTerm: form.lastTerm,
      lastGpa: form.lastGpa,
      currentTerm: form.currentTerm,
      courses
    };

    const url = recordId ? `${API}/${recordId}` : API;
    const method = recordId ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        alert(data.error || "Failed to save record");
        return;
      }

      alert("Advising saved successfully");
      navigate("/advising-history");
    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  }

  // ========================
  // UI
  // ========================
  return (
    <div>
      <h2>Course Advising Form</h2>

      <section className="term-info">
        <h3>Term</h3>
        <div className="inputs">
          <input
            placeholder="Last Term Attended"
            value={form.lastTerm}
            disabled={!isEditable}
            onChange={(e) => updateForm("lastTerm", e.target.value)}
          />

          <input
            placeholder="Last GPA"
            value={form.lastGpa}
            disabled={!isEditable}
            onChange={(e) => updateForm("lastGpa", e.target.value)}
          />

          <input
            placeholder="Current Term"
            value={form.currentTerm}
            disabled={!isEditable}
            onChange={(e) => updateForm("currentTerm", e.target.value)}
          />
        </div>
      </section>

      <section>
        <div className="heading-row">
          <h3>Course Plan</h3>

          {isEditable && (
            <button onClick={addRow}>+ Add Course</button>
          )}
        </div>
        {courses.map((course, index) => (
          <div key={index} className="plan">
            <select
              value={course.level}
              disabled={!isEditable}
              onChange={(e) =>
                updateCourse(index, "level", e.target.value)
              }
            >
              <option value="">Level</option>
              <option>100</option>
              <option>200</option>
              <option>300</option>
              <option>400</option>
            </select>

            <select
              value={course.course_name}
              disabled={!isEditable}
              onChange={(e) =>
                updateCourse(index, "course_name", e.target.value)
              }
            >
              <option value="">Course Name</option>
              <option>CS101</option>
              <option>CS201</option>
              <option>CS301</option>
            </select>

            {isEditable && (
              <button onClick={() => removeRow(index)}>Remove</button>
            )}
          </div>
        ))}
      </section>

      <section>
        <button onClick={() => navigate("/dashboard")}>
          Back to Dashboard
        </button>
        <button onClick={handleSubmit} disabled={!isEditable}>
          {recordId ? "Update" : "Submit"}
        </button>

        {!isEditable && (
          <p>This record is locked (Approved/Rejected)</p>
        )}
      </section>

      {isAdmin && (
        <section style={{ marginTop: 30 }}>
          <h3>Admin Review</h3>

          <select
            value={adminDecision}
            onChange={(e) => setAdminDecision(e.target.value)}
          >
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>

          <textarea
            placeholder="Enter feedback for student..."
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            style={{ width: "100%", height: 120, marginTop: 10 }}
          />

          <button onClick={handleAdminSubmit}>
            Submit Decision
          </button>
        </section>
      )}
    </div>
  );
}