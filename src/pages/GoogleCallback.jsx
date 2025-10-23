import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../axios';

function GoogleCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    // Direct redirect for testing
    setTimeout(() => {
      navigate('/');
    }, 2000);
  }, [navigate]);

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      flexDirection: 'column',
      padding: '2rem'
    }}>
      <h2>Google Sign In Successful!</h2>
      <p>Redirecting to your dashboard...</p>
      <div>Loading...</div>
    </div>
  );
}

export default GoogleCallback;