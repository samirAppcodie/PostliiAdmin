import React, { useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CreateAdmin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleCreateAdmin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `https://admin.postlii.com/api/admin/create-admin`,
        { email, password }
      );

      toast.success(response.data.message); // show success toast

      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Error creating admin';
      toast.error(errorMessage); // show error toast
    }
  };

  const styles = {
     page: {
      minHeight: '100vh',
      // display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(180deg, #1E1E2F, #4B4F7A)', // page background
      padding: '20px',
    },
    form: {
      maxWidth: '440px',
      margin: '60px auto',
      padding: '35px',
      background: 'linear-gradient(145deg, #ffffff, #e6e6e6)',
      borderRadius: '12px',
      boxShadow: '0 12px 28px rgba(0,0,0,0.08)',
      fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif',
      display: 'flex',
      flexDirection: 'column',
      gap: '18px',
    },
    label: {
      fontWeight: '600',
      color: '#333',
      fontSize: '14px',
    },
    input: {
      padding: '12px',
      fontSize: '15px',
      borderRadius: '8px',
      border: '1.8px solid #ccc',
      outline: 'none',
      backgroundColor: '#fdfdfd',
    },
    button: {
      padding: '14px',
      fontSize: '16px',
      fontWeight: '600',
      color: 'white',
      background: ' linear-gradient(180deg, #1E1E2F, #4B4F7A)',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
    },
  };

  return (
        <div style={styles.page}>
      <form onSubmit={handleCreateAdmin} style={styles.form}>
        <h2 style={{ textAlign: 'center', color: '#222', marginBottom: '20px' }}>
          🧑‍💼 Create Admin
        </h2>

        <label htmlFor="email" style={styles.label}>
          Admin Email:
        </label>
        <input
          id="email"
          type="email"
          placeholder="Admin Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={styles.input}
          onFocus={(e) => (e.target.style.borderColor = '#007BFF')}
          onBlur={(e) => (e.target.style.borderColor = '#ccc')}
        />

        <label htmlFor="password" style={styles.label}>
          Admin Password:
        </label>
        <input
          id="password"
          type="password"
          placeholder="Admin Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={styles.input}
          onFocus={(e) => (e.target.style.borderColor = '#007BFF')}
          onBlur={(e) => (e.target.style.borderColor = '#ccc')}
        />

        <button
          type="submit"
          style={styles.button}
          onMouseOver={(e) =>
            (e.currentTarget.style.background =
              ' linear-gradient(180deg, #1E1E2F, #4B4F7A)')
          }
          onMouseOut={(e) =>
            (e.currentTarget.style.background =
              'linear-gradient(180deg, #4B4F7A, #1E1E2F)  ')
          }
        >
          Create Admin
        </button>
      </form>

      <ToastContainer position="top-right" autoClose={2500} />
    </div>
  );
};

export default CreateAdmin;
