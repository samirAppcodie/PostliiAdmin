import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AddUser = ({ userData, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    mobile: '',
    phone: '',
    email: '',
    email1: '',
    password: '',
  });

  useEffect(() => {
    if (userData) {
      setFormData({
        fullName: userData.fullName || '',
        mobile: userData.mobile || '',
        phone: userData.phone || '',
        email: userData.email || '',
        email1: userData.email1 || '',
        password: '', // password blank on edit
      });
    }
  }, [userData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  console.log('Submitting form:', formData);
  const token = localStorage.getItem('token');

  try {
    if (userData?._id) {
      // EDIT mode
      const { password, ...dataToSend } = formData;
      if (password.trim() !== '') {
        dataToSend.password = password;
      }
      console.log('Edit mode payload:', dataToSend);

      const res = await axios.put(
        `https://api.postlii.com/api/signup/${userData._id}`,
        dataToSend,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log('Edit response:', res.data);

      if (res.status === 200) {
        toast.success(res.data.message || 'User updated successfully!');
        setTimeout(() => {
          onSuccess();
        }, 4000); // delay so toast shows before unmount
      } else {
        toast.error(res.data.message || 'Failed to update user.');
      }
    } else {
      // ADD mode: Check if email exists first
      const checkRes = await axios.get(
        `https://api.postlii.com/api/check-email?email=${encodeURIComponent(formData.email)}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (checkRes.data.exists) {
        toast.error('Email already exists');
        return; // stop further processing
      }

      // Proceed to add user if email does not exist
      const newUserPayload = {
        ...formData,
        adminCreated: true,
      };
      console.log('Add mode payload:', newUserPayload);

      const res = await axios.post(
        `https://api.postlii.com/api/signup`,
        newUserPayload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log('Add response:', res.data);

      toast.success(res.data.message || 'User created successfully!');
      setTimeout(() => {
        onSuccess();
      }, 4000);
    }
  } catch (err) {
    const errorMsg = err.response?.data?.message || 'Something went wrong';
    toast.error('Error: ' + errorMsg);
    console.error('❌ Error saving user:', err.response?.data || err.message);
  }
};


  return (
    <div className="p-3">
      <ToastContainer position="top-right" autoClose={4000} />
      <form onSubmit={handleSubmit}>
        {['fullName', 'mobile', 'phone', 'email', 'email1'].map((field) => (
          <div className="mb-3" key={field}>
            <label>{field.replace(/([A-Z])/g, ' $1')}:</label>
            <input
              type="text"
              name={field}
              value={formData[field]}
              onChange={handleChange}
              className="form-control"
              required={field !== 'email1'}
            />
          </div>
        ))}

        {!userData && (
          <div className="mb-3">
            <label>Password:</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>
        )}

        <div className="d-flex justify-content-end">
          <button
            type="submit"
            className="btn btn-success me-2"
            style={{ background: 'linear-gradient(180deg, #5f7cdb, #589ebe)' }}
          >
            {userData ? 'Update User' : 'Add User'}
          </button>
          <button type="button" className="btn btn-secondary" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddUser;
