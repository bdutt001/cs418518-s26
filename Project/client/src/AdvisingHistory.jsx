import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdvisingHistory.css";

export default function AdvisingHistory() {
  const API_URL = import.meta.env.VITE_API_KEY;
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("loggedInUser"));

  const [records, setRecords] = useState([]);

  useEffect(() => {
    const endpoint = user.u_is_admin
      ? `${API_URL}/api/advising/admin/history`
      : `${API_URL}/api/advising/history/${user.u_id}`;

    fetch(endpoint)
      .then(res => res.json())
      .then(data => {
        console.log(data);
        setRecords(Array.isArray(data) ? data : []);
      });
  }, []);

  return (

    
    <div>
      {user.u_is_admin ? (
        <div>
          <h2>Course Plans</h2>
          <div className="history">
          
            {records.length === 0 ? (
              <p>No records found.</p>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Date</th>
                    <th>Term</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {records.map(rec => (
                    <tr key={rec.id} onClick={() => navigate(`/advising/${rec.id}`)}>
                      <td>{rec.u_first_name}{" "}{rec.u_last_name}</td>
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
      ) : (
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
        )}
    </div>

  );
}