import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AddUser from './AddUser';
import DataTable from 'react-data-table-component';
import '../assets/css/UserList.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ConfirmDeleteToast = ({ onConfirm, onCancel }) => (
  <div style={{ 
    maxWidth: '420px',
    margin: '0 auto',
    backgroundColor: '#fff',
    padding: '24px 32px',
    borderRadius: '10px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    textAlign: 'center',
  }}>
    <p style={{ 
      marginBottom: '20px', 
      fontSize: '16px', 
      fontWeight: '500', 
      color: '#333' 
    }}>
      ⚠️ Are you sure you want to delete this user?
    </p>
    <div style={{ display: 'flex', justifyContent: 'center', gap: '16px' }}>
      <button
        onClick={() => {
          toast.dismiss();
          onConfirm();
        }}
        style={{
          width: '140px',
          padding: '10px 20px',
          backgroundColor: '#dc3545',
          color: '#fff',
          border: 'none',
          borderRadius: '6px',
          fontWeight: 500,
          cursor: 'pointer',
          transition: 'background 0.3s',
        }}
        onMouseOver={(e) => (e.target.style.backgroundColor = '#c82333')}
        onMouseOut={(e) => (e.target.style.backgroundColor = '#dc3545')}
      >
        Yes, Delete
      </button>
      <button
        onClick={() => {
          toast.dismiss();
          onCancel();
        }}
        style={{
          width: '140px',
          padding: '10px 20px',
          backgroundColor: '#6c757d',
          color: '#fff',
          border: 'none',
          borderRadius: '6px',
          fontWeight: 500,
          cursor: 'pointer',
          transition: 'background 0.3s',
        }}
        onMouseOver={(e) => (e.target.style.backgroundColor = '#5a6268')}
        onMouseOut={(e) => (e.target.style.backgroundColor = '#6c757d')}
      >
        Cancel
      </button>
    </div>
  </div>
);

const UserList = () => {
  const [signupUsers, setSignupUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [profileName, setProfileName] = useState('');
  const [editUser, setEditUser] = useState(null);
  const [searchText, setSearchText] = useState('');

  const getSafeImageUrl = (path) => {
    if (!path) return null;
    if (/^https?:\/\//i.test(path)) return path;
    const cleanedPath = path.replace(/^\/+/, '');
    const safePath = cleanedPath.split('/').map(encodeURIComponent).join('/');
    return `${process.env.REACT_APP_BASE_URL}/${safePath}`;
  };

  const getSignupIdFromToken = () => {
    const token = localStorage.getItem('token');
    if (!token) return null;
    try {
      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      return decodedToken?.signupId;
    } catch (err) {
      console.error('Error decoding token:', err);
      return null;
    }
  };

  const fetchAdminProfile = async (signupId) => {
    if (!signupId) return;
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get(`/api/signup/${signupId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProfileName(response.data.name);
    } catch (error) {
      console.error('Error fetching admin profile:', error);
    }
  };

  const fetchUsers = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/signupall`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      setSignupUsers(response.data || []);
    } catch (error) {
      console.error('Error fetching users:', error.response?.data || error.message);
      setSignupUsers([]);
    }
  };

  useEffect(() => {
    const signupId = getSignupIdFromToken();
    fetchAdminProfile(signupId);
    fetchUsers();
  }, []);

  const handleView = (userId) => {
    const user = signupUsers.find((u) => u._id === userId);
    setSelectedUser(user);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setSelectedUser(null);
    setShowModal(false);
  };

  const handleEdit = (user) => {
    setEditUser(user);
    setShowAddModal(true);
  };

  const handleDelete = async (userId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("No token found");
      return;
    }

    toast.info(
      <ConfirmDeleteToast
        onConfirm={async () => {
          try {
            await axios.delete(`${process.env.REACT_APP_API_URL}/api/signup/${userId}`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            setSignupUsers(signupUsers.filter((user) => user._id !== userId));
            toast.success('User deleted successfully!');
            if (selectedUser && selectedUser._id === userId) {
              handleCloseModal();
            }
          } catch (error) {
            toast.error("Delete failed: " + (error.response?.data?.message || error.message));
          }
        }}
        onCancel={() => toast.info('Deletion cancelled')}
      />,
      {
        position: 'top-center',
        autoClose: false,
        closeOnClick: false,
        closeButton: false,
        icon: false,
        style: {
          background: 'transparent',
          boxShadow: 'none',
        },
      }
    );
  };

  const columns = [
    { name: 'Full Name', selector: (row) => row.fullName, sortable: true, grow: 2 },
    { name: 'Email', selector: (row) => row.email || '-', sortable: true, grow: 2 },
    { name: 'Mobile', selector: (row) => row.mobile || '-', sortable: true, grow: 1 },
    { name: 'Verified', selector: (row) => row.isVerified ? 'Yes' : 'No', sortable: true, grow: 1 },
    { name: 'Subscribed', selector: (row) => row.is_subscribed ? '1' : '0', sortable: true, grow: 1 },
    {
      name: 'Actions',
      cell: (row) => (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center' }}>
          <button 
            onClick={() => handleView(row._id)} 
            className="btn btn-info btn-sm" 
            style={{ 
              background: 'linear-gradient(180deg, #5f7cdb, #589ebe)', 
              color: 'white', 
              border: 'none',
              padding: '6px 12px',
              fontSize: '14px'
            }}
          >
            View
          </button>
          <button 
            onClick={() => handleEdit(row)} 
            className="btn btn-warning btn-sm" 
            style={{ 
              background: 'linear-gradient(180deg, #5f7cdb, #589ebe)', 
              color: 'white', 
              border: 'none',
              padding: '6px 12px',
              fontSize: '14px'
            }}
          >
            Edit
          </button>
          <button 
            onClick={() => handleDelete(row._id)} 
            className="btn btn-danger btn-sm" 
            style={{ 
              padding: '6px 12px',
              fontSize: '14px'
            }}
          >
            Delete
          </button>
        </div>
      ),
      grow: 2,
      style: {
        padding: '8px',
      },
    },
  ];

  const customStyles = {
    table: {
      style: {
        minWidth: '100%',
        width: '100%',
      },
    },
    headCells: {
      style: {
        background: 'linear-gradient(180deg, #5f7cdb, #589ebe)',
        fontWeight: 'bold',
        fontSize: '15px',
        color: '#333',
        padding: '12px 8px',
        '@media (max-width: 768px)': {
          fontSize: '13px',
          padding: '8px 4px',
        },
      },
    },
    cells: {
      style: {
        fontSize: '16px',
        padding: '12px 8px',
        '@media (max-width: 768px)': {
          fontSize: '14px',
          padding: '8px 4px',
        },
      },
    },
    rows: {
      style: {
        minHeight: '48px',
        '@media (max-width: 768px)': {
          minHeight: '40px',
        },
      },
    },
  };

  return (
    <div className="user-table">
      <ToastContainer position="top-right" autoClose={4000} />
      <h2 style={{ color: '#111827', paddingBottom: '20px', fontSize: '28px', fontWeight: '700', textShadow: '0 1px 2px rgba(0,0,0,0.1)' }}>
        🙋‍♂️ All Signup Users
      </h2>

      <div className="add-member-container d-flex justify-content-between align-items-center mb-2 pb-4">
        <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
          + Add Member
        </button>

        <div className="search-container position-relative">
          <i className="fa fa-search search-icon" />
          <input
            type="text"
            placeholder="Search by name, email, mobile..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="form-control search-input ps-5"
          />
        </div>
      </div>

      <DataTable
        columns={columns}
        data={signupUsers.filter((user) => {
          const text = searchText.toLowerCase().trim();
          return (
            (user.fullName && user.fullName.toLowerCase().includes(text)) ||
            (user.email && user.email.toLowerCase().includes(text)) ||
            (user.mobile && user.mobile.toString().toLowerCase().includes(text))
          );
        })}
        pagination
        highlightOnHover
        responsive
        persistTableHead
        customStyles={customStyles}
      />

      {showModal && selectedUser && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h4>User Details</h4>
            <p><strong>Full Name:</strong> {selectedUser.fullName}</p>
            <p><strong>First Name:</strong> {selectedUser.firstName}</p>
            <p><strong>Last Name:</strong> {selectedUser.lastName}</p>
            <p><strong>Email:</strong> {selectedUser.email}</p>
            <p><strong>Mobile:</strong> {selectedUser.mobile}</p>
            <p><strong>Google ID:</strong> {selectedUser.googleId}</p>
            <p><strong>Facebook ID:</strong> {selectedUser.facebookId}</p>
            <p><strong>Apple ID:</strong> {selectedUser.appleId}</p>
            <p><strong>Is Verified:</strong> {selectedUser.isVerified ? 'Yes' : 'No'}</p>
            <p><strong>Is Subscribed:</strong> {selectedUser.is_subscribed ? '1' : '0'}</p>

            {selectedUser.profilePhoto && (
              <div>
                <p><strong>Profile Photo:</strong></p>
                <img src={getSafeImageUrl(selectedUser.profilePhoto)} alt="Profile" width="70" />
              </div>
            )}

            {selectedUser.personalLogo && (
              <div>
                <p><strong>Personal Logo:</strong></p>
                <img src={getSafeImageUrl(selectedUser.personalLogo)} alt="Personal Logo" width="70" />
              </div>
            )}

            {selectedUser.brokerageLogo && (
              <div>
                <p><strong>Brokerage Logo:</strong></p>
                <img src={getSafeImageUrl(selectedUser.brokerageLogo)} alt="Brokerage Logo" width="70" />
              </div>
            )}

            <button className="btn btn-secondary mt-3" onClick={handleCloseModal}>
              Close
            </button>
          </div>
        </div>
      )}

      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h4 style={{
              background: "linear-gradient(180deg, #5f7cdb, #589ebe)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              fontWeight: 700,
            }}>
              {editUser ? 'Update User' : 'Add New User'}
            </h4>

            <AddUser
              userData={editUser}
              onSuccess={() => {
                setShowAddModal(false);
                setEditUser(null);
                fetchUsers();
              }}
              onCancel={() => {
                setShowAddModal(false);
                setEditUser(null);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default UserList;