/* eslint-disable react/no-unescaped-entities */
import * as React from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Button from '@mui/material/Button';
import './main.css';
import OutlinedInput from '@mui/material/OutlinedInput';
import { IconSearch } from '@tabler/icons-react';
import InputAdornment from '@mui/material/InputAdornment';
import { useTheme } from '@mui/material/styles';
import AddIcon from '@mui/icons-material/Add';
import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import axios from 'axios';
import { API_URL } from 'config/constant';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import {
    ToggleButton,
    ToggleButtonGroup,
    CircularProgress,
    Alert,
    Snackbar,
    Chip,
    Stack,
    Typography,
    Grid,
    Card,
    CardContent
} from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import PeopleIcon from '@mui/icons-material/People';
import PaymentIcon from '@mui/icons-material/Payment';
import PendingIcon from '@mui/icons-material/Pending';
import { styled } from '@mui/material/styles';

const columns = [
    { id: 'S_No', label: 'S.No.', align: 'center' },
    { id: 'name', label: 'Name', align: 'center', minWidth: "170px" },
    { id: 'course_name', label: 'Course Name', align: 'center', minWidth: "150px" },
    { id: 'total_earning', label: 'Total Earning', align: 'center', minWidth: "130px" },
    { id: 'fees_submitted', label: 'Fees Submitted', align: 'center', minWidth: "130px" },
    { id: 'fees_pending', label: 'Fees Pending', align: 'center', minWidth: "130px" },
    { id: 'payment_mode', label: 'Payment Mode', align: 'center', minWidth: "130px" },
    { id: 'payment_date', label: 'Payment Date', align: 'center' },
    { id: 'create_datetime', label: 'Create Date & Time', minWidth: "180px", align: 'center' }
];

// Styled Toggle Button with custom design
const StyledToggleButton = styled(ToggleButton)(({ theme }) => ({
    color: '#ffffff',
    backgroundColor: '#1a1a2e',
    border: '1px solid #2d2d44',
    padding: '8px 20px',
    fontWeight: 500,
    fontSize: '0.875rem',
    textTransform: 'none',
    transition: 'all 0.3s ease-in-out',
    '&:hover': {
        backgroundColor: '#3268f1 !important',
        color: '#ffffff !important',
        borderColor: '#3268f1',
        transform: 'translateY(-2px)',
        boxShadow: '0 4px 12px rgba(50, 104, 241, 0.3)',
    },
    '&.Mui-selected': {
        backgroundColor: '#3268f1 !important',
        color: '#ffffff !important',
        borderColor: '#3268f1',
        boxShadow: '0 4px 12px rgba(50, 104, 241, 0.4)',
        '&:hover': {
            backgroundColor: '#2851c4 !important',
            boxShadow: '0 6px 20px rgba(50, 104, 241, 0.5)',
            transform: 'translateY(-2px)',
        }
    },
    '&.Mui-disabled': {
        opacity: 0.6,
    },
    '&:first-of-type': {
        borderTopLeftRadius: '8px',
        borderBottomLeftRadius: '8px',
    },
    '&:last-of-type': {
        borderTopRightRadius: '8px',
        borderBottomRightRadius: '8px',
    },
    '&:not(:first-of-type)': {
        borderLeft: '1px solid #2d2d44',
    },
    '@media (max-width: 600px)': {
        padding: '6px 12px',
        fontSize: '0.75rem',
    }
}));

// Styled Toggle Button Group
const StyledToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
    backgroundColor: '#0f0f1a',
    borderRadius: '8px',
    padding: '4px',
    border: '1px solid #2d2d44',
    gap: '2px',
    '& .MuiToggleButton-root': {
        borderRadius: '6px !important',
        border: 'none',
        margin: '0 2px',
        '&:first-of-type': {
            borderRadius: '6px !important',
        },
        '&:last-of-type': {
            borderRadius: '6px !important',
        },
    },
}));

// Styled Summary Cards
const StyledCard = styled(Card)(({ theme, bgcolor }) => ({
    backgroundColor: bgcolor || '#ffffff',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
    transition: 'all 0.3s ease',
    '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
    },
    '& .MuiCardContent-root': {
        padding: '20px',
        '&:last-child': {
            paddingBottom: '20px',
        }
    },
    '& .MuiTypography-colorTextSecondary': {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        fontSize: '0.875rem',
        fontWeight: 500,
        color: '#6b7280',
    },
    '& .MuiTypography-h4': {
        fontWeight: 700,
        fontSize: '1.75rem',
        marginTop: '8px',
    }
}));

const ManageEarning = () => {
    const theme = useTheme();
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(50);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterType, setFilterType] = useState('this_month');
    const [earningsData, setEarningsData] = useState([]);
    const [summaryData, setSummaryData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [totalRecords, setTotalRecords] = useState(0);
    const [currentMonth, setCurrentMonth] = useState('');

    // Fetch earnings data
    const fetchEarnings = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(`${API_URL}get_earnings`, {
                params: {
                    page: page + 1,
                    limit: rowsPerPage,
                    search: searchQuery,
                    filter: filterType
                }
            });

            if (response.data.success) {
                setEarningsData(response.data.data || []);
                setSummaryData(response.data.summary || null);
                setTotalRecords(response.data.pagination?.total || 0);
                setCurrentMonth(response.data.current_month || '');
            } else {
                setError('Failed to fetch earnings data');
            }
        } catch (err) {
            console.error('Error fetching earnings:', err);
            setError('Error fetching earnings data. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Fetch on page, filter, or search change
    useEffect(() => {
        fetchEarnings();
    }, [page, rowsPerPage, filterType, searchQuery]);

    // Handle filter change
    const handleFilterChange = (event, newFilter) => {
        if (newFilter !== null) {
            setFilterType(newFilter);
            setPage(0);
        }
    };

    // Handle search
    const handleSearch = (event) => {
        setSearchQuery(event.target.value);
        setPage(0);
    };

    // Handle page change
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    // Export to Excel
    const exportToExcel = async () => {
        try {
            const response = await axios.post(`${API_URL}export_earnings`, {
                filter: filterType
            });

            if (response.data.success && response.data.data.length > 0) {
                const exportData = response.data.data.map((item, index) => ({
                    'S. No.': index + 1,
                    'Name': item.name || 'N/A',
                    'Email': item.email || 'N/A',
                    'Mobile': item.mobile || 'N/A',
                    'Course': item.course_name || 'N/A',
                    'Total Fees': item.total_fees || 0,
                    'Fees Submitted': item.fees_submitted || 0,
                    'Fees Pending': item.fees_pending || 0,
                    'Registration Fee': item.registration_fee || 0,
                    'Total Earning': item.total_earning || 0,
                    'Payment Mode': item.payment_mode || 'N/A',
                    'Payment Date': item.payment_date || 'N/A',
                    'Admission Date': item.admission_date || 'N/A',
                    'Batch Timing': item.batch_timing || 'N/A',
                    'Enquiry Source': item.enquiry_source || 'N/A',
                    'Create Date Time': item.create_datetime || 'N/A'
                }));

                const ws = XLSX.utils.json_to_sheet(exportData);
                const wb = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(wb, ws, 'EarningsReport');
                
                const colWidths = [
                    { wch: 8 }, { wch: 25 }, { wch: 30 }, { wch: 15 },
                    { wch: 20 }, { wch: 15 }, { wch: 18 }, { wch: 15 },
                    { wch: 18 }, { wch: 18 }, { wch: 15 }, { wch: 15 },
                    { wch: 18 }, { wch: 20 }, { wch: 20 }, { wch: 25 }
                ];
                ws['!cols'] = colWidths;

                const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
                const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
                const fileName = `EarningsReport_${new Date().toISOString().split('T')[0]}.xlsx`;
                saveAs(blob, fileName);
            } else {
                setError('No data available to export');
            }
        } catch (err) {
            console.error('Export error:', err);
            setError('Error exporting data. Please try again.');
        }
    };

    // Get status chip color
    const getStatusColor = (status) => {
        switch(status) {
            case 3: return 'success';
            case 4: return 'info';
            case 5: return 'error';
            default: return 'warning';
        }
    };

    const getStatusLabel = (status) => {
        switch(status) {
            case 3: return 'Active';
            case 4: return 'Completed';
            case 5: return 'Discontinued';
            default: return 'Pending';
        }
    };

    // Format currency
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 0
        }).format(amount || 0);
    };

    return (
        <>
            <div className="col-xl-12" style={{ backgroundColor: '#FFF', borderRadius: '12px', padding: '10px', marginBottom: '20px' }}>
                <Typography variant="h5" sx={{ fontWeight: 600, color: '#121926', fontFamily: 'Poppins' }}>
                    Manage Earnings {currentMonth && `- ${currentMonth}`}
                </Typography>
            </div>

            {/* Summary Cards */}
            {summaryData && (
                <Grid container spacing={3} sx={{ mb: 3 }}>
                    <Grid item xs={12} sm={6} md={3}>
                        <StyledCard bgcolor="#e3f2fd">
                            <CardContent>
                                <Typography color="textSecondary" gutterBottom>
                                    <PeopleIcon sx={{ fontSize: '1.2rem' }} />
                                    Total Students
                                </Typography>
                                <Typography variant="h4" color="#1565c0">
                                    {summaryData.total_students || 0}
                                </Typography>
                            </CardContent>
                        </StyledCard>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <StyledCard bgcolor="#e8f5e9">
                            <CardContent>
                                <Typography color="textSecondary" gutterBottom>
                                    <TrendingUpIcon sx={{ fontSize: '1.2rem' }} />
                                    Total Earnings
                                </Typography>
                                <Typography variant="h4" color="#2e7d32">
                                    {formatCurrency(summaryData.total_earnings)}
                                </Typography>
                            </CardContent>
                        </StyledCard>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <StyledCard bgcolor="#fff3e0">
                            <CardContent>
                                <Typography color="textSecondary" gutterBottom>
                                    <PaymentIcon sx={{ fontSize: '1.2rem' }} />
                                    Fees Submitted
                                </Typography>
                                <Typography variant="h4" color="#e65100">
                                    {formatCurrency(summaryData.total_fees_submitted)}
                                </Typography>
                            </CardContent>
                        </StyledCard>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <StyledCard bgcolor="#fce4ec">
                            <CardContent>
                                <Typography color="textSecondary" gutterBottom>
                                    <PendingIcon sx={{ fontSize: '1.2rem' }} />
                                    Fees Pending
                                </Typography>
                                <Typography variant="h4" color="#c62828">
                                    {formatCurrency(summaryData.total_fees_pending)}
                                </Typography>
                            </CardContent>
                        </StyledCard>
                    </Grid>
                </Grid>
            )}

            {/* Filter and Search Section */}
            <Box 
                alignItems="center" 
                justifyContent="space-between" 
                display="flex" 
                className="mobile-res" 
                flexWrap="wrap" 
                gap={2}
                sx={{ 
                    backgroundColor: '#0f0f1a', 
                    padding: '12px', 
                    borderRadius: '12px',
                    border: '1px solid #2d2d44'
                }}
            >
                <StyledToggleButtonGroup
                    value={filterType}
                    exclusive
                    onChange={handleFilterChange}
                    aria-label="filter options"
                    size="small"
                >
                    <StyledToggleButton value="today">
                        Today
                    </StyledToggleButton>
                    <StyledToggleButton value="this_month">
                        This Month
                    </StyledToggleButton>
                    <StyledToggleButton value="last_month">
                        Last Month
                    </StyledToggleButton>
                    <StyledToggleButton value="this_year">
                        This Year
                    </StyledToggleButton>
                    <StyledToggleButton value="last_year">
                        Last Year
                    </StyledToggleButton>
                    <StyledToggleButton value="all">
                        All Time
                    </StyledToggleButton>
                </StyledToggleButtonGroup>

                <Box display="flex" gap={2} alignItems="center" flexWrap="wrap">
                    <OutlinedInput
                        sx={{ 
                            pr: 1, 
                            pl: 2, 
                            my: 1,
                            backgroundColor: '#1a1a2e',
                            borderRadius: '8px',
                            '& .MuiOutlinedInput-notchedOutline': {
                                borderColor: '#2d2d44',
                            },
                            '&:hover .MuiOutlinedInput-notchedOutline': {
                                borderColor: '#3268f1',
                            },
                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                borderColor: '#3268f1',
                            },
                            input: {
                                color: '#ffffff',
                            }
                        }}
                        id="input-search-profile"
                        onChange={handleSearch}
                        placeholder="Search by name, course, payment..."
                        value={searchQuery}
                        startAdornment={
                            <InputAdornment position="start">
                                <IconSearch stroke={1.5} size="1rem" color="#6b7280" />
                            </InputAdornment>
                        }
                    />
                    <Button 
                        variant="contained" 
                        onClick={exportToExcel}
                        sx={{ 
                            backgroundColor: '#3268f1', 
                            color: '#fff',
                            borderRadius: '8px',
                            padding: '10px 24px',
                            fontWeight: 600,
                            textTransform: 'none',
                            '&:hover': { 
                                backgroundColor: '#2851c4',
                                transform: 'translateY(-2px)',
                                boxShadow: '0 4px 12px rgba(50, 104, 241, 0.3)',
                            },
                            transition: 'all 0.3s ease',
                        }}
                        disabled={loading || earningsData.length === 0}
                    >
                        <AddIcon sx={{ mr: 1 }} />
                        Export to Excel
                    </Button>
                </Box>
            </Box>

            {/* Table Section */}
            <Paper sx={{ 
                width: '100%', 
                marginTop: '20px', 
                overflow: 'hidden',
                backgroundColor: '#0f0f1a',
                border: '1px solid #2d2d44',
                borderRadius: '12px',
            }}>
                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
                        <CircularProgress sx={{ color: '#3268f1' }} />
                    </Box>
                ) : error ? (
                    <Alert severity="error" sx={{ m: 2 }}>{error}</Alert>
                ) : (
                    <>
                        <TableContainer sx={{ maxHeight: 640 }}>
                            <Table stickyHeader>
                                <TableHead>
                                    <TableRow>
                                        {columns.map((column) => (
                                            <TableCell 
                                                key={column.id} 
                                                align={column.align} 
                                                style={{ 
                                                    minWidth: column.minWidth, 
                                                    fontWeight: 700,
                                                    color: '#ffffff',
                                                    backgroundColor: '#1a1a2e',
                                                    borderBottom: '2px solid #2d2d44',
                                                }}
                                            >
                                                {column.label}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {earningsData.length > 0 ? (
                                        earningsData.map((row) => (
                                            <TableRow 
                                                hover 
                                                role="checkbox" 
                                                tabIndex={-1} 
                                                key={row.user_id || row.SNo}
                                                sx={{
                                                    '&:hover': {
                                                        backgroundColor: 'rgba(50, 104, 241, 0.05)',
                                                    },
                                                    '&:nth-of-type(odd)': {
                                                        backgroundColor: 'rgba(255, 255, 255, 0.02)',
                                                    },
                                                }}
                                            >
                                                <TableCell align="center" sx={{ color: '#e0e0e0' }}>
                                                    {row.SNo}
                                                </TableCell>
                                                <TableCell align="center" sx={{ color: '#e0e0e0' }}>
                                                    <Stack direction="column" alignItems="center" spacing={0.5}>
                                                        <Typography variant="body2" sx={{ color: '#ffffff', fontWeight: 500 }}>
                                                            {row.Name}
                                                        </Typography>
                                                        {row.Mobile && row.Mobile !== 'N/A' && (
                                                            <Typography variant="caption" sx={{ color: '#6b7280' }}>
                                                                {row.Mobile}
                                                            </Typography>
                                                        )}
                                                    </Stack>
                                                </TableCell>
                                                <TableCell align="center" sx={{ color: '#e0e0e0' }}>
                                                    <Stack direction="column" alignItems="center" spacing={0.5}>
                                                        <Typography variant="body2" sx={{ color: '#ffffff' }}>
                                                            {row.CourseName}
                                                        </Typography>
                                                        {row.BatchTiming && row.BatchTiming !== 'N/A' && (
                                                            <Chip 
                                                                label={row.BatchTiming} 
                                                                size="small" 
                                                                variant="outlined"
                                                                sx={{ 
                                                                    color: '#6b7280',
                                                                    borderColor: '#2d2d44',
                                                                }}
                                                            />
                                                        )}
                                                    </Stack>
                                                </TableCell>
                                                <TableCell align="center">
                                                    <Typography sx={{ color: '#4caf50', fontWeight: 700 }}>
                                                        {formatCurrency(row.TotalEarning || row.FeesSubmitted + row.RegistrationFee)}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell align="center" sx={{ color: '#e0e0e0' }}>
                                                    {formatCurrency(row.FeesSubmitted)}
                                                </TableCell>
                                                <TableCell align="center" sx={{ color: '#ef5350' }}>
                                                    {formatCurrency(row.FeesPending)}
                                                </TableCell>
                                                <TableCell align="center">
                                                    <Chip 
                                                        label={row.PaymentMode || 'N/A'} 
                                                        size="small" 
                                                        sx={{ 
                                                            backgroundColor: row.PaymentMode ? 'rgba(50, 104, 241, 0.1)' : 'rgba(255, 193, 7, 0.1)',
                                                            color: row.PaymentMode ? '#3268f1' : '#ffc107',
                                                            border: `1px solid ${row.PaymentMode ? 'rgba(50, 104, 241, 0.3)' : 'rgba(255, 193, 7, 0.3)'}`,
                                                        }}
                                                    />
                                                </TableCell>
                                                <TableCell align="center" sx={{ color: '#e0e0e0' }}>
                                                    {row.PaymentDate || 'N/A'}
                                                </TableCell>
                                                <TableCell align="center">
                                                    <Stack direction="column" alignItems="center" spacing={0.5}>
                                                        <Typography variant="body2" sx={{ color: '#e0e0e0' }}>
                                                            {row.CreateDateTime || 'N/A'}
                                                        </Typography>
                                                        {row.StudentStatus !== undefined && (
                                                            <Chip 
                                                                label={getStatusLabel(row.StudentStatus)} 
                                                                size="small" 
                                                                color={getStatusColor(row.StudentStatus)}
                                                            />
                                                        )}
                                                    </Stack>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={columns.length} align="center" sx={{ py: 5 }}>
                                                <Typography variant="body1" sx={{ color: '#6b7280' }}>
                                                    No earnings data available
                                                </Typography>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>

                        {/* Pagination */}
                        <Box sx={{ 
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            alignItems: 'center', 
                            p: 2, 
                            flexWrap: 'wrap',
                            borderTop: '1px solid #2d2d44',
                            backgroundColor: '#0f0f1a',
                        }}>
                            <Typography variant="body2" sx={{ color: '#6b7280' }}>
                                Showing {Math.min(earningsData.length > 0 ? page * rowsPerPage + 1 : 0, totalRecords)} to {Math.min((page + 1) * rowsPerPage, totalRecords)} of {totalRecords} entries
                            </Typography>
                            <Box>
                                <Button
                                    onClick={() => handleChangePage(null, page - 1)}
                                    disabled={page === 0 || loading}
                                    sx={{ 
                                        mr: 1,
                                        color: '#ffffff',
                                        border: '1px solid #2d2d44',
                                        borderRadius: '8px',
                                        '&:hover': {
                                            backgroundColor: '#3268f1',
                                            borderColor: '#3268f1',
                                        },
                                        '&.Mui-disabled': {
                                            color: '#6b7280',
                                        }
                                    }}
                                >
                                    Previous
                                </Button>
                                <Button
                                    onClick={() => handleChangePage(null, page + 1)}
                                    disabled={(page + 1) * rowsPerPage >= totalRecords || loading}
                                    sx={{ 
                                        color: '#ffffff',
                                        border: '1px solid #2d2d44',
                                        borderRadius: '8px',
                                        '&:hover': {
                                            backgroundColor: '#3268f1',
                                            borderColor: '#3268f1',
                                        },
                                        '&.Mui-disabled': {
                                            color: '#6b7280',
                                        }
                                    }}
                                >
                                    Next
                                </Button>
                            </Box>
                        </Box>
                    </>
                )}
            </Paper>

            {/* Error Snackbar */}
            <Snackbar
                open={!!error}
                autoHideDuration={6000}
                onClose={() => setError(null)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert onClose={() => setError(null)} severity="error" sx={{ width: '100%' }}>
                    {error}
                </Alert>
            </Snackbar>
        </>
    );
};

export default ManageEarning;