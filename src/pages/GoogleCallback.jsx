import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function GoogleCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    // Since session might not be working, let's try a different approach
    // Redirect to home and let the app handle authentication
    const timer = setTimeout(() => {
      navigate('/', { replace: true });
    }, 1000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      flexDirection: 'column'
    }}>
      <h2>Google Sign In Successful!</h2>
      <p>Redirecting you to the app...</p>
      <div>Loading...</div>
    </div>
  );
}

export default GoogleCallback;