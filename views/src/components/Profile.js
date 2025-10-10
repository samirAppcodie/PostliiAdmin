// // src/components/ProfileDropdown.js
// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// const Profile = () => {
//   const [show, setShow] = useState(false);
//     const [showForm, setShowForm] = useState(false); 
//   const [email, setEmail] = useState('');
//   const [newPassword, setNewPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');
//   const [message, setMessage] = useState('');
//   const [loading, setLoading] = useState(false);

//   // Fetch user email on mount
//   useEffect(() => {
//     const fetchProfile = async () => {
//       try {
//         const token = localStorage.getItem('token');
//         const res = await axios.get('/api/profile', {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setEmail(res.data.email);
//       } catch (err) {
//         setMessage('Failed to load profile');
//       }
//     };
//     fetchProfile();
//   }, []);

//   // Submit profile update
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (newPassword && newPassword !== confirmPassword) {
//       setMessage('Passwords do not match');
//       return;
//     }

//     setLoading(true);
//     setMessage('');
//     try {
//       const token = localStorage.getItem('token');
//       await axios.put(
//         '/api/profile',
//         { email, password: newPassword || undefined },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       setMessage('Profile updated successfully');
//       setNewPassword('');
//       setConfirmPassword('');
//       setShow(false); // close popup
//     } catch (err) {
//       setMessage(err.response?.data?.message || 'Update failed');
//     } finally {
//       setLoading(false);
//     }
//   };
// return (
//   <div style={{ position: 'relative', display: 'inline-block' }}>
//     <div
//       onClick={() => setShow(!show)}
//       style={{
//         cursor: 'pointer',
//         width: 40,
//         height: 40,
//         borderRadius: '50%',
//         backgroundColor: '#1976d2',
//         color: '#fff',
//         display: 'flex',
//         justifyContent: 'center',
//         alignItems: 'center',
//         fontWeight: 'bold',
//         fontSize: '18px',
//         userSelect: 'none',
//       }}
//       title={email}
//     >
//       {email ? email.charAt(0).toUpperCase() : '?'}
//     </div>

//     {show && (
//       <div
//         style={{
//           position: 'absolute',
//           right: 0,
//           top: 'calc(100% + 10px)',
//           backgroundColor: '#fff',
//           boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
//           padding: '16px',
//           width: '300px',
//           borderRadius: '8px',
//           zIndex: 1000,
//         }}
//       >
//         {!showForm ? (
//         <button
//   onClick={() => setShowForm(true)}
//   style={{
//     width: '70%',
//     backgroundColor: 'white',
//     color: 'black',
//     border: 'none',
//     borderRadius: '4px',
//     cursor: 'pointer',
//     textAlign: 'center',  // centers the text inside the button
//     display: 'block',     // ensures width applies properly and text centers
//     margin: '0 auto',     // centers the button itself if needed
//   }}
// >
//   🔑 Change Password
// </button>


//         ) : (
//           <form onSubmit={handleSubmit}>
//             <div style={{ marginBottom: 12 }}>
//               <label style={{ fontSize: '14px', color: '#333', marginBottom: '4px', display: 'block' }}>Email</label>
//               <input
//                 type="email"
//                 value={email}
//                 readOnly
//                 style={{
//                   width: '100%',
//                   padding: '10px',
//                   boxSizing: 'border-box',
//                   backgroundColor: '#f5f5f5',
//                   border: '1px solid #ccc',
//                   borderRadius: '6px',
//                   color: '#555',
//                   fontSize: '14px',
//                 }}
//               />
//             </div>

//             <div style={{ marginBottom: 12 }}>
//               <label style={{ fontSize: '14px', color: '#333', marginBottom: '4px', display: 'block' }}>New Password</label>
//               <input
//                 type="password"
//                 value={newPassword}
//                 onChange={(e) => setNewPassword(e.target.value)}
//                 placeholder="Leave blank to keep current"
//                 style={{
//                   width: '100%',
//                   padding: '10px',
//                   boxSizing: 'border-box',
//                   border: '1px solid #ccc',
//                   borderRadius: '6px',
//                   fontSize: '14px',
//                 }}
//               />
//             </div>

//             <div style={{ marginBottom: 12 }}>
//               <label style={{ fontSize: '14px', color: '#333', marginBottom: '4px', display: 'block' }}>Confirm Password</label>
//               <input
//                 type="password"
//                 value={confirmPassword}
//                 onChange={(e) => setConfirmPassword(e.target.value)}
//                 placeholder="Confirm new password"
//                 style={{
//                   width: '100%',
//                   padding: '10px',
//                   boxSizing: 'border-box',
//                   border: '1px solid #ccc',
//                   borderRadius: '6px',
//                   fontSize: '14px',
//                 }}
//               />
//             </div>

//             <button
//               type="submit"
//               disabled={loading}
//               style={{
//                 width: '100%',
//                 padding: '10px',
//                 backgroundColor: '#1976d2',
//                 color: '#fff',
//                 border: 'none',
//                 borderRadius: '4px',
//                 cursor: loading ? 'not-allowed' : 'pointer',
//               }}
//             >
//               {loading ? 'Saving...' : 'Save Changes'}
//             </button>

//             {message && (
//               <p
//                 style={{
//                   color: message.includes('success') ? 'green' : 'red',
//                   marginTop: '8px',
//                   textAlign: 'center',
//                 }}
//               >
//                 {message}
//               </p>
//             )}
//           </form>
//         )}
//       </div>
//     )}
//   </div>
// ); 
// }

// export default Profile;




// src/components/ProfileDropdown.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Profile = () => {
  const [show, setShow] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // Fetch user email on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('/api/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEmail(res.data.email);
      } catch (err) {
        setMessage('Failed to load profile');
      }
    };
    fetchProfile();
  }, []);

  // Submit profile update (change password)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword && newPassword !== confirmPassword) {
      setMessage('Passwords do not match');
      return;
    }

    setLoading(true);
    setMessage('');
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        '/api/profile',
        { email, password: newPassword || undefined },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage('Profile updated successfully');
      setNewPassword('');
      setConfirmPassword('');
      setShow(false);
      setShowForm(false);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      {/* Clickable profile area: circle + email */}
      <div
        onClick={() => {
          setShow(!show);
          setShowForm(false); // reset form when toggling dropdown
        }}
        style={{
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          userSelect: 'none',
          // padding: '5px 10px',
          borderRadius: '25px',
          backgroundColor: '#f0f0f0',
          width: 'max-content',
        }}
        title={email}
      >
        {/* Round profile circle */}
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: '50%',
            backgroundColor: '#1976d2',
            color: '#fff',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            fontWeight: 'bold',
            fontSize: '18px',
          }}
        >
          {email ? email.charAt(0).toUpperCase() : '?'}
        </div>

        {/* Email text */}
        {/* <span style={{ fontSize: '16px', color: '#333', fontWeight: '500' }}>
          {email || 'Loading...'}
        </span> */}
      </div>

      {show && (
        <div
          style={{
            position: 'absolute',
            right: 0,
            top: 'calc(100% + 10px)',
            backgroundColor: '#fff',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            padding: '16px',
            width: '300px',
            borderRadius: '8px',
            zIndex: 1000,
          }}
        >
          {!showForm ? (
            <button
              onClick={() => setShowForm(true)}
              style={{
                width: '70%',
                backgroundColor: 'white',
                color: 'black',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                textAlign: 'center',
                display: 'block',
                margin: '0 auto',
              }}
            >
              🔑 Change Password
            </button>
          ) : (
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: 12 }}>
                <label
                  style={{
                    fontSize: '14px',
                    color: '#333',
                    marginBottom: '4px',
                    display: 'block',
                  }}
                >
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  readOnly
                  style={{
                    width: '100%',
                    padding: '10px',
                    boxSizing: 'border-box',
                    backgroundColor: '#f5f5f5',
                    border: '1px solid #ccc',
                    borderRadius: '6px',
                    color: '#555',
                    fontSize: '14px',
                  }}
                />
              </div>

              <div style={{ marginBottom: 12 }}>
                <label
                  style={{
                    fontSize: '14px',
                    color: '#333',
                    marginBottom: '4px',
                    display: 'block',
                  }}
                >
                  New Password
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Leave blank to keep current"
                  style={{
                    width: '100%',
                    padding: '10px',
                    boxSizing: 'border-box',
                    border: '1px solid #ccc',
                    borderRadius: '6px',
                    fontSize: '14px',
                  }}
                />
              </div>

              <div style={{ marginBottom: 12 }}>
                <label
                  style={{
                    fontSize: '14px',
                    color: '#333',
                    marginBottom: '4px',
                    display: 'block',
                  }}
                >
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  style={{
                    width: '100%',
                    padding: '10px',
                    boxSizing: 'border-box',
                    border: '1px solid #ccc',
                    borderRadius: '6px',
                    fontSize: '14px',
                  }}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '10px',
                  backgroundColor: '#1976d2',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: loading ? 'not-allowed' : 'pointer',
                }}
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>

              {message && (
                <p
                  style={{
                    color: message.includes('success') ? 'green' : 'red',
                    marginTop: '8px',
                    textAlign: 'center',
                  }}
                >
                  {message}
                </p>
              )}
            </form>
          )}
        </div>
      )}
    </div>
  );
};

export default Profile;
