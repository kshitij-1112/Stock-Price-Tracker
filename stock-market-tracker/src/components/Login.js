import React, { useState } from 'react';
import { useAuth } from '../AuthContext';

function Login() {
  const { handleLogin } = useAuth();
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    const email = event.target.username.value;
    const password = event.target.password.value;

    try {
      setError('');
      // Call handleLogin function to authenticate using Firebase
      const { success, message } = await handleLogin(email, password);

      if (!success) {
        setError(message || 'Failed to log in. Please try again.');
      } else {
        // Redirect or perform further actions after successful login
        window.location.href = '/stocks'; // Adjust redirect path as needed
      }
    } catch (error) {
      console.error('Error logging in:', error.message);
      setError('Failed to log in. Please check your credentials.');
    }
  };

  const inputStyles = {
    padding: '0.75rem',
    fontSize: '1rem',
    border: '1px solid #ccc',
    borderRadius: '4px',
    marginBottom: '1rem',
    width: '100%',
  };

  const buttonStyles = {
    padding: '1rem 2rem',
    fontSize: '1rem',
    border: 'none',
    borderRadius: '4px',
    backgroundColor: '#f0f0f0',
    color: '#405d72',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease-in-out, color 0.2s ease-in-out',
    width: '100%',
  };

  return (
    <div style={{ // Container styles
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '2rem',
      backgroundColor: '#405d72',
      color: '#f0f0f0',
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: '60%',
      maxWidth: '400px',
      borderRadius: '12px',
      boxShadow: '0 8px 16px rgba(0, 0, 0, 0.3)',
      zIndex: '10',
    }}>
      <form onSubmit={handleSubmit} style={{ // Form styles
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}>
        <label>
          Username:
          <input type="text" name="username" required style={inputStyles} />
        </label>
        <label>
          Password:
          <input type="password" name="password" required style={inputStyles} />
        </label>
        {error && <div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}
        <button type="submit" name="submit" style={buttonStyles}>Login</button>
      </form>
    </div>
  );
}

export default Login;
