import React, { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const JsonDataList = () => {
  const [jsonData, setJsonData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    const fetchJsonData = async () => {
      const token = localStorage.getItem('token');

      if (!token) {
        setError('No token found. Please login first.');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/json/all`, {
          headers: {
            
            'Content-Type': 'application/json',
          },
        });

        const data = await response.json();
        if (data.success) {
          setJsonData(data.data);
        } else {
          setError('Failed to load JSON data');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchJsonData();
  }, []);

  const handleDelete = (id) => {
  toast(
    ({ closeToast }) => (
      <div style={{
        maxWidth: '480px',
        margin: '0 auto',
        backgroundColor: '#fff',
        padding: '24px 5px',
        borderRadius: '10px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        textAlign: 'center',
      }}>
        <p style={{ fontWeight: '500', color: '#333', marginBottom: '16px' }}>
          ⚠️ Are you sure you want to delete this JSON file?
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
          <button
            onClick={async () => {
              closeToast();
              const token = localStorage.getItem('token');
              if (!token) return;

              try {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/api/json/${id}`, {
                  method: 'DELETE',
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                });

                const result = await response.json();
                if (result.success) {
                  const updatedData = jsonData.filter(item => item._id !== id);
                  setJsonData(updatedData);

                  // Adjust pagination if needed
                  const maxPage = Math.ceil(updatedData.length / itemsPerPage);
                  if (currentPage > maxPage) setCurrentPage(maxPage);

                  toast.success(' JSON deleted successfully!');
                } else {
                  toast.error('Failed to delete item');
                }
              } catch (err) {
                console.error('Delete error:', err);
                toast.error('An error occurred while deleting');
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


  if (loading) return <div>Loading...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;

  // Pagination calculations
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = jsonData.slice(startIndex, startIndex + itemsPerPage);
  const totalPages = Math.ceil(jsonData.length / itemsPerPage);

  return (
    <div>
      <ToastContainer position="top-right" autoClose={3000} />

    <h2 style={{ color: "#4B4B4B", padding: "12px", textAlign: 'center',fontWeight:'700' }}>
  🧬 Uploaded JSON Data
</h2>




      <ul style={{ listStyle: 'none', padding: "8px" }}>
        {paginatedData.map((item, index) => (
          <li
            key={index}
            style={{
              display: 'flex',
              flexDirection: window.innerWidth <= 480 ? 'column' : 'row',
              justifyContent: 'space-between',
              alignItems: window.innerWidth <= 480 ? 'flex-start' : 'center',
              background: '#f9f9f9',
              border: '1px solid #e0e0e0',
              padding: '16px',
              marginBottom: '12px',
              borderRadius: '8px',
              boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
              fontFamily: 'Arial, sans-serif',
            }}
          >
            <div>
              <div>
                <strong style={{ display: 'inline-block', width: '100px', color: '#333' }}>File:</strong>
                {item.fileUrl}
              </div>
              <div>
                <strong style={{ display: 'inline-block', width: '100px', color: '#333' }}>Uploaded:</strong>
                {new Date(item.uploadedAt).toLocaleString()}
              </div>
            </div>

            <button
              onClick={() => handleDelete(item._id)}
              style={{
                marginLeft: '10px',
                padding: '6px 12px',
                backgroundColor: '#DC2626',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                marginRight: "50px",
              }}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>

      {/* Pagination Controls */}
 {totalPages > 1 && (
  <div className="pagination">
    <button
      onClick={() => setCurrentPage(prev => prev - 1)}
      disabled={currentPage === 1}
    >
      &laquo; Prev
    </button>

    {[...Array(totalPages)].map((_, i) => (
      <button
        key={i + 1}
        className={currentPage === i + 1 ? 'active' : ''}
        onClick={() => setCurrentPage(i + 1)}
      >
        {i + 1}
      </button>
    ))}

    <button
      onClick={() => setCurrentPage(prev => prev + 1)}
      disabled={currentPage === totalPages}
    >
      Next &raquo;
    </button>
  </div>
)}




    </div>
  );
};

export default JsonDataList;
