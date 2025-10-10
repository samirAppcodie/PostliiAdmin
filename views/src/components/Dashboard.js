import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Card,
  Typography,
  Grid,
  Box,
  LinearProgress
} from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import ImageIcon from '@mui/icons-material/Image';
import { useNavigate } from 'react-router-dom';
import Profile from '../components/Profile';
import GroupIcon from '@mui/icons-material/Group';
import PersonIcon from '@mui/icons-material/Person';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid,
  PieChart, Pie, Cell, LineChart, Line, Legend,
} from 'recharts';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
 
const Dashboard = () => {
  const navigate = useNavigate();
  const [data, setData] = useState({
    totalUsers: 0,
    trialUsers: 0,
    subscribedUsers: 0,
    videoCounts: [],
    imageCounts: []
  });
 
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await axios.get('/api/dashboard');
        setData(response.data);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      }
    };
    fetchDashboardData();
  }, []);
 
  const totalVideos = data.videoCounts.reduce((sum, v) => sum + v.totalVideos, 0);
  const totalImages = data.imageCounts.reduce((sum, img) => sum + img.totalImages, 0);
 
  const chartData = [
    { name: 'Users', value: data.totalUsers },
    { name: 'Videos', value: totalVideos },
    { name: 'Images', value: totalImages },
  ];
 
  const COLORS = ['#8E2DE2', '#00F260', '#FF416C'];
 
  // ✅ Compute circular overview data
  const total = chartData.reduce((sum, item) => sum + item.value, 0);
  const circleData = chartData.map((item, i) => ({
    ...item,
    percent: total > 0 ? Math.round((item.value / total) * 100) : 0,
    color: COLORS[i],
  }));
 
  // ✅ Card Styles
  const cardBaseStyle = {
    color: '#f1ebebff',
    height: '180px',
    width: '280px',
    borderRadius: '20px',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '10px 15px',
    fontWeight: '400',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    boxShadow: '0 8px 20px rgba(0,0,0,0.35)',
    '&:hover': {
      transform: 'translateY(-10px)',
      boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
    },
    overflow: 'visible',
    flexShrink: 0
  };
 
  const cardTextStyle = {
    textAlign: 'right',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    height: '100%',
    '& h6': { fontWeight: 700, wordBreak: 'break-word' },
    '& h4': { fontWeight: 700 },
  };
 
  const cardGradients = [
    'linear-gradient(135deg, #8E2DE2, #4A00E0)',
    'linear-gradient(135deg, #00F260, #0575E6)',
    'linear-gradient(135deg, #FF416C, #FF4B2B)',
  ];
 
  // ✅ All cards (kept same — includes category-wise)
  const allCards = [
    { title: 'Total Users', value: data.totalUsers, icon: <GroupIcon sx={{ fontSize: 62, flexShrink: 0 }}/> },
    { title: 'Trial Users', value: data.trialUsers, icon: <PersonIcon sx={{ fontSize: 62, flexShrink: 0 }} /> },
    { title: 'Subscribed Users', value: data.subscribedUsers, icon: <AccountCircleIcon sx={{ fontSize: 62, flexShrink: 0 }} /> },
    { title: 'Total Videos', value: totalVideos, icon: <VideoLibraryIcon sx={{ fontSize: 62, flexShrink: 0 }} />},
    ...data.videoCounts.map(v => ({
      title: v._id,
      value: v.totalVideos,
      icon: <VideoLibraryIcon sx={{ fontSize: 62, flexShrink: 0 }} />
    })),
    { title: 'Total Images', value: totalImages, icon: <ImageIcon sx={{ fontSize: 62, flexShrink: 0 }}/>},
    ...data.imageCounts.map(img => ({
      title: img._id,
      value: img.totalImages,
      icon: <ImageIcon sx={{ fontSize: 62, flexShrink: 0 }}/>
    }))
  ];
 
  return (
    <div style={{ padding: '30px', minHeight: '100vh', background: 'linear-gradient(180deg, #1E1E2F, #4B4F7A)' }}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" style={{ color: '#fff', fontWeight: 700 }}>
          📊 Admin Dashboard
        </Typography>
        <Profile />
      </Box>
 
      {/* ✅ Cards Grid */}
      <Grid container spacing={3}>
        {allCards.map((item, i) => (
          <Grid
            item
            key={i}
            xs={12}
            sm={6}
            md={4}
            lg={3}
            xl={2}
            sx={{ display: 'flex', justifyContent: 'center' }}
          >
            <Card sx={{
              ...cardBaseStyle,
              background: cardGradients[i % cardGradients.length],
              cursor: item.title === 'Total Users' ? 'pointer' : 'default'
            }}
              onClick={() => {
                if (item.title === 'Total Users') navigate('/users');
              }}
            >
              <Box sx={{ flexShrink: 0 }}>{item.icon}</Box>
              <Box sx={{ ...cardTextStyle }}>
                <Typography variant="h6">{item.title}</Typography>
                <Typography variant="h4">{item.value}</Typography>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>
 
      {/* ✅ Charts Section */}
      <Grid container spacing={3} mt={4}>
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 3, borderRadius: 3, background: '#2A2A3D', color: '#fff' }}>
            <Typography variant="h6" mb={2}>Bar Chart</Typography>
            <BarChart width={660} height={250} data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#444" />
              <XAxis dataKey="name" stroke="white" />
              <YAxis stroke="white" />
              <Tooltip />
              <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`bar-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </Card>
        </Grid>
 
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 3, borderRadius: 3, background: '#2A2A3D', color: '#fff' }}>
            <Typography variant="h6" mb={2}>Pie Chart</Typography>
            <PieChart width={660} height={250}>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="value"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {chartData.map((entry, i) => (
                  <Cell key={`pie-${i}`} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </Card>
        </Grid>
 
       <Grid container spacing={2}>
  {/* Line Chart */}
  <Grid item xs={12} md={8}>
    <Card sx={{ p: 3, borderRadius: 3, background: '#2A2A3D', color: '#fff', height: '100%' }}>
      <Typography variant="h6" mb={2}>Line Chart</Typography>
      <LineChart width={800} height={280} data={chartData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#444" />
        <XAxis dataKey="name" stroke="white" />
        <YAxis stroke="white" />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="value" stroke="#8E2DE2" strokeWidth={3} />
      </LineChart>
    </Card>
  </Grid>
 
  {/* Data Distribution Overview */}
 <Grid item xs={12} md={4}>
  <Card sx={{ p: 3, borderRadius: 3, background: '#2A2A3D', color: 'white', height: '100%' }}>
    <Typography
      variant="h6"
      mb={2}
      sx={{ color: 'white', fontWeight: 700, textAlign: 'center' }}
    >
      Data Distribution Overview
    </Typography>
 
    <Grid container spacing={2} justifyContent="center">
      {circleData.map((item, i) => (
        <Grid item xs={12} key={i}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              background: '#1E1E2F',
              borderRadius: 2,
              p: 2,
              gap: 1.5,
              width: '165px',  // increased width
              maxWidth: '350px', // keep uniform
              height: 200,
              margin: '0 auto',
              boxShadow: '0 2px 6px rgba(0,0,0,0.25)',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              '&:hover': {
                transform: 'translateY(-3px)',
                boxShadow: '0 6px 16px rgba(0,0,0,0.4)',
              },
            }}
          >
            {/* Circular Chart */}
            <Box sx={{ width: 70, height: 70 }}>
              <CircularProgressbar
                value={item.percent}
                text={`${item.percent}%`}
                styles={buildStyles({
                  pathColor: item.color,
                  textColor: 'white',
                  trailColor: '#444',
                  textSize: '18px',
                })}
              />
            </Box>
 
            {/* Text + Progress */}
            <Box sx={{ width: '100%', textAlign: 'center' }}>
              <Typography variant="subtitle1" fontWeight={600} sx={{ color: 'white' }}>
                {item.name}
              </Typography>
              <Typography variant="body2" sx={{ color: '#bbb', mb: 1 }}>
                {item.value} items
              </Typography>
 
              <LinearProgress
                variant="determinate"
                value={item.percent}
                sx={{
                  height: 6,
                  borderRadius: 3,
                  backgroundColor: '#555',
                  '& .MuiLinearProgress-bar': { backgroundColor: item.color },
                }}
              />
            </Box>
          </Box>
        </Grid>
      ))}
    </Grid>
  </Card>
</Grid>
 
</Grid>
 
 
 
      </Grid>
    </div>
  );
};
 
export default Dashboard;