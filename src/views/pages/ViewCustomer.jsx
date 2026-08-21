// import React, { useState, useEffect } from 'react';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import './main.css';
// import MainCard from 'ui-component/cards/MainCard';
// import { Row, Col, Modal } from 'react-bootstrap';
// import { useParams } from 'react-router-dom';
// import axios from 'axios';
// import { API_URL, IMAGE_PATH } from 'config/constant';
// import Table from '@mui/material/Table';
// import TableBody from '@mui/material/TableBody';
// import TableCell from '@mui/material/TableCell';
// import TableContainer from '@mui/material/TableContainer';
// import TableHead from '@mui/material/TableHead';
// import TableRow from '@mui/material/TableRow';
// import Paper from '@mui/material/Paper';
// import './ViewCustomer.css';
// import { decode as base64_decode } from 'base-64';
// import { Box, Typography, Chip, Card, CardContent } from '@mui/material';
// import { useTheme } from '@mui/material/styles';
// import  Logo_Student from '../../../src/assets/images/Student_logo.png';

// const ViewCustomer = () => {
//   const { user_id } = useParams();
//   const decode_user_id = base64_decode(user_id);
  
//   const [show, setShow] = useState(false);
//   const [user_data, setUserDetails] = useState({});
//   const [activeTab, setActiveTab] = useState(0);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);
  
//   const [vehicleData, setVehicleData] = useState([]);
//   const [visitorData, setVisitorData] = useState([]);
//   const [preApprovedData, setPreApprovedData] = useState([]);
//   const [parkingData, setParkingData] = useState([]);
  
//   const theme = useTheme();
  

//   // Fetch user data
//   useEffect(() => {
//     const fetchUserData = async () => {
//       try {
//         setIsLoading(true);
//         const response = await axios.get(`${API_URL}get_student/${decode_user_id}`);
        
//         if (response.data.success) {
//           setUserDetails(response.data.data);
          
        
//         } else {
//           setError(response.data.msg || 'Failed to fetch user data');
//         }
//       } catch (error) {
//         console.error('Error fetching user data:', error);
//         setError('An error occurred while fetching data');
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     if (decode_user_id) {
//       fetchUserData();
//     }
//   }, [decode_user_id]);

//   const handleClose = () => setShow(false);
//   const handleShow = () => setShow(true);

//   const renderTable = (data, columns, emptyMessage) => {
//     if (isLoading) {
//       return (
//         <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
//           <Typography>Loading...</Typography>
//         </Box>
//       );
//     }

//     if (error) {
//       return (
//         <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
//           <Typography color="error">{error}</Typography>
//         </Box>
//       );
//     }

//     return (
//       <TableContainer component={Paper} sx={{ mt: 2, borderRadius: 2 }}>
//         <Table stickyHeader aria-label="sticky table">
//           <TableHead>
//             <TableRow>
//               {columns.map((column) => (
//                 <TableCell
//                   key={column.id}
//                   align={column.align}
//                   style={{ 
//                     minWidth: column.minWidth,
//                     backgroundColor: theme.palette.primary.main,
//                     color: '#fff',
//                     fontWeight: 'bold'
//                   }}
//                 >
//                   {column.label}
//                 </TableCell>
//               ))}
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {data.length > 0 ? (
//               data.map((row, index) => (
//                 <TableRow 
//                   hover 
//                   key={index}
//                   sx={{ 
//                     '&:nth-of-type(odd)': { backgroundColor: '#f9f9f9' },
//                     '&:hover': { backgroundColor: '#f5f5f5' }
//                   }}
//                 >
//                   {columns.map((column) => (
//                     <TableCell key={column.id} align={column.align}>
//                       {row[column.id] || 'NA'}
//                     </TableCell>
//                   ))}
//                 </TableRow>
//               ))
//             ) : (
//               <TableRow>
//                 <TableCell colSpan={columns.length} align="center" sx={{ py: 3 }}>
//                   <Typography variant="body1" color="text.secondary">
//                     {emptyMessage}
//                   </Typography>
//                 </TableCell>
//               </TableRow>
//             )}
//           </TableBody>
//         </Table>
//       </TableContainer>
//     );
//   };



//   if (isLoading && !Object.keys(user_data).length) {
//     return (
//       <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
//         <Typography>Loading user information...</Typography>
//       </Box>
//     );
//   }

//   return (
//     <Box sx={{ p: 3 }}>
//       <MainCard title="Customer Profile">
//         <Row>
//           {/* Profile Image Column */}
//           <Col lg={4} md={6} className="mb-3">
//             <Card sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', p: 2 }}>
//               <Box sx={{ textAlign: 'center' }}>
//                 <img
//                   src={Logo_Student}   
//                   alt={user_data.name || 'User'}
//                   style={{ 
//                     width: '200px', 
//                     height: '200px', 
//                     borderRadius: '50%', 
//                     objectFit: 'cover',
//                     cursor: 'pointer',
//                     border: `4px solid ${theme.palette.primary.main}`,
//                     boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
//                   }}
//                   onClick={handleShow}
//                 />
//                 <Typography variant="h6" sx={{ mt: 2, fontWeight: 'bold' }}>
//                   {user_data.name || 'NA'}
//                 </Typography>
//                 <Typography variant="body2" color="text.secondary">
//                   {user_data.email || 'NA'}
//                 </Typography>
//               </Box>
//             </Card>
//           </Col>

//           {/* User Details Column */}
//           <Col lg={8} md={6}>
//             <Card sx={{ height: '100%' }}>
//               <CardContent>
//                 <Typography variant="h6" sx={{ mb: 3, color: theme.palette.primary.main, fontWeight: 'bold' }}>
//                   Student Information
//                 </Typography>
                
//                 <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2 }}>
//                   <DetailItem label="Full Name" value={user_data.name} />
//                   <DetailItem label="Email" value={user_data.email} />
//                   <DetailItem label="Mobile No" value={user_data.mobile} />
                 
//                   <DetailItem label="Create Date & Time" value={user_data.createtime} />
//                 </Box>

              
//               </CardContent>
//             </Card>
//           </Col>
//         </Row>

      
//       </MainCard>

      
//     </Box>
//   );
// };

// // Helper component for detail items
// const DetailItem = ({ label, value }) => (
//   <Box>
//     <Typography variant="caption" color="text.secondary" display="block">
//       {label}
//     </Typography>
//     <Typography variant="body1" sx={{ fontWeight: 500 }}>
//       {value || 'NA'}
//     </Typography>
//   </Box>
// );



// export default ViewCustomer;



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
import { Box, Typography, Chip, Card, CardContent, Grid, Divider, Avatar, Stack, alpha, useTheme } from '@mui/material';
import { styled } from '@mui/material/styles';
import Logo_Student from '../../../src/assets/images/Student_logo.png';
import { fontSize } from '@mui/system';

// Styled components for modern look
const StatCard = styled(Card)(({ theme }) => ({
  padding: theme.spacing(2, 3),
  borderRadius: 16,
  background: 'linear-gradient(145deg, #ffffff 0%, #f8faff 100%)',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)',
  border: '1px solid rgba(226, 232, 240, 0.6)',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 8px 30px rgba(0, 0, 0, 0.08)',
  },
}));

const InfoChip = styled(Chip)(({ theme }) => ({
  borderRadius: 8,
  fontWeight: 600,
  fontSize: '0.75rem',
  height: 28,
}));

const DetailItem = ({ label, value }) => (
  <Box sx={{ py: 1 }}>
    <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500, display: 'block', fontSize: '16px', textTransform: 'uppercase', letterSpacing: 0.5 }}>
      {label}
    </Typography>
    <Typography variant="body1" sx={{ fontWeight: 600, color: '#f2f4f1a9' }}>
      {value || 'NA'}
    </Typography>
  </Box>
);

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

  const getStatusColor = (status) => {
    const statusMap = {
      1: { label: 'Active', color: '#22c55e' },
      2: { label: 'Inactive', color: '#ef4444' },
      3: { label: 'Active', color: '#22c55e' },
    };
    return statusMap[status] || { label: 'Unknown', color: '#94a3b8' };
  };

  const statusInfo = getStatusColor(user_data.student_status);

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, bgcolor: '#f4f7fc', minHeight: '100vh' }}>
      <MainCard 
        title="Student Profile" 
        sx={{ 
          borderRadius: 4, 
          boxShadow: '0 8px 40px rgba(0,0,0,0.05)',
          border: '1px solid #eef2f6'
        }}
      >
        {/* ===== TOP SUMMARY CARDS - Important Info ===== */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ 
                  width: 48, 
                  height: 48, 
                  borderRadius: 2, 
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <i className="fas fa-graduation-cap" style={{ color: theme.palette.primary.main, fontSize: 20 }} />
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500, display: 'block' }}>
                    Course
                  </Typography>
                  <Typography variant="h6" sx={{ fontSize: "30px" ,fontWeight: 700, lineHeight: 1.2, color: '#35c522' }}>
                    {user_data.course_name || 'NA'}
                  </Typography>
                </Box>
              </Box>
            </StatCard>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <StatCard>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ 
                  width: 48, 
                  height: 48, 
                  borderRadius: 2, 
                  bgcolor: alpha('#22c55e', 0.1),
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <i className="fas fa-wallet" style={{ color: '#22c55e', fontSize: 20 }} />
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500, display: 'block' }}>
                    Total Fees
                  </Typography>
                  <Typography variant="h6" sx={{ fontSize: "30px" ,fontWeight: 700, lineHeight: 1.2, color: '#35c522' }}>
                    ₹{user_data.total_fees?.toLocaleString() || 0}
                  </Typography>
                </Box>
              </Box>
            </StatCard>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <StatCard>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ 
                  width: 48, 
                  height: 48, 
                  borderRadius: 2, 
                  bgcolor: alpha('#f59e0b', 0.1),
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <i className="fas fa-clock" style={{ color: '#f59e0b', fontSize: 20 }} />
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500, display: 'block' }}>
                    Pending
                  </Typography>
                  <Typography variant="h6" sx={{ fontSize: "30px" ,fontWeight: 700, lineHeight: 1.2, color: '#d5dd3b' }}>
                    ₹{user_data.fees_pending?.toLocaleString() || 0}
                  </Typography>
                </Box>
              </Box>
            </StatCard>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <StatCard>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ 
                  width: 48, 
                  height: 48, 
                  borderRadius: 2, 
                  bgcolor: alpha(statusInfo.color, 0.1),
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <i className="fas fa-circle" style={{ color: statusInfo.color, fontSize: 16 }} />
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500, display: 'block' }}>
                    Status
                  </Typography>
                  <Typography variant="h6" sx={{ fontSize: "30px" ,fontWeight: 700, lineHeight: 1.2, color: '#35c522' }}>
                    {statusInfo.label}
                  </Typography>
                </Box>
              </Box>
            </StatCard>
          </Grid>
        </Grid>

        {/* ===== PROFILE HEADER ===== */}
        <Grid container spacing={4} sx={{ mb: 4 }}>
          <Grid item xs={12} md={4} lg={3}>
            <Card sx={{ 
              borderRadius: 4, 
              p: 3, 
              textAlign: 'center',
              boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
              border: '1px solid #eef2f6',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Avatar
                src={Logo_Student}
                alt={user_data.name || 'User'}
                sx={{
                  width: 140,
                  height: 140,
                  cursor: 'pointer',
                  border: `4px solid ${theme.palette.primary.main}`,
                  boxShadow: '0 8px 30px rgba(0,0,0,0.1)',
                  '&:hover': { transform: 'scale(1.02)' },
                  transition: 'transform 0.2s',
                }}
                onClick={handleShow}
              />
              <Typography variant="h5" sx={{ mt: 2, fontWeight: 700 }}>
                {user_data.name || 'NA'}
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {user_data.email || 'NA'}
              </Typography>
              <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                <InfoChip 
                  label={`ID: ${user_data.user_id}`} 
                  size="small"
                  sx={{ bgcolor: alpha(theme.palette.primary.main, 0.08), color: theme.palette.primary.main }}
                />
                <InfoChip 
                  label={user_data.mobile || 'NA'} 
                  size="small"
                  sx={{ bgcolor: alpha('#22c55e', 0.08), color: '#22c55e' }}
                />
              </Stack>
            </Card>
          </Grid>

          <Grid item xs={12} md={8} lg={9}>
            <Card sx={{ 
              borderRadius: 4, 
              p: 3,
              boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
              border: '1px solid #eef2f6',
              height: '100%'
            }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: theme.palette.primary.main }}>
                <i className="fas fa-user-graduate" style={{ marginRight: 8 }} />
                Student Information
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <DetailItem label="Full Name" value={user_data.name}  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <DetailItem label="Email" value={user_data.email} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <DetailItem label="Mobile Number" value={user_data.mobile} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <DetailItem label="Parent Contact" value={user_data.parent_contact} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <DetailItem label="Date of Birth" value={user_data.dob ? new Date(user_data.dob).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : 'NA'} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <DetailItem label="Gender" value={user_data.gender === 1 ? 'Male' : user_data.gender === 2 ? 'Female' : 'NA'} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <DetailItem label="Qualification" value={user_data.qualification} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <DetailItem label="Admission Date" value={user_data.date_of_admission ? new Date(user_data.date_of_admission).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : 'NA'} />
                </Grid>
                <Grid item xs={12}>
                  <DetailItem label="Address" value={user_data.address?.replace(/\n/g, ', ')} />
                </Grid>
              </Grid>
            </Card>
          </Grid>
        </Grid>

        {/* ===== FEES & PAYMENT DETAILS ===== */}
        <Card sx={{ 
          borderRadius: 4, 
          p: 3, 
          mb: 4,
          boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
          border: '1px solid #eef2f6'
        }}>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 3, color: theme.palette.primary.main }}>
            <i className="fas fa-file-invoice-dollar" style={{ marginRight: 8 }} />
            Fees & Payment Details
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12} sm={4}>
              <Box sx={{ p: 2, bgcolor: alpha(theme.palette.primary.main, 0.04), borderRadius: 3 }}>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500, display: 'block' }}>
                  Total Fees
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                  ₹{user_data.total_fees?.toLocaleString() || 0}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Box sx={{ p: 2, bgcolor: alpha('#22c55e', 0.04), borderRadius: 3 }}>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500, display: 'block' }}>
                  Fees Submitted
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 700, color: '#22c55e' }}>
                  ₹{user_data.fees_submitted?.toLocaleString() || 0}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Box sx={{ p: 2, bgcolor: alpha('#f59e0b', 0.04), borderRadius: 3 }}>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500, display: 'block' }}>
                  Fees Pending
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 700, color: '#f59e0b' }}>
                  ₹{user_data.fees_pending?.toLocaleString() || 0}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <DetailItem label="Payment Mode" value={user_data.payment_mode} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <DetailItem label="Payment Date" value={user_data.payment_date ? new Date(user_data.payment_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : 'NA'} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <DetailItem label="Registration Fee" value={`₹${user_data.registration_fee || 0}`} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <DetailItem label="Student Status" value={
                <Chip 
                  label={statusInfo.label} 
                  size="small"
                  sx={{ 
                    bgcolor: alpha(statusInfo.color, 0.1), 
                    color: statusInfo.color,
                    fontWeight: 600
                  }} 
                />
              } />
            </Grid>
          </Grid>
        </Card>

        {/* ===== ADDITIONAL INFORMATION ===== */}
        <Card sx={{ 
          borderRadius: 4, 
          p: 3,
          boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
          border: '1px solid #eef2f6'
        }}>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 3, color: theme.palette.primary.main }}>
            <i className="fas fa-ellipsis-h" style={{ marginRight: 8 }} />
            Additional Information
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <DetailItem label="User ID" value={user_data.user_id} />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <DetailItem label="Admission Type" value={user_data.admission_type === 1 ? 'Regular' : user_data.admission_type === 2 ? 'Distance' : 'NA'} />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <DetailItem label="Enquiry Type" value={user_data.enquiry_type || 'NA'} />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <DetailItem label="Reference By" value={user_data.reference_by || 'NA'} />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <DetailItem label="Batch Timing" value={user_data.batch_timing || 'NA'} />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <DetailItem label="Created" value={user_data.createtime} />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <DetailItem label="Last Updated" value={user_data.updatetime} />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <DetailItem label="Active Flag" value={user_data.active_flag === 1 ? 'Yes' : 'No'} />
            </Grid>
          </Grid>
        </Card>

        {/* ===== MODAL FOR IMAGE PREVIEW ===== */}
        <Modal show={show} onHide={handleClose} centered>
          <Modal.Header closeButton>
            <Modal.Title>{user_data.name || 'Student'}</Modal.Title>
          </Modal.Header>
          <Modal.Body className="text-center">
            <img
              src={Logo_Student}
              alt={user_data.name || 'User'}
              style={{ maxWidth: '100%', maxHeight: '70vh', borderRadius: 8 }}
            />
          </Modal.Body>
          <Modal.Footer>
            <button className="btn btn-secondary" onClick={handleClose}>
              Close
            </button>
          </Modal.Footer>
        </Modal>

      </MainCard>
    </Box>
  );
};

export default ViewCustomer;