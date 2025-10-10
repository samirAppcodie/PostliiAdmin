import React, { useEffect, useState } from 'react';
import '../assets/css/VideoList.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const VideoList = () => {
  //tst
  const [groupedVideos, setGroupedVideos] = useState({});
  const [categoryPages, setCategoryPages] = useState({});
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVideos, setSelectedVideos] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [previewVideoId, setPreviewVideoId] = useState(null);
  const [videosPerPage, setVideosPerPage] = useState(8); // Default videos per page

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

  // Handle thumbnail click to toggle video preview
  const handleThumbnailClick = (videoId) => {
    setPreviewVideoId(prev => (prev === videoId ? null : videoId));
  };

  // Handle videos per page change
  const handleVideosPerPageChange = (e) => {
    const newVideosPerPage = parseInt(e.target.value);
    setVideosPerPage(newVideosPerPage);
    // Reset to first page when changing videos per page
    setCategoryPages(prev => ({ ...prev, [currentCategory]: 1 }));
  };

  async function fetchVideos() {
    try {
      const res = await fetch(`https://admin.postlii.com/api/videos`);
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
                  const res = await fetch(`https://admin.postlii.com/api/videos/${videoId}`, { method: 'DELETE' });
                  if (!res.ok) throw new Error('Failed to delete video');
                  toast.success('Video deleted successfully!');
                  await fetchVideos();
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

                const categoryKeys = Object.keys(groupedVideos);
                const currentCategory = categoryKeys[currentCategoryIndex];
                const currentCategoryVideos = groupedVideos[currentCategory] || [];
                const selectedFromCurrentCategory = currentCategoryVideos.filter(video =>
                  selectedVideos.includes(video._id)
                ).length;

                for (const videoId of selectedVideos) {
                  try {
                    const res = await fetch(`https://admin.postlii.com/api/videos/${videoId}`, { method: 'DELETE' });
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

                if (successCount > 0) {
                  toast.success(`Successfully deleted ${successCount} video${successCount > 1 ? 's' : ''}`);
                }
                if (errorCount > 0) {
                  toast.error(`Failed to delete ${errorCount} video${errorCount > 1 ? 's' : ''}`);
                }

                await fetchVideos();
                setSelectedVideos([]);
                setSelectAll(false);

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
    <div className="video-list-container" style={{
      background: 'linear-gradient(180deg, #1E1E2F, #4B4F7A)',
      minHeight: '100vh',
      padding: '20px'
    }}>
      <ToastContainer position="top-right" autoClose={3000} />

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
          <h2 style={{
            margin: 0,
            fontWeight: '700',
            fontSize: '28px',
            color: 'white',
            display: 'inline-flex',
            alignItems: 'center',
          }}>
            <i className="fa fa-video" style={{
              marginRight: '10px',
              background: 'white',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}></i>
            Uploaded Videos
          </h2>
        </div>

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
            <label htmlFor="selectAll" style={{
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              color: 'white'
            }}>
              Select All
            </label>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <label htmlFor="videosPerPage" style={{
              fontSize: '14px',
              fontWeight: '500',
              color: 'white'
            }}>
              Videos per page:
            </label>
            <select
              id="videosPerPage"
              value={videosPerPage}
              onChange={handleVideosPerPageChange}
              style={{
                padding: '8px',
                borderRadius: '5px',
                border: '1px solid #4c4e52ff',
                backgroundColor: '#f5f5f5',
                color: '#333',
                cursor: 'pointer'
              }}
            >
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={75}>75</option>
              <option value={100}>100</option>
            </select>
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
              border: '2px solid #4c4e52ff',
              outline: 'none',
              width: '100%',
              fontSize: '15px',
              color: '#333'
            }}
          />
        </div>
      </div>

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
                border: isSelected ? '2px solid #4b4c4eff' : '1px solid #ccc',
                background: isSelected
                  ? 'linear-gradient(180deg, #4B4F7A, #1E1E2F)'
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

      <div className="video-grid" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
        gap: '24px',
        marginBottom: '30px'
      }}>
        {currentVideos.map((video) => (
          <div
            key={video._id}
            className="video-card"
            style={{
              backgroundColor: '#2a2a3e',
              borderRadius: '12px',
              padding: '20px',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
              transition: 'all 0.3s ease',
              border: '1px solid #4B4F7A',
              overflow: 'hidden'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-8px)';
              e.currentTarget.style.boxShadow = '0 16px 48px rgba(0, 0, 0, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.3)';
            }}
          >
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '16px',
              paddingBottom: '12px',
              borderBottom: '1px solid #4B4F7A'
            }}>
              <h3 style={{
                color: '#e7dfdfff',
                fontWeight: '600',
                margin: 0,
                fontSize: '18px',
                flex: 1,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}>{video.title}</h3>
              <input
                type="checkbox"
                checked={selectedVideos.includes(video._id)}
                onChange={() => handleSelectVideo(video._id)}
                style={{
                  cursor: 'pointer',
                  width: '20px',
                  height: '20px',
                  accentColor: '#DC2626'
                }}
              />
            </div>

            <div style={{ position: 'relative', marginBottom: '16px' }}>
              {previewVideoId === video._id ? (
                <video
                  controls
                  autoPlay
                  style={{
                    width: '100%',
                    height: '200px',
                    borderRadius: '8px',
                    backgroundColor: '#000',
                    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3)',
                    objectFit: 'cover'
                  }}
                  preload="metadata"
                >
                  <source
                    src={`${video.videoUrl.startsWith('http') ? '' : 'https://admin.postlii.com'}${video.videoUrl}`}
                    type="video/mp4"
                  />
                  Your browser does not support the video tag.
                </video>
              ) : (
                <div
                  onClick={() => handleThumbnailClick(video._id)}
                  style={{ cursor: 'pointer' }}
                >
                  {video.thumbnailUrl ? (
                    <img
                      src={`${video.thumbnailUrl.startsWith('http') ? '' : 'https://admin.postlii.com'}${video.thumbnailUrl}`}
                      alt="Video Thumbnail"
                      style={{
                        width: '100%',
                        height: '200px',
                        borderRadius: '8px',
                        marginBottom: '5px',
                        objectFit: 'cover',
                        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3)'
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        width: '100%',
                        height: '200px',
                        background: 'linear-gradient(135deg, #4B4F7A, #1E1E2F)',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#999',
                        marginBottom: '12px',
                        fontSize: '16px',
                        border: '2px dashed #4B4F7A'
                      }}
                    >
                      <i className="fa fa-image" style={{ fontSize: '48px', opacity: 0.5 }} />
                    </div>
                  )}
                </div>
              )}
            </div>

            <button
              onClick={() => handleDelete(video._id)}
              style={{
                width: '100%',
                background: 'linear-gradient(135deg, #DC2626, #b91c1c)',
                color: '#fff',
                border: 'none',
                padding: '12px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '14px',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'linear-gradient(135deg, #b91c1c, #991b1b)';
                e.target.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'linear-gradient(135deg, #DC2626, #b91c1c)';
                e.target.style.transform = 'translateY(0)';
              }}
            >
              <i className="fa fa-trash" />
              Delete
            </button>
          </div>
        ))}
      </div>

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