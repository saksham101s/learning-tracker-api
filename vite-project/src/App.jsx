import { useState } from 'react';
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';
import './styles/app.css';

function App() {
  const [token, setToken] = useState(null);

  return (
    <div className="App">
      {!token ? (
        <Auth setToken={setToken} />
      ) : (
        <Dashboard token={token} setToken={setToken} />
      )}
    </div>
  );
}

export default App;
