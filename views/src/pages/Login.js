import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../assets/css/Login.css';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// const BASE_URL=process.env.REACT_APP_API_URL 

const Login = ({ setIsAuthenticated }) => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const tokenKey = 'token';



  const handleGoogleLogin = () => {
    window.location.href = `https://admin.postlii.com/api/auth/google`;
  };
  
  const handleFacebookLogin = () => {
    window.location.href = `https://admin.postlii.com/api/auth/facebook`;
  };
  

  // Using the environment variable for the base API URL
  // const API_URL ='${process.env.REACT_APP_API_URL} ';
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
  
    try {
      const response = await fetch(`https://admin.postlii.com/api/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        })
      });
  
      const data = await response.json();
  
      if (response.ok && data.token) {
        localStorage.setItem('token', data.token);
        setIsAuthenticated(true);
        navigate('/dashboard');
      } else {
        setError(data.message || 'Login failed. Please check your credentials.');
      }
    } catch (err) {
      console.error('Login failed:', err);
      setError('Server error. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  

 

  return (
    <div className="login-container">

      <div className="Login-left">
      <h1>Welcome to postlii</h1>
      <strong>Log in to continue your journey.</strong><br />
    <p>Access your dashboard, share your thoughts, connect with your network, and stay updated — all in one place.</p>
    <div className="hero-image">
    <img src={"signupp.jpg"} alt="Community Connection" />
  </div>

      </div>
      <div className="Login-right">
      <div className="Login-right-box">

       
           <h2>Log in to your account</h2>
        
          <p>join postlii to connect with your community</p>
          {/* <div className="Login-Social-Login">
          <button className="login-google-btn" onClick={handleGoogleLogin}>Sign Up with Google</button>
          <button className="login-facebook-btn" onClick={handleFacebookLogin}>Sign Up with Facebook</button>
          </div> */}

          {/* <div className="login-divider">
            <span>or</span>
          </div> */}
      {/* <h2>postlii</h2>
    
      <p>Stay updated on your professional world</p> */}
      <form onSubmit={handleSubmit}>
        <div className="Login">
        <div className="input-wrapper">
          <label>Email:</label>
          <input
            type="email"
            name="email"
            className="form-control"
            value={formData.email}
            placeholder="Enter your email" // Add the placeholder here
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
        </div>
        <div className="input-wrapper">
          <label>Password:</label>
          <input
            type="password"
            name="password"
            className="form-control"
            value={formData.password}
            placeholder="Enter your password" // Add the placeholder here
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
          />
        </div>
  <div className="remember-me">
  <input
    type="checkbox"
    id="remember"
    name="remember"
    checked={formData.remember || false}
    onChange={(e) =>
      setFormData({ ...formData, remember: e.target.checked })
    }
  />
  <label htmlFor="remember">Remember me</label>
</div>
<div className="signup-prompt">
 
</div>

        <button className='Login-button'type="submit">Log in</button>
        {/* <p style={{ fontSize: '14px', color: '#6b7280', marginTop: '-16px' }}>
    Don’t have an account?{" "}
    <a href="/" className="signup-link">Sign up</a>
  </p> */}
        </div>
      </form>
      <ToastContainer closeButton={false} />
    </div>
    </div>
    </div>

   
  );
};

export default Login;
