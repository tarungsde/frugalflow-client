import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../axios';

function GoogleCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      // Check if user is authenticated via session
      const response = await axios.get('/me', {
        withCredentials: true
      });
      
      if (response.data.loggedIn) {
        // Success - redirect to dashboard
        navigate('/');
      } else {
        // Not authenticated - redirect to login
        navigate('/login?error=Google authentication failed');
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      navigate('/login?error=Authentication failed');
    }
  };

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      flexDirection: 'column',
      padding: '2rem'
    }}>
      <h2>Completing Google Sign In...</h2>
      <p>Please wait while we authenticate you.</p>
      <div>Loading...</div>
    </div>
  );
}

export default GoogleCallback;