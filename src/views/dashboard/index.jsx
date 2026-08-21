/* eslint-disable no-dupe-keys */
import { useEffect, useState } from 'react';

// material-ui
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import { Box, CircularProgress, Alert, Snackbar, Chip } from '@mui/material';

// icons
import PeopleIcon from '@mui/icons-material/People';
import SchoolIcon from '@mui/icons-material/School';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import PaymentIcon from '@mui/icons-material/Payment';
import PersonIcon from '@mui/icons-material/Person';
import GroupsIcon from '@mui/icons-material/Groups';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import DownloadIcon from '@mui/icons-material/Download';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import NoteIcon from '@mui/icons-material/Note';
import RefreshIcon from '@mui/icons-material/Refresh';

// project imports
import { gridSpacing } from 'store/constant';
import axios from 'axios';
import { API_URL, APP_PREFIX_PATH } from 'config/constant';
import { styled } from '@mui/material/styles';
import { Link, useNavigate } from 'react-router-dom';

// Styled Components
const StyledCard = styled(Card)(({ theme, borderColor }) => ({
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
    borderLeft: `4px solid ${borderColor || '#60a5fa'}`,
    height: '100%',
    transition: 'all 0.3s ease-in-out',
    cursor: 'pointer',
    backgroundColor: '#0f0f1a',
    border: `1px solid #2d2d44`,
    '&:hover': {
        transform: 'translateY(-5px)',
        boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
        borderColor: borderColor || '#60a5fa',
    }
}));

const StatCard = ({ title, value, icon, change, color, subtitle, loading }) => (
    <StyledCard borderColor={color}>
        <CardContent style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}>
                    <Typography variant="body2" style={{ 
                        color: '#6b7280',
                        fontWeight: 600,
                        textTransform: 'uppercase',
                        fontSize: '0.75rem',
                        letterSpacing: '0.5px',
                        marginBottom: '8px'
                    }}>
                        {title}
                    </Typography>
                    {loading ? (
                        <CircularProgress size={24} sx={{ color: '#3268f1' }} />
                    ) : (
                        <Typography variant="h4" style={{ 
                            fontWeight: 700,
                            color: '#ffffff',
                            marginBottom: '4px',
                            fontSize: '1.75rem'
                        }}>
                            {typeof value === 'string' && value.startsWith('₹') ? value : 
                             typeof value === 'number' ? `₹${value.toLocaleString()}` : value}
                        </Typography>
                    )}
                    {subtitle && (
                        <Typography variant="caption" style={{ color: '#6b7280' }}>
                            {subtitle}
                        </Typography>
                    )}
                    {change !== undefined && change !== null && (
                        <div style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            marginTop: '8px',
                            backgroundColor: change >= 0 ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                            padding: '4px 8px',
                            borderRadius: '12px',
                            width: 'fit-content'
                        }}>
                            {change >= 0 ? 
                                <ArrowUpwardIcon style={{ fontSize: '14px', color: '#10B981', marginRight: '4px' }} /> : 
                                <ArrowDownwardIcon style={{ fontSize: '14px', color: '#EF4444', marginRight: '4px' }} />
                            }
                            <Typography variant="caption" style={{ 
                                color: change >= 0 ? '#10B981' : '#EF4444',
                                fontWeight: 600
                            }}>
                                {change >= 0 ? '+' : ''}{change}%
                            </Typography>
                        </div>
                    )}
                </div>
                <div style={{
                    backgroundColor: `${color}20`,
                    borderRadius: '50%',
                    width: '56px',
                    height: '56px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    {icon}
                </div>
            </div>
        </CardContent>
    </StyledCard>
);

const Dashboard = () => {

    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [userName , setUserName ] = useState(true);
    
    const [dashboardData, setDashboardData] = useState({
        totalStudents: 0,
        monthlyStudents: 0,
        totalFaculty: 0,
        facultySalary: 0,
        feesCollection: 0,
        pendingFees: 0,
        totalRevenue: 0,
        netProfit: 0,
        totalNotes: 0,
        recentTransactions: []
    });
    const [error, setError] = useState(null);
    const [currentMonth, setCurrentMonth] = useState('');
    const [refreshing, setRefreshing] = useState(false);

    

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour >= 5 && hour < 12) return "Good Morning";
        else if (hour >= 12 && hour < 17) return "Good Afternoon";
        else if (hour >= 17 && hour < 21) return "Good Evening";
        else return "Good Night";
    };

    const fetchDashboardData = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(`${API_URL}dashboard/stats`);
            if (response.data.success) {
                setDashboardData(response.data.data);
                setCurrentMonth(response.data.current_month || '');
            } else {
                setError('Failed to fetch dashboard data');
            }
        } catch (err) {
            console.error('Error fetching dashboard:', err);
            setError('Error fetching dashboard data. Please try again.');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();

        const user = sessionStorage.getItem('name') || "Admin";
        setUserName(user);
    }, []);

    const handleRefresh = () => {
        setRefreshing(true);
        fetchDashboardData();
    };

    // Get status chip color
    const getStatusColor = (status) => {
        switch(status) {
            case 'Paid': return 'success';
            case 'Pending': return 'warning';
            default: return 'default';
        }
    };

    return (
        <Box sx={{ 
            padding: '24px',
            backgroundColor: '#0a0a14',
            minHeight: '100vh'
        }}>
            {/* Header Section */}
            <Box sx={{ 
                backgroundColor: '#0f0f1a', 
                borderRadius: '12px', 
                padding: '24px',
                marginBottom: '24px',
                border: '1px solid #2d2d44'
            }}>
                <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: 2
                }}>
                    <Box>
                        <Typography variant="h4" sx={{
                            color: '#ffffff',
                            fontWeight: 700,
                            fontFamily: 'Poppins, sans-serif',
                            marginBottom: '4px'
                        }}>
                            Coaching Desk Dashboard
                        </Typography>
                        <Typography variant="body1" sx={{
                            color: '#6b7280',
                            fontSize: '14px',
                            marginTop: '6px'
                        }}>
                            {getGreeting()}, <span style={{ fontWeight: 500, color: '#3268f1' }}>{userName}</span>! Here's what's happening today.
                        </Typography>
                        {currentMonth && (
                            <Chip 
                                label={`📅 ${currentMonth}`} 
                                size="small"
                                sx={{ 
                                    mt: 1,
                                    backgroundColor: 'rgba(50, 104, 241, 0.1)',
                                    color: '#3268f1',
                                    border: '1px solid rgba(50, 104, 241, 0.3)'
                                }}
                            />
                        )}
                    </Box>
                    <Box sx={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                        <Button 
                            variant="outlined" 
                            startIcon={<RefreshIcon />}
                            onClick={handleRefresh}
                            disabled={refreshing}
                            sx={{ 
                                borderRadius: '8px',
                                textTransform: 'none',
                                borderColor: '#2d2d44',
                                color: '#ffffff',
                                '&:hover': {
                                    borderColor: '#3268f1',
                                    backgroundColor: 'rgba(50, 104, 241, 0.1)'
                                }
                            }}
                        >
                            {refreshing ? 'Refreshing...' : 'Refresh'}
                        </Button>
                        <Button 
                            variant="contained" 
                            startIcon={<DownloadIcon />}
                            sx={{ 
                                borderRadius: '8px',
                                textTransform: 'none',
                                backgroundColor: '#3268f1',
                                '&:hover': {
                                    backgroundColor: '#2851c4'
                                }
                            }}
                        >
                            Export Report
                        </Button>
                        <IconButton sx={{ 
                            backgroundColor: 'rgba(50, 104, 241, 0.1)',
                            borderRadius: '8px',
                            color: '#3268f1'
                        }}>
                            <NotificationsActiveIcon />
                        </IconButton>
                    </Box>
                </Box>
            </Box>

            {error && (
                <Alert severity="error" sx={{ mb: 2, backgroundColor: 'rgba(244, 67, 54, 0.1)', color: '#ef5350' }}>
                    {error}
                </Alert>
            )}

            {/* Main Stats Grid */}
            <Grid container spacing={gridSpacing} sx={{ marginBottom: '24px' }}>
               {/* <Link to={`${APP_PREFIX_PATH}/`}> */}
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="Total Students"
                        value={dashboardData.totalStudents}
                        icon={<PeopleIcon sx={{ fontSize: '28px', color: '#60a5fa' }} />}
                        color="#60a5fa"
                        subtitle="Total admissions"
                        loading={loading}
                    />
                </Grid>
               {/* </Link> */}
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="This Month Students"
                        value={dashboardData.monthlyStudents}
                        icon={<GroupsIcon sx={{ fontSize: '28px', color: '#10B981' }} />}
                        color="#10B981"
                        subtitle="New admissions this month"
                        loading={loading}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="Total Faculty"
                        value={dashboardData.totalFaculty}
                        icon={<PersonIcon sx={{ fontSize: '28px', color: '#8B5CF6' }} />}
                        color="#8B5CF6"
                        subtitle="Teaching staff"
                        loading={loading}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="Net Profit"
                        value={dashboardData.netProfit}
                        icon={<TrendingUpIcon sx={{ fontSize: '28px', color: '#059669' }} />}
                        change={dashboardData.netProfit > 0 ? 22 : -5}
                        color="#059669"
                        subtitle="After expenses"
                        loading={loading}
                    />
                </Grid>
            </Grid>

            {/* Financial Stats Grid */}
            <Grid container spacing={gridSpacing} sx={{ marginBottom: '24px' }}>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="Fees Collection"
                        value={dashboardData.feesCollection}
                        icon={<PaymentIcon sx={{ fontSize: '28px', color: '#6366F1' }} />}
                        change={15}
                        color="#6366F1"
                        subtitle="This month"
                        loading={loading}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="Pending Fees"
                        value={dashboardData.pendingFees}
                        icon={<AccountBalanceWalletIcon sx={{ fontSize: '28px', color: '#F59E0B' }} />}
                        change={-5}
                        color="#F59E0B"
                        subtitle="To be collected"
                        loading={loading}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="Faculty Salary"
                        value={dashboardData.facultySalary}
                        icon={<AttachMoneyIcon sx={{ fontSize: '28px', color: '#EC4899' }} />}
                        color="#EC4899"
                        subtitle="Monthly expenditure"
                        loading={loading}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="Total Revenue"
                        value={dashboardData.totalRevenue}
                        icon={<CurrencyRupeeIcon sx={{ fontSize: '28px', color: '#059669' }} />}
                        change={18}
                        color="#059669"
                        subtitle="This financial year"
                        loading={loading}
                    />
                </Grid>
            </Grid>

            {/* Quick Stats Bar */}
            <Grid container spacing={gridSpacing} sx={{ marginBottom: '24px' }}>
                <Grid item xs={12} sm={6}>
                    <StyledCard borderColor="#F59E0B">
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Box>
                                    <Typography variant="body2" sx={{ color: '#6b7280', fontWeight: 500 }}>
                                        📝 Total Notes
                                    </Typography>
                                    {loading ? (
                                        <CircularProgress size={24} sx={{ color: '#3268f1' }} />
                                    ) : (
                                        <Typography variant="h4" sx={{ fontWeight: 700, color: '#ffffff' }}>
                                            {dashboardData.totalNotes}
                                        </Typography>
                                    )}
                                </Box>
                                <Box sx={{
                                    backgroundColor: 'rgba(245, 158, 11, 0.1)',
                                    borderRadius: '8px',
                                    padding: '8px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    <NoteIcon sx={{ color: '#F59E0B', fontSize: '28px' }} />
                                </Box>
                            </Box>
                        </CardContent>
                    </StyledCard>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <StyledCard borderColor="#60a5fa">
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Box>
                                    <Typography variant="body2" sx={{ color: '#6b7280', fontWeight: 500 }}>
                                        📚 Attendance Today
                                    </Typography>
                                    {loading ? (
                                        <CircularProgress size={24} sx={{ color: '#3268f1' }} />
                                    ) : (
                                        <Typography variant="h4" sx={{ fontWeight: 700, color: '#ffffff' }}>
                                            92%
                                        </Typography>
                                    )}
                                </Box>
                                <Box sx={{
                                    backgroundColor: 'rgba(96, 165, 250, 0.1)',
                                    borderRadius: '8px',
                                    padding: '8px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    <MenuBookIcon sx={{ color: '#60a5fa', fontSize: '28px' }} />
                                </Box>
                            </Box>
                        </CardContent>
                    </StyledCard>
                </Grid>
            </Grid>

            {/* Two Column Layout */}
            <Grid container spacing={gridSpacing}>
                {/* Left Column - Recent Transactions */}
                <Grid item xs={12} md={8}>
                    <Card sx={{ 
                        borderRadius: '12px',
                        height: '100%',
                        backgroundColor: '#0f0f1a',
                        border: '1px solid #2d2d44'
                    }}>
                        <CardContent sx={{ padding: '24px' }}>
                            <Box sx={{ 
                                display: 'flex', 
                                justifyContent: 'space-between', 
                                alignItems: 'center',
                                marginBottom: '24px'
                            }}>
                                <Typography variant="h6" sx={{ fontWeight: 600, color: '#ffffff' }}>
                                    Recent Fee Transactions
                                </Typography>
                               <Link to={ `${APP_PREFIX_PATH}/student-list`}>
                                <Button 
                                    variant="text" 
                                    sx={{ 
                                        textTransform: 'none',
                                        color: '#3268f1',
                                        fontWeight: 500
                                    }}
                                >
                                    View All
                                </Button>
                               </Link>
                            </Box>
                            
                            <Box sx={{ overflowX: 'auto' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                    <thead>
                                        <tr style={{ borderBottom: '1px solid #2d2d44' }}>
                                            <th style={{ 
                                                textAlign: 'left', 
                                                padding: '12px 16px',
                                                color: '#6b7280',
                                                fontWeight: 500,
                                                fontSize: '0.875rem'
                                            }}>Student</th>
                                            <th style={{ 
                                                textAlign: 'left', 
                                                padding: '12px 16px',
                                                color: '#6b7280',
                                                fontWeight: 500,
                                                fontSize: '0.875rem'
                                            }}>Course</th>
                                            <th style={{ 
                                                textAlign: 'left', 
                                                padding: '12px 16px',
                                                color: '#6b7280',
                                                fontWeight: 500,
                                                fontSize: '0.875rem'
                                            }}>Amount</th>
                                            <th style={{ 
                                                textAlign: 'left', 
                                                padding: '12px 16px',
                                                color: '#6b7280',
                                                fontWeight: 500,
                                                fontSize: '0.875rem'
                                            }}>Date</th>
                                            <th style={{ 
                                                textAlign: 'left', 
                                                padding: '12px 16px',
                                                color: '#6b7280',
                                                fontWeight: 500,
                                                fontSize: '0.875rem'
                                            }}>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {loading ? (
                                            <tr>
                                                <td colSpan={5} style={{ textAlign: 'center', padding: '40px' }}>
                                                    <CircularProgress sx={{ color: '#3268f1' }} />
                                                </td>
                                            </tr>
                                        ) : dashboardData.recentTransactions.length > 0 ? (
                                            dashboardData.recentTransactions.map((transaction, index) => (
                                                <tr key={index} style={{ 
                                                    borderBottom: index < dashboardData.recentTransactions.length - 1 ? '1px solid #2d2d44' : 'none'
                                                }}>
                                                    <td style={{ padding: '16px' }}>
                                                        <Typography variant="body2" sx={{ fontWeight: 500, color: '#ffffff' }}>
                                                            {transaction.name || 'N/A'}
                                                        </Typography>
                                                    </td>
                                                    <td style={{ padding: '16px' }}>
                                                        <Typography variant="body2" sx={{ color: '#6b7280' }}>
                                                            {transaction.course_name || 'N/A'}
                                                        </Typography>
                                                    </td>
                                                    <td style={{ padding: '16px' }}>
                                                        <Typography variant="body2" sx={{ fontWeight: 600, color: '#4caf50' }}>
                                                            ₹{parseFloat(transaction.amount || 0).toLocaleString()}
                                                        </Typography>
                                                    </td>
                                                    <td style={{ padding: '16px' }}>
                                                        <Typography variant="body2" sx={{ color: '#6b7280' }}>
                                                            {transaction.date || transaction.create_datetime || 'N/A'}
                                                        </Typography>
                                                    </td>
                                                    <td style={{ padding: '16px' }}>
                                                        <Chip 
                                                            label={transaction.status || 'Pending'} 
                                                            size="small"
                                                            color={getStatusColor(transaction.status)}
                                                            sx={{ 
                                                                fontWeight: 600,
                                                                '& .MuiChip-label': {
                                                                    px: 1
                                                                }
                                                            }}
                                                        />
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={5} style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
                                                    No recent transactions
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Right Column - Upcoming Classes */}
                <Grid item xs={12} md={4}>
                    <Card sx={{ 
                        borderRadius: '12px',
                        height: '100%',
                        backgroundColor: '#0f0f1a',
                        border: '1px solid #2d2d44'
                    }}>
                        <CardContent sx={{ padding: '24px' }}>
                            <Box sx={{ 
                                display: 'flex', 
                                alignItems: 'center',
                                marginBottom: '24px'
                            }}>
                                <CalendarMonthIcon sx={{ color: '#3268f1', marginRight: '12px' }} />
                                <Typography variant="h6" sx={{ fontWeight: 600, color: '#ffffff' }}>
                                    Today's Classes
                                </Typography>
                            </Box>
                            
                            <Box>
                                {[
                                    { time: '9:00 AM', subject: 'Java Full Stack', batch: 'Java Batch A', faculty: 'Ms. Gouri Patel' },
                                    { time: '11:00 AM', subject: 'MERN Stack', batch: 'MERN Batch B', faculty: 'Suraj Gupta' },
                                    { time: '2:00 PM', subject: 'Basic Computer', batch: 'Basic Computer Batch C', faculty: 'Daman Dabiya' },
                                    { time: '4:00 PM', subject: 'Tally Master', batch: 'Tally Batch A', faculty: 'Anita Dabiya' }
                                ].map((cls, index) => (
                                    <Box key={index} sx={{
                                        backgroundColor: index === 0 ? 'rgba(50, 104, 241, 0.1)' : 'transparent',
                                        border: index === 0 ? '1px solid #3268f1' : '1px solid #2d2d44',
                                        borderRadius: '12px',
                                        padding: '16px',
                                        marginBottom: '12px',
                                        transition: 'all 0.2s',
                                        '&:hover': {
                                            borderColor: '#3268f1',
                                            boxShadow: '0 2px 8px rgba(50, 104, 241, 0.1)'
                                        }
                                    }}>
                                        <Box sx={{ 
                                            display: 'flex', 
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            marginBottom: '8px'
                                        }}>
                                            <Typography variant="subtitle2" sx={{ 
                                                fontWeight: 600,
                                                color: '#ffffff'
                                            }}>
                                                {cls.subject}
                                            </Typography>
                                            <Chip 
                                                label={cls.time} 
                                                size="small"
                                                sx={{ 
                                                    backgroundColor: index === 0 ? 'rgba(50, 104, 241, 0.2)' : 'rgba(107, 114, 128, 0.2)',
                                                    color: index === 0 ? '#3268f1' : '#6b7280',
                                                    fontWeight: 600
                                                }}
                                            />
                                        </Box>
                                        <Typography variant="body2" sx={{ color: '#6b7280', marginBottom: '4px' }}>
                                            {cls.batch}
                                        </Typography>
                                        <Box sx={{ 
                                            display: 'flex', 
                                            alignItems: 'center',
                                            marginTop: '8px'
                                        }}>
                                            <PersonIcon sx={{ fontSize: '14px', color: '#6b7280', marginRight: '6px' }} />
                                            <Typography variant="caption" sx={{ color: '#6b7280' }}>
                                                {cls.faculty}
                                            </Typography>
                                        </Box>
                                    </Box>
                                ))}
                            </Box>
                            
                            <Box sx={{ marginTop: '20px', textAlign: 'center' }}>
                                <Button 
                                    variant="outlined" 
                                    fullWidth
                                    sx={{ 
                                        borderRadius: '8px',
                                        textTransform: 'none',
                                        borderColor: '#2d2d44',
                                        color: '#ffffff',
                                        '&:hover': {
                                            borderColor: '#3268f1',
                                            backgroundColor: 'rgba(50, 104, 241, 0.1)'
                                        }
                                    }}
                                >
                                    View Full Schedule
                                </Button>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Dashboard;