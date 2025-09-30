import React, { useState, useEffect } from 'react';
import '../assets/css/VideoUpload.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const VideoUpload = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [videoFile, setVideoFile] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isHovered, setIsHovered] = useState(false);
  const [thumbnailImages, setThumbnailImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const [processingFiles, setProcessingFiles] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/api/categories`);
        const data = await res.json();
        setCategories(data);
      } catch (err) {
        console.error('Error fetching categories:', err);
        toast.error('Error fetching categories');
      }
    };
    fetchCategories();
  }, []);

  const generateThumbnail = async (file, index) => {
    const video = document.createElement('video');
    const canvas = document.createElement('canvas');
    const videoURL = URL.createObjectURL(file);

    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

    video.setAttribute('playsinline', '');
    video.setAttribute('muted', '');
    video.setAttribute('crossorigin', 'anonymous');
    video.preload = 'metadata';
    video.autoplay = false;

    const targetWidth = 1080;
    const targetHeight = 1080;
    const videoWidth = video.videoWidth;
    const videoHeight = video.videoHeight
    canvas.width = targetWidth;
    canvas.height = targetHeight;

    video.src = videoURL;

    const waitForVideoReady = () => {
      return new Promise((resolve, reject) => {
        const timeoutId = setTimeout(() => {
          console.warn(`Video ${index + 1} - Loading timeout after 15s`);
          reject(new Error('Video loading timed out'));
        }, 15000);

        const handleReady = () => {
          clearTimeout(timeoutId);
          setTimeout(resolve, isSafari ? 1000 : 200);
        };

        if (isSafari) {
          video.onloadeddata = handleReady;
          video.oncanplay = handleReady;
          video.oncanplaythrough = handleReady;

          setTimeout(() => {
            try {
              video.currentTime = 0.1;
              video.play().then(() => video.pause()).catch((e) => {
                console.warn(`Play attempt failed for video ${index + 1}:`, e);
              });
            } catch (e) {
              console.warn(`Play attempt error for video ${index + 1}:`, e);
            }
          }, 200);
        } else {
          video.onloadedmetadata = () => {
            video.oncanplaythrough = handleReady;
          };
        }

        video.onerror = (e) => {
          clearTimeout(timeoutId);
          reject(new Error(`Video ${index + 1} failed to load: ${e.message || 'Unknown error'}`));
        };
      });
    };

    const trySeek = (time) => {
      return new Promise((resolve, reject) => {
        const timeoutId = setTimeout(() => {
          console.warn(`Video ${index + 1} - Seek timeout at ${time}s`);
          resolve();
        }, 7000);

        try {
          if (isSafari && video.duration) {
            const seekIncrement = () => {
              const currentPos = video.currentTime;
              const targetPos = time;
              const diff = Math.abs(targetPos - currentPos);

              if (diff < 0.1 || isNaN(diff)) {
                clearTimeout(timeoutId);
                setTimeout(resolve, 200);
                return;
              }

              const step = Math.min(0.5, diff);
              const newTime = currentPos < targetPos ? currentPos + step : currentPos - step;
              video.currentTime = newTime;
              setTimeout(seekIncrement, 100);
            };
            seekIncrement();
          } else {
            video.currentTime = time;
            video.onseeked = () => {
              clearTimeout(timeoutId);
              resolve();
            };
          }
        } catch (e) {
          console.warn(`Seek error for video ${index + 1} at ${time}s:`, e);
          clearTimeout(timeoutId);
          resolve();
        }
      });
    };

    const captureFrame = (time) => {
      return new Promise((resolve) => {
        const timeoutId = setTimeout(() => {
          console.warn(`Video ${index + 1} - Frame capture timeout at ${time}s`);
          resolve(null);
        }, 7000);

        const drawFrame = () => {
          try {
            const ctx = canvas.getContext('2d', { alpha: false });
            ctx.fillStyle = '#000000';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            const videoWidth = video.videoWidth || targetWidth;
            const videoHeight = video.videoHeight || targetHeight;
            const videoAspect = videoWidth / videoHeight;
            const canvasAspect = canvas.width / canvas.height;
            let drawWidth, drawHeight, offsetX, offsetY;

            if (videoAspect > canvasAspect) {
              drawWidth = canvas.height * videoAspect;
              drawHeight = canvas.height;
              offsetX = (canvas.width - drawWidth) / 2;
              offsetY = 0;
            } else {
              drawWidth = canvas.width;
              drawHeight = canvas.width / videoAspect;
              offsetX = 0;
              offsetY = (canvas.height - drawHeight) / 2;
            }

            ctx.drawImage(video, offsetX, offsetY, drawWidth, drawHeight);

            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const data = imageData.data;
            let blackPixels = 0;
            const totalPixels = data.length / 4;

            for (let i = 0; i < data.length; i += 4) {
              const r = data[i];
              const g = data[i + 1];
              const b = data[i + 2];
              if (r < 20 && g < 20 && b < 20) {
                blackPixels++;
              }
            }

            const blackPercentage = (blackPixels / totalPixels) * 100;
            if (blackPercentage > 90 && thumbnailAttempts < maxAttempts) {
              console.warn(`Video ${index + 1} - Black frame detected at ${time}s (${blackPercentage.toFixed(1)}% black)`);
              thumbnailAttempts++;
              const newTime = timePositions[thumbnailAttempts] || Math.min(thumbnailAttempts * 2, video.duration / 2);
              trySeek(newTime).then(() => captureFrame(newTime).then(resolve));
              return;
            }

            canvas.toBlob(
              (blob) => {
                clearTimeout(timeoutId);
                if (blob) {
                  const thumbnailFile = new File([blob], `thumbnail-${index}-${file.name}.jpg`, {
                    type: 'image/jpeg',
                  });
                  resolve({ thumbnailFile, videoIndex: index });
                } else {
                  console.warn(`Failed to generate blob for video ${index + 1}`);
                  resolve(null);
                }
              },
              'image/jpeg',
              0.9
            );
          } catch (e) {
            console.warn(`Canvas draw error for video ${index + 1}:`, e);
            clearTimeout(timeoutId);
            resolve(null);
          }
        };

        requestAnimationFrame(() => {
          setTimeout(drawFrame, isSafari ? 500 : 100);
        });
      });
    };

    let thumbnailAttempts = 0;
    const maxAttempts = 8;
    const timePositions = [0, 0.5, 1, 2, 3, 5, 10, 15];

    try {
      if (!video.canPlayType('video/mp4; codecs="avc1.42E01E"')) {
        throw new Error('Unsupported video codec');
      }

      await waitForVideoReady();
      if (!video.duration || isNaN(video.duration)) {
        throw new Error('Invalid video duration');
      }

      await trySeek(0);
      return await captureFrame(0);
    } catch (error) {
      console.error(`Error processing video ${index + 1}:`, error);
      toast.error(`Failed to generate thumbnail for video ${index + 1}: ${error.message}`);

      const fallbackCanvas = document.createElement('canvas');
      fallbackCanvas.width = targetWidth;
      fallbackCanvas.height = targetHeight;
      const ctx = fallbackCanvas.getContext('2d');
      ctx.fillStyle = '#888888';
      ctx.fillRect(0, 0, targetWidth, targetHeight);
      ctx.fillStyle = '#ffffff';
      ctx.font = '30px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(file.name, targetWidth / 2, targetHeight / 2);

      return new Promise((resolve) => {
        fallbackCanvas.toBlob(
          (blob) => {
            const thumbnailFile = new File([blob], `thumbnail-${index}-${file.name}.jpg`, {
              type: 'image/jpeg',
            });
            resolve({ thumbnailFile, videoIndex: index });
          },
          'image/jpeg',
          0.9
        );
      });
    } finally {
      video.src = '';
      video.remove();
      canvas.remove();
      URL.revokeObjectURL(videoURL);
      if (window.gc) {
        try { window.gc(); } catch (e) { console.log('GC not available'); }
      }
    }
  };

  const handleFileChange = async (e) => {
    try {
      const files = Array.from(e.target.files);
      if (files.length === 0) {
        setVideoFile([]);
        setThumbnailImages([]);
        return;
      }

      const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
      const maxFileSize = isSafari ? 100 * 1024 * 1024 : 500 * 1024 * 1024;
      const maxFiles = isSafari ? 100 : 100;

      const oversizedFiles = files.filter(file => file.size > maxFileSize);
      if (oversizedFiles.length > 0) {
        const maxSizeMB = Math.floor(maxFileSize / (1024 * 1024));
        toast.error(`Some files exceed the ${maxSizeMB}MB limit. Please use smaller files.`);
        return;
      }

      if (files.length > maxFiles) {
        toast.error(`Please upload a maximum of ${maxFiles} files at once.`);
        return;
      }

      if (isSafari) {
        toast.info('Safari detected. Processing videos one at a time for better reliability.');
      }

      setVideoFile(files);
      setProcessingFiles(true);
      setThumbnailImages([]);

      const initialProgress = {};
      files.forEach((_, index) => {
        initialProgress[index] = { status: 'waiting', progress: 0 };
      });
      setUploadProgress(initialProgress);

      const thumbnails = [];
      for (let i = 0; i < files.length; i++) {
        setUploadProgress(prev => ({
          ...prev,
          [i]: { status: 'processing', progress: 10 }
        }));

        const result = await generateThumbnail(files[i], i);
        thumbnails[i] = result ? result.thumbnailFile : null;

        setUploadProgress(prev => ({
          ...prev,
          [i]: { status: result ? 'complete' : 'error', progress: result ? 100 : 0 }
        }));

        if (i < files.length - 1) {
          await new Promise(resolve => setTimeout(resolve, isSafari ? 2000 : 500));
        }
      }

      const successfulThumbnails = thumbnails.filter(thumb => thumb !== null);
      setThumbnailImages(successfulThumbnails);
      setProcessingFiles(false);

      if (successfulThumbnails.length !== files.length) {
        toast.warn(`Generated thumbnails for ${successfulThumbnails.length} out of ${files.length} videos`);
      } else {
        toast.success('All thumbnails generated successfully');
      }
    } catch (e) {
      console.error('Error in handleFileChange:', e);
      toast.error('Error processing videos');
      setProcessingFiles(false);
    }
  };

  const regenerateThumbnail = async (index) => {
    try {
      setProcessingFiles(true);
      setUploadProgress(prev => ({
        ...prev,
        [index]: { status: 'processing', progress: 10 }
      }));

      const file = videoFile[index];
      const result = await generateThumbnail(file, index);

      if (result) {
        setThumbnailImages(prev => {
          const newThumbnails = [...prev];
          newThumbnails[index] = result.thumbnailFile;
          return newThumbnails;
        });
        setUploadProgress(prev => ({
          ...prev,
          [index]: { status: 'complete', progress: 100 }
        }));
        toast.success(`Thumbnail regenerated for video ${index + 1}`);
      } else {
        setUploadProgress(prev => ({
          ...prev,
          [index]: { status: 'error', progress: 0 }
        }));
        toast.error(`Failed to regenerate thumbnail for video ${index + 1}`);
      }
    } catch (e) {
      console.error(`Error regenerating thumbnail for video ${index + 1}:`, e);
      toast.error(`Error regenerating thumbnail for video ${index + 1}`);
      setUploadProgress(prev => ({
        ...prev,
        [index]: { status: 'error', progress: 0 }
      }));
    } finally {
      setProcessingFiles(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (videoFile.length === 0 || !selectedCategory) {
      toast.error('Please select video files and category');
      return;
    }

    if (thumbnailImages.length !== videoFile.length) {
      toast.error(`Thumbnails not generated for all videos. Generated ${thumbnailImages.length} out of ${videoFile.length}`);
      return;
    }

    setIsLoading(true);

    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

    try {
      if (isSafari) {
        toast.info('Safari detected. Using optimized upload method...');

        if (window.gc) {
          try { window.gc(); } catch (e) { console.log('GC not available'); }
        }

        for (let i = 0; i < videoFile.length; i++) {
          const singleFormData = new FormData();
          singleFormData.append('videos', videoFile[i]);
          singleFormData.append('thumbnails', thumbnailImages[i]);
          singleFormData.append('title', title);
          singleFormData.append('categoryId', selectedCategory);

          setUploadProgress(prev => ({
            ...prev,
            [i]: { status: 'uploading', progress: 0 }
          }));

          const xhr = new XMLHttpRequest();

          xhr.upload.onprogress = (event) => {
            if (event.lengthComputable) {
              const percentComplete = Math.round((event.loaded / event.total) * 100);
              console.log(`Upload progress for file ${i + 1}: ${percentComplete}%`);
              setUploadProgress(prev => ({
                ...prev,
                [i]: { status: 'uploading', progress: percentComplete }
              }));
            }
          };

          const uploadPromise = new Promise((resolve, reject) => {
            xhr.onload = () => {
              if (xhr.status >= 200 && xhr.status < 300) {
                resolve(xhr.response);
              } else {
                reject(new Error(`Upload failed with status ${xhr.status}`));
              }
            };
            xhr.onerror = () => reject(new Error('Network error during upload'));
            xhr.ontimeout = () => reject(new Error('Upload timed out'));
          });

          xhr.open('POST', `${process.env.REACT_APP_API_URL}/api/videos`);
          xhr.responseType = 'json';
          xhr.timeout = 600000;
          xhr.send(singleFormData);

          try {
            await uploadPromise;
            setUploadProgress(prev => ({
              ...prev,
              [i]: { status: 'complete', progress: 100 }
            }));
            if (i < videoFile.length - 1) {
              await new Promise(resolve => setTimeout(resolve, 1000));
            }
          } catch (error) {
            console.error(`Error uploading file ${i + 1}:`, error);
            setUploadProgress(prev => ({
              ...prev,
              [i]: { status: 'error', progress: 0 }
            }));
            toast.error(`Error uploading video ${i + 1}. Continuing with remaining files.`);
          }
        }

        toast.success('Upload process completed!');
      } else {
        const formData = new FormData();
        videoFile.forEach((file, index) => {
          formData.append('videos', file);
        });
        thumbnailImages.forEach((thumbnail, index) => {
          formData.append('thumbnails', thumbnail);
        });
        formData.append('title', title);
        formData.append('categoryId', selectedCategory);

        const xhr = new XMLHttpRequest();

        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            const percentComplete = Math.round((event.loaded / event.total) * 100);
            console.log(`Upload progress: ${percentComplete}%`);
            setUploadProgress(prev => {
              const newProgress = { ...prev };
              videoFile.forEach((_, index) => {
                newProgress[index] = { status: 'uploading', progress: percentComplete };
              });
              return newProgress;
            });
          }
        };

        const uploadPromise = new Promise((resolve, reject) => {
          xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) {
              resolve(xhr.response);
            } else {
              reject(new Error(`Upload failed with status ${xhr.status}`));
            }
          };
          xhr.onerror = () => reject(new Error('Network error during upload'));
        });

        xhr.open('POST', `${process.env.REACT_APP_API_URL}/api/videos`);
        xhr.responseType = 'json';
        xhr.send(formData);

        await uploadPromise;
        toast.success('Videos uploaded successfully!');
      }

      setTitle('');
      setDescription('');
      setVideoFile([]);
      setSelectedCategory('');
      setThumbnailImages([]);
      setUploadProgress({});

      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      console.error('Error uploading videos:', error);
      toast.error('Error uploading videos');
      setUploadProgress(prev => {
        const newProgress = { ...prev };
        videoFile.forEach((_, index) => {
          newProgress[index] = { status: 'error', progress: 0 };
        });
        return newProgress;
      });
    } finally {
      setIsLoading(false);
    }
  };

  const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

  // Calculate overall progress for the global progress bar
  const overallProgress = videoFile.length > 0
    ? Math.round(
        Object.values(uploadProgress).reduce((sum, p) => sum + p.progress, 0) / videoFile.length
      )
    : 0;

  return (
    <>
      <style>{`
        .loader-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, rgba(0, 0, 0, 0.8), rgba(50, 50, 50, 0.9));
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          z-index: 10000;
          color: white;
          text-align: center;
          overflow: hidden;
        }

        .loader-container {
        display:none;
          position: relative;
          width: 120px;
          height: 120px;
          display: flex;
          justify-content: center;
          align-items: center;
          margin-bottom: 20px;
        }

        .loader {
          position: absolute;
          width: 80px;
          height: 80px;
          border: 8px solid transparent;
          border-top-color: #5f7cdb;
          border-right-color: #589ebe;
          border-radius: 50%;
          animation: spin 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
          box-shadow: 0 0 20px rgba(95, 124, 219, 0.5);
        }

        .loader-inner {
          position: absolute;
          width: 60px;
          height: 60px;
          border: 6px solid transparent;
          border-bottom-color: #4caf50;
          border-radius: 50%;
          animation: spin 0.8s cubic-bezier(0.5, 0, 0.5, 1) infinite reverse;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .particle {
          position: absolute;
          width: 4px;
          height: 4px;
          background: #ffffff;
          border-radius: 50%;
          animation: particle 2s linear infinite;
          opacity: 0.6;
        }

        @keyframes particle {
          0% {
            transform: translate(0, 0);
            opacity: 0.6;
          }
          100% {
            transform: translate(calc(100px * var(--dx)), calc(100px * var(--dy)));
            opacity: 0;
          }
        }

        .global-progress-container {
          width: 350px;
          height: 24px;
          background: #2d2d2d;
          border-radius: 12px;
          margin-top: 20px;
          position: relative;
          overflow: hidden;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        }

        .global-progress-bar {
          height: 100%;
          background: linear-gradient(90deg, #5f7cdb, #4caf50, #589ebe);
          background-size: 200%;
          border-radius: 12px;
          transition: width 0.4s ease-in-out;
          animation: gradientShift 3s ease infinite;
          position: relative;
          overflow: hidden;
        }

        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        .global-progress-text {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          color: #fff;
          font-weight: 600;
          font-size: 14px;
          text-shadow: 0 0 4px rgba(0, 0, 0, 0.5);
        }

        .file-progress-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 10px;
          margin-top: 20px;
          width: 80%;
          max-width: 800px;
        }

        .file-progress-item {
          background: rgba(255, 255, 255, 0.1);
          padding: 10px;
          border-radius: 8px;
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .file-progress-bar {
          height: 8px;
          background: #444;
          border-radius: 4px;
          overflow: hidden;
        }

        .file-progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #5f7cdb, #589ebe);
          transition: width 0.3s ease;
        }

        .file-name {
          font-size: 12px;
          color: #ddd;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .safari-upload-tip {
          margin-top: 20px;
          font-size: 0.9rem;
          color: #fff;
          background: rgba(220, 53, 69, 0.3);
          padding: 8px 12px;
          border-radius: 6px;
          max-width: 350px;
        }

        .reload-button {
          padding: 8px 12px;
          border-radius: 6px;
          background: linear-gradient(90deg, #5f7cdb, #589ebe);
          color: #fff;
          border: none;
          cursor: pointer;
          font-size: 14px;
          transition: all 0.2s ease-in-out;
          margin-top: 8px;
        }

        .reload-button:hover:enabled {
          transform: scale(1.05);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .reload-button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
      `}</style>
      <div className="video-upload-container">
        {(isLoading || processingFiles) && (
          <div className="loader-overlay">
          
            <p>
              {isLoading
                ? `Uploading ${videoFile.length} video${videoFile.length !== 1 ? 's' : ''}${isSafari ? ' (Safari mode)' : ''}...`
                : `Processing ${videoFile.length} video${videoFile.length !== 1 ? 's' : ''}${isSafari ? ' (Safari optimized mode)' : ''}...`}
            </p>
            <div className="global-progress-container">
              <div className="global-progress-bar" style={{ width: `${overallProgress}%` }}></div>
              <span className="global-progress-text">{overallProgress}%</span>
            </div>
            {(isLoading || processingFiles) && videoFile.length > 0 && (
              <div className="file-progress-grid">
                {videoFile.map((file, index) => {
                  const progress = uploadProgress[index] || { status: 'waiting', progress: 0 };
                  return (
                    <div key={index} className="file-progress-item">
                      <span className="file-name">
                        {file.name.length > 20 ? `${file.name.substring(0, 20)}...` : file.name}
                      </span>
                      <div className="file-progress-bar">
                        <div
                          className="file-progress-fill"
                          style={{ width: `${progress.progress}%` }}
                        ></div>
                      </div>
                      <span className="file-name">{progress.status}</span>
                    </div>
                  );
                })}
              </div>
            )}
            {isSafari && (
              <p className="safari-upload-tip">Keep this tab active for best results</p>
            )}
          </div>
        )}
        <form
          onSubmit={handleSubmit}
          className="video-upload-form"
          style={{ opacity: isLoading ? 0.5 : 1, pointerEvents: isLoading ? 'none' : 'auto' }}
        >
          <h2
            style={{
              textAlign: 'center',
              fontWeight: '600',
              fontSize: '26px',
              color: 'black',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '10px',
              marginBottom: '20px',
              userSelect: 'none',
            }}
          >
            <i
              className="fas fa-upload"
              style={{
                fontSize: '28px',
                background: 'linear-gradient(180deg, #5f7cdb, #589ebe)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                pointerEvents: 'none',
              }}
            ></i>
            <span
              style={{
                color: 'black',
                fontSize: '16px',
                fontWeight: 'bold',
              }}
            >
              Upload The Videos
            </span>
          </h2>

          <label style={{ fontWeight: '500', marginBottom: '4px', display: 'block' }}>
            Video Title
          </label>
          <input
            type="text"
            placeholder="Video Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            disabled={isLoading}
          />

          <label style={{ fontWeight: '500', marginTop: '12px', marginBottom: '4px', display: 'block' }}>
            Select Category
          </label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '14px 18px',
              margin: '12px 0',
              border: '1px solid #ddd',
              borderRadius: '8px',
              fontSize: '16px',
              color: '#333',
              outline: 'none',
            }}
            disabled={isLoading}
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>

          <label style={{ fontWeight: '500', marginBottom: '4px', display: 'block' }}>
            Upload Video Files
          </label>
          <input
            type="file"
            accept="video/*"
            onChange={handleFileChange}
            multiple
            required
            disabled={isLoading}
          />

          {videoFile.length > 0 && (
            <div style={{ marginTop: '12px' }}>
              <label style={{ fontWeight: '500', marginBottom: '8px', display: 'block' }}>
                Video Processing Status
              </label>
              <div className="video-processing-grid">
                {videoFile.map((file, index) => {
                  const progress = uploadProgress[index] || { status: 'waiting', progress: 0 };
                  const thumbnail = thumbnailImages[index];

                  return (
                    <div key={index} className="video-thumbnail-container">
                      <div className="video-info">
                        <p className="video-name">{file.name.length > 20 ? `${file.name.substring(0, 20)}...` : file.name}</p>
                        <p className="video-status">
                          {progress.status === 'processing' && 'Processing...'}
                          {progress.status === 'complete' && 'Ready'}
                          {progress.status === 'uploading' && 'Uploading...'}
                          {progress.status === 'error' && 'Error'}
                        </p>
                      </div>

                      <div className="thumbnail-wrapper">
                        {thumbnail ? (
                          <img
                            src={URL.createObjectURL(thumbnail)}
                            alt={`Thumbnail for video ${index + 1}`}
                            className="video-thumbnail"
                          />
                        ) : (
                          <div className="thumbnail-placeholder">
                            <i className="fas fa-file-video" style={{ fontSize: '24px', color: '#5f7cdb' }}></i>
                          </div>
                        )}

                        {(progress.status === 'processing' || progress.status === 'uploading') && (
                          <div className="progress-overlay">
                            <div className="progress-bar-container">
                              <div
                                className="progress-bar"
                                style={{ width: `${progress.progress}%` }}
                              ></div>
                            </div>
                            <span className="progress-text">{progress.progress}%</span>
                          </div>
                        )}

                        {progress.status === 'error' && (
                          <div className="error-overlay">
                            <i className="fas fa-exclamation-circle" style={{ fontSize: '24px', color: '#ff4d4f' }}></i>
                            <span>Failed</span>
                          </div>
                        )}
                      </div>

                      <button
                        className="reload-button"
                        onClick={() => regenerateThumbnail(index)}
                        disabled={isLoading || progress.status === 'processing' || progress.status === 'uploading'}
                      >
                        Reload Thumbnail
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <button
            type="submit"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{
              width: '100%',
              fontWeight: '500',
              padding: '12px',
              borderRadius: '8px',
              background: 'linear-gradient(90deg, #5f7cdb, #589ebe)',
              color: '#fff',
              border: 'none',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              transform: isHovered && !isLoading ? 'scale(1.03)' : 'scale(1)',
              boxShadow: isHovered && !isLoading ? '0 4px 12px rgba(0, 0, 0, 0.1)' : 'none',
              transition: 'all 0.2s ease-in-out',
              opacity: isLoading ? 0.7 : 1,
            }}
            disabled={isLoading}
          >
            {isLoading ? 'Uploading...' : 'Upload Videos'}
          </button>
        </form>
      </div>

      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
};

export default VideoUpload;