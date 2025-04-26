import { useEffect, useState } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

function Dashboard({ token, setToken}){
    const [logs, setLogs] = useState([]);
    const [totalTime, setTotalTime] = useState(0);
    const [totalProblems, setTotalProblems] = useState(0);

    const[ formData, setFormData] = useState({
        date: '',
        platform: '',
        topics: '',
        time_spent: '',
        problems_solved: ''
    });

    const fetchLogs = async () => {
        try{
            const res = await axios.get(`${API_URL}/logs`,{
                headers: {Authorization: `Bearer ${token}`}
            });
            setLogs(res.data);
        }
        catch (err) {
            console.error('Failed to load logs:', err);
        }
    };

    const fetchStats = async () => {
        try {
          const res = await axios.get(`${API_URL}/stats`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setTotalTime(res.data.total_time);
          setTotalProblems(res.data.total_problems);
        } catch (err) {
          console.error('Failed to load stats:', err);
        }
      };
    
      const handleLogSubmit = async () => {
        try {
          await axios.post(`${API_URL}/log`, formData, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setFormData({ date: '', platform: '', topics: '', time_spent: '', problems_solved: '' });
          fetchLogs();
          fetchStats();
        } catch (err) {
          console.error('Failed to submit log:', err);
        }
      };
    
      const handleLogout = () => {
        setToken(null);
      };
    
      useEffect(() => {
        fetchLogs();
        fetchStats();
      }, []);

      return (
        <div className="dashboard">
      <h2>Welcome to your Dashboard</h2>
      <button onClick={handleLogout}>Logout</button>

      <h3>Add Learning Log</h3>
      <div className="log-form">
        <input
          type="date"
          value={formData.date}
          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
        />
        <input
          type="text"
          placeholder="Platform"
          value={formData.platform}
          onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
        />
        <input
          type="text"
          placeholder="Topics Covered"
          value={formData.topics}
          onChange={(e) => setFormData({ ...formData, topics: e.target.value })}
        />
        <input
          type="number"
          step="0.1"
          placeholder="Time Spent (hrs)"
          value={formData.time_spent}
          onChange={(e) => setFormData({ ...formData, time_spent: e.target.value })}
        />
        <input
          type="number"
          placeholder="Problems Solved"
          value={formData.problems_solved}
          onChange={(e) => setFormData({ ...formData, problems_solved: e.target.value })}
        />
        <button onClick={handleLogSubmit}>Add Log</button>
      </div>

      <div className="stats">
        <h3>Your Stats</h3>
        <p>Total Time: {totalTime} hrs</p>
        <p>Total Problems Solved: {totalProblems}</p>
      </div>

      <div className="logs">
        <h3>Learning Logs</h3>
        <ul>
          {logs.map((log, index) => (
            <li key={index}>
              {log.date}: {log.platform} - {log.problems_solved} problems in {log.time_spent} hrs
            </li>
          ))}
        </ul>
      </div>
    </div>
    );
}

export default Dashboard;