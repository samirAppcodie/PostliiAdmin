import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AddTemplate = () => {
  const [templateData, setTemplateData] = useState({ name: '', images: [], categoryId: '' });
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/api/categories`);
        if (!res.ok) throw new Error('Failed to load categories');
        const data = await res.json();
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setTemplateData({ ...templateData, [name]: files ? [...files] : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userId = JSON.parse(localStorage.getItem('user'))?.userId;

    if (!templateData.name || templateData.images.length === 0 || !templateData.categoryId) {
      alert('Please fill out all fields.');
      return;
    }

    const formData = new FormData();
    formData.append('name', templateData.name);
    templateData.images.forEach(imageFile => formData.append('images', imageFile));
    formData.append('userId', userId);
    formData.append('categoryId', templateData.categoryId);

    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/templates`, {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const errorMessage = await res.text();
        throw new Error(errorMessage || 'Upload failed.');
      }

      await res.json();
     toast.success('Template uploaded successfully!');

      window.location.reload();
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Upload failed! ' + error.message);
    }
  };

  return (
    <div style={styles.container}>
      <ToastContainer position="top-right" autoClose={4000} />
<h2
  style={{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center', // centers the whole h2 content
    fontSize: '24px',
    fontWeight: '600',
    color: 'black', // text color
  }}
>
  <i
    className="fa fa-cloud-upload-alt"
    style={{
      marginRight: '10px',
      background: 'linear-gradient(180deg, #5f7cdb, #589ebe)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
    }}
  ></i>
  Upload New Template
</h2>








      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.fieldGroup}>
          <label style={styles.label}>Template Name</label>
          <input
            type="text"
            name="name"
            placeholder='Template Name'
            onChange={handleChange}
            style={styles.input}
            required
          />
        </div>

        <div style={styles.fieldGroup}>
          <label style={styles.label}>Upload Images</label>
          <input
            type="file"
            name="images"
            multiple
            accept="image/png, image/jpeg, image/gif"
            onChange={handleChange}
            style={styles.input}
            required
          />
        </div>

        <div style={styles.fieldGroup}>
          <label style={styles.label}>Category</label>
          <select
            name="categoryId"
            onChange={handleChange}
            style={styles.input}
            required
          >
            <option value="">Select a category</option>
            {categories.map(cat => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div style={styles.buttonGroup}>
          <button type="submit" style={styles.uploadButton}>Upload Template</button>
          <button onClick={() => navigate('/template-list')} type="button" style={styles.backButton}>
            ← Back to Templates
          </button>
        </div>
      </form>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '600px',
    margin: '40px auto',
    padding: '30px',
    backgroundColor: '#f9f9f9',
    borderRadius: '12px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.1)',
    fontFamily: 'Segoe UI, sans-serif',
  },
  heading: {
    textAlign: 'center',
    color: '#333',
    marginBottom: '24px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  fieldGroup: {
    display: 'flex',
    flexDirection: 'column',
  },
  label: {
    marginBottom: '6px',
    fontWeight: '600',
    color: '#555',
  },
  input: {
    padding: '10px 12px',
    fontSize: '16px',
    borderRadius: '6px',
    border: '1px solid #ccc',
  },
  buttonGroup: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '10px',
    gap: '12px',
  },
  uploadButton: {
    padding: '10px 20px',
    background: 'linear-gradient(180deg, #5f7cdb, #589ebe)',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    fontWeight: '600',
    cursor: 'pointer',
    flex: 1,
  },
  backButton: {
    padding: '10px 20px',
    backgroundColor: '#6c757d',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    fontWeight: '600',
    cursor: 'pointer',
    flex: 1,
  },
};

export default AddTemplate;
