import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdvisingHistory.css";

export default function AdvisingHistory() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("loggedInUser"));

  const [records, setRecords] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:3000/api/advising/history/${user.u_id}`)
      .then(res => res.json())
      .then(data => setRecords(data));
  }, []);

  return (
    <div>
      <h2>Advising History</h2>
      <div className="history">
        

        {records.length === 0 ? (
          <p>No records found.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Term</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {records.map(rec => (
                <tr key={rec.id} onClick={() => navigate(`/advising/${rec.id}`)}>
                  <td>{new Date(rec.created_at).toLocaleDateString()}</td>
                  <td>{rec.current_term}</td>
                  <td>{rec.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <button onClick={() => navigate("/dashboard")}>
          Back to Dashboard
        </button>
      </div>
    </div>
  );
}