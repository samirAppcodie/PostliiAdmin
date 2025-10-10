import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import {
  CDBSidebar,
  CDBSidebarContent,
  CDBSidebarFooter,
  CDBSidebarHeader,
  CDBSidebarMenu,
} from 'cdbreact';

const Sidebar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false); // To handle sidebar collapse
  const [windowWidth, setWindowWidth] = useState(window.innerWidth); // To track screen size

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
    }

    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    window.location.href = '/login';
  };

  // Toggle sidebar collapse
  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const getSidebarWidth = () => {
    if (isCollapsed) return '70px'; // collapsed width
    if (windowWidth <= 480) return '70%';
    if (windowWidth <= 768) return '150px';
    if (windowWidth <= 1024) return '200px';
    return '250px';
  };

  const navLinkStyle = {
    padding: '10px 15px',
    borderRadius: '8px',
    color: 'white',
    textDecoration: 'none',
    display: 'block',
    transition: 'all 0.3s ease',
    fontWeight: '600',
    fontSize: '18px',
    borderBottom: '3px solid rgba(255, 255, 255, 0.2)',
    marginBottom: '5px',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  };

  const handleMouseEnter = (e) => {
    e.currentTarget.style.transform = 'scale(1.03)';
    e.currentTarget.style.boxShadow = '0 4px 10px rgba(0,0,0,0.1)';
    e.currentTarget.style.fontWeight = '600';
  };

  const handleMouseLeave = (e) => {
    e.currentTarget.style.transform = '';
    e.currentTarget.style.boxShadow = '';
    e.currentTarget.style.fontWeight = '600';
  };

  return (
    <div className="sidebar" style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <CDBSidebar
        textColor="white"
        backgroundColor="#A78BFA"
        style={{
          background: 'linear-gradient(180deg, #1E1E2F, #4B4F7A)',
          minHeight: '100vh',
          boxShadow: '4px 0 6px -4px rgba(0,0,0,0.1)',
          display: 'flex',
          flexDirection: 'column',
          padding: '7%',
          width: getSidebarWidth(), // dynamic width based on collapse
          transition: 'width 0.3s ease',
          margin: '1px',
          gap: '5px',
        }}
      >
        {/* Sidebar Header with toggle */}
        <CDBSidebarHeader>
         
          {!isCollapsed && <span className="ms-2 fw-bold">MyAdmin</span>}
           <i
            className="fa fa-bars me-2"
            style={{ cursor: 'pointer', color: 'white', fontSize: '18px',paddingLeft:'10px' }}
            onClick={toggleSidebar}
          />
        </CDBSidebarHeader>

        {/* Sidebar Content */}
        <CDBSidebarContent>
          <CDBSidebarMenu>
            <div style={{ marginBottom: '5px' }}>
              <NavLink to="/create-admin" style={navLinkStyle} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                <i className="fa fa-users me-2" style={{ fontSize: '18px' }} />
                {!isCollapsed && 'admin'}
              </NavLink>
            </div>

            <div style={{ marginBottom: '5px' }}>
              <NavLink to="/dashboard" style={navLinkStyle} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                <i className="fa fa-user-plus me-2" style={{ fontSize: '18px' }} />
                {!isCollapsed && 'Dashboard'}
              </NavLink>
            </div>

            <div style={{ marginBottom: '5px' }}>
              <NavLink to="/user-list" style={navLinkStyle} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                <i className="fa fa-users me-2" style={{ fontSize: '18px' }} />
                {!isCollapsed && 'Users'}
              </NavLink>
            </div>

            <div className="mt-2" style={{ marginBottom: '5px' }}>
              <NavLink to="/template-list" style={navLinkStyle} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                <i className="fa fa-image me-2" style={{ fontSize: '18px' }} />
                {!isCollapsed && 'Image List'}
              </NavLink>
            </div>

            <div className="mt-2" style={{ marginBottom: '5px' }}>
              <NavLink to="/video-upload" style={navLinkStyle} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                <i className="fa fa-video me-2" style={{ fontSize: '18px' }} />
                {!isCollapsed && 'Add Video'}
              </NavLink>
            </div>

            <div className="mt-2" style={{ marginBottom: '5px' }}>
              <NavLink to="/video-list" style={navLinkStyle} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                <i className="fa fa-list-alt me-2" style={{ fontSize: '18px' }} />
                {!isCollapsed && 'Video List'}
              </NavLink>
            </div>

            <div className="mt-2" style={{ marginBottom: '5px' }}>
              <NavLink to="/categories" style={navLinkStyle} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                <i className="fa fa-folder me-2" style={{ fontSize: '18px' }} />
                {!isCollapsed && 'Categories'}
              </NavLink>
            </div>

            <div className="mt-2" style={{ marginBottom: '5px' }}>
              <NavLink to="/tickets" style={navLinkStyle} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                <i className="fa fa-folder me-2" style={{ fontSize: '18px' }} />
                {!isCollapsed && 'Tickets'}
              </NavLink>
            </div>

            <div className="mt-2" style={{ marginBottom: '5px' }}>
              <NavLink to="/Subscriptions" style={navLinkStyle} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                <i className="fa fa-folder me-2" style={{ fontSize: '18px' }} />
                {!isCollapsed && 'Subscriber'}
              </NavLink>
            </div>

            <div className="mt-2">
             

              <NavLink to="/json-files" style={navLinkStyle} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                <i className="fa fa-file-code me-2" style={{ fontSize: '18px' }} />
                {!isCollapsed && 'View JSONs'}
              </NavLink>

               <NavLink to="/upload-file" style={navLinkStyle} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                <i className="fa fa-upload me-2" style={{ fontSize: '18px' }} />
                {!isCollapsed && 'Upload JSONs'}
              </NavLink>
            </div>
          </CDBSidebarMenu>
        </CDBSidebarContent>

        {/* Sidebar Footer */}
        <CDBSidebarFooter style={{ marginTop: 'auto', padding: '20px' }}>
          {isLoggedIn ? (
            <button
              className="btn btn-sm w-100"
              style={{
                backgroundColor: 'white',
                color: 'linear-gradient(180deg, #4B4F7A, #1E1E2F)',
                border: 'none',
                fontWeight: 'bold',
                fontSize: '16px',
              }}
              onClick={handleLogout}
            >
              <i className="fa fa-sign-out me-2" />
              {!isCollapsed && 'Logout'}
            </button>
          ) : (
            <NavLink to="/login" className="btn btn-outline-success btn-sm w-100">
              <i className="fa fa-sign-in me-2" />
              {!isCollapsed && 'Login'}
            </NavLink>
          )}
        </CDBSidebarFooter>
      </CDBSidebar>
    </div>
  );
};

export default Sidebar;
