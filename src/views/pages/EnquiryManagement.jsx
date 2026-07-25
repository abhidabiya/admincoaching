import * as React from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import { 
    ArrowDropDown, 
    Visibility, 
    Edit, 
    PersonAdd,
    Phone,
    CalendarToday,
    Comment,
    School,
    QueryBuilder
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import './main.css';
import Box from '@mui/material/Box';
import OutlinedInput from '@mui/material/OutlinedInput';
import { IconSearch } from '@tabler/icons-react';
import InputAdornment from '@mui/material/InputAdornment';
import { useTheme } from '@mui/material/styles';
import { API_URL, APP_PREFIX_PATH, IMAGE_PATH } from 'config/constant';
import { encode as base64_encode } from 'base-64';
import axios from 'axios';
import { Modal } from 'react-bootstrap';
import { CircularProgress, Alert, AlertTitle } from '@mui/material';

const columns = [
    { id: 'number', label: 'S.No.', minWidth: 70, align: 'center' },
    { id: 'Action', label: 'Action', minWidth: 130, align: 'center' },
    { id: 'name', label: 'Name', minWidth: 150, align: 'center' },
    // { id: 'image', label: 'Image', minWidth: 100, align: 'center' },
    { id: 'mobile', label: 'Mobile No.', minWidth: 120, align: 'center' },
    { id: 'parent_contact', label: 'Parent Contact', minWidth: 130, align: 'center' },
    { id: 'course', label: 'Interested Course', minWidth: 150, align: 'center' },
    { id: 'followup_status', label: 'Follow-up Status', minWidth: 130, align: 'center' },
    { id: 'last_followup', label: 'Last Follow-up', minWidth: 150, align: 'center' },
    { id: 'next_followup', label: 'Next Follow-up', minWidth: 150, align: 'center' },
    { id: 'source', label: 'Source', minWidth: 120, align: 'center' },
    { id: 'created_date', label: 'Enquiry Date', minWidth: 130, align: 'center' }
];

const EnquiryManagement = () => {
    const [page, setPage] = React.useState(0);
    const [rowsPerPage] = React.useState(50);
    const navigate = useNavigate();
    const theme = useTheme();
    const [enquiryData, setEnquiryData] = React.useState([]);
    const [searchQuery, setSearchQuery] = React.useState('');
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [selectedIndex, setSelectedIndex] = React.useState(null);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(null);

    // Modal states
    const [showFollowupModal, setShowFollowupModal] = React.useState(false);
    const [selectedEnquiry, setSelectedEnquiry] = React.useState(null);
    const [followupDetails, setFollowupDetails] = React.useState({
        followup_date: '',
        followup_time: '',
        notes: '',
        next_followup_date: '',
        next_followup_time: '',
        status: 0
    });

    // Status labels and colors
    const followupStatusLabels = {
        0: { label: 'Pending', color: '#FF9800', bgColor: '#FFF3E0' },
        1: { label: 'Contacted', color: '#2196F3', bgColor: '#E3F2FD' },
        2: { label: 'Not Reachable', color: '#F44336', bgColor: '#FFEBEE' },
        3: { label: 'Interested', color: '#4CAF50', bgColor: '#E8F5E9' },
        4: { label: 'Not Interested', color: '#9E9E9E', bgColor: '#F5F5F5' },
        5: { label: 'Converted', color: '#9C27B0', bgColor: '#F3E5F5' }
    };

    const sourceLabels = {
        1: 'Website',
        2: 'Walk-in',
        3: 'Reference',
        4: 'Phone Call',
        5: 'Social Media',
        6: 'Advertisement',
        7: 'Other'
    };

    const handleSearch = (event) => {
        setSearchQuery(event.target.value);
    };

    const handleClose = () => {
        setAnchorEl(null);
        setSelectedIndex(null);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleCloseModal = () => {
        setShowFollowupModal(false);
        setSelectedEnquiry(null);
        setFollowupDetails({
            followup_date: '',
            followup_time: '',
            notes: '',
            next_followup_date: '',
            next_followup_time: '',
            status: 0
        });
    };

    // Fetch only enquiry data (user_type = 5 and admission_type = 0)
    const fetchEnquiryData = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(`${API_URL}get_all_student_data`);
            
            if (response.data && response.data.success) {
                let userArr = [];
                // Handle different response structures
                if (Array.isArray(response.data.data)) {
                    userArr = response.data.data;
                } else if (Array.isArray(response.data.users)) {
                    userArr = response.data.users;
                } else if (Array.isArray(response.data.user_arr)) {
                    userArr = response.data.user_arr;
                }
                
                // Filter only enquiries (user_type 5 AND admission_type 0)
                const enquiries = userArr.filter(user => 
                    user && 
                    (user.user_type === 5 || user.user_type === '5') && 
                    (user.admission_type === 0 || user.admission_type === '0' || user.admission_type === null)
                );
                
                setEnquiryData(enquiries);
            } else {
                setEnquiryData([]);
            }
        } catch (error) {
            console.error('Error fetching enquiry data:', error);
            setError('Failed to load enquiry data. Please try again.');
            setEnquiryData([]);
        } finally {
            setLoading(false);
        }
    };

    // Convert enquiry to admission
    const convertToAdmission = async (userId) => {
        if (window.confirm('Are you sure you want to convert this enquiry to admission?')) {
            try {
                const response = await axios.put(`${API_URL}convert_enquiry/${userId}`);
                if (response.data.success) {
                    alert(response.data.message || 'Enquiry converted to admission successfully!');
                    fetchEnquiryData(); // Refresh the list
                } else {
                    alert(response.data.message || 'Conversion failed');
                }
            } catch (error) {
                console.error('Error converting enquiry to admission:', error);
                alert('Error converting enquiry to admission');
            }
        }
    };

    // Update follow-up details
    const updateFollowup = async (userId, followupData) => {
        try {
            const response = await axios.put(`${API_URL}update_followup/${userId}`, followupData);
            if (response.data.success) {
                alert(response.data.message || 'Follow-up updated successfully!');
                fetchEnquiryData();
                return response.data;
            } else {
                alert(response.data.message || 'Failed to update follow-up');
                return null;
            }
        } catch (error) {
            console.error('Error updating follow-up:', error);
            alert('Error updating follow-up details');
            return null;
        }
    };

    const handleView = (userId) => {
        let encode_user_id = base64_encode(userId.toString());
        navigate(APP_PREFIX_PATH + `/view-user/${encode_user_id}`);
        handleClose();
    };

    const handleEdit = (userId) => {
        let encode_user_id = base64_encode(userId.toString());
        navigate(APP_PREFIX_PATH + `/edit-user/${encode_user_id}`);
        handleClose();
    };

    const handleOpenFollowupModal = (enquiry) => {
        setSelectedEnquiry(enquiry);
        setFollowupDetails({
            followup_date: enquiry.last_followup_date || '',
            followup_time: enquiry.last_followup_time || '',
            notes: enquiry.followup_notes || '',
            next_followup_date: enquiry.next_followup_date || '',
            next_followup_time: enquiry.next_followup_time || '',
            status: enquiry.followup_status || 0
        });
        setShowFollowupModal(true);
    };

    const handleUpdateFollowup = () => {
        if (selectedEnquiry && selectedEnquiry.user_id) {
            updateFollowup(selectedEnquiry.user_id, followupDetails);
            handleCloseModal();
        }
    };

    // Filter enquiries based on search
    const filteredEnquiries = enquiryData.filter((enquiry) => {
        if (!enquiry) return false;
        
        const lowercasedTerm = searchQuery.toLowerCase();
        
        const searchFields = [
            enquiry.name?.toLowerCase() || '',
            enquiry.mobile ? String(enquiry.mobile).toLowerCase() : '',
            enquiry.parent_contact ? String(enquiry.parent_contact).toLowerCase() : '',
            enquiry.course_name?.toLowerCase() || '',
            enquiry.qualification?.toLowerCase() || '',
            enquiry.source ? sourceLabels[enquiry.source]?.toLowerCase() || '' : '',
            enquiry.followup_status !== undefined ? followupStatusLabels[enquiry.followup_status]?.label.toLowerCase() || '' : '',
            enquiry.createtime ? String(enquiry.createtime).toLowerCase() : '',
            enquiry.email?.toLowerCase() || ''
        ];

        return searchFields.some(field => field && field.includes(lowercasedTerm));
    });

    React.useEffect(() => {
        fetchEnquiryData();
    }, []);

    const handleClick = (event, index) => {
        setAnchorEl(event.currentTarget);
        setSelectedIndex(index);
    };

    const handleAction = (index, action, enquiry) => {
        setAnchorEl(null);
        setSelectedIndex(null);

        if (action === 'view') {
            
            handleView(enquiry.user_id);
        } else if (action === 'edit') {
            handleEdit(enquiry.user_id);
        } else if (action === 'convert') {
            convertToAdmission(enquiry.user_id);
        } else if (action === 'followup') {
            handleOpenFollowupModal(enquiry);
        }
    };

    // Format date for display
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    };

    // Format date-time for display
    const formatDateTime = (dateString, timeString) => {
        if (!dateString) return 'N/A';
        let displayText = formatDate(dateString);
        if (timeString) {
            displayText += ` ${timeString}`;
        }
        return displayText;
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                <CircularProgress />
                <span style={{ marginLeft: '16px' }}>Loading enquiry data...</span>
            </Box>
        );
    }

    if (error) {
        return (
            <Alert severity="error" sx={{ mt: 2 }}>
                <AlertTitle>Error</AlertTitle>
                {error}
                <Button 
                    variant="contained" 
                    onClick={fetchEnquiryData} 
                    sx={{ mt: 2 }}
                >
                    Retry
                </Button>
            </Alert>
        );
    }

    return (
        <>
            <div className="col-xl-12" style={{ backgroundColor: '#FFF', borderRadius: '12px', padding: '10px', marginBottom: '20px' }}>
                <p
                    style={{
                        fontSize: '1.25rem',
                        color: '#121926',
                        fontWeight: '600',
                        fontFamily: 'Poppins',
                        lineHeight: '1.167',
                        marginBottom: '5px'
                    }}
                >
                    Manage Enquiries (Not Converted)
                </p>
                <p style={{ fontSize: '0.875rem', color: '#6B7280', marginBottom: '0' }}>
                    View and manage all student enquiries that haven't been converted to admissions
                </p>
            </div>
            
            <Box alignItems="center" justifyContent="space-start" display="flex" className="mobile-res">
                <OutlinedInput
                    sx={{ pr: 1, pl: 2, my: 2, flex: 1 }}
                    id="input-search-profile"
                    placeholder="Search by name, mobile, course, follow-up status..."
                    onChange={handleSearch}
                    startAdornment={
                        <InputAdornment position="start">
                            <IconSearch stroke={1.5} size="1rem" color={theme.palette.grey[500]} />
                        </InputAdornment>
                    }
                    aria-describedby="search-helper-text"
                    inputProps={{
                        'aria-label': 'weight'
                    }}
                />
            </Box>
            
            {filteredEnquiries.length > 0 ? (
                <Paper sx={{ width: '100%', overflow: 'hidden', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
                    <TableContainer sx={{ maxHeight: 600 }}>
                        <Table stickyHeader>
                            <TableHead>
                                <TableRow>
                                    {columns.map((column) => (
                                        <TableCell 
                                            key={column.id} 
                                            align={column.align} 
                                            style={{ 
                                                minWidth: column.minWidth,
                                                backgroundColor: '#f8fafc',
                                                fontWeight: '600',
                                                fontSize: '14px',
                                                color: '#1f2937',
                                                borderBottom: '2px solid #e5e7eb'
                                            }}
                                        >
                                            {column.label}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredEnquiries.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => (
                                    <TableRow hover role="checkbox" tabIndex={-1} key={row.user_id || index}>
                                        <TableCell style={{ textAlign: 'center', color: '#4b5563' }}>
                                            {page * rowsPerPage + index + 1}
                                        </TableCell>
                                        
                                        <TableCell style={{ textAlign: 'center' }}>
                                            <Button
                                                className="btn btn-primary"
                                                aria-label="more"
                                                aria-controls="long-menu"
                                                aria-haspopup="true"
                                                onClick={(event) => handleClick(event, index)}
                                                style={{ 
                                                    width: '120px',
                                                    background: 'linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)',
                                                    border: 'none',
                                                    fontSize: '13px',
                                                    padding: '6px 12px'
                                                }}
                                            >
                                                Actions <ArrowDropDown />
                                            </Button>
                                            <Menu
                                                id="long-menu"
                                                anchorEl={anchorEl}
                                                keepMounted
                                                open={selectedIndex === index}
                                                onClose={handleClose}
                                                PaperProps={{
                                                    style: {
                                                        maxHeight: 300,
                                                        width: '200px',
                                                    },
                                                }}
                                            >
                                                <MenuItem onClick={() => handleAction(index, 'view', row)} className="menu-icons">
                                                    <Visibility style={{ marginRight: '8px', fontSize: '18px' }} />
                                                    View Details
                                                </MenuItem>
                                                
                                                <MenuItem 
                                                    onClick={() => handleAction(index, 'convert', row)} 
                                                    className="menu-icons"
                                                    style={{ color: '#4CAF50' }}
                                                >
                                                    <PersonAdd style={{ marginRight: '8px', fontSize: '18px' }} />
                                                    Convert to Admission
                                                </MenuItem>
                                                
                                                <MenuItem onClick={() => handleAction(index, 'followup', row)} className="menu-icons">
                                                    <Phone style={{ marginRight: '8px', fontSize: '18px' }} />
                                                    Update Follow-up
                                                </MenuItem>
                                                
                                                <MenuItem onClick={() => handleAction(index, 'edit', row)} className="menu-icons">
                                                    <Edit style={{ marginRight: '8px', fontSize: '18px' }} />
                                                    Edit
                                                </MenuItem>
                                            </Menu>
                                        </TableCell>
                                        
                                        <TableCell style={{ textAlign: 'center', fontWeight: '500' }}>
                                            {row.name || 'N/A'}
                                        </TableCell>
                                        
                                        {/* <TableCell style={{ textAlign: 'center' }}>
                                            <img
                                                alt={row.name}
                                                src={row.image ? `${IMAGE_PATH}${row.image}` : `${IMAGE_PATH}placeholder.png`}
                                                style={{ 
                                                    width: '60px', 
                                                    height: '60px', 
                                                    borderRadius: '50%', 
                                                    objectFit: 'cover',
                                                    border: '2px solid #e5e7eb'
                                                }}
                                            />
                                        </TableCell> */}
                                        
                                        <TableCell style={{ textAlign: 'center', fontWeight: '500' }}>
                                            {row.mobile || 'N/A'}
                                        </TableCell>
                                        
                                        <TableCell style={{ textAlign: 'center' }}>
                                            {row.parent_contact || 'N/A'}
                                        </TableCell>
                                        
                                        <TableCell style={{ textAlign: 'center', color: '#374151' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                                                <School fontSize="small" />
                                                {row.course_name || 'N/A'}
                                            </div>
                                        </TableCell>
                                        
                                        <TableCell style={{ textAlign: 'center' }}>
                                            {row.followup_status !== undefined ? (
                                                <span style={{
                                                    padding: '4px 12px',
                                                    borderRadius: '20px',
                                                    fontSize: '12px',
                                                    fontWeight: '500',
                                                    backgroundColor: followupStatusLabels[row.followup_status]?.bgColor || '#f3f4f6',
                                                    color: followupStatusLabels[row.followup_status]?.color || '#6b7280'
                                                }}>
                                                    {followupStatusLabels[row.followup_status]?.label || 'Pending'}
                                                </span>
                                            ) : 'N/A'}
                                        </TableCell>
                                        
                                        <TableCell style={{ textAlign: 'center', color: '#6b7280', fontSize: '13px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                                                <CalendarToday fontSize="small" />
                                                {formatDateTime(row.last_followup_date, row.last_followup_time)}
                                            </div>
                                            {row.followup_notes && (
                                                <div style={{ 
                                                    fontSize: '11px', 
                                                    color: '#9ca3af',
                                                    marginTop: '2px',
                                                    maxWidth: '200px',
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                    whiteSpace: 'nowrap'
                                                }}>
                                                    <Comment fontSize="small" sx={{ fontSize: '12px', verticalAlign: 'middle' }} />
                                                    {row.followup_notes}
                                                </div>
                                            )}
                                        </TableCell>
                                        
                                        <TableCell style={{ textAlign: 'center', color: '#6b7280', fontSize: '13px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                                                <QueryBuilder fontSize="small" />
                                                {formatDateTime(row.next_followup_date, row.next_followup_time)}
                                            </div>
                                        </TableCell>
                                        
                                        <TableCell style={{ textAlign: 'center' }}>
                                            {row.source ? (
                                                <span style={{
                                                    padding: '4px 8px',
                                                    borderRadius: '12px',
                                                    fontSize: '11px',
                                                    fontWeight: '500',
                                                    backgroundColor: '#e0f2fe',
                                                    color: '#0369a1'
                                                }}>
                                                    {sourceLabels[row.source] || 'Other'}
                                                </span>
                                            ) : 'N/A'}
                                        </TableCell>
                                        
                                        <TableCell style={{ textAlign: 'center', color: '#6b7280', fontSize: '13px' }}>
                                            {formatDate(row.createtime)}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        padding: '16px 24px',
                        backgroundColor: '#f9fafb',
                        borderTop: '1px solid #e5e7eb'
                    }}>
                        <p style={{ margin: 0, color: '#6b7280', fontSize: '14px' }}>
                            {`Showing ${Math.min(filteredEnquiries.length > 0 ? page * rowsPerPage + 1 : 0, filteredEnquiries.length)} to ${Math.min((page + 1) * rowsPerPage, filteredEnquiries.length)} of ${filteredEnquiries.length} entries`}
                        </p>
                        <div>
                            <button
                                onClick={() => handleChangePage(null, page - 1)}
                                disabled={page === 0}
                                style={{ 
                                    marginRight: '8px', 
                                    borderRadius: '6px', 
                                    background: page === 0 ? '#f3f4f6' : '#3b82f6',
                                    color: page === 0 ? '#9ca3af' : 'white',
                                    border: '1px solid #e5e7eb',
                                    padding: '8px 16px',
                                    cursor: page === 0 ? 'not-allowed' : 'pointer',
                                    fontSize: '14px'
                                }}
                            >
                                Previous
                            </button>
                            <button
                                onClick={() => handleChangePage(null, page + 1)}
                                disabled={(page + 1) * rowsPerPage >= filteredEnquiries.length}
                                style={{ 
                                    borderRadius: '6px', 
                                    background: (page + 1) * rowsPerPage >= filteredEnquiries.length ? '#f3f4f6' : '#3b82f6',
                                    color: (page + 1) * rowsPerPage >= filteredEnquiries.length ? '#9ca3af' : 'white',
                                    border: '1px solid #e5e7eb',
                                    padding: '8px 16px',
                                    cursor: (page + 1) * rowsPerPage >= filteredEnquiries.length ? 'not-allowed' : 'pointer',
                                    fontSize: '14px'
                                }}
                            >
                                Next
                            </button>
                        </div>
                    </div>
                </Paper>
            ) : (
                <Paper sx={{ width: '100%', padding: '40px', textAlign: 'center', borderRadius: '12px' }}>
                    <div style={{ color: '#9ca3af', fontSize: '16px' }}>
                        <QueryBuilder style={{ fontSize: '48px', marginBottom: '16px', color: '#d1d5db' }} />
                        <p style={{ marginBottom: '8px', fontSize: '18px', fontWeight: '500' }}>No Enquiries Found</p>
                        <p>There are currently no pending enquiries. All enquiries might have been converted to admissions.</p>
                        <Button 
                            variant="contained" 
                            onClick={fetchEnquiryData}
                            sx={{ mt: 2 }}
                        >
                            Refresh Data
                        </Button>
                    </div>
                </Paper>
            )}

            {/* Update Follow-up Modal */}
            <Modal show={showFollowupModal} onHide={handleCloseModal} centered size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Update Follow-up Details</Modal.Title>
                    {selectedEnquiry && (
                        <span style={{ marginLeft: '12px', fontSize: '14px', color: '#6b7280' }}>
                            For: {selectedEnquiry.name}
                        </span>
                    )}
                </Modal.Header>
                <Modal.Body>
                    <div className="row">
                        <div className="col-md-6 mb-3">
                            <label className="form-label">Follow-up Date</label>
                            <input
                                type="date"
                                className="form-control"
                                value={followupDetails.followup_date}
                                onChange={(e) => setFollowupDetails({...followupDetails, followup_date: e.target.value})}
                            />
                        </div>
                        <div className="col-md-6 mb-3">
                            <label className="form-label">Follow-up Time</label>
                            <input
                                type="time"
                                className="form-control"
                                value={followupDetails.followup_time}
                                onChange={(e) => setFollowupDetails({...followupDetails, followup_time: e.target.value})}
                            />
                        </div>
                        <div className="col-md-6 mb-3">
                            <label className="form-label">Next Follow-up Date</label>
                            <input
                                type="date"
                                className="form-control"
                                value={followupDetails.next_followup_date}
                                onChange={(e) => setFollowupDetails({...followupDetails, next_followup_date: e.target.value})}
                            />
                        </div>
                        <div className="col-md-6 mb-3">
                            <label className="form-label">Next Follow-up Time</label>
                            <input
                                type="time"
                                className="form-control"
                                value={followupDetails.next_followup_time}
                                onChange={(e) => setFollowupDetails({...followupDetails, next_followup_time: e.target.value})}
                            />
                        </div>
                        <div className="col-md-12 mb-3">
                            <label className="form-label">Status</label>
                            <select
                                className="form-control"
                                value={followupDetails.status}
                                onChange={(e) => setFollowupDetails({...followupDetails, status: parseInt(e.target.value)})}
                            >
                                {Object.entries(followupStatusLabels).map(([key, value]) => (
                                    <option key={key} value={key}>{value.label}</option>
                                ))}
                            </select>
                        </div>
                        <div className="col-md-12 mb-3">
                            <label className="form-label">Notes</label>
                            <textarea
                                className="form-control"
                                value={followupDetails.notes}
                                onChange={(e) => setFollowupDetails({...followupDetails, notes: e.target.value})}
                                rows="3"
                                placeholder="Enter follow-up notes..."
                            />
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Cancel
                    </Button>
                    <Button 
                        variant="primary" 
                        onClick={handleUpdateFollowup}
                        style={{ background: 'linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)', border: 'none' }}
                    >
                        Update Follow-up
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default EnquiryManagement;