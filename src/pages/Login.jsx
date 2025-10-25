import React, { useState } from 'react';

function Login() {

  function handleGoogleLogin() {
    window.location.href = `${import.meta.env.VITE_API_BASE_URL}/auth/google`;
  };

  return (
    <div>
      <h2>Welcome to FrugalFlow</h2>
      <p>Sign in to manage your finances</p>
      <button type="button" onClick={handleGoogleLogin}>Continue with Google</button>
    </div>
  );
}

export default Login;
