import { useState, useEffect } from "react";

const Dashboard = ({ token, setToken }) => {
  const [date, setDate] = useState("");
  const [platform, setPlatform] = useState("");
  const [topics, setTopics] = useState("");
  const [timeSpent, setTimeSpent] = useState("");
  const [problemsSolved, setProblemsSolved] = useState("");
  const [logs, setLogs] = useState([]);
  const [stats, setStats] = useState({ total_time: 0, total_problems: 0 });

  const API_URL = "http://localhost:8000";

  const fetchLogs = async () => {
    try {
      const res = await fetch(`${API_URL}/logs`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error(`Failed to fetch logs: ${res.status}`);
      }

      const data = await res.json();
      if (Array.isArray(data)) {
        setLogs(data);
      } else {
        setLogs([]);
      }
    } catch (error) {
      console.error("Error fetching logs:", error);
      setLogs([]);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await fetch(`${API_URL}/stats`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        throw new Error("Failed to fetch stats: ${res.status}");
      }

      const data = await res.json();
      setStats(data);
    } catch (err) {
      console.error("Error fetching stats:", err);
      setStats({ total_time: 0, total_problems: 0 });
    }
  };

  const handleLogout = () => {
    setToken(null);
  };

  const handleAddLog = async () => {
    const payload = {
      date,
      platform,
      topics,
      time_spent: parseFloat(timeSpent),
      problems_solved: parseInt(problemsSolved),
    };

    await fetch(`${API_URL}/log`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    setDate("");
    setPlatform("");
    setTopics("");
    setTimeSpent("");
    setProblemsSolved("");
    fetchLogs();
    fetchStats();
  };

  useEffect(() => {
    fetchLogs();
    fetchStats();
  }, []);

  return (
    <div className="dashboard">
      <div className="topbar">
        <h1>Learning Tracker</h1>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>

      <div className="card">
        <h2>Add Learning Log</h2>
        <div className="form">
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
          <input
            type="text"
            placeholder="Platform"
            value={platform}
            onChange={(e) => setPlatform(e.target.value)}
          />
          <input
            type="text"
            placeholder="Topics Covered"
            value={topics}
            onChange={(e) => setTopics(e.target.value)}
          />
          <input
            type="number"
            placeholder="Time Spent (hrs)"
            value={timeSpent}
            onChange={(e) => setTimeSpent(e.target.value)}
          />
          <input
            type="number"
            placeholder="Problems Solved"
            value={problemsSolved}
            onChange={(e) => setProblemsSolved(e.target.value)}
          />
          <button onClick={handleAddLog}>Add Log</button>
        </div>
      </div>

      <div className="stats">
        <h2>Your Stats</h2>
        <p>Total Time: {stats.total_time} hrs</p>
        <p>Total Problems Solved: {stats.total_problems}</p>
      </div>

      <div className="logs">
        <h2>Learning Logs</h2>

        {logs.length === 0 ? (
          <p>No learning logs yet. Start tracking your progress!</p>
        ) : (
          <div className="logs-container">
            {logs.map((log, index) => (
              <div key={index} className="log-card">
                <p>
                  <strong>Date:</strong> {log.date}
                </p>
                <p>
                  <strong>Platform:</strong> {log.platform}
                </p>
                <p>
                  <strong>Topics:</strong> {log.topics}
                </p>
                <p>
                  <strong>Time Spent:</strong> {log.time_spent} hrs
                </p>
                <p>
                  <strong>Problems Solved:</strong> {log.problems_solved}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
