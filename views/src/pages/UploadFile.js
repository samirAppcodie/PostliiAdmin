import React, { useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const UploadFile = () => {
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const [jsonData, setJsonData] = useState(null);
  const [isHovered, setIsHovered] = useState(false);

  const handleFileChange = (e) => {
    const uploadedFile = e.target.files[0];
    if (uploadedFile && uploadedFile.type === 'application/json') {
      setError('');
      setFile(uploadedFile);
    } else {
      setError('Please upload a valid JSON file.');
      setFile(null);
    }
  };

  const token = localStorage.getItem('token');

  const handleUpload = async () => {
    if (file) {
      const formData = new FormData();
      formData.append('file', file);

      try {
        const res = await axios.post(`https://admin.postlii.com/api/json/upload-json`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`,
          },
        });

        setJsonData(res.data.data);
        toast.success('JSON uploaded successfully!');

        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } catch (err) {
        setError('Error uploading file');
        toast.error('Upload failed. Please try again.');
        console.error('Upload error:', err.response?.data || err.message);
      }
    } else {
      setError('Please select a file first.');
      toast.warn('No file selected.');
    }
  };

  return (
    <div
  style={{
    minHeight: '100vh',
    background: 'linear-gradient(180deg, #1E1E2F, #4B4F7A)',
    padding:'20px',
  }}
>
    <div
      className="container mt-5 p-4 shadow-sm"
      style={{
        maxWidth: '500px',
        border: '1px solid #eee',
        borderRadius: '12px',
        background: '#ffffff',
        boxShadow: '0 6px 18px rgba(0,0,0,0.06)',
      }}
    >
      <ToastContainer position="top-right" autoClose={2500} />


      <h3
        style={{
          textAlign: 'center',
          fontWeight: 600,
          fontSize: '24px',
          color: 'black',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '10px',
        }}
      >
        <i className="fa fa-upload" style={{ fontSize: '24px', color: 'linear-gradient(180deg, #4B4F7A, #1E1E2F)' }}></i>
        Upload JSON File
      </h3>

      {error && (
        <div
          className="alert alert-danger"
          style={{
            fontSize: '14px',
            padding: '8px 12px',
            borderRadius: '6px',
            marginBottom: '15px',
          }}
        >
          {error}
        </div>
      )}

      <input
        type="file"
        accept=".json"
        onChange={handleFileChange}
        className="form-control mb-3"
        style={{
          padding: '10px',
          borderRadius: '8px',
          border: '1px solid #ccc',
        }}
      />

     <button
  className="btn btn-primary w-100"
  onClick={handleUpload}
  onMouseEnter={() => setIsHovered(true)}
  onMouseLeave={() => setIsHovered(false)}
  style={{
    fontWeight: '500',
    padding: '10px 0',
    borderRadius: '8px',
    background: 'linear-gradient(180deg, #4B4F7A, #1E1E2F)',
    border: 'none',
    transform: isHovered ? 'scale(1.01)' : 'scale(1)',
    boxShadow: isHovered ? '0 4px 12px rgba(0, 0, 0, 0.15)' : 'none',
    transition: 'all 0.2s ease-in-out',
  }}
>
  Upload File
</button>

      {jsonData && (
        <div
          className="mt-4"
          style={{
            background: '#f9f9f9',
            border: '1px solid #ddd',
            borderRadius: '8px',
            padding: '15px',
            fontSize: '14px',
          }}
        >
          <h5 style={{ fontWeight: '600' }}>Uploaded JSON Data:</h5>
          <pre
            style={{
              background: '#fff',
              padding: '10px',
              borderRadius: '6px',
              overflowX: 'auto',
              maxHeight: '250px',
            }}
          >
            {JSON.stringify(jsonData, null, 2)}
          </pre>
          <h5 style={{ fontWeight: '600' }}>File URL:</h5>
          <p style={{ wordBreak: 'break-all' }}>{jsonData.fileUrl}</p>
        </div>
      )}
    </div>
    </div>
  );
};

export default UploadFile;
