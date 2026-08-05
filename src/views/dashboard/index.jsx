/* eslint-disable no-dupe-keys */
import { useEffect, useState } from 'react';

// material-ui
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
// import Box from '@mui/material/Box';
// import LinearProgress from '@mui/material/LinearProgress';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';

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

// project imports
import { gridSpacing } from 'store/constant';

const Dashboard = () => {
    const [isLoading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(false);
    }, []);

    // Static data for dashboard
    const dashboardData = {
        totalStudents: 287,
        totalRevenueabhi: 2500000,
        
        totalFaculty: 24,
        activeBatches: 18,
        feesCollection: 425000,
        pendingFees: 187500,
        facultySalary: 325000,
        totalRevenue: 1250000,
        recentTransactions: [
            { name: 'Rahul Sharma', course: 'Basic Computer', amount: 12000, date: 'Today', status: 'Paid' },
  { name: 'Priya Patel', course: 'Tally with GST', amount: 15000, date: 'Today', status: 'Paid' },
  { name: 'Amit Kumar', course: 'MERN Stack', amount: 25000, date: 'Yesterday', status: 'Pending' },
  { name: 'Sneha Verma', course: 'Java Full Stack', amount: 30000, date: '2 days ago', status: 'Paid' },
  { name: 'Vikas Yadav', course: 'React.js', amount: 18000, date: 'Today', status: 'Paid' },
  { name: 'Anjali Singh', course: 'Node.js', amount: 20000, date: 'Yesterday', status: 'Pending' },
  { name: 'Rohit Mehta', course: 'JavaScript', amount: 10000, date: '3 days ago', status: 'Paid' },
  { name: 'Kavita Joshi', course: 'Data Science', amount: 35000, date: 'Today', status: 'Paid' },
  { name: 'Manish Gupta', course: 'Open AI & ChatGPT', amount: 22000, date: 'Yesterday', status: 'Pending' },
  { name: 'Pooja Sharma', course: 'Advanced Excel', amount: 8000, date: '4 days ago', status: 'Paid' },
  { name: 'Deepak Verma', course: 'Web Development', amount: 20000, date: 'Today', status: 'Paid' },
  { name: 'Nisha Rajput', course: 'Python Programming', amount: 18000, date: '2 days ago', status: 'Pending' }
        ],
        upcomingClasses: [
            { time: '9:00 AM', subject: 'Java Full Stack', batch: 'Java Batch A', faculty: 'Ms. Gouri Patel' },
            { time: '11:00 AM', subject: 'MERN Stack', batch: 'MERN Batch B', faculty: 'Suraj Gupta' },
            { time: '2:00 PM', subject: 'Basic Computer', batch: 'Basic Computer Batch C', faculty: 'Daman Dabiya' },
            { time: '4:00 PM', subject: 'Tally Master', batch: 'Tally Batch A', faculty: 'Anita Dabiya' }
        ]
    };

    const StatCard = ({ title, value, icon, change, color, subtitle }) => (
        <Card style={{
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
            borderLeft: `4px solid ${color}`,
            height: '100%',
            transition: 'transform 0.3s ease-in-out',
            cursor: 'pointer',
            ':hover': {
                transform: 'translateY(-5px)',
                boxShadow: '0 8px 24px rgba(0,0,0,0.1)'
            }
        }}>
            <CardContent style={{ padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                        <Typography variant="body2" style={{ 
                            color: '#dbdbdb',   // soft blue
                            fontWeight: 600,
                            textTransform: 'uppercase',
                            fontSize: '0.75rem',
                            letterSpacing: '0.5px',
                            marginBottom: '8px'
                        }}>
                            {title}
                        </Typography>
                        <Typography variant="h4" style={{ 
                            fontWeight: 700,
                            color: '#1F2937',
                            marginBottom: '4px',
                            fontSize: '1.75rem'
                        }}>
                            {title.includes('Fees') || title.includes('Revenue') || title.includes('Salary') ? `₹${value.toLocaleString()}` : value}
                        </Typography>
                        {subtitle && (
                            <Typography variant="caption" style={{ color: '#6B7280' }}>
                                {subtitle}
                            </Typography>
                        )}
                        {change && (
                            <div style={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                marginTop: '8px',
                                backgroundColor: change > 0 ? '#D1FAE5' : '#FEE2E2',
                                padding: '4px 8px',
                                borderRadius: '12px',
                                width: 'fit-content'
                            }}>
                                {change > 0 ? 
                                    <ArrowUpwardIcon style={{ fontSize: '14px', color: '#059669', marginRight: '4px' }} /> : 
                                    <ArrowDownwardIcon style={{ fontSize: '14px', color: '#DC2626', marginRight: '4px' }} />
                                }
                                <Typography variant="caption" style={{ 
                                    color: change > 0 ? '#059669' : '#DC2626',
                                    fontWeight: 600
                                }}>
                                    {change > 0 ? '+' : ''}{change}%
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
        </Card>
    );

    // const userName = user?.name || "User";
    const userName = localStorage.getItem('userName') || "User";

const getGreeting = () => {
    const hour = new Date().getHours();

    if (hour >= 5 && hour < 12) {
        return "Good Morning";
    } else if (hour >= 12 && hour < 17) {
        return "Good Afternoon";
    } else if (hour >= 17 && hour < 21) {
        return "Good Evening";
    } else {
        return "Good Night";
    }
};

    return (
        <div style={{ 
            padding: '24px',
            
            minHeight: '100vh'
        }}>
            {/* Header Section */}
            <div style={{ 
                backgroundColor: '#fffffff3', 
                borderRadius: '12px', 
                padding: '24px',
                marginBottom: '24px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.04)'
            }}>
                <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    marginBottom: '8px'
                }}>
                    <div>
                        <Typography variant="h3" style={{
                            color: '#1F2937',
                            fontWeight: 700,
                            fontFamily: 'Poppins, sans-serif',
                            marginBottom: '4px'
                        }}>
                            Coaching Desk Dashboard
                        </Typography>
                        <Typography
                               variant="body1"
                               style={{
                                color: '#7a7f89',
                                fontSize: '14px',
                                marginTop: '6px'
                             }}
                            >
                        {getGreeting()}, <span style={{ fontWeight: 500 , color: '#5caafd'  , fontSize: '15px' }}> {userName}</span>! Here's what's happening today.
                        </Typography>
                    </div>
                    <div style={{ display: 'flex', gap: '12px' }}>
                        <Button 
                            variant="outlined" 
                            startIcon={<DownloadIcon />}
                            style={{ 
                                borderRadius: '8px',
                                textTransform: 'none',
                                borderColor: '#5589d6'
                            }}
                        >
                            Export Report
                        </Button>
                        <IconButton style={{ 
                            backgroundColor: '#aee5ff44',
                            borderRadius: '8px'
                        }}>
                            <NotificationsActiveIcon />
                        </IconButton>
                    </div>
                </div>
            </div>

            {/* Main Stats Grid */}
            <Grid container spacing={gridSpacing} style={{ marginBottom: '24px' }}>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="Total Students"
                       
                        value={<span style={{ color: 'white' }}>{dashboardData.totalStudents}</span>}
                        icon={<PeopleIcon style={{ fontSize: '28px', color: '#00d8fe' }} />}
                        change={12}
                        color="#60a5fa"
                        subtitle="Active students this month"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="Total Faculty"
                
                        value={<span style={{ color: 'white' }}>{dashboardData.totalFaculty}</span>}
                        icon={<PersonIcon style={{ fontSize: '28px', color: '#10B981' }} />}
                        change={8}
                        color="#10B981"
                        subtitle="Teaching staff"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="Active Batches"
                        // value={dashboardData.activeBatches}
                        value={<span style={{ color: 'white' }}>{dashboardData.activeBatches}</span>}
                        icon={<GroupsIcon style={{ fontSize: '28px', color: '#8B5CF6' }} />}
                        color="#8B5CF6"
                        subtitle="Running classes"
                    />
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="Net Profit"
                        value={<span style={{ color: 'white' }}> { dashboardData.totalRevenue - dashboardData.facultySalary }  </span>}
                        icon={<TrendingUpIcon style={{ fontSize: '28px', color: '#059669' }} />}
                        change={22}
                        color="#059669"
                        subtitle="After expenses"
                    />
                </Grid>
               
            </Grid>

            {/* Financial Stats Grid */}
            <Grid container spacing={gridSpacing} style={{ marginBottom: '24px' }}>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="Fees Collection"
                        value={dashboardData.feesCollection}
                        icon={<PaymentIcon style={{ fontSize: '28px', color: '#6366F1' }} />}
                        change={15}
                        color="#6366F1"
                        subtitle="This month"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="Pending Fees"
                        value={dashboardData.pendingFees}
                        icon={<AccountBalanceWalletIcon style={{ fontSize: '28px', color: '#F59E0B' }} />}
                        change={-5}
                        color="#F59E0B"
                        subtitle="To be collected"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="Faculty Salary"
                        value={dashboardData.facultySalary}
                        icon={<AttachMoneyIcon style={{ fontSize: '28px', color: '#EC4899' }} />}
                        color="#EC4899"
                        subtitle="Monthly expenditure"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
    <StatCard
        title="Total Revenue"
        value={  dashboardData.totalRevenueabhi  }   
        // value={<span style={{ color: 'white' }}>₹{dashboardData.totalRevenueabhi}</span>}
        icon={<CurrencyRupeeIcon style={{ fontSize: '28px', color: '#059669' }} />}
        change={18}
        color="#059669"
        subtitle="This financial year"
    />
</Grid>
            </Grid>

            {/* Two Column Layout */}
            <Grid container spacing={gridSpacing}>
                {/* Left Column - Recent Transactions */}
                <Grid item xs={12} md={8}>
                    <Card style={{ 
                        borderRadius: '12px',
                        height: '100%'
                    }}>
                        <CardContent style={{ padding: '24px' }}>
                            <div style={{ 
                                display: 'flex', 
                                justifyContent: 'space-between', 
                                alignItems: 'center',
                                marginBottom: '24px'
                            }}>
                                <Typography variant="h6" style={{ fontWeight: 600, color: '#3c9639' }}>
                                    Recent Fee Transactions
                                </Typography>
                                <Button 
                                    variant="text" 
                                    style={{ 
                                        textTransform: 'none',
                                        color: '#60a5fa',
                                        fontWeight: 500
                                    }}
                                >
                                    View All
                                </Button>
                            </div>
                            
                            <div style={{ overflowX: 'auto' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                    <thead>
                                        <tr style={{ borderBottom: '1px solid #E5E7EB' }}>
                                            <th style={{ 
                                                textAlign: 'left', 
                                                padding: '12px 16px',
                                                color: '#6B7280',
                                                fontWeight: 500,
                                                fontSize: '0.875rem'
                                            }}>Student</th>
                                            <th style={{ 
                                                textAlign: 'left', 
                                                padding: '12px 16px',
                                                color: '#6B7280',
                                                fontWeight: 500,
                                                fontSize: '0.875rem'
                                            }}>Course</th>
                                            <th style={{ 
                                                textAlign: 'left', 
                                                padding: '12px 16px',
                                                color: '#6B7280',
                                                fontWeight: 500,
                                                fontSize: '0.875rem'
                                            }}>Amount</th>
                                            <th style={{ 
                                                textAlign: 'left', 
                                                padding: '12px 16px',
                                                color: '#6B7280',
                                                fontWeight: 500,
                                                fontSize: '0.875rem'
                                            }}>Date</th>
                                            <th style={{ 
                                                textAlign: 'left', 
                                                padding: '12px 16px',
                                                color: '#6B7280',
                                                fontWeight: 500,
                                                fontSize: '0.875rem'
                                            }}>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {dashboardData.recentTransactions.map((transaction, index) => (
                                            <tr key={index} style={{ 
                                                borderBottom: index < dashboardData.recentTransactions.length - 1 ? '1px solid #F3F4F6' : 'none',
                                                ':hover': { backgroundColor: '#F9FAFB' }
                                            }}>
                                                <td style={{ padding: '16px' }}>
                                                    <Typography variant="body2" style={{ fontWeight: 500 }}>
                                                        {transaction.name}
                                                    </Typography>
                                                </td>
                                                <td style={{ padding: '16px' }}>
                                                    <Typography variant="body2" style={{ color: '#6B7280' }}>
                                                        {transaction.course}
                                                    </Typography>
                                                </td>
                                                <td style={{ padding: '16px' }}>
                                                    <Typography variant="body2" style={{ fontWeight: 600 }}>
                                                        ₹{transaction.amount.toLocaleString()}
                                                    </Typography>
                                                </td>
                                                <td style={{ padding: '16px' }}>
                                                    <Typography variant="body2" style={{ color: '#6B7280' }}>
                                                        {transaction.date}
                                                    </Typography>
                                                </td>
                                                <td style={{ padding: '16px' }}>
                                                    <span style={{
                                                        padding: '4px 12px',
                                                        borderRadius: '12px',
                                                        fontSize: '0.75rem',
                                                        fontWeight: 600,
                                                        backgroundColor: transaction.status === 'Paid' ? '#2e6c4c' : '#f3e9b7f4',
                                                        color: transaction.status === 'Paid' ? '#7bd3b7' : '#ab7c1ec5'
                                                    }}>
                                                        {transaction.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Right Column - Upcoming Classes */}
                <Grid item xs={12} md={4}>
                    <Card style={{ 
                        borderRadius: '12px',
                        height: '100%'
                    }}>
                        <CardContent style={{ padding: '24px' }}>
                            <div style={{ 
                                display: 'flex', 
                                alignItems: 'center',
                                marginBottom: '24px'
                            }}>
                                <CalendarMonthIcon style={{ color: 'info', marginRight: '12px' }} />
                                <Typography variant="h6" style={{ fontWeight: 600, color: '#3c9639' }}>
                                    Today's Classes
                                </Typography>
                            </div>
                            
                            <div>
                                {dashboardData.upcomingClasses.map((cls, index) => (
                                    <div key={index} style={{
                                        backgroundColor: index === 0 ? '#EFF6FF' : '#FFFFFF',
                                        border: index === 0 ? '1px solid red' : '1px solid #E5E7EB',
                                        borderRadius: '12px',
                                        padding: '16px',
                                        marginBottom: '12px',
                                        transition: 'all 0.2s',
                                        ':hover': {
                                            borderColor: 'red',
                                            boxShadow: '0 2px 8px rgba(59, 130, 246, 0.1)'
                                        }
                                    }}>
                                        <div style={{ 
                                            display: 'flex', 
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            marginBottom: '8px'
                                        }}>
                                            <Typography variant="subtitle2" style={{ 
                                                fontWeight: 600,
                                                color: '#1F2937'
                                            }}>
                                                {cls.subject}
                                            </Typography>
                                            <Typography variant="caption" style={{
                                                backgroundColor: index === 0 ? '#DBEAFE' : '#F3F4F6',
                                                color: index === 0 ? '#1E40AF' : '#6B7280',
                                                padding: '2px 8px',
                                                borderRadius: '12px',
                                                fontWeight: 600
                                            }}>
                                                {cls.time}
                                            </Typography>
                                        </div>
                                        <Typography variant="body2" style={{ color: '#6B7280', marginBottom: '4px' }}>
                                            {cls.batch}
                                        </Typography>
                                        <div style={{ 
                                            display: 'flex', 
                                            alignItems: 'center',
                                            marginTop: '8px'
                                        }}>
                                            <PersonIcon style={{ fontSize: '14px', color: '#6B7280', marginRight: '6px' }} />
                                            <Typography variant="caption" style={{ color: '#6B7280' }}>
                                                {cls.faculty}
                                            </Typography>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            
                            <div style={{ marginTop: '20px', textAlign: 'center' }}>
                                <Button 
                                    variant="outlined" 
                                    fullWidth
                                    style={{ 
                                        borderRadius: '8px',
                                        textTransform: 'none',
                                        borderColor: '#5589d6'
                                    }}
                                >
                                    View Full Schedule
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Quick Stats Bar */}
            <div style={{ 
                marginTop: '24px',
                display: 'flex',
                gap: '16px',
                flexWrap: 'wrap'
            }}>
                <Card style={{ 
                    flex: 1,
                    minWidth: '200px',
                    borderRadius: '12px',
                    padding: '16px',
                    backgroundColor: '#F0F9FF',
                    border: '1px solid #BAE6FD'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div>
                            <Typography variant="body2" style={{ color: '#0369A1', fontWeight: 500 }}>
                                Attendance Today
                            </Typography>
                            <Typography variant="h5" style={{ fontWeight: 700, color: '#0C4A6E' }}>
                                92%
                            </Typography>
                        </div>
                        <div style={{
                            backgroundColor: '#BAE6FD',
                            borderRadius: '8px',
                            padding: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <MenuBookIcon style={{ color: '#0369A1' }} />
                        </div>
                    </div>
                </Card>
                
                <Card style={{ 
                    flex: 1,
                    minWidth: '200px',
                    borderRadius: '12px',
                    padding: '16px',
                    backgroundColor: '#FEFCE8',
                    border: '1px solid #FDE68A'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div>
                            <Typography variant="body2" style={{ color: '#854D0E', fontWeight: 500 }}>
                                Pending Assignments
                            </Typography>
                            <Typography variant="h5" style={{ fontWeight: 700, color: '#713F12' }}>
                                24
                            </Typography>
                        </div>
                        <div style={{
                            backgroundColor: '#FDE68A',
                            borderRadius: '8px',
                            padding: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <SchoolIcon style={{ color: '#854D0E' }} />
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default Dashboard;