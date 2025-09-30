// import React, { useEffect, useState } from 'react';
// import '../assets/css/VideoList.css';

// const VideoList = () => {
//   const [videos, setVideos] = useState([]);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [groupedVideos, setGroupedVideos] = useState({});
//   const [categoryPages, setCategoryPages] = useState({});


//   const videosPerPage = 3;

//   useEffect(() => {
//     fetchVideos();
//   }, []);

// async function fetchVideos() {
//   try {
//     const res = await fetch('/api/videos');
//     const data = await res.json();
//     setVideos(data);

//     // GROUPING LOGIC
//     const grouped = data.reduce((acc, video) => {
//       const categoryName = (video.categoryName || 'Uncategorized').toUpperCase();
//       if (!acc[categoryName]) acc[categoryName] = [];
//       acc[categoryName].push(video);
//       return acc;
//     }, {});
//     setGroupedVideos(grouped);

//     // INITIALIZE PAGINATION for each category
//     const initialPages = {};
//     Object.keys(grouped).forEach(cat => {
//       initialPages[cat] = 1;
//     });
//     setCategoryPages(initialPages);

//   } catch (error) {
//     console.error('Failed to fetch videos', error);
//   }
// }


// const handleDelete = async (videoId) => {
//   const confirmDelete = window.confirm('Are you sure you want to delete this video?');
//   if (!confirmDelete) return;

//   try {
//     const res = await fetch(`/api/videos/${videoId}`, {
//       method: 'DELETE',
//     });

//     if (!res.ok) throw new Error('Failed to delete video');
//     await fetchVideos();  // Refresh list after deletion
//   } catch (error) {
//     console.error('Error deleting video', error);
//   }
// };



//   // Calculate total pages
//   const totalPages = Math.ceil(videos.length / videosPerPage);

//   // Get current page videos
//   const indexOfLastVideo = currentPage * videosPerPage;
//   const indexOfFirstVideo = indexOfLastVideo - videosPerPage;
//   const currentVideos = videos.slice(indexOfFirstVideo, indexOfLastVideo);

//   // Handle page change
//   const handlePageChange = (pageNumber) => {
//     setCurrentPage(pageNumber);
//     window.scrollTo({ top: 0, behavior: 'smooth' });
//   };

//   return (
//     <div className="video-list-container">
//       <h2 style={{ color:"#1c4e91",paddingBottom:"10px"}}>Uploaded Videos</h2>
//       {videos.length === 0 && <p>No videos found.</p>}

      

//       <div className="video-grid">
//         {currentVideos.map((video) => (
//           <div key={video._id} className="video-card">
//             <h3>{video.title}</h3>
//             <video controls autoPlay muted loop>
//               <source src={video.videoUrl} type="video/mp4" />
//               Your browser does not support the video tag.
//             </video>
//             {/* <p>{video.description}</p> */}

//              <button
//         onClick={() => handleDelete(video._id)}
//         style={{
//           marginTop: '10px',
//           backgroundColor: '#ff4d4d',
//           color: 'white',
//           border: 'none',
//           padding: '8px 16px',
//           borderRadius: '5px',
//           cursor: 'pointer'
//         }}
//       >
//         Delete
//       </button>


//           </div>
//         ))}
//       </div>

//       {/* Pagination controls */}
//       {totalPages > 1 && (
//         <div className="pagination">
//           <button
//             onClick={() => handlePageChange(currentPage - 1)}
//             disabled={currentPage === 1}
//           >
//             &laquo; Prev
//           </button>

//           {[...Array(totalPages)].map((_, i) => (
//             <button
//               key={i + 1}
//               className={currentPage === i + 1 ? "active" : ""}
//               onClick={() => handlePageChange(i + 1)}
//             >
//               {i + 1}
//             </button>
//           ))}

//           <button
//             onClick={() => handlePageChange(currentPage + 1)}
//             disabled={currentPage === totalPages}
//           >
//             Next &raquo;
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default VideoList;


import React, { useEffect, useState } from 'react';
import '../assets/css/VideoList.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const VideoList = () => {
  const [groupedVideos, setGroupedVideos] = useState({});
  const [categoryPages, setCategoryPages] = useState({});
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVideos, setSelectedVideos] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const videosPerPage = 6;

  useEffect(() => {
    fetchVideos();
  }, []);
  
  // Handle checkbox selection
  const handleSelectVideo = (videoId) => {
    setSelectedVideos(prev => {
      if (prev.includes(videoId)) {
        return prev.filter(id => id !== videoId);
      } else {
        return [...prev, videoId];
      }
    });
  };
  
  // Handle select all checkbox
  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedVideos([]);
    } else {
      const allVideoIds = currentVideos.map(video => video._id);
      setSelectedVideos(allVideoIds);
    }
    setSelectAll(!selectAll);
  };

  async function fetchVideos() {
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/videos`);
      const data = await res.json();

      const grouped = data.reduce((acc, video) => {
        const categoryName = (video.categoryName || 'Uncategorized').toUpperCase();
        if (!acc[categoryName]) acc[categoryName] = [];
        acc[categoryName].push(video);
        return acc;
      }, {});
      setGroupedVideos(grouped);

      const initialPages = {};
      Object.keys(grouped).forEach(cat => {
        initialPages[cat] = 1;
      });
      setCategoryPages(initialPages);
      setCurrentCategoryIndex(0);
    } catch (error) {
      console.error('Failed to fetch videos', error);
    }
  }

const handleDelete = (videoId) => {
  toast(
    ({ closeToast }) => (
      <div style={{
        maxWidth: '600px',
        width: '100%',
        backgroundColor: '#fff',
        padding: '28px 5px',
        borderRadius: '10px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        textAlign: 'center',
      }}>
        <p style={{ fontWeight: '500', color: '#333', marginBottom: '16px' }}>
          ⚠️ Are you sure you want to delete this video?
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
          <button
            onClick={async () => {
              closeToast();
              try {
                const res = await fetch(`${process.env.REACT_APP_API_URL}/api/videos/${videoId}`, { method: 'DELETE' });
                if (!res.ok) throw new Error('Failed to delete video');
                toast.success('Video deleted successfully!');
                await fetchVideos(); // Refresh list
                
                // Check if current category is empty and switch to first category if needed
                const categoryKeys = Object.keys(groupedVideos);
                const currentCategory = categoryKeys[currentCategoryIndex];
                if (groupedVideos[currentCategory]?.length <= 1 && categoryKeys.length > 1) {
                  setCurrentCategoryIndex(0);
                }
              } catch (error) {
                console.error('Error deleting video:', error);
                toast.error('Error deleting video.');
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

// Handle bulk delete
const handleBulkDelete = () => {
  if (selectedVideos.length === 0) {
    toast.info('No videos selected for deletion');
    return;
  }
  
  toast(
    ({ closeToast }) => (
      <div style={{
        maxWidth: '600px',
        width: '100%',
        backgroundColor: '#fff',
        padding: '28px 5px',
        borderRadius: '10px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        textAlign: 'center',
      }}>
        <p style={{ fontWeight: '500', color: '#333', marginBottom: '16px' }}>
          ⚠️ Are you sure you want to delete {selectedVideos.length} selected video{selectedVideos.length > 1 ? 's' : ''}?
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
          <button
            onClick={async () => {
              closeToast();
              let successCount = 0;
              let errorCount = 0;
              
              // Track if current category will be affected
              const categoryKeys = Object.keys(groupedVideos);
              const currentCategory = categoryKeys[currentCategoryIndex];
              const currentCategoryVideos = groupedVideos[currentCategory] || [];
              const selectedFromCurrentCategory = currentCategoryVideos.filter(video => 
                selectedVideos.includes(video._id)
              ).length;
              
              // Process each selected video
              for (const videoId of selectedVideos) {
                try {
                  const res = await fetch(`${process.env.REACT_APP_API_URL}/api/videos/${videoId}`, { method: 'DELETE' });
                  if (res.ok) {
                    successCount++;
                  } else {
                    errorCount++;
                  }
                } catch (error) {
                  console.error(`Error deleting video ${videoId}:`, error);
                  errorCount++;
                }
              }
              
              // Show results
              if (successCount > 0) {
                toast.success(`Successfully deleted ${successCount} video${successCount > 1 ? 's' : ''}`);
              }
              if (errorCount > 0) {
                toast.error(`Failed to delete ${errorCount} video${errorCount > 1 ? 's' : ''}`);
              }
              
              // Refresh videos
              await fetchVideos();
              setSelectedVideos([]);
              setSelectAll(false);
              
              // Switch to first category if current category is now empty
              if (selectedFromCurrentCategory >= currentCategoryVideos.length && categoryKeys.length > 1) {
                setCurrentCategoryIndex(0);
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
            Yes, Delete All
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


  const handlePageChange = (category, pageNumber) => {
    setCategoryPages(prev => ({ ...prev, [category]: pageNumber }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const categoryKeys = Object.keys(groupedVideos);
  if (categoryKeys.length === 0) return <p>No videos found.</p>;

  const currentCategory = categoryKeys[currentCategoryIndex];
  const allVideosInCategory = groupedVideos[currentCategory] || [];

  // 🔍 Filter videos by title or category
  const filteredVideos = allVideosInCategory.filter(video =>
    video.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    video.categoryName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const currentPage = categoryPages[currentCategory] || 1;
  const totalPages = Math.ceil(filteredVideos.length / videosPerPage);
  const indexOfLastVideo = currentPage * videosPerPage;
  const indexOfFirstVideo = indexOfLastVideo - videosPerPage;
  const currentVideos = filteredVideos.slice(indexOfFirstVideo, indexOfLastVideo);

  return (
    <div className="video-list-container">
          <ToastContainer position="top-right" autoClose={3000} />

      {/* Header with search and bulk actions */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingBottom: '15px',
        paddingTop: '20px',
        flexWrap: 'wrap',
        gap: '10px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
       <h2
  style={{
    margin: 0,
    fontWeight: '700',
    fontSize: '28px',
    color:'black',
    // background: 'linear-gradient(180deg, #5f7cdb, #589ebe)',
    // WebkitBackgroundClip: 'text',
    // WebkitTextFillColor: 'transparent',
    display: 'inline-flex',
    alignItems: 'center',
  }}
>
  <i
    className="fa fa-video"
    style={{
      marginRight: '10px',
      background: 'linear-gradient(180deg, #5f7cdb, #589ebe)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
    }}
  ></i>
  Uploaded Videos
</h2>
        </div>
        
        {/* Bulk Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {selectedVideos.length > 0 && (
            <button
              onClick={handleBulkDelete}
              style={{
                backgroundColor: '#DC2626',
                color: 'white',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '5px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                fontWeight: '500'
              }}
            >
              <i className="fa fa-trash"></i>
              Delete Selected ({selectedVideos.length})
            </button>
          )}
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <input
              type="checkbox"
              id="selectAll"
              checked={selectAll}
              onChange={handleSelectAll}
              style={{ cursor: 'pointer', width: '18px', height: '18px' }}
            />
            <label htmlFor="selectAll" style={{ cursor: 'pointer', fontSize: '14px', fontWeight: '500' }}>
              Select All
            </label>
          </div>
        </div>

        <div style={{ position: 'relative', width: '100%', maxWidth: '600px' }}>
          <i className="fa fa-search" style={{
            position: 'absolute',
            left: '12px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: '#999',
            fontSize: '16px',
            pointerEvents: 'none'
          }} />
          <input
            type="text"
            placeholder="Search by video title or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              padding: '10px 12px 10px 40px',
              borderRadius: '8px',
              border: '2px solid #5f7cdb',
              outline: 'none',
              width: '100%',
              fontSize: '15px',
              color: '#333'
            }}
          />
        </div>
      </div>

      {/* Category Buttons */}
      <div className="category-buttons" style={{ marginBottom: '20px' }}>
        {categoryKeys.map((category, index) => {
          const isSelected = currentCategoryIndex === index;
          return (
            <button
              key={category}
              onClick={() => setCurrentCategoryIndex(index)}
              style={{
                marginRight: '10px',
                padding: '8px 16px',
                borderRadius: '5px',
                border: isSelected ? '2px solid #5f7cdb' : '1px solid #ccc',
                background: isSelected
                  ? 'linear-gradient(180deg, #5f7cdb, #589ebe)'
                  : '#f5f5f5',
                color: isSelected ? 'white' : '#333',
                cursor: 'pointer',
                fontWeight: '500',
                transition: 'all 0.3s ease'
              }}
            >
              {category}
            </button>
          );
        })}
      </div>

      {/* Video Grid */}
      <div className="video-grid">
        {currentVideos.map((video) => (
          <div key={video._id} className="video-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <h3 style={{ color: "black", fontWeight: 'bold', margin: 0 }}>{video.title}</h3>
              <input
                type="checkbox"
                checked={selectedVideos.includes(video._id)}
                onChange={() => handleSelectVideo(video._id)}
                style={{ cursor: 'pointer', width: '18px', height: '18px' }}
              />
            </div>
            
           <div style={{ position: 'relative' }}>
  {video.thumbnailUrl ? (
    <img
      src={`${video.thumbnailUrl.startsWith('http') ? '' : process.env.REACT_APP_API_URL}${video.thumbnailUrl}`}
      alt="Video Thumbnail"
      style={{
        width: '100%',
        borderRadius: '8px',
        marginBottom: '8px',
        objectFit: 'cover',
        height: '180px'
      }}
    />
  ) : (
    <div
      style={{
        width: '100%',
        height: '180px',
        backgroundColor: '#f0f0f0',
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#999',
        marginBottom: '8px',
        fontSize: '14px',
      }}
    >
      No Thumbnail
    </div>
  )}

  <video controls style={{ width: '100%', borderRadius: '8px' }}>
    <source src={`${video.videoUrl.startsWith('http') ? '' : process.env.REACT_APP_API_URL}${video.videoUrl}`} type="video/mp4" />
    Your browser does not support the video tag.
  </video>
</div>

            <button
              onClick={() => handleDelete(video._id)}
              style={{
                marginTop: '10px',
                backgroundColor: '#DC2626',
                color: 'white',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '5px',
                cursor: 'pointer'
              }}
            >
              Delete
            </button>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination">
          <button
            onClick={() => handlePageChange(currentCategory, currentPage - 1)}
            disabled={currentPage === 1}
          >
            &laquo; Prev
          </button>

          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i + 1}
              className={currentPage === i + 1 ? "active" : ""}
              onClick={() => handlePageChange(currentCategory, i + 1)}
            >
              {i + 1}
            </button>
          ))}

          <button
            onClick={() => handlePageChange(currentCategory, currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next &raquo;
          </button>
        </div>
      )}
    </div>
  );
};

export default VideoList;
