
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

    // Update window width on resize
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

  // Toggle sidebar collapse on smaller screens
  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  // Determine sidebar width based on window size and collapse state
  const getSidebarWidth = () => {
    // if (isCollapsed) return '0';
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
    fontWeight : '600',
    fontSize:'18px',
     borderBottom: '3px solid rgba(255, 255, 255, 0.2)', // add subtle border
  marginBottom: '5px' // add spacing
  };

const handleMouseEnter = (e) => {
    // e.currentTarget.style.backgroundColor = 'white';
    // e.currentTarget.style.color = ' #5f7cdb'; // purple text on hover
    e.currentTarget.style.transform = 'scale(1.03)';
    e.currentTarget.style.boxShadow = '0 4px 10px rgba(0,0,0,0.1)';
      e.currentTarget.style.fontWeight = '600'; // increase font weight
         e.currentTarget.style.fontsize = '18px'; // increase font weight
};

const handleMouseLeave = (e) => {
    e.currentTarget.style.backgroundColor = '';
    e.currentTarget.style.color = 'white';  // revert back to white text
    e.currentTarget.style.transform = '';
    e.currentTarget.style.boxShadow = '';
};


  return (
    <div className='sidebar' style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <CDBSidebar
        textColor="white"
        backgroundColor="#A78BFA"
        style={{
          background: 'linear-gradient(180deg, #5f7cdb, #589ebe)',
          minHeight: '100vh',
          boxShadow: '4px 0 6px -4px rgba(0,0,0,0.1)',
          display: 'flex',
          flexDirection: 'column',
          padding: '7%',
          width: getSidebarWidth(), // Adjust the width dynamically based on screen size and collapse state
          transition: 'width 0.3s ease', // Smooth transition for collapsing
          margin: '1px',
          gap: '5px',
        }}
      >
        {/* Sidebar Header */}
        <CDBSidebarHeader
        
          //  prefix={<i className="fa fa-bars" style={{ cursor: 'pointer',color:'white' }} onClick={toggleSidebar} />}
        >
         <span className="ms-2 fw-bold" >MyAdmin</span>

        </CDBSidebarHeader>

        {/* Sidebar Content */}
        <CDBSidebarContent>
          <CDBSidebarMenu>
            {/* Dashboard Section */}

             {/* Users Section */}
            <div style={{ marginBottom: '5px' }}>
              <NavLink to="/create-admin"style={navLinkStyle} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                <i className="fa fa-users me-2" style={{ fontSize: '18px' }} />
                admin
              </NavLink>
            </div>

            <div style={{ marginBottom: '5px' }}>
              <NavLink to="/dashboard" style={navLinkStyle} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                <i className="fa fa-user-plus me-2" style={{ fontSize: '18px' }} />
                Dashboard
              </NavLink>
            </div>

            {/* Users Section */}
            <div style={{ marginBottom: '5px' }}>
              <NavLink to="/user-list" style={navLinkStyle} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                <i className="fa fa-users me-2" style={{ fontSize: '18px' }} />
                Users
              </NavLink>
            </div>

            {/* Templates Section */}
            <div className="mt-2" style={{ marginBottom: '5px' }}>
              <NavLink to="/template-list" style={navLinkStyle} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                <i className="fa fa-image me-2" style={{ fontSize: '18px' }} />
                Templates
              </NavLink>
            </div>


                  {/* video section  */}


             <div className="mt-2" style={{ marginBottom: '5px' }}>
              <NavLink to="/video-upload"style={navLinkStyle} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                <i className="fa fa-video me-2" style={{ fontSize: '18px' }} />
                Add Video
              </NavLink>
            </div>

             <div className="mt-2" style={{ marginBottom: '5px' }}>
              <NavLink to="/video-list" style={navLinkStyle} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                <i className="fa fa-list-alt me-2" style={{ fontSize: '18px' }} />
                Video-list
              </NavLink>
            </div>

            {/* Categories Section */}
            <div className="mt-2" style={{ marginBottom: '5px' }}>
              <NavLink to="/categories" style={navLinkStyle} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                <i className="fa fa-folder me-2" style={{ fontSize: '18px' }} />
                Manage Categories
              </NavLink>
            </div>
             <div className="mt-2" style={{ marginBottom: '5px' }}>
              <NavLink to="/tickets" style={navLinkStyle} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                <i className="fa fa-folder me-2" style={{ fontSize: '18px' }} />
                Tickets
              </NavLink>
            </div>
             <div className="mt-2" style={{ marginBottom: '5px' }}>
              <NavLink to="/Subscriptions" style={navLinkStyle} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                <i className="fa fa-folder me-2" style={{ fontSize: '18px' }} />
                Subscription
              </NavLink>
            </div>
             {/* JSON Files Section */}
           <div className="mt-2">
           
              <NavLink to="/upload-file"style={navLinkStyle} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                <i className="fa fa-upload me-2" style={{ fontSize: '18px' }} />
                Upload File
              </NavLink>
              {/* <br></br> */}
              <NavLink to="/json-files"style={navLinkStyle} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
              <i className="fa fa-file-code me-2" style={{ fontSize: '18px' }} />
               View JSONs
              </NavLink>
            </div>
        
          </CDBSidebarMenu>
        </CDBSidebarContent>

       

        {/* Sidebar Footer */}
        <CDBSidebarFooter style={{ marginTop: 'auto', padding: '20px' }}>
          {isLoggedIn ? (
            <button className="btn  btn-sm w-100" style={{
    backgroundColor: 'white',
    color: ' #5f7cdb',
    border: 'none',
    fontWeight:"bold",
    fontSize:'16px'
  }} onClick={handleLogout}>
              <i className="fa fa-sign-out me-2" />
              Logout
            </button>
          ) : (
            <NavLink to="/login" className="btn btn-outline-success btn-sm w-100">
              <i className="fa fa-sign-in me-2" />
              Login
            </NavLink>
          )}
        </CDBSidebarFooter>
      </CDBSidebar>
    </div>
  );
};

export default Sidebar;
