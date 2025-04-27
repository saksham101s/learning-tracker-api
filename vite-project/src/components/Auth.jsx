import { useState } from 'react';

const Auth = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [isLogin, setIsLogin] = useState(true); // Login or Register mode
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // 👉 NEW STATE

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true); // 👉 Start loading

    try {
      if (isLogin) {
        // Login
        const response = await fetch('http://localhost:8000/token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams({ username, password })
        });

        if (!response.ok) {
          throw new Error('Login failed');
        }

        const data = await response.json();
        onLoginSuccess(data.access_token);
      } else {
        // Register
        const response = await fetch('http://localhost:8000/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password, email })
        });

        if (!response.ok) {
          throw new Error('Registration failed');
        }

        alert('Registration successful! Now you can login.');
        setIsLogin(true);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false); // 👉 Stop loading in any case
    }
  };

  return (
    <div className="auth-container">
      <h2>{isLogin ? 'Login' : 'Register'}</h2>

      <form onSubmit={handleSubmit}>
        {!isLogin && (
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        )}
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
  {loading ? <div className="spinner"></div> : (isLogin ? 'Login' : 'Register')}
</button>

      </form>

      {error && <p className="error">{error}</p>}

      <p>
        {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
        <button type="button" onClick={() => setIsLogin(!isLogin)}>
          {isLogin ? 'Register' : 'Login'}
        </button>
      </p>
    </div>
  );
};

export default Auth;
