


// src/App.js
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import AddUser from './pages/AddUser';
import AddTemplate from './pages/UploadTemplate';
import UploadFile from './pages/UploadFile';
import JsonFileList from './pages/JsonFileList';
import TemplateList from './pages/TemplateList';
import Categories from './pages/CategoryList';
import UserList from './pages/UserList';
import TemplateUpload from './pages/UploadTemplate';
import TemplateByCategory from './pages/TemplateByCategory';
import Loader from './components/Loader';  // Import the loader component
import CreateAdmin from './pages/AdminCreation';
import VideoUpload from './pages/VideoUpload';
import VideoList from './pages/VideoList';
import Tickets from './pages/Tickets';
import Subscriptions from './pages/Subscriptions';

const Layout = ({ children }) => {
  const location = useLocation();
  const showSidebar = location.pathname !== '/login';

  return (
    <div style={{ display: 'flex',height: '100vh'  }}>
      {showSidebar && <Sidebar />}
      <div style={{ flex: 1,overflowY: 'auto', backgroundColor: '#f8f9fa' }}>
        {children}
      </div>
    </div>
  );
};

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [categoryId, setCategoryId] = useState('');

useEffect(() => {
  const token = localStorage.getItem('token');
  setIsAuthenticated(!!token);

  // Delay to simulate loading
  const timer = setTimeout(() => setLoading(false), 500);
  return () => clearTimeout(timer);
}, []);



  if (loading) return <Loader />; 

  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />
          <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
          
          {/* Protected Routes */}
          {isAuthenticated && (
            <>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/add-user" element={<AddUser />} />
              <Route path="/user-list" element={<UserList />} />
              <Route path="/add-template" element={<AddTemplate />} />
              <Route path="/upload-file" element={<UploadFile />} />
              <Route path="/json-files" element={<JsonFileList />} />
              <Route path="/template-list" element={<TemplateList />} />
              <Route path="/categories" element={<Categories setCategoryId={setCategoryId} />} />
              <Route path="/template-upload" element={<TemplateUpload />} />
              <Route path="/tickets" element={<Tickets />} />
              <Route path="/subscriptions" element={<Subscriptions />} />
              <Route path="/template-list-with-category" element={<TemplateByCategory />} />
              <Route path="/create-admin" element={<CreateAdmin />} />
              <Route path="/video-upload" element={<VideoUpload />} />   {/* ✅ Add this */}
              <Route path="/video-list" element={<VideoList/>} />   {/* ✅ Add this */}

              
            </>
          )}

          {/* Catch-all for unauthorized access */}
          {!isAuthenticated && (
            <Route path="*" element={<Navigate to="/login" />} />
          )}
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
