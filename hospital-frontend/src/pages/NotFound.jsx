import React from 'react';
import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <div style={{ padding: '60px', textAlign: 'center' }}>
      <h1>404 - Page not found</h1>
      <p>The page you're looking for does not exist.</p>
      <p>
        <Link to="/login">Go to Login</Link>
      </p>
    </div>
  );
}

export default NotFound;
