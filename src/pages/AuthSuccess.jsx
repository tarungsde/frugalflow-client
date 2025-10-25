import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

function AuthSuccess() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  // Get token from either 'token' parameter or 'code' parameter
  const token = searchParams.get('token');
  const code = searchParams.get('code');

  useEffect(() => {
    if (token) {
      // Token from server redirect
      localStorage.setItem('authToken', token);
      console.log('Token stored successfully:', token);
      navigate('/');
    } else if (code) {
      // Code from Google - this means server callback didn't process properly
      console.log('Received code from Google, but no token from server');
      navigate('/login?error=Authentication failed - please try again');
    } else {
      // No token or code
      navigate('/login?error=Authentication failed');
    }
  }, [token, code, navigate]);

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      flexDirection: 'column'
    }}>
      <h2>Processing Authentication...</h2>
      <p>Please wait while we complete your sign in.</p>
    </div>
  );
}

export default AuthSuccess;