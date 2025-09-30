import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  LinearProgress
} from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import CategoryIcon from '@mui/icons-material/Category';
import { useNavigate } from 'react-router-dom';
import Profile from '../components/Profile';

import {
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid,
  PieChart, Pie, Cell, LineChart, Line, Legend,
} from 'recharts';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

const Dashboard = () => {
  const navigate = useNavigate();

  const [dashboardData, setDashboardData] = useState({
    signupCount: 0,
    templateCount: 0,
    categoryCount: 0,
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await axios.get('/api/dashboard');
        setDashboardData(response.data);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      }
    };

    fetchDashboardData();
  }, []);

  const COLORS = ['#42a5f5', '#66bb6a', '#ffa726'];
  const total = dashboardData.signupCount + dashboardData.templateCount + dashboardData.categoryCount;

  const pieData = [
    { name: 'Users', value: dashboardData.signupCount },
    { name: 'Templates', value: dashboardData.templateCount },
    { name: 'Categories', value: dashboardData.categoryCount },
  ];

  const circleData = pieData.map((item, i) => ({
    ...item,
    percent: total > 0 ? Math.round((item.value / total) * 100) : 0,
    color: COLORS[i],
  }));

  const cardBaseStyle = {
    color: '#fff',
    minHeight: '180px',
    borderRadius: '16px',
    display: 'flex',
    alignItems: 'center',
    transition: 'transform 0.3s ease',
    boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
    '&:hover': {
      transform: 'translateY(-5px)',
    },
  };

  const iconStyle = {
    fontSize: 48,
    opacity: 0.7,
    marginRight: 16,
  };

  const cardContentStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    height: '100%',
    width: '100%',
  };

  const renderCard = (title, value, Icon, bgColor, navigateTo) => (
    <Grid item xs={12} sm={6} md={4} key={title}>
      <Card sx={{ ...cardBaseStyle, background: bgColor }} onClick={() => navigate(`/${navigateTo}`)}>
        <CardContent sx={cardContentStyle}>
          <Icon sx={iconStyle} />
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 500 }}>{title}</Typography>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>{value}</Typography>
          </Box>
        </CardContent>
      </Card>
    </Grid>
  );

  return (
    <div style={{ padding: '24px', minHeight: '100vh' }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 3,
        }}
      >
       <Typography variant="h4" gutterBottom style={{ fontWeight: 600, color: 'black' }}>
  📊 Admin Dashboard
</Typography>

        <Profile />
      </Box>

      <Grid container spacing={3}>
        {renderCard('Total Users', dashboardData.signupCount, PeopleIcon, 'linear-gradient(135deg, #42a5f5, #478ed1)', 'user-list')}
        {renderCard('Total Templates', dashboardData.templateCount, InsertDriveFileIcon, 'linear-gradient(135deg, #66bb6a, #43a047)', 'template-list')}
        {renderCard('Total Categories', dashboardData.categoryCount, CategoryIcon, 'linear-gradient(135deg, #ffa726, #fb8c00)', 'categories')}
      </Grid>

      <Grid container spacing={3} mt={2}>
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 3 }}>
            <Typography variant="h6" mb={2}>Bar Chart</Typography>
            <BarChart width={660} height={250} data={pieData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#42a5f5" radius={[6, 6, 0, 0]} />
            </BarChart>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ p: 3 }}>
            <Typography variant="h6" mb={2}>Pie Chart</Typography>
            <PieChart width={660} height={250}>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {pieData.map((entry, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card sx={{ p: 3 }}>
            <Typography variant="h6" mb={2}>Line Chart</Typography>
            <LineChart width={900} height={280} data={pieData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="value" stroke="#66bb6a" strokeWidth={3} />
            </LineChart>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card sx={{ p: 3, borderRadius: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
            <Typography variant="h6" mb={3} fontWeight={600}>Data Distribution Overview</Typography>
            <Grid container spacing={2}>
              {circleData.map((item, i) => (
                <Grid item xs={12} sm={4} key={i}>
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      p: 2,
                      borderRadius: 2,
                      background: '#fff',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                    }}
                  >
                    <Box sx={{ width: 100, height: 160, mb: 2 }}>
                      <CircularProgressbar
                        value={item.percent}
                        text={`${item.percent}%`}
                        styles={buildStyles({
                          pathColor: item.color,
                          textColor: '#2c3e50',
                          trailColor: '#eee',
                          textSize: '20px',
                          pathTransitionDuration: 0.5,
                        })}
                      />
                    </Box>
                    <Typography variant="subtitle1" fontWeight={500}>{item.name}</Typography>
                    <Typography variant="body2" color="textSecondary">{item.value} items</Typography>
                    <LinearProgress
                      value={item.percent}
                      variant="determinate"
                      sx={{
                        width: '100%',
                        height: 6,
                        borderRadius: 3,
                        mt: 1,
                        backgroundColor: '#eee',
                        '& .MuiLinearProgress-bar': {
                          backgroundColor: item.color,
                        },
                      }}
                    />
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
};

export default Dashboard;



// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import {
//   Card, CardContent, Typography, Grid, Box, LinearProgress,
// } from '@mui/material';
// import {
//   BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid,
//   PieChart, Pie, Cell, LineChart, Line, Legend,
// } from 'recharts';
// import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
// import 'react-circular-progressbar/dist/styles.css';
// import PeopleIcon from '@mui/icons-material/People';
// import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
// import CategoryIcon from '@mui/icons-material/Category';
// import { useNavigate } from 'react-router-dom';
// import Profile from '../components/Profile';

// const COLORS = ['#42a5f5', '#66bb6a', '#ffa726'];

// const Dashboard = () => {
//   const navigate = useNavigate();
//   const [dashboardData, setDashboardData] = useState({
//     signupCount: 0,
//     templateCount: 0,
//     categoryCount: 0,
//   });

//   useEffect(() => {
//     const fetchDashboardData = async () => {
//       try {
//         const response = await axios.get('/api/dashboard');
//         setDashboardData(response.data);
//       } catch (err) {
//         console.error('Error fetching dashboard data:', err);
//       }
//     };
//     fetchDashboardData();
//   }, []);

//   const total = dashboardData.signupCount + dashboardData.templateCount + dashboardData.categoryCount;

//   const pieData = [
//     { name: 'Users', value: dashboardData.signupCount },
//     { name: 'Templates', value: dashboardData.templateCount },
//     { name: 'Categories', value: dashboardData.categoryCount },
//   ];

//   const circleData = pieData.map((item, i) => ({
//     ...item,
//     percent: total > 0 ? Math.round((item.value / total) * 100) : 0,
//     color: COLORS[i],
//   }));

//   const renderCard = (title, value, Icon, bgColor, link) => (
//     <Grid item xs={12} sm={6} md={4}>
//       <Card
//         sx={{
//           background: bgColor,
//           color: '#fff',
//           height: { xs: 140, sm: 180, md: 200 }, // updated height
//           borderRadius: 3,
//           display: 'flex',
//           alignItems: 'center',
//           px: 3,
//           cursor: 'pointer',
//           '&:hover': {
//             transform: 'translateY(-4px)',
//             boxShadow: '0 12px 24px rgba(0,0,0,0.15)',
//           },
//         }}
//         onClick={() => navigate(`/${link}`)}
//       >
//         <Icon sx={{ fontSize: 50, opacity: 0.9, mr: 2 }} />
//         <Box>
//           <Typography variant="subtitle1">{title}</Typography>
//           <Typography variant="h4" fontWeight="bold">{value}</Typography>
//         </Box>
//       </Card>
//     </Grid>
//   );

//   return (
//     <Box p={3} sx={{ background: '#f5f7fb', minHeight: '100vh' }}>
//       {/* Header */}
//       <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
//         <Typography variant="h4" fontWeight={700}>Admin Dashboard</Typography>
//         <Profile />
//       </Box>

//       {/* Cards */}
//       <Grid container spacing={3} mb={3}>
//         {renderCard('Total Users', dashboardData.signupCount, PeopleIcon, 'linear-gradient(135deg, #42a5f5, #478ed1)', 'user-list')}
//         {renderCard('Total Templates', dashboardData.templateCount, InsertDriveFileIcon, 'linear-gradient(135deg, #66bb6a, #43a047)', 'template-list')}
//         {renderCard('Total Categories', dashboardData.categoryCount, CategoryIcon, 'linear-gradient(135deg, #ffa726, #fb8c00)', 'categories')}
//       </Grid>

//       {/* Charts */}
//       <Grid container spacing={3}>
//         <Grid item xs={12} md={6}>
//           <Card sx={{ p: 3 }}>
//             <Typography variant="h6" mb={2}>Bar Chart</Typography>
//             <BarChart width={660} height={250} data={pieData}>
//               <CartesianGrid strokeDasharray="3 3" />
//               <XAxis dataKey="name" />
//               <YAxis />
//               <Tooltip />
//               <Bar dataKey="value" fill="#42a5f5" radius={[6, 6, 0, 0]} />
//             </BarChart>
//           </Card>
//         </Grid>

//         <Grid item xs={12} md={6}>
//           <Card sx={{ p: 3 }}>
//             <Typography variant="h6" mb={2}>Pie Chart</Typography>
//             <PieChart width={660} height={250}>
//               <Pie
//                 data={pieData}
//                 cx="50%"
//                 cy="50%"
//                 outerRadius={80}
//                 fill="#8884d8"
//                 dataKey="value"
//                 label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
//               >
//                 {pieData.map((entry, i) => (
//                   <Cell key={i} fill={COLORS[i % COLORS.length]} />
//                 ))}
//               </Pie>
//               <Tooltip />
//             </PieChart>
//           </Card>
//         </Grid>

//         <Grid item xs={12}>
//           <Card sx={{ p: 3 }}>
//             <Typography variant="h6" mb={2}>Line Chart</Typography>
//             <LineChart width={900} height={280} data={pieData}>
//               <CartesianGrid strokeDasharray="3 3" />
//               <XAxis dataKey="name" />
//               <YAxis />
//               <Tooltip />
//               <Legend />
//               <Line type="monotone" dataKey="value" stroke="#66bb6a" strokeWidth={3} />
//             </LineChart>
//           </Card>
//         </Grid>

//         {/* Data Overview */}
//         <Grid item xs={12}>
//           <Card sx={{ p: 3, borderRadius: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
//             <Typography variant="h6" mb={3} fontWeight={600}>Data Distribution Overview</Typography>
//             <Grid container spacing={2}>
//               {circleData.map((item, i) => (
//                 <Grid item xs={12} sm={4} key={i}>
//                   <Box
//                     sx={{
//                       display: 'flex',
//                       flexDirection: 'column',
//                       alignItems: 'center',
//                       p: 2,
//                       borderRadius: 2,
//                       background: '#fff',
//                       boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
//                     }}
//                   >
//                     <Box sx={{ width: 100, height: 160, mb: 2 }}>
//                       <CircularProgressbar
//                         value={item.percent}
//                         text={`${item.percent}%`}
//                         styles={buildStyles({
//                           pathColor: item.color,
//                           textColor: '#2c3e50',
//                           trailColor: '#eee',
//                           textSize: '20px',
//                           pathTransitionDuration: 0.5,
//                         })}
//                       />
//                     </Box>
//                     <Typography variant="subtitle1" fontWeight={500}>{item.name}</Typography>
//                     <Typography variant="body2" color="textSecondary">{item.value} items</Typography>
//                     <LinearProgress
//                       value={item.percent}
//                       variant="determinate"
//                       sx={{
//                         width: '100%',
//                         height: 6,
//                         borderRadius: 3,
//                         mt: 1,
//                         backgroundColor: '#eee',
//                         '& .MuiLinearProgress-bar': {
//                           backgroundColor: item.color,
//                         },
//                       }}
//                     />
//                   </Box>
//                 </Grid>
//               ))}
//             </Grid>
//           </Card>
//         </Grid>
//       </Grid>
//     </Box>
//   );
// };

// export default Dashboard;
