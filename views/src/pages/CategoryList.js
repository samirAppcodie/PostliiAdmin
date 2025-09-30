import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Categories = ({ setCategoryId }) => {
  const [categories, setCategories] = useState([]);
  const [newCategoryName, setNewCategoryName] = useState('');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('https://admin.postlii.com/api/categories');
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories', error);
      }
    };
    fetchCategories();
  }, []);

  const handleCategoryNameChange = (e) => {
    setNewCategoryName(e.target.value);
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (newCategoryName.trim() === '') {
      toast.error('Category name is required');
      return;
    }

    try {
      const response = await axios.post('https://admin.postlii.com/api/categories', {
        name: newCategoryName,
      });
      setCategories((prev) => [...prev, response.data]);
      setNewCategoryName('');
      toast.success('Category added successfully!');
    } catch (error) {
      console.error('Error adding category', error);
      toast.error('Failed to add category');
    }
  };

const handleDeleteCategory = (id) => {
  toast(
    ({ closeToast }) => (
      <div style={{
        maxWidth: '600px',
        backgroundColor: '#fff',
        padding: '24px 5px',
        borderRadius: '10px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        textAlign: 'center',
      }}>
        <p style={{ fontWeight: '500', color: '#333', marginBottom: '16px' }}>
          ⚠️ Are you sure you want to delete this category?
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
          <button
            onClick={async () => {
              closeToast();
              try {
                await axios.delete(`https://admin.postlii.com/api/categories/${id}`);
                setCategories(prev => prev.filter(cat => cat._id !== id));
                toast.success("Category deleted successfully!");
              } catch (error) {
                console.error("Error deleting category", error);
                toast.error("Failed to delete category");
              }
            }}
            style={{
              backgroundColor: '#dc3545',
              color: '#fff',
              border: 'none',
              padding: '6px 16px',
              borderRadius: '6px',
              fontWeight: 500,
              cursor: 'pointer',
            }}
          >
            Yes, Delete
          </button>
          <button
            onClick={closeToast}
            style={{
              backgroundColor: '#6c757d',
              color: '#fff',
              border: 'none',
              padding: '6px 16px',
              borderRadius: '6px',
              fontWeight: 500,
              cursor: 'pointer',
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    ),
    {
      position: 'top-center',
      autoClose: false,
      closeOnClick: false,
      draggable: false,
      closeButton: false,
      icon: false,
      style: {
        background: 'transparent',
        boxShadow: 'none',
      },
    }
  );
};


  return (
    <div style={{ maxWidth: '650px', margin: '40px auto', fontFamily: 'Arial, sans-serif' }}>
      <ToastContainer position="top-right" autoClose={3000} />
      

      <div style={{ background: '#fff', borderRadius: '12px', padding: '25px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
        <h2 style={{ textAlign: 'center', color: '#222', marginBottom: '30px',marginTop:'10px' }}>📂 Category Manager</h2>
        {/* Select Category */}
        {/* <label style={{ fontWeight: '600', display: 'block', marginBottom: '6px' }}>Select Existing Category</label> */}
        {/* <select
          onChange={(e) => setCategoryId(e.target.value)}
          style={{
            width: '100%',
            padding: '10px',
            borderRadius: '8px',
            border: '1px solid #ccc',
            marginBottom: '20px',
          }}
        >
          <option value="">-- Select --</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>{cat.name}</option>
          ))}
        </select> */}

        {/* Add Category */}
        <form onSubmit={handleAddCategory} style={{ marginBottom: '30px' }}>
          <label style={{ fontWeight: '600', display: 'block', marginBottom: '6px' }}>Add New Category</label>
          <div style={{ display: 'flex', gap: '10px' }}>
            <input
              type="text"
              value={newCategoryName}
              onChange={handleCategoryNameChange}
              placeholder="Enter category"
              style={{
                flex: 1,
                padding: '10px',
                borderRadius: '8px',
                border: '1px solid #ccc',
              }}
            />
            <button
              type="submit"
              style={{
                padding: '10px 20px',
                background: 'linear-gradient(180deg, #5f7cdb, #589ebe)',
                border: 'none',
                color: 'white',
                fontWeight: 'bold',
                borderRadius: '8px',
                cursor: 'pointer',
              }}
            >
              + Add
            </button>
          </div>
        </form>

        {/* List Categories */}
        <label style={{ fontWeight: '600', display: 'block', marginBottom: '6px' }}>All Categories</label>
        <ul style={{ padding: 0, listStyle: 'none', margin: 0 }}>
          {categories.map((cat) => (
            <li key={cat._id} style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              background: '#f3f4f6',
              padding: '12px 16px',
              borderRadius: '8px',
              marginBottom: '10px',
            }}>
              <span>{cat.name}</span>
              <button
                onClick={() => handleDeleteCategory(cat._id)}
                style={{
                  backgroundColor: '#ef4444',
                  color: '#fff',
                  border: 'none',
                  padding: '6px 12px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                }}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Categories;
