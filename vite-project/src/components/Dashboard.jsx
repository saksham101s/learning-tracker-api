import { useState, useEffect } from 'react';

const Dashboard = ({ token, setToken }) => {
  const [date, setDate] = useState('');
  const [platform, setPlatform] = useState('');
  const [topics, setTopics] = useState('');
  const [timeSpent, setTimeSpent] = useState('');
  const [problemsSolved, setProblemsSolved] = useState('');
  const [logs, setLogs] = useState([]);
  const [stats, setStats] = useState({ total_time: 0, total_problems: 0 });

  const API_URL = 'http://localhost:8000';

  const fetchLogs = async () => {
    const res = await fetch(`${API_URL}/logs`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    setLogs(data);
  };

  const fetchStats = async () => {
    const res = await fetch(`${API_URL}/stats`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    setStats(data);
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
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    });

    setDate('');
    setPlatform('');
    setTopics('');
    setTimeSpent('');
    setProblemsSolved('');
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
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </div>

      <div className="card">
        <h2>Add Learning Log</h2>
        <div className="form">
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          <input type="text" placeholder="Platform" value={platform} onChange={(e) => setPlatform(e.target.value)} />
          <input type="text" placeholder="Topics Covered" value={topics} onChange={(e) => setTopics(e.target.value)} />
          <input type="number" placeholder="Time Spent (hrs)" value={timeSpent} onChange={(e) => setTimeSpent(e.target.value)} />
          <input type="number" placeholder="Problems Solved" value={problemsSolved} onChange={(e) => setProblemsSolved(e.target.value)} />
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
        <ul>
          {logs.map((log, index) => (
            <li key={index}>
              <strong>{log.date}</strong> — {log.platform}: {log.problems_solved} problems in {log.time_spent} hrs
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;
