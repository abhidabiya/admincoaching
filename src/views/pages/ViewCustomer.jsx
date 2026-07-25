import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './main.css';
import MainCard from 'ui-component/cards/MainCard';
import { Row, Col, Modal } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { API_URL, IMAGE_PATH } from 'config/constant';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import './ViewCustomer.css';
import { decode as base64_decode } from 'base-64';
import { Box, Typography, Chip, Card, CardContent } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import  Logo_Student from '../../../src/assets/images/Student_logo.png';

const ViewCustomer = () => {
  const { user_id } = useParams();
  const decode_user_id = base64_decode(user_id);
  
  const [show, setShow] = useState(false);
  const [user_data, setUserDetails] = useState({});
  const [activeTab, setActiveTab] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [vehicleData, setVehicleData] = useState([]);
  const [visitorData, setVisitorData] = useState([]);
  const [preApprovedData, setPreApprovedData] = useState([]);
  const [parkingData, setParkingData] = useState([]);
  
  const theme = useTheme();
  

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`${API_URL}get_student/${decode_user_id}`);
        
        if (response.data.success) {
          setUserDetails(response.data.data);
          
        
        } else {
          setError(response.data.msg || 'Failed to fetch user data');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        setError('An error occurred while fetching data');
      } finally {
        setIsLoading(false);
      }
    };

    if (decode_user_id) {
      fetchUserData();
    }
  }, [decode_user_id]);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const renderTable = (data, columns, emptyMessage) => {
    if (isLoading) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
          <Typography>Loading...</Typography>
        </Box>
      );
    }

    if (error) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
          <Typography color="error">{error}</Typography>
        </Box>
      );
    }

    return (
      <TableContainer component={Paper} sx={{ mt: 2, borderRadius: 2 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ 
                    minWidth: column.minWidth,
                    backgroundColor: theme.palette.primary.main,
                    color: '#fff',
                    fontWeight: 'bold'
                  }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.length > 0 ? (
              data.map((row, index) => (
                <TableRow 
                  hover 
                  key={index}
                  sx={{ 
                    '&:nth-of-type(odd)': { backgroundColor: '#f9f9f9' },
                    '&:hover': { backgroundColor: '#f5f5f5' }
                  }}
                >
                  {columns.map((column) => (
                    <TableCell key={column.id} align={column.align}>
                      {row[column.id] || 'NA'}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} align="center" sx={{ py: 3 }}>
                  <Typography variant="body1" color="text.secondary">
                    {emptyMessage}
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };



  if (isLoading && !Object.keys(user_data).length) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Typography>Loading user information...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <MainCard title="Customer Profile">
        <Row>
          {/* Profile Image Column */}
          <Col lg={4} md={6} className="mb-3">
            <Card sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', p: 2 }}>
              <Box sx={{ textAlign: 'center' }}>
                <img
                  src={Logo_Student}   
                  alt={user_data.name || 'User'}
                  style={{ 
                    width: '200px', 
                    height: '200px', 
                    borderRadius: '50%', 
                    objectFit: 'cover',
                    cursor: 'pointer',
                    border: `4px solid ${theme.palette.primary.main}`,
                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                  }}
                  onClick={handleShow}
                />
                <Typography variant="h6" sx={{ mt: 2, fontWeight: 'bold' }}>
                  {user_data.name || 'NA'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {user_data.email || 'NA'}
                </Typography>
              </Box>
            </Card>
          </Col>

          {/* User Details Column */}
          <Col lg={8} md={6}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 3, color: theme.palette.primary.main, fontWeight: 'bold' }}>
                  Student Information
                </Typography>
                
                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2 }}>
                  <DetailItem label="Full Name" value={user_data.name} />
                  <DetailItem label="Email" value={user_data.email} />
                  <DetailItem label="Mobile No" value={user_data.mobile} />
                 
                  <DetailItem label="Create Date & Time" value={user_data.createtime} />
                </Box>

              
              </CardContent>
            </Card>
          </Col>
        </Row>

      
      </MainCard>

      
    </Box>
  );
};

// Helper component for detail items
const DetailItem = ({ label, value }) => (
  <Box>
    <Typography variant="caption" color="text.secondary" display="block">
      {label}
    </Typography>
    <Typography variant="body1" sx={{ fontWeight: 500 }}>
      {value || 'NA'}
    </Typography>
  </Box>
);



export default ViewCustomer;