import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

function AuthSuccess() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  useEffect(() => {
    if (token) {
      // Store the token in localStorage
      localStorage.setItem('authToken', token);
      
      // Redirect to main app
      setTimeout(() => {
        navigate('/');
      }, 1000);
    } else {
      // No token, redirect to login
      navigate('/login?error=Authentication failed');
    }
  }, [token, navigate]);

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      flexDirection: 'column'
    }}>
      <h2>Authentication Successful!</h2>
      <p>Redirecting you to the app...</p>
      <div>Loading...</div>
    </div>
  );
}

export default AuthSuccess;